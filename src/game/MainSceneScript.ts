import DataManager from "../main/DataManager";
import MyGameConfig from "../main/MyGameConfig";
import EventUtils from "../utils/EventUtils";
import MathUtils from "../utils/MathUtils";
import UiUtils from "../utils/UiUtils";
import FunctionUnlockConfigInfo from "./bean/config/FunctionUnlockConfigInfo";
import GuideDialog from "./dialog/GuideDialog";
import NextChildLoadingDialog from "./dialog/NextChildLoadingDialog";
import GameManager from "../main/GameManager";
import MapManager from "./map/MapManager";
import ProspectingMapManager from "./ProspectingMapManager";
import RoleScript from "./RoleScript";
import SceneResManager from "./SceneResManager";
import WormholeScript from "./WormholeScript";
import PvpMapManager from "./map/PvpMapManager";
import PvpSceneScript from "./PvpSceneScript";
import RobotScript from "./role/RobotScript";
import CommonTipDialog from "./dialog/CommonTipDialog";
import WalletUtils from "../utils/WalletUtils";
import ConnectTipDialog from "./dialog/ConnectWalletDialog";

export default class MainSceneScript extends Laya.Script3D {

    private mScene: Laya.Scene3D;
    private mNodeBridge: Laya.Sprite3D;
    private mCurNodeChildIsland: Laya.MeshSprite3D;
    private mIsCreateMeteorite: boolean = true;
    private mWormholeScript: WormholeScript;

    private mLoadedCallback: Function;

    private mNodeEffectLine: Laya.ShuriKenParticle3D;

    onAwake() {
        this.mScene = this.owner as Laya.Scene3D;
        GameManager.instance.scene3d = this.mScene;
        GameManager.instance.curLevel = DataManager.getLastSelectLevel();
        GameManager.instance.curLevel = GameManager.instance.curLevel % MyGameConfig.levelConfig.length;

        this.mNodeEffectLine = this.mScene.getChildByName("effect_line") as Laya.ShuriKenParticle3D;
        let directionLight = this.mScene.getChildByName("node_light") as Laya.DirectionLight;

        directionLight.shadowMode = Laya.ShadowMode.SoftHigh;
        directionLight.shadowDistance = 30;
        directionLight.shadowResolution = 2048;
        directionLight.shadowCascadesMode = Laya.ShadowCascadesMode.NoCascades;
        directionLight.shadowNormalBias = 2;

        this.addHandler();
        this.checkFunction();
        this.createMainIsland();
        this.addPvpScene();
        GameManager.instance.roleScript.aniCameraShipStart(0);

        if (MyGameConfig.levelConfig[GameManager.instance.curLevel].model == MyGameConfig.PLAY_MODEL_NORMAL) {
            this.createChildIsLand();
        } else {
            this.createCrystalIsland();
        }

        this.createMeteorite(0);
    }

    onDisable() {
        EventUtils.offAllEventByNode(this);
    }

    private addHandler(): void {
        EventUtils.onEvent(this, MyGameConfig.EVENT_GO_NEXT_ISLAND, () => {
            GameManager.instance.roleScript.getDirectionScript().hide();
            this.goNextIsland();
        });

        EventUtils.onEvent(this, MyGameConfig.EVENT_TO_NEXT_ISLAND, () => {
            let requestIndex: number = 0;
            let self = this;

            let requestComplete = function () {
                requestIndex++;

                if (requestIndex == 2) {
                    loadingDialog.hide();
                    self.mWormholeScript.reset();
                    self.mCurNodeChildIsland.destroy(true);
                    Laya.Resource.destroyUnusedResources();
                    self.mNodeEffectLine.particleSystem.simulate(0, true);
                    if (MyGameConfig.levelConfig[GameManager.instance.curLevel].model == MyGameConfig.PLAY_MODEL_NORMAL) {
                        self.createChildIsLand();
                    } else {
                        self.createCrystalIsland();
                    }
                }
            }

            let loadingDialog = new NextChildLoadingDialog(() => {
                requestComplete();
            });

            UiUtils.addChild(loadingDialog);

            SceneResManager.createSky(GameManager.instance.scene3d.getChildByName("node_sky") as Laya.Sprite3D,
                MyGameConfig.levelConfig[GameManager.instance.curLevel].skyName, () => {
                    requestComplete();
                });
        });
    }

    private createMainIsland(): void {
        let nodeRole = this.mScene.getChildByName("node_role") as Laya.Sprite3D;
        let roleScript = nodeRole.addComponent(RoleScript) as RoleScript;
        let nodeWormhole = this.mScene.getChildByName("node_wormhole") as Laya.Sprite3D;
        this.mWormholeScript = nodeWormhole.addComponent(WormholeScript);

        roleScript.setNode(nodeRole);
        roleScript.init();
        GameManager.instance.roleScript = roleScript;

        SceneResManager.createSky(GameManager.instance.scene3d.getChildByName("node_sky") as Laya.Sprite3D,
            MyGameConfig.levelConfig[GameManager.instance.curLevel].skyName, () => {
                try {
                    roleScript.createRoleModel(MyGameConfig.carConfig[DataManager.getUseCarId()], () => {
                        if (this.mLoadedCallback) {
                            this.mLoadedCallback(this.mScene);
                        } else {
                            Laya.timer.once(500, this, () => {
                                this.mLoadedCallback(this.mScene);
                            });
                        }
                    });
                } finally {

                }
            });
    }

    private goNextIsland(): void {
        MapManager.instance.clearAll();
        GameManager.instance.curLevel = DataManager.getLastSelectLevel();
        GameManager.instance.curLevel = GameManager.instance.curLevel % MyGameConfig.levelConfig.length;
        GameManager.instance.clearAll();
        GameManager.instance.isControl = false;

        Laya.Tween.to(this.mNodeBridge.transform.position, {
            z: 4,
            update: new Laya.Handler(this, () => {
                this.mNodeBridge.transform.position = this.mNodeBridge.transform.position;
            })
        }, 1000, null, new Laya.Handler(this, () => {
            GameManager.instance.roleScript.backStart(() => {
                Laya.Tween.to(this.mCurNodeChildIsland.transform.position, {
                    y: -40,
                    update: new Laya.Handler(this, () => {
                        this.mCurNodeChildIsland.transform.position = this.mCurNodeChildIsland.transform.position;
                    })
                }, 3000, null, new Laya.Handler(this, () => {
                    this.mNodeEffectLine.particleSystem.play();
                    this.mWormholeScript.startMove(this.mCurNodeChildIsland);
                }));
            });
        }));
    }

    private createChildIsLand(): void {
        this.mIsCreateMeteorite = true;

        MapManager.instance.createMap(GameManager.instance.curLevel, (childIsland: Laya.MeshSprite3D) => {
            this.moveIsland(childIsland, () => {
                GameManager.instance.roleScript.setPlayModel(MyGameConfig.PLAY_MODEL_NORMAL);
                EventUtils.dispatchEvent(MyGameConfig.EVENT_START, MyGameConfig.PLAY_MODEL_NORMAL);
                GameManager.instance.roleScript.getDirectionScript().start();
            });
        });
    }

    private moveIsland(childIsland: Laya.MeshSprite3D, callback: Function): void {
        this.mCurNodeChildIsland = childIsland;
        this.mIsCreateMeteorite = false;
        this.mNodeEffectLine.particleSystem.stop();

        Laya.Tween.to(childIsland.transform.position, {
            z: 0,
            update: new Laya.Handler(this, () => {
                childIsland.transform.position = childIsland.transform.position;
            })
        }, 3000, null, new Laya.Handler(this, () => {
            GameManager.instance.roleScript.prepare();

            Laya.Tween.to(this.mNodeBridge.transform.position, {
                z: 0,
                update: new Laya.Handler(this, () => {
                    this.mNodeBridge.transform.position = this.mNodeBridge.transform.position;
                })
            }, 1000, null, new Laya.Handler(this, () => {
                GameManager.instance.isControl = true;
                MapManager.instance.start();
                callback();

                if (!DataManager.isShowGuide(MyGameConfig.levelConfig[GameManager.instance.curLevel].model)) {
                    UiUtils.addChild(new GuideDialog(MyGameConfig.levelConfig[GameManager.instance.curLevel].model));
                }
            }));
        }));
    }

    private createCrystalIsland(): void {
        ProspectingMapManager.instance.createMap(GameManager.instance.curLevel, (childIsland: Laya.MeshSprite3D) => {
            this.moveIsland(childIsland, () => {
                GameManager.instance.roleScript.setPlayModel(MyGameConfig.PLAY_MODEL_PROSPECTING);
                EventUtils.dispatchEvent(MyGameConfig.EVENT_START, MyGameConfig.PLAY_MODEL_PROSPECTING);
            });
        });
    }

    private createMeteorite(time: number): void {
        Laya.timer.once(time, this, () => {
            if (Laya.timer.delta > 4000) {
                this.createMeteorite(MathUtils.nextInt(500, 4000));

                return;
            }

            if (this.mIsCreateMeteorite) {
                SceneResManager.createMeteorite(this.mScene);
                this.createMeteorite(MathUtils.nextInt(500, 4000));
            }
        });
    }

    private checkFunction(): void {
        let nodeMainIsland = this.mScene.getChildByName("node_main_island") as Laya.Sprite3D;
        let nodeFunctionPosition = this.mScene.getChildByName("node_function_position") as Laya.Sprite3D;
        this.mNodeBridge = nodeMainIsland.getChildByName("home_bridge") as Laya.Sprite3D;
        let unlockFunctionData = DataManager.getUnlockFunction();

        GameManager.instance.mainIsland = nodeMainIsland;

        for (let key in MyGameConfig.functionUnlockConfig) {
            let functionUnlock = MyGameConfig.functionUnlockConfig[key] as FunctionUnlockConfigInfo;

            if (functionUnlock.isNeedLock) {
                if (unlockFunctionData[functionUnlock.id]) {
                    functionUnlock.isUnlock = true;
                } else {
                    functionUnlock.isUnlock = false;
                }
            } else {
                functionUnlock.isUnlock = true;
            }
            functionUnlock.position = (nodeFunctionPosition.getChildByName(functionUnlock.pointName) as Laya.Sprite3D).transform.position;

            if (functionUnlock.id == MyGameConfig.FUNCTION_ID_FACTORY) {
                GameManager.instance.createGoods();
            }
        }
    }

    public addPvpScene(): void {
        let nodeRobot = this.mScene.getChildByName("node_robot") as Laya.Sprite3D;
        let script = nodeRobot.addComponent(RobotScript) as RobotScript;
        script.init();
        let nodePvp = this.mScene.getChildByName("node_pvp") as Laya.Sprite3D;
        nodePvp.addComponent(PvpSceneScript);
    }

    public setLoadedCallback(callback: Function): void {
        this.mLoadedCallback = callback;
    }
}
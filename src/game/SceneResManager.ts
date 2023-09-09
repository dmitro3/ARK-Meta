import GameConfig from "../GameConfig";
import LoadingDialog from "../loading/LoadingDialog";
import DataManager from "../main/DataManager";
import MyGameConfig from "../main/MyGameConfig";
import PoolManager from "../main/PoolManager";
import SdkCenter from "../sdk/SdkCenter";
import MathUtils from "../utils/MathUtils";
import ParticleScript from "../utils/ParticleScript";
import UiUtils from "../utils/UiUtils";
import ZipUtils from "../utils/ZipUtils";
import AudioManager from "../main/AudioManager";
import StoneConfigInfo from "./bean/config/StoneConfigInfo";
import GameManager from "../main/GameManager";
import MainSceneScript from "./MainSceneScript";
import MeteoriteScript from "./MeteoriteScript";
import MineralScript from "./MineralScript";
import OreScript from "./ani/RotateAniScript";
import StoneCoreScript from "./StoneCoreScript";
import RotateAniScript from "./ani/RotateAniScript";
import CrystalScript from "./CrystalScript";
import GridInfo from "./bean/game/GridInfo";
import LayaZip from "../../libs/LayaZip";
import GuideManager from "./guide/GuideManager";
import LanguageData from "../i18n/LanguageData";

export default class SceneResManager {

    private static mLoadingDialog: LoadingDialog;

    public static loadStartRes(callback: Function): void {
        let res3d = [
            MyGameConfig.URL_RES3D_MAIN + "MainScene.lh",
            MyGameConfig.URL_RES3D_FIRST + "node_spike.lh",
            MyGameConfig.URL_RES3D_FIRST + "node_meteorite1.lh",
            MyGameConfig.URL_RES3D_FIRST + "node_meteorite2.lh",
            MyGameConfig.URL_RES3D_FIRST + "node_meteorite3.lh",
            MyGameConfig.URL_RES3D_FIRST + "node_meteorite4.lh",
            MyGameConfig.URL_RES3D_FIRST + "node_ore.lh",
            MyGameConfig.URL_RES3D_FIRST + "effect_mining.lh",
            MyGameConfig.URL_RES3D_FIRST + "effect_prop_power_small.lh",
            MyGameConfig.URL_RES3D_FIRST + "effect_prop_power_big.lh",
            MyGameConfig.URL_RES3D_FIRST + "effect_boom.lh",
            MyGameConfig.URL_RES3D_FIRST + "effect_catch_crystal.lh"
        ];

        let res2d = [
            ""
        ];

        LayaZip.Init();

        let zipArr = [
            { url: MyGameConfig.URL_RES3D + "LayaScene_MainScene.zip", type: LayaZip.ZIP },
            { url: MyGameConfig.URL_RES3D + "LayaScene_FirstScene.zip", type: LayaZip.ZIP },
            { url: MyGameConfig.URL_RES2D + "sounds.zip", type: LayaZip.ZIP },
        ];

        if (!DataManager.isShowGuide(MyGameConfig.PLAY_MODEL_NORMAL)) {
            zipArr.push({ url: MyGameConfig.URL_RES2D + "guide.zip", type: LayaZip.ZIP });
        }

        this.loadConfig(() => {
            Laya.loader.load(res2d, Laya.Handler.create(this, () => {
                let bitmapFont: Laya.BitmapFont = new Laya.BitmapFont();

                bitmapFont.loadFont("bitmapfont/num1.fnt", new Laya.Handler(this, (bitmapFont: Laya.BitmapFont) => {
                    Laya.Text.registerBitmapFont("num1", bitmapFont);
                }, [bitmapFont]));

                Laya.loader.create(res3d, Laya.Handler.create(this, () => {
                    callback();
                }));
            }));
        });
    }

    private static loadConfig(callback: Function): void {
        let jsonArr = [
            "CarConfig",
            "DesignDiagramConfig",
            "FactoryGoodsConfig",
            "FunctionUnlockConfig",
            "GameConfig",
            "LevelConfig",
            "PvpLevelConfig",
            "StoneConfig",
            "TruckConfig",
        ];
        let requestNum: number = jsonArr.length;
        let currentCompleteNum: number = 0;

        let requestComplete = function () {
            currentCompleteNum++;

            if (requestNum == currentCompleteNum) {
                if (callback) {
                    callback();
                }
            }
        }

        this.loadJosn("CarConfig", (json: any) => {
            for (let i = 0; i < json.length; i++) {
                MyGameConfig.carConfig[json[i].id] = json[i];
            }
            requestComplete();
        });

        this.loadJosn("DesignDiagramConfig", (json: any) => {
            MyGameConfig.designDiagramConfig = json;
            requestComplete();
        });

        this.loadJosn("LevelConfig", (json: any) => {
            MyGameConfig.levelConfig = json;
            requestComplete();
        });

        this.loadJosn("PvpLevelConfig", (json: any) => {
            MyGameConfig.pvpLevelConfig = json;
            requestComplete();
        });

        this.loadJosn("FactoryGoodsConfig", (json: any) => {
            for (let i = 0; i < json.length; i++) {
                MyGameConfig.factoryGoodsConfig[json[i].id] = json[i];
            }

            requestComplete();
        });

        this.loadJosn("FunctionUnlockConfig", (json: any) => {
            MyGameConfig.functionUnlockConfig = json;
            requestComplete();
        });

        this.loadJosn("GameConfig", (json: any) => {
            MyGameConfig.gameConfig = json;
            requestComplete();
        });

        this.loadJosn("StoneConfig", (json: any) => {
            for (let i = 0; i < json.length; i++) {
                let info = json[i];
                MyGameConfig.stoneConfig[info.type] = info;
                info.particleColor = JSON.parse(info.particleColor);
                info.particleColor.particleColor = new Laya.Vector4(info.particleColor[0] / 255, info.particleColor[1] / 255, info.particleColor[2] / 255, 1);
            }

            requestComplete();
        });

        this.loadJosn("TruckConfig", (json: any) => {
            MyGameConfig.truckConfig = json;
            requestComplete();
        });

        UiUtils.loadJson(MyGameConfig.URL_RES2D + "i18n/" + LanguageData.getInstance().getLanguage() + "/language", (json: any) => {
            LanguageData.getInstance().addLanguageData(LanguageData.getInstance().getLanguage(), json);
        });
    }

    public static createScene(callback: Function): void {
        let scene3d = new Laya.Scene3D();

        let sceneContent = Laya.loader.getRes(MyGameConfig.URL_RES3D_MAIN + "MainScene.lh") as Laya.Sprite3D;
        scene3d.ambientMode = Laya.AmbientMode.SolidColor;
        scene3d.ambientColor = new Laya.Vector3(1, 1, 1);

        scene3d.addChild(sceneContent);

        while (sceneContent.numChildren > 0) {
            scene3d.addChild(sceneContent.getChildAt(0));
        }

        Laya.stage.addChild(scene3d);

        let sceneScript = scene3d.addComponent(MainSceneScript) as MainSceneScript;

        sceneScript.setLoadedCallback(callback);
    }

    public static loadJosn(name: string, callback: Function): void {
        UiUtils.loadJson(MyGameConfig.URL_CONFIG + name, callback);
    }

    public static createSky(parent: Laya.Sprite3D, name: string, callback: Function): void {
        let subName = name.substring(0, name.lastIndexOf("."));

        if (parent.numChildren > 0) {
            if (parent.getChildAt(0).name == subName) {
                callback();
                return;
            }
        }

        Laya.loader.create(MyGameConfig.URL_RES3D_SKY + name, Laya.Handler.create(this, () => {
            parent.destroyChildren();
            let sky = Laya.loader.getRes(MyGameConfig.URL_RES3D_SKY + name) as Laya.Sprite3D;
            let skyRotateAniScript = sky.addComponent(RotateAniScript) as RotateAniScript;
            skyRotateAniScript.init(new Laya.Vector3(0, MyGameConfig.SKY_ROTATE_SPEED, 0));
            sky.transform.position = new Laya.Vector3(0, 0, 0);
            parent.addChild(sky);

            callback();
        }));
    }

    public static createRole(name: string, callback: Function): void {
        Laya.Sprite3D.load(MyGameConfig.URL_RES3D_ROLE + name + ".lh", Laya.Handler.create(null, function (node: Laya.Script3D) {
            callback(Laya.loader.getRes(MyGameConfig.URL_RES3D_ROLE + name + ".lh").clone() as Laya.Sprite3D);
        }));
    }

    public static createSpike(parent: Laya.Sprite3D, position: Laya.Vector3, rotationEuler: Laya.Vector3, size: Laya.Vector3): Laya.Sprite3D {
        let nodeSpike = Laya.loader.getRes(MyGameConfig.URL_RES3D_FIRST + "node_spike.lh").clone() as Laya.Sprite3D;

        nodeSpike.transform.localPosition = position;
        nodeSpike.transform.rotationEuler = rotationEuler;
        (nodeSpike.getChildAt(0) as Laya.Sprite3D).transform.setWorldLossyScale(size);

        parent.addChild(nodeSpike);

        return nodeSpike;
    }

    public static createCrushedStone(parent: any, type: number, position: Laya.Vector3, rotationEuler: Laya.Vector3, scale?: number): StoneCoreScript {
        let nodeStone = this.getPoolNode(parent, MyGameConfig.stoneConfig[type].stoneFloorModel, MyGameConfig.URL_RES3D_STONE + MyGameConfig.stoneConfig[type].stoneFloorModel, StoneCoreScript) as Laya.MeshSprite3D;

        nodeStone.transform.localPosition = position;
        nodeStone.transform.rotationEuler = rotationEuler;
        parent.addChild(nodeStone);
        let script: StoneCoreScript = nodeStone.getComponent(StoneCoreScript);

        if (scale) {
            nodeStone.transform.setWorldLossyScale(new Laya.Vector3(scale, scale, scale));
        } else {
            nodeStone.transform.setWorldLossyScale(new Laya.Vector3(1, 1, 1));
        }

        script.setNode(nodeStone);

        return script;
    }

    public static createStaticCrushedStone(parent: any, type: number, position: Laya.Vector3, rotationEuler: Laya.Vector3, scale?: number): Laya.MeshSprite3D {
        let nodeStone = Laya.loader.getRes(MyGameConfig.URL_RES3D_STONE + MyGameConfig.stoneConfig[type].stoneFloorModel).clone() as Laya.MeshSprite3D;

        parent.addChild(nodeStone);

        nodeStone.transform.position = position;
        nodeStone.transform.rotationEuler = rotationEuler;

        return nodeStone;
    }

    public static createCatchStone(parent: any, type: number, position: Laya.Vector3, rotationEuler: Laya.Vector3, scale?: number): StoneCoreScript {
        let nodeStone = this.getPoolNode(parent, MyGameConfig.stoneConfig[type].stoneCatchModel, MyGameConfig.URL_RES3D_STONE + MyGameConfig.stoneConfig[type].stoneCatchModel, StoneCoreScript) as Laya.MeshSprite3D;

        nodeStone.transform.position = position;
        nodeStone.transform.rotationEuler = rotationEuler;

        if (!scale) {
            nodeStone.transform.setWorldLossyScale(new Laya.Vector3(1, 1, 1));
        } else {
            nodeStone.transform.setWorldLossyScale(new Laya.Vector3(scale, scale, scale));
        }

        let script: StoneCoreScript = nodeStone.getComponent(StoneCoreScript);

        script.setNode(nodeStone);

        return script;
    }

    public static createStaticCatchStone(parent: any, type: number, position: Laya.Vector3, scale?: number): Laya.MeshSprite3D {
        let nodeStone = Laya.loader.getRes(MyGameConfig.URL_RES3D_STONE + MyGameConfig.stoneConfig[type].stoneCatchModel).clone() as Laya.MeshSprite3D;

        parent.addChild(nodeStone);

        nodeStone.transform.localPosition = position;
        if (scale) {
            nodeStone.transform.setWorldLossyScale(new Laya.Vector3(scale, scale, scale));
        } else {
            nodeStone.transform.setWorldLossyScale(new Laya.Vector3(MyGameConfig.CONTAINER_STONE_SCALE, MyGameConfig.CONTAINER_STONE_SCALE, MyGameConfig.CONTAINER_STONE_SCALE));
        }

        return nodeStone;
    }

    public static createMineral(parent: any, position: Laya.Vector3): MineralScript {
        let nodeMineral = this.getPoolNode(parent, "node_crystal2", MyGameConfig.URL_RES3D_FIRST + "node_crystal2.lh", MineralScript);
        let script: MineralScript = nodeMineral.getComponent(MineralScript);

        script.init(nodeMineral);

        nodeMineral.transform.localPosition = position;

        nodeMineral.active = false;

        return script;
    }

    public static createMeteorite(parent: any): Laya.Sprite3D {
        let num = MathUtils.nextInt(1, 4);
        let nodeMineral = this.getPoolNode(parent, "node_meteorite" + num, MyGameConfig.URL_RES3D_FIRST + "node_meteorite" + num + ".lh", MeteoriteScript);
        let scale = MathUtils.toFixed(MathUtils.nextFloat(0.3, 0.5), 2);
        nodeMineral.transform.setWorldLossyScale(new Laya.Vector3(scale, scale, scale));
        nodeMineral.transform.position = new Laya.Vector3(MathUtils.nextFloat(-7, 7), MathUtils.nextFloat(3, 6), -10);

        return nodeMineral;
    }

    public static createCrystal(parent: Laya.Sprite3D, pos: Laya.Vector3, gridInfo: GridInfo): CrystalScript {
        let nodeCrystal = this.getPoolNode(parent, "node_ore.lh", MyGameConfig.URL_RES3D_FIRST + "node_ore.lh", CrystalScript);
        let script: CrystalScript = nodeCrystal.getComponent(CrystalScript);

        nodeCrystal.transform.position = pos;

        script.init(nodeCrystal as Laya.MeshSprite3D, gridInfo);

        return script;
    }

    public static createEffectPropPower(parent: Laya.Sprite3D, isBig: boolean): Laya.Sprite3D {
        let nodeName = "effect_prop_power_small.lh";

        let nodeEffect = Laya.loader.getRes(MyGameConfig.URL_RES3D_FIRST + nodeName).clone() as Laya.MeshSprite3D;

        nodeEffect.transform.localPosition = new Laya.Vector3(0, 0, 0);

        parent.addChild(nodeEffect);

        return nodeEffect;
    }

    public static playEffectMining(position: Laya.Vector3, rotationEuler: Laya.Vector3, type: number): Laya.Sprite3D {
        return null;
    }

    public static playEffectCatchCrystal(position: Laya.Vector3): Laya.Sprite3D {
        var nodeEffect: Laya.Sprite3D = this.createEffectParticle("effect_catch_crystal",
            MyGameConfig.URL_RES3D_FIRST + "effect_catch_crystal.lh", GameManager.instance.scene3d) as Laya.Sprite3D;

        if (nodeEffect) {
            nodeEffect.transform.position = position;
        }

        return nodeEffect;
    }

    public static playEffectBoom(position: Laya.Vector3): Laya.Sprite3D {
        var nodeEffect: Laya.Sprite3D = this.createEffectParticle("effect_boom",
            MyGameConfig.URL_RES3D_FIRST + "effect_boom.lh", GameManager.instance.scene3d) as Laya.Sprite3D;

        if (nodeEffect) {
            nodeEffect.transform.position = position;
            AudioManager.playBoom();
        }

        return nodeEffect;
    }

    private static getPoolNode(parent: any, nodeName: string, url: string, componentType?: typeof Laya.Component): Laya.Sprite3D {
        let node = PoolManager.getItem(nodeName);

        if (node) {
        } else {
            node = Laya.loader.getRes(url).clone();
            node.name = nodeName;
            parent.addChild(node);

            if (componentType) {
                node.addComponent(componentType);
            }
        }

        return node;
    }

    private static createEffectParticle(effectName: string, path: string, nodeParent: any, isPrepareCreate?: boolean, playRate?: number): Laya.Sprite3D {
        var nodeEffect: Laya.Sprite3D;
        var script: ParticleScript;

        if (!isPrepareCreate) {
            nodeEffect = PoolManager.getItemParticle(effectName);
        }

        if (!nodeEffect) {
            nodeEffect = Laya.loader.getRes(path).clone() as Laya.Sprite3D;
            nodeEffect.name = effectName;
            script = nodeEffect.addComponent(ParticleScript);
            nodeParent.addChild(nodeEffect);
        } else {
            script = nodeEffect.getComponent(ParticleScript);
            nodeEffect.active = true;
        }

        if (isPrepareCreate) {
            nodeEffect.active = false;
        } else {
            script.init(effectName, playRate);
        }

        return nodeEffect;
    }
}
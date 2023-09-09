import DataManager from "../main/DataManager";
import MyGameConfig from "../main/MyGameConfig";
import CameraMoveScript from "../utils/CameraMoveScript";
import EventUtils from "../utils/EventUtils";
import Vector3Utils from "../utils/Vector3Utils";
import AudioManager from "../main/AudioManager";
import CarConfigInfo from "./bean/config/CarConfigInfo";
import FunctionUnlockConfigInfo from "./bean/config/FunctionUnlockConfigInfo";
import StoneConfigInfo from "./bean/config/StoneConfigInfo";
import GridInfo from "./bean/game/GridInfo";
import DirectionScript from "./DirectionScript";
import FullStoneTipScript from "./FullStoneTipScript";
import GameManager from "../main/GameManager";
import MapManager from "./map/MapManager";
import BasePropsScript from "./props/BasePropsScript";
import PropsCapacityScript from "./props/PropsCapacityScript";
import PropsExplosiveScript from "./props/PropsExplosiveScript";
import PropsPowerScript from "./props/PropsPowerScript";
import PropsRollerScript from "./props/PropsRollerScript";
import ProspectingMapManager from "./ProspectingMapManager";
import RollerScript from "./RollerScript";
import SceneResManager from "./SceneResManager";
import CharacterFactoryState from "./state/character/CharacterFactoryState";
import CharacterHaulState from "./state/character/CharacterHaulState";
import CharacterMapState from "./state/character/CharacterMapState";
import CharacterLaboratoryState from "./state/character/CharacterLaboratoryState";
import CharacterRepairFactoryState from "./state/character/CharacterRepairFactoryState";
import CharacterRepairState from "./state/character/CharacterRepairState";
import CharacterSellState from "./state/character/CharacterSellState";
import CharacterShopState from "./state/character/CharacterTankShopState";
import CharacterUpgradeState from "./state/character/CharacterUpgradeState";
import CharacterBaseState from "./state/CharacterBaseState";
import StateMachine from "./state/StateMachine";
import StoneCoreScript from "./StoneCoreScript";
import UiUtils from "../utils/UiUtils";
import RadarScript from "./RadarScript";
import DurableScript from "./role/DurableScript";
import { CharacterHaulPvpState } from "./state/character/CharacterHaulPvpState";
import BaseState from "./state/BaseState";
import BaseRoleScript from "./role/BaseRoleScript";
import PvpMapManager from "./map/PvpMapManager";
import WalletUtils from "../utils/WalletUtils";

export default class RoleScript extends BaseRoleScript {


    private CONTAINER_LAYER_MAX = this.CONTAINER_LAYER_ROW * this.CONTAINER_LAYER_COL;

    private mNodeContainer: Laya.Sprite3D;

    private mCameraPosition: Laya.Vector3;



    private mNodeCamera: Laya.Sprite3D;

    private mNodeRadar: Laya.Sprite3D;

    private mCamera: Laya.Camera;

    private mDirectionScript: DirectionScript;

    private mNodeEffectMining: Laya.Sprite3D;

    private mFullTipScript: FullStoneTipScript;

    private mPreControlAngle: number = 0;

    private mStartPosition: Laya.Vector3;

    private mMoveLastPosition: Laya.Vector3 = new Laya.Vector3();

    private mMoveDeltaX: number = 0;

    private mMoveDeltaZ: number = 0;

    private mCurcapacity: number;

    private mMaxCapacity: number;


    private mForward = new Laya.Vector3();
    private mScaleWard = new Laya.Vector3();

    private mStateMachine: StateMachine = new StateMachine();

    private mContainerArr: any[][] = [];

    private mContainerLayer: number = 0;

    private mCatchStoneProgress: number = 0;

    private mContainerNum: number = 0;

    private mContainerProgress: number = 0;

    private mCatchStoneCoreNum: number = 0;

    private mCatchStoneCoreProgress: number = 0;

    private mCurSmokeIndex: number;

    private mTrcuckData: any = {
        "capacity": {},
        "catchStoneNum": 0,
    };

    private mTargetPos: Laya.Vector3;

    private mTargetDistance: number;

    private mTargetCallback: Function;

    private mCameraStartFieldOfView: number;
    private mCameraStartLocalPosition: Laya.Vector3;
    private mCameraStartRotationEuler: Laya.Vector3;

    private mPropsEffectMap: any = {};

    private mCurPlayModel: number = MyGameConfig.PLAY_MODEL_NORMAL;

    private mStoneCoreScriptMap: Map<string, StoneCoreScript> = new Map();

    private mIsEnterChildIsland: boolean = false;

    private mRepairRate: number = 1;

    onAwake() {
        this.mContainerArr[this.mContainerLayer] = [];

        this.mStateMachine.registerState(MyGameConfig.STATE_INVALID, new CharacterBaseState(this));
        this.mStateMachine.registerState(MyGameConfig.STATE_SELL, new CharacterSellState(this));
        this.mStateMachine.registerState(MyGameConfig.STATE_UPGRADE, new CharacterUpgradeState(this));
        this.mStateMachine.registerState(MyGameConfig.STATE_TANK_SHOP, new CharacterShopState(this));
        this.mStateMachine.registerState(MyGameConfig.STATE_LABORATORY, new CharacterLaboratoryState(this));
        this.mStateMachine.registerState(MyGameConfig.STATE_FACTORY, new CharacterFactoryState(this));
        this.mStateMachine.registerState(MyGameConfig.STATE_MAP, new CharacterMapState(this));
        this.mStateMachine.registerState(MyGameConfig.STATE_REPAIR_FACTORY, new CharacterRepairFactoryState(this));
        this.mStateMachine.registerState(MyGameConfig.STATE_REPAIR, new CharacterRepairState(this));
        this.mStateMachine.registerState(MyGameConfig.STATE_HAUL, new CharacterHaulState(this));
        this.mStateMachine.registerState(MyGameConfig.STATE_HAUL_PVP, new CharacterHaulPvpState(this));

        this.mStateMachine.changeState(MyGameConfig.STATE_INVALID);

        this.mPropsEffectMap[MyGameConfig.PROPS_ROLLER] = new PropsRollerScript();
        this.mPropsEffectMap[MyGameConfig.PROPS_POWER] = new PropsPowerScript();
        this.mPropsEffectMap[MyGameConfig.PROPS_CAPACITY] = new PropsCapacityScript();
        this.mPropsEffectMap[MyGameConfig.PROPS_EXPLOSIVE] = new PropsExplosiveScript();

        this.addHandler();
    }

    onUpdate() {
        if (!this.mNode || GameManager.instance.isPause
            || this.mStateMachine.mainStateScript.getStateKey() == MyGameConfig.STATE_HAUL
            || this.mStateMachine.mainStateScript.getStateKey() == MyGameConfig.STATE_HAUL_PVP) {
            return;
        }

        let timerDelta = GameManager.instance.timerDelta;

        if (this.mCurStatus == this.STATUS_MOVE) {
            this.mNodeRole.transform.getForward(this.mForward);
            let speedScele = timerDelta * this.mSpeed * this.mSpeedRate;
            Laya.Vector3.scale(this.mForward, speedScele, this.mScaleWard);

            this.mCharacterController.move(this.mScaleWard);
        } else if (this.mCurStatus == this.STATUS_TOUCH_ROTATE && this.mTargetRotateY !== null) {
            let angle = Vector3Utils.getMinAngle(this.mTargetRotateY, this.mNodeRole.transform.rotationEuler.y);
            let absAngle = Math.abs(angle);

            if (absAngle < 10) {
                this.mCurStatus = this.STATUS_MOVE;
                this.mTargetRotateY = null;
            } else {
                let newAngle = angle > 0 ? timerDelta / 3 * this.mSpeedRate : -timerDelta / 3 * this.mSpeedRate;

                if (Math.abs(newAngle) > absAngle) {
                    newAngle = angle > 0 ? angle : -angle;
                } else {
                    newAngle = angle > 0 ? timerDelta / 3 * this.mSpeedRate : -timerDelta / 3 * this.mSpeedRate;
                }
                this.mNodeRole.transform.rotate(new Laya.Vector3(0, newAngle, 0), false, false);
            }
            this.mCharacterController.move(Vector3Utils.ZERO);

            if (this.mNodeRole.transform.position.z < 0) {
                switch (this.mCurPlayModel) {
                    case MyGameConfig.PLAY_MODEL_NORMAL:
                        this.mRollerScript.changeMap();
                        break;
                    case MyGameConfig.PLAY_MODEL_PVP:
                        this.mRollerScript.changePvpMap();
                        break;
                }
            }
        } else if (this.mCurStatus == this.STATUS_GO_TARGET) {
            this.mNodeRole.transform.getForward(this.mForward);
            let moveDistance = timerDelta * this.mSpeed;

            if (this.mTargetDistance < moveDistance) {
                Laya.Vector3.scale(this.mForward, this.mTargetDistance, this.mScaleWard);
                this.mCharacterController.move(this.mScaleWard)
                this.mCurStatus = this.STATUS_IDLE;
                this.mTargetCallback();
                this.mCharacterController.move(Vector3Utils.ZERO);
            } else {
                Laya.Vector3.scale(this.mForward, moveDistance, this.mScaleWard);
                this.mCharacterController.move(this.mScaleWard);
            }

            this.mTargetDistance -= moveDistance;
        }

        for (let key in this.mPropsEffectMap) {
            (this.mPropsEffectMap[key] as BasePropsScript).update();
        }
    }

    onLateUpdate(): void {
        if (!this.mNode || GameManager.instance.isPause) {
            return;
        }

        let position = this.mNodeRole.transform.position;

        if (this.mStateMachine.mainStateScript.getStateKey() != MyGameConfig.STATE_HAUL_PVP) {
            this.mMoveDeltaX = position.x - this.mMoveLastPosition.x;
            let moveDeltaY = position.y - this.mMoveLastPosition.y;
            this.mMoveDeltaZ = position.z - this.mMoveLastPosition.z;

            this.mCameraPosition.x += this.mMoveDeltaX;
            this.mCameraPosition.y += moveDeltaY;
            this.mCameraPosition.z += this.mMoveDeltaZ;
            this.mNodeCamera.transform.position = this.mCameraPosition;
            this.mMoveLastPosition.setValue(position.x, position.y, position.z);
        }

        if (this.mStateMachine.mainStateScript.getStateKey() == MyGameConfig.STATE_HAUL
            || this.mStateMachine.mainStateScript.getStateKey() == MyGameConfig.STATE_HAUL_PVP) {
            this.mStateMachine.update();
            return;
        }

        this.mDirectionScript.check();

        if (position.z > 1) {
            this.mIsEnterChildIsland = false;

            let isLevel: boolean = true;

            for (let key in MyGameConfig.functionUnlockConfig) {
                let functionUnlock = MyGameConfig.functionUnlockConfig[key] as FunctionUnlockConfigInfo;

                let state;
                let distance = Laya.Vector3.distance(functionUnlock.position, position);

                if (distance < functionUnlock.radius) {
                    let curState = this.mStateMachine.mainStateScript.getStateKey();

                    switch (functionUnlock.id) {
                        case MyGameConfig.FUNCTION_ID_SELL:
                            state = MyGameConfig.STATE_SELL;
                            break;
                        case MyGameConfig.FUNCTION_ID_TANK_SHOP:
                            state = MyGameConfig.STATE_TANK_SHOP;
                            break;
                        case MyGameConfig.FUNCTION_ID_LABORATORY:
                            state = MyGameConfig.STATE_LABORATORY;
                            break;
                        case MyGameConfig.FUNCTION_ID_FACTORY:
                            state = MyGameConfig.STATE_FACTORY;
                            break;
                        case MyGameConfig.FUNCTION_ID_MAP:
                            state = MyGameConfig.STATE_MAP;
                            break;
                        case MyGameConfig.FUNCTION_ID_REPAIR_STATION:
                            if (curState != MyGameConfig.STATE_UPGRADE && curState != MyGameConfig.STATE_REPAIR) {
                                state = MyGameConfig.STATE_REPAIR_FACTORY;
                            } else {
                                state = curState;
                            }
                            break;
                        default:
                            state = curState;
                            break;
                    }
                    isLevel = false;

                    if (distance < functionUnlock.radius && state != curState) {
                        this.mStateMachine.changeState(state);
                        break;
                    } else if (distance > functionUnlock.radius && state == curState) {
                        this.mStateMachine.changeState(MyGameConfig.STATE_INVALID);
                        break;
                    }
                }
            }

            if (isLevel && this.mStateMachine.mainStateScript.getStateKey() != MyGameConfig.STATE_INVALID) {
                this.mStateMachine.changeState(MyGameConfig.STATE_INVALID);
            }

            this.mStateMachine.update();
            this.setSpeedRate(1);
        } else {
            this.checkMap();
        }
    }

    private checkMap(): void {
        switch (this.mCurPlayModel) {
            case MyGameConfig.PLAY_MODEL_NORMAL:
                this.checkNormalMap();
                break;
            case MyGameConfig.PLAY_MODEL_PROSPECTING:
                this.checkProspectingMap();
                if (!this.mIsEnterChildIsland) {
                    EventUtils.dispatchEvent(MyGameConfig.EVENT_PROSPECTING_TIMER_PAUSE, false);
                }
                break;
            case MyGameConfig.PLAY_MODEL_PVP:
                this.checkPvpMap();
                break;
        }

        this.mIsEnterChildIsland = true;
    }

    private checkNormalMap(): void {
        let position = this.mNodeRole.transform.position;
        let distance = Laya.Vector3.distance(position, this.mLastPosition);

        if (this.mDurable <= 0) {
            this.haul();
            return;
        }

        if (this.mStateMachine.mainStateScript.getStateKey() != MyGameConfig.STATE_INVALID) {
            this.mStateMachine.changeState(MyGameConfig.STATE_INVALID);
        }

        if (distance > 0.1) {
            this.mLastPosition.setValue(position.x, position.y, position.z);
            this.mRollerScript.changeMap();
        }
    }

    private checkProspectingMap(): void {
        ProspectingMapManager.instance.checkMap();
    }

    private haul(): void {
        GameManager.instance.isControl = false;
        this.stopMove();
        this.showWheel(false);
        this.mCharacterController.enabled = false;
        this.mStateMachine.changeState(MyGameConfig.STATE_HAUL);
    }

    public haulEnd(): void {
        GameManager.instance.isControl = true;
        this.showWheel(true);
        this.mCharacterController.enabled = true;
        this.mStateMachine.changeState(MyGameConfig.STATE_INVALID);
    }


    public init(): void {
        super.init();
        this.mNodeCamera = this.mNode.getChildByName("node_camera") as Laya.Sprite3D;
        this.mCamera = this.mNodeCamera.getChildByName("Main Camera") as Laya.Camera;
        this.mCameraStartFieldOfView = this.mCamera.fieldOfView;
        this.mCameraStartLocalPosition = this.mCamera.transform.localPosition.clone();
        this.mCameraStartRotationEuler = this.mCamera.transform.rotationEuler.clone();
        this.mCameraPosition = this.mNodeCamera.transform.position.clone();

        this.mCamera.enableHDR = false;

        this.mCamera.addComponent(CameraMoveScript);
        this.mLastPosition.setValue(this.mNodeRole.transform.position.x, this.mNodeRole.transform.position.y, this.mNodeRole.transform.position.z);
        this.mMoveLastPosition.setValue(this.mNodeRole.transform.position.x, this.mNodeRole.transform.position.y, this.mNodeRole.transform.position.z);


        this.mNodeContainer = this.mNodeRole.getChildByName("node_container") as Laya.Sprite3D;
        this.mNodeEffectMining = this.mNodeRole.getChildByName("node_effect_mining") as Laya.Sprite3D;
        let noodeFullTip = this.mNodeRole.getChildByName("node_full_tip") as Laya.Sprite3D;

        this.mNodeRadar = this.mNodeRole.getChildByName("node_radar") as Laya.Sprite3D;
        this.mNodeRadar.addComponent(RadarScript);
        let nodeDirection = this.mNodeCamera.getChildByName("node_direction") as Laya.Sprite3D;
        this.mDirectionScript = nodeDirection.addComponent(DirectionScript);
        this.mDirectionScript.init(nodeDirection);
        this.mCurSmokeIndex = 0;

        this.mFullTipScript = noodeFullTip.addComponent(FullStoneTipScript);
        noodeFullTip.active = true;

        this.setSpeedLevel(DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_TRUCK_SPEED));
        this.setMaxCapacity(DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_TRUCK_CAPACITY));

        let levelData = {};
        levelData[MyGameConfig.PROPERTY_CAR_SPIKE_CIRCLE_NUM] = DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_SPIKE_CIRCLE_NUM);
        levelData[MyGameConfig.PROPERTY_CAR_SPIKE_NUM] = DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_SPIKE_NUM);
        levelData[MyGameConfig.PROPERTY_CAR_SPIKE_SIZE] = DataManager.getLevelByKey(MyGameConfig.KEY_DAY_LEVEL_SPIKE_SIZE);
        levelData[MyGameConfig.PROPERTY_CAR_ROLLER_SIZE] = DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_ROLLER_SIZE);

        this.getRollerScript().initLevel(levelData);


        this.mNodeRole.transform.position = new Laya.Vector3(this.mNodeRole.transform.position.x, 0, this.mNodeRole.transform.position.z);
        this.mStartPosition = this.mNodeRole.transform.position.clone();
        let totalPrice: number = 0;

        DataManager.addGoldValue(totalPrice);
        DataManager.setTruckData(this.mTrcuckData);
    }

    private addHandler(): void {
        EventUtils.onEvent(this, MyGameConfig.EVENT_CATCH_PROPS, (args: any) => {
            this.mPropsEffectMap[args.type].refresh();
        });

        EventUtils.onEvent(this, MyGameConfig.EVENT_REPAIR, () => {
            this.clearWheel();
            this.showWheel(true);
            this.mCharacterController.enabled = true;
            this.mStateMachine.changeState(MyGameConfig.STATE_REPAIR);
        });
    }



    public startMove(): void {
        this.mCurStatus = this.STATUS_TOUCH_ROTATE;
        this.mTargetRotateY = 0;
    }

    public controlMove(radians: number, angle: number): void {
        if (this.mCurStatus == this.STATUS_TOUCH_ROTATE) {
            this.mTargetRotateY = angle;
            this.mPreControlAngle = angle;

            return;
        }

        if (Math.abs(angle - this.mPreControlAngle) > 10) {
            this.mCurStatus = this.STATUS_TOUCH_ROTATE;
            this.mTargetRotateY = angle;
            return;
        }

        this.mNodeRole.transform.rotationEuler = new Laya.Vector3(0, angle, 0);
        this.mCurStatus = this.STATUS_MOVE;
        this.mPreControlAngle = angle;
        AudioManager.playTruck();
    }

    public stopMove(): void {
        this.mCurStatus = this.STATUS_IDLE;
        this.mCharacterController.move(Vector3Utils.ZERO);
        AudioManager.stopTruck();
    }

    public catchStone(info: any, isCatchFloorStone: boolean, nodeStone?: Laya.Sprite3D): boolean {
        if (this.mContainerNum >= this.mMaxCapacity) {
            this.mFullTipScript.startAni(this.mContainerLayer);
            return false;
        }

        let num = isCatchFloorStone ? info.num : 1;

        for (let i = 0; i < num; i++) {
            if (i == 0) {
                if (!nodeStone) {
                    nodeStone = SceneResManager.createCatchStone(GameManager.instance.curChildIsland, info.type, info.pos, this.mNodeRole.transform.rotationEuler).getNode();
                } else {
                    nodeStone = SceneResManager.createCrushedStone(GameManager.instance.curChildIsland, info.type, info.pos, info.node.transform.rotationEuler).getNode();
                    nodeStone.transform.position = info.pos;

                    MapManager.instance.pushDestroyStatic(info.node);

                    info.node = nodeStone;
                }
            } else {
                nodeStone = SceneResManager.createCatchStone(GameManager.instance.curChildIsland, info.type, info.pos, this.mNodeRole.transform.rotationEuler).getNode();
            }

            let script = nodeStone.getComponent(StoneCoreScript) as StoneCoreScript;

            if (!script) {
                script = nodeStone.addComponent(StoneCoreScript) as StoneCoreScript;
            }

            if (!this.mStoneCoreScriptMap[script.getUuid()]) {
                this.mStoneCoreScriptMap.set(script.getUuid(), script);
            }

            if (!this.mContainerArr[this.mContainerLayer]) {
                this.mContainerArr[this.mContainerLayer] = [];
            }

            if (this.mContainerArr[this.mContainerLayer].length == this.CONTAINER_LAYER_MAX) {
                this.mContainerLayer++;
                this.mContainerArr[this.mContainerLayer] = [];
            }

            let row = Math.floor(this.mContainerArr[this.mContainerLayer].length / this.CONTAINER_LAYER_COL);
            let col = this.mContainerArr[this.mContainerLayer].length % this.CONTAINER_LAYER_COL;
            let startX = -0.23;
            let startZ = -0.12;

            let localPosition = new Laya.Vector3(startX + col * 0.072, this.mContainerLayer * 0.075 + 0.04, startZ + row * 0.24);

            let obj = { type: info.type, node: nodeStone, pos: localPosition };

            if (i == 0) {
                let self = this;

                let flyCallback = function (script: StoneCoreScript, args) {
                    AudioManager.playCollectStone();

                    let newStone = SceneResManager.createStaticCatchStone(self.mNodeContainer, args.type, args.pos);

                    MapManager.instance.pushContainerStatic(newStone);

                    obj.node = newStone;
                };

                if (isCatchFloorStone) {
                    let outPos: Laya.Vector3 = new Laya.Vector3();

                    Laya.Vector3.transformV3ToV3(localPosition, this.mNodeContainer.transform.worldMatrix, outPos);
                    outPos.y += this.mContainerLayer * 0.07;
                    script.fly(script.getNode().transform.position, outPos, true, flyCallback, obj);
                } else {
                    script.jump(info.pos, obj, (script: StoneCoreScript, args) => {
                        let outPos: Laya.Vector3 = new Laya.Vector3();

                        Laya.Vector3.transformV3ToV3(args.pos, this.mNodeContainer.transform.worldMatrix, outPos);
                        script.fly(script.getNode().transform.position, outPos, true, flyCallback, obj);
                    });
                }
            } else {
                script.getNode().transform.localPosition = localPosition;
                script.getNode().transform.setWorldLossyScale(new Laya.Vector3(MyGameConfig.CONTAINER_STONE_SCALE, MyGameConfig.CONTAINER_STONE_SCALE, MyGameConfig.CONTAINER_STONE_SCALE));
                script.getNode().transform.localRotationEuler = new Laya.Vector3(0, 0, 0);
                this.mNodeContainer.addChild(script.getNode());
            }

            this.mContainerArr[this.mContainerLayer].push(obj);

            if (!this.mTrcuckData.capacity[info.type]) {
                this.mTrcuckData.capacity[info.type] = 1;
            } else {
                this.mTrcuckData.capacity[info.type]++;
            }

            this.mTrcuckData.catchStoneNum++;
            this.mContainerNum++;

            this.mCatchStoneProgress = this.mTrcuckData.catchStoneNum / MapManager.instance.curIslandTotalCatchStone;
            this.mContainerProgress = this.mContainerNum / this.mMaxCapacity;

            if (this.mCatchStoneProgress == 1) {
                this.clearProps();
                EventUtils.dispatchEvent(MyGameConfig.EVENT_CATCH_END, "");
            }
        }

        return true;
    }

    public catchStoneCore(info: any, gridInfo?: GridInfo): void {
        this.mCatchStoneCoreNum++;

        this.mCatchStoneCoreProgress = this.mCatchStoneCoreNum / MapManager.instance.curIslandTotalCatchStoneCore;

        let stoneInfo = MyGameConfig.stoneConfig[info.type] as StoneConfigInfo;

        this.addDurable(-stoneInfo.loss);

        if (this.mContainerNum >= this.mMaxCapacity) {
            this.mFullTipScript.startAni(this.mContainerLayer);
            if (this.mCatchStoneCoreNum % MyGameConfig.gameConfig.stoneCoreComposeStone == 0) {
                MapManager.instance.createFloorStone(info, gridInfo);
            }
        } else {
            if (this.mCatchStoneCoreNum % MyGameConfig.gameConfig.stoneCoreComposeStone == 0) {
                // MapManager.instance.createCrystal();
                MapManager.instance.createDesignDiagram();

                this.catchStone(info, false);
            }
        }
    }

    public stoneCoreConsumeDurable(stoneInfo: StoneConfigInfo, reduce: number = 1): void {
    }

    public catchStoneCoreCreateStone(info: any, gridInfo: GridInfo): void {
        this.mCatchStoneCoreNum++;

        this.mCatchStoneCoreProgress = this.mCatchStoneCoreNum / MapManager.instance.curIslandTotalCatchStoneCore;

        if (this.mCatchStoneCoreNum % MyGameConfig.gameConfig.stoneCoreComposeStone == 0) {
            MapManager.instance.createFloorStone(info, gridInfo);
        }
    }

    public popOneStone(): any {
        if (this.mContainerArr[this.mContainerLayer]) {
            let info;

            if (this.mContainerArr[this.mContainerLayer].length > 0) {
                this.mContainerNum--;

                info = this.mContainerArr[this.mContainerLayer].pop();

                this.mTrcuckData.capacity[info.type]--;
            } else if (this.mContainerLayer > 0) {
                this.mContainerArr.pop();
                this.mContainerNum--;
                this.mContainerLayer--;

                info = this.mContainerArr[this.mContainerLayer].pop();

                this.mTrcuckData.capacity[info.type]--;
            }

            if (this.mContainerArr[0].length == 0) {
                this.mContainerArr.pop();
            }

            if (this.mContainerNum < this.mMaxCapacity) {
                this.mFullTipScript.stopAni();
            }

            this.mContainerProgress = this.mContainerNum / this.mMaxCapacity;

            return info;
        }

        return null;
    }

    public popLayerStone(): any {
        let arr = this.mContainerArr.pop();

        this.mContainerLayer = this.mContainerArr.length;

        if (arr) {
            this.mContainerNum -= arr.length;
            this.mContainerProgress = this.mContainerNum / this.mMaxCapacity;

            for (let i = 0; i < arr.length; i++) {
                this.mTrcuckData.capacity[arr[i].type]--;
            }
        }

        if (this.mContainerNum < this.mMaxCapacity) {
            this.mFullTipScript.stopAni();
        }

        return arr;
    }

    public changeSmoke(data: any): void {
    }

    public toTarget(target: Laya.Vector3, callback: Function): void {
        this.mTargetPos = target;
        this.mTargetCallback = callback;
        this.mTargetDistance = Laya.Vector3.distance(this.mNodeRole.transform.position, target);
        this.mNodeRole.transform.lookAt(target, Vector3Utils.UP, false);
        this.mCurStatus = this.STATUS_GO_TARGET;
    }

    public backStart(callback: Function): void {
        this.toTarget(this.mStartPosition, callback);

        this.aniCameraShipStart(1000);
    }

    public aniCameraShipStart(time: number): void {
        this.cameraAni(null, null,
            this.mCamera.fieldOfView + 20, time, false);
    }

    public prepare(): void {
        if (this.mCameraStartLocalPosition) {
            this.cameraAni(null, null,
                this.mCameraStartFieldOfView, 800, false);
        }
    }

    public enterFunction(camera: Laya.Camera): void {
        this.cameraAni(camera.transform.position, camera.transform.rotationEuler,
            camera.fieldOfView, 800, false);
    }

    public levelFunction(): void {
        this.cameraAni(this.mCameraStartLocalPosition, this.mCameraStartRotationEuler,
            this.mCameraStartFieldOfView, 800, true);
    }

    public catchCrystal(): void {
        ProspectingMapManager.instance.catchCrystal();
    }

    public surveyCrystal(): void {
        this.showRadar(true);
    }

    private cameraAni(position: Laya.Vector3, rotationEuler: Laya.Vector3, fieldOfView: number, time: number, isLocal: boolean): void {
        Laya.Tween.to(this.mCamera, {
            fieldOfView: fieldOfView,
            update: new Laya.Handler(this, () => {
                this.mCamera.fieldOfView = this.mCamera.fieldOfView;
            })
        }, time, null, Laya.Handler.create(this, () => {
        }));

        if (position) {
            if (isLocal) {
                let tempPosition = this.mCamera.transform.localPosition;

                Laya.Tween.to(tempPosition, {
                    x: position.x,
                    y: position.y,
                    z: position.z,
                    update: new Laya.Handler(this, () => {
                        this.mCamera.transform.localPosition = tempPosition;
                    })
                }, time, null, Laya.Handler.create(this, () => {
                }));
            } else {
                let tempPosition = this.mCamera.transform.position;

                Laya.Tween.to(tempPosition, {
                    x: position.x,
                    y: position.y,
                    z: position.z,
                    update: new Laya.Handler(this, () => {
                        this.mCamera.transform.position = tempPosition;
                    })
                }, time, null, Laya.Handler.create(this, () => {
                }));
            }
        }

        if (rotationEuler) {
            let tempRotationEuler = this.mCamera.transform.rotationEuler;

            Laya.Tween.to(tempRotationEuler, {
                x: rotationEuler.x,
                y: rotationEuler.y,
                z: rotationEuler.z,
                update: new Laya.Handler(this, () => {
                    this.mCamera.transform.rotationEuler = tempRotationEuler;
                })
            }, time, null, Laya.Handler.create(this, () => {
            }));
        }
    }

    public changeState(state: number): void {
        this.mStateMachine.changeState(state);
    }

    public getCurState(): number {
        return this.mStateMachine.mainStateScript.getStateKey();
    }

    public getMainStateScript(): BaseState {
        return this.mStateMachine.mainStateScript;
    }

    public setMaxCapacity(level: number): void {
        this.mMaxCapacity = MyGameConfig.truckConfig[level].truckCapacity;

        if (this.mTrcuckData.catchStoneNum < this.mMaxCapacity) {
            this.mFullTipScript.stopAni();
        } else {
            this.mFullTipScript.startAni(this.mContainerLayer);
        }
    }

    public getCamera(): Laya.Camera {
        return this.mCamera;
    }

    public getNodeContainer(): Laya.Sprite3D {
        return this.mNodeContainer;
    }

    public getNodeEffectMining(): Laya.Sprite3D {
        return this.mNodeEffectMining;
    }

    public getPosition(): Laya.Vector3 {
        return this.mNodeRole.transform.position;
    }

    public getRotationEuler(): Laya.Vector3 {
        return this.mNodeRole.transform.rotationEuler;
    }

    public addContainerLayer(num: number): void {
        this.mContainerLayer += num;
    }

    public setContainerLayer(num: number): void {
        this.mContainerLayer = num;
    }

    public getCatchStoneNum(): number {
        return this.mTrcuckData.catchStoneNum;
    }

    public getCatchStoneProgress(): number {
        return this.mCatchStoneProgress;
    }

    public getCatchStoneCoreProgress(): number {
        return this.mCatchStoneCoreProgress;
    }

    public getContainerProgress(): number {
        return this.mContainerProgress;
    }

    public getContainerNum(): number {
        return this.mContainerNum;
    }

    public getMaxCapacity(): number {
        return this.mMaxCapacity;
    }

    public getCatchStoneCoreNum(): number {
        return this.mCatchStoneCoreNum;
    }

    public setCatchStoneCoreNum(num): void {
        this.mCatchStoneCoreNum = num;
    }

    public isMove(): boolean {
        return this.mCurStatus == this.STATUS_MOVE;
    }

    public getMoveDeltaX(): number {
        return this.mMoveDeltaX;
    }

    public getMoveDeltaZ(): number {
        return this.mMoveDeltaZ;
    }

    public getNodeSize(): Laya.Sprite3D {
        return this.mNodeSize;
    }

    public getTruckData(): any {
        return this.mTrcuckData;
    }

    public refresh(): any {
        this.mCatchStoneProgress = 0;
        this.mTrcuckData = DataManager.getTruckData();
    }

    public setPlayModel(model: number): void {
        this.mCurPlayModel = model;
    }

    public getPlayModel(): number {
        return this.mCurPlayModel;
    }

    public addDurable(value: number): boolean {
        return false;
    }

    public saveDurable(): void {
        DataManager.setDurable(this.mDurable);
    }

    public getDurableProgress(): number {
        return this.mDurableProgress;
    }

    public clearWheel(): void {
        for (let i = 0; i < this.mNodeWheel.numChildren; i++) {
            (this.mNodeWheel.getChildAt(i) as Laya.TrailSprite3D).clear();
        }
    }

    public showWheel(b: boolean): void {
        for (let i = 0; i < this.mNodeWheel.numChildren; i++) {
            (this.mNodeWheel.getChildAt(i) as Laya.TrailSprite3D).active = b;
        }
    }

    public showRadar(b: boolean): void {
        if (b) {
            (this.mNodeRadar.getComponent(RadarScript) as RadarScript).show();
        }
        this.mNodeRadar.active = b;
    }

    public getDirectionScript(): DirectionScript {
        return this.mDirectionScript;
    }

    public getRepairRate(): number {
        return this.mRepairRate;
    }

    public setRepairRate(rate: number): void {
        this.mRepairRate = rate;
    }

    public pvpPrepare(b: boolean): void {
        GameManager.instance.isControl = false;
        this.stopMove();
        this.showWheel(false);
        this.mCharacterController.enabled = false;
        this.mStateMachine.changeState(MyGameConfig.STATE_HAUL_PVP);

        if (b) {
            EventUtils.dispatchEvent(MyGameConfig.EVENT_PVP_PREPARE, 0);
        }
    }

    public clearProps(): void {
        for (let key in this.mPropsEffectMap) {
            this.mPropsEffectMap[key].clear();
        }
    }
}
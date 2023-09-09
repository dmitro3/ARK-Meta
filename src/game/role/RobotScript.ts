import DataManager from "../../main/DataManager";
import GameManager from "../../main/GameManager";
import MyGameConfig from "../../main/MyGameConfig";
import AstarUtils from "../../utils/AstarUtils";
import MathUtils from "../../utils/MathUtils";
import Vector3Utils from "../../utils/Vector3Utils";
import CarConfigInfo from "../bean/config/CarConfigInfo";
import GridInfo from "../bean/game/GridInfo";
import PvpMapManager from "../map/PvpMapManager";
import RollerScript from "../RollerScript";
import BaseRoleScript from "./BaseRoleScript";

export default class RobotScript extends BaseRoleScript {
    protected STATUS_SEARCH_PATH = 201;

    private mForward = new Laya.Vector3();
    private mScaleWard = new Laya.Vector3();
    private mIsUpdate: boolean = false;
    private mAstarPath: Laya.Vector3[];
    private mAstartPahtIndex: number = 0;
    private mOffsetX: number;
    private mTargetGridInfo: GridInfo;

    onAwake(): void {
        this.mNodeRole = this.owner as Laya.Sprite3D;
        this.mOffsetX = (GameManager.instance.scene3d.getChildByName("node_pvp") as Laya.Sprite3D).transform.position.x;
        this.mIsSelf = false;
    }

    onUpdate(): void {
        if (!this.mIsUpdate) {
            return;
        }

        if (this.mAstarPath) {
            let timerDelta = GameManager.instance.timerDelta;

            if (this.mCurStatus == this.STATUS_MOVE) {
                let position = this.mNodeRole.transform.position;
                let distance = Laya.Vector3.distance(position, this.mAstarPath[this.mAstartPahtIndex]);

                if (distance < 0.1) {
                    this.mAstartPahtIndex++;
                    this.goTarget();

                    if (this.mAstartPahtIndex >= this.mAstarPath.length - 1) {
                        this.searchPath();
                    }

                    return;
                }

                this.mNodeRole.transform.lookAt(this.mAstarPath[this.mAstartPahtIndex], Vector3Utils.UP, false);
                this.mNodeRole.transform.getForward(this.mForward);
                let speedScele = timerDelta * this.mSpeed * this.mSpeedRate;
                Laya.Vector3.scale(this.mForward, speedScele, this.mScaleWard);

                this.mCharacterController.move(this.mScaleWard);
            } else if (this.mCurStatus == this.STATUS_TOUCH_ROTATE && this.mTargetRotateY !== null) {
                let angle = Vector3Utils.getMinAngle(this.mTargetRotateY, this.mNodeRole.transform.rotationEuler.y);
                let absAngle = Math.abs(angle);

                if (absAngle < 5) {
                    this.mNodeRole.transform.lookAt(this.mAstarPath[this.mAstartPahtIndex], Vector3Utils.UP, false);
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

                this.mRollerScript.changePvpMap();
            } else if (this.mCurStatus == this.STATUS_SEARCH_PATH) {
                this.mCurStatus = this.STATUS_IDLE;
                this.searchPath();
            }
        }
    }

    onLateUpdate(): void {
        if (!this.mIsUpdate) {
            return;
        }
        if (this.mTargetGridInfo.stoneCoreArr.length == 0) {
            this.searchPath();
            return;
        }

        this.checkPvpMap();
    }

    public init(): void {
        super.init();
    }

    public createRoleModel(carConfig: CarConfigInfo, callback?: Function, releaseResources?: boolean): void {
        super.createRoleModel(carConfig, () => {
            let levelData = {};
            levelData[MyGameConfig.PROPERTY_CAR_SPIKE_CIRCLE_NUM] = this.getRecentLevel(DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_SPIKE_CIRCLE_NUM));
            levelData[MyGameConfig.PROPERTY_CAR_SPIKE_NUM] = this.getRecentLevel(DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_SPIKE_NUM));
            levelData[MyGameConfig.PROPERTY_CAR_SPIKE_SIZE] = this.getRecentLevel(DataManager.getLevelByKey(MyGameConfig.KEY_DAY_LEVEL_SPIKE_SIZE));
            levelData[MyGameConfig.PROPERTY_CAR_ROLLER_SIZE] = this.getRecentLevel(DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_ROLLER_SIZE));

            this.setSpeedLevel(this.getRecentLevel(DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_TRUCK_SPEED)));
            this.getRollerScript().initLevel(levelData);

            callback();
        }, false);
    }

    private getRecentLevel(level: number): number {
        let newLevel = MathUtils.nextInt(level - 1, level + 3);

        if (newLevel < 0) {
            newLevel = 0;
        }

        if (newLevel >= MyGameConfig.levelConfig.length) {
            newLevel -= MyGameConfig.levelConfig.length - 1;
        }

        return newLevel;
    }

    public setStart(b: boolean): void {
        this.mIsUpdate = b;
        let pos = this.mNode.transform.position;
        this.mLastPosition.setValue(pos.x, pos.y, pos.z);
    }

    public searchPath(): void {
        let randomZ = MathUtils.nextInt(0, PvpMapManager.instance.stoneCountArr.length - 1);

        if (PvpMapManager.instance.stoneCountArr[randomZ].length == 0) {
            let find = false;

            for (let i = 0; i < PvpMapManager.instance.stoneCountArr.length; i++) {
                randomZ++;
                randomZ = randomZ % PvpMapManager.instance.stoneCountArr.length;

                if (PvpMapManager.instance.stoneCountArr[randomZ].length > 0) {
                    find = true;
                    break;
                }
            }

            if (!find) {
                return;
            }
        }

        let randomX = MathUtils.nextInt(0, PvpMapManager.instance.stoneCountArr[randomZ].length - 1);

        let aStarPos = PvpMapManager.instance.stoneCountArr[randomZ][randomX];
        let pos = this.mNodeRole.transform.position;

        this.mTargetGridInfo = PvpMapManager.instance.aStarInfo2GridInfo(aStarPos);

        let pathInfo = AstarUtils.search(Math.floor(pos.x + PvpMapManager.instance.sizeOffsetX - this.mOffsetX),
            Math.floor(-(pos.z + PvpMapManager.instance.sizeOffsetZ)), aStarPos.x, aStarPos.z,
            -PvpMapManager.instance.sizeOffsetX + this.mOffsetX, -PvpMapManager.instance.sizeOffsetZ);
        this.mAstartPahtIndex = 0;

        if (pathInfo && pathInfo.pathArr[this.mAstartPahtIndex]) {
            this.mAstarPath = pathInfo.pathArr;
            this.goTarget();
        } else {
            this.mCurStatus = this.STATUS_SEARCH_PATH;
        }
    }

    private goTarget(): void {
        let pathInfo = this.mAstarPath[this.mAstartPahtIndex];

        if (pathInfo && pathInfo.x && pathInfo.z) {
            let preRotation = this.mNodeRole.transform.rotationEuler.clone();
            this.mNodeRole.transform.lookAt(pathInfo, Vector3Utils.UP, false);
            this.mTargetRotateY = this.mNodeRole.transform.rotationEuler.y;
            this.mNodeRole.transform.rotationEuler = preRotation;
            this.mCurStatus = this.STATUS_TOUCH_ROTATE;

            this.mCharacterController.move(Vector3Utils.ZERO);
            this.mRollerScript.changePvpMap();
        } else {
            this.mCurStatus = this.STATUS_SEARCH_PATH;
        }
    }

    public stopMove(): void {
        this.mCurStatus = this.STATUS_IDLE;
        this.mCharacterController.move(Vector3Utils.ZERO);
        this.mIsUpdate = false;
    }
}
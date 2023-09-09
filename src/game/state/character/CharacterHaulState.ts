import MyGameConfig from "../../../main/MyGameConfig";
import EventUtils from "../../../utils/EventUtils";
import Vector3Utils from "../../../utils/Vector3Utils";
import GameManager from "../../../main/GameManager";
import RoleScript from "../../RoleScript";
import CharacterBaseState from "../CharacterBaseState";

export default class CharacterHaulState extends CharacterBaseState {

    private STATUS_IDLE: number = 0;

    private STATUS_TAKE_OFF: number = 1;

    private STATUS_FLYING: number = 2;
 
    private STATUS_LAND: number = 3;

    private SPEED_LIFT = 0.007;

    private MAX_FLY_HEIGHT = 5;

    private SPEED = 0.3;

    private mNodeTractor: Laya.Sprite3D;

    private mRepairPosition: Laya.Vector3;

    private mCurStatus: number = this.STATUS_IDLE;

    private mTargetPosition: Laya.Vector3;

    private mTempVec3: Laya.Vector3 = new Laya.Vector3();

    private mIsHaul: boolean = false;

    private mIsCarFollow: boolean = false;

    private mStepIndex: number = 0;

    private mLiftCallback: Function;

    private mCamera: Laya.Camera;


    constructor(owner: RoleScript) {
        super(owner);

        this.mPointPosition = this.getPoint(MyGameConfig.FUNCTION_ID_TRACTOR).position;
        this.mRepairPosition = this.getPoint(MyGameConfig.FUNCTION_ID_REPAIR_STATION).position;
        this.mNodeTractor = this.getSceneNode(MyGameConfig.FUNCTION_ID_TRACTOR);
        this.mNodeScene = this.getSceneNode(MyGameConfig.FUNCTION_ID_REPAIR_STATION);
        this.mCamera = this.mNodeScene.getChildByName("Main Camera") as Laya.Camera;
        this.addHandler();
    }

    public onEnter(): void {
        this.mCurStatus = this.STATUS_TAKE_OFF;
        this.mIsHaul = true;
        EventUtils.dispatchEvent(MyGameConfig.EVENT_HIDE_VIEW_DURABLE, false);
        GameManager.instance.roleScript.setRepairRate(MyGameConfig.gameConfig.repairPunish);
    }

    public onUpdate(): void {
        let self = this;

        switch (this.mCurStatus) {
            case this.STATUS_TAKE_OFF:
                switch (this.mStepIndex) {
                    case 0:
                        if (!this.mLiftCallback) {
                            this.takeOff(this.MAX_FLY_HEIGHT);
                            this.mTargetPosition = new Laya.Vector3(this.mOwner.getPosition().x,
                                this.MAX_FLY_HEIGHT, this.owner.getPosition().z);
                            this.mLiftCallback = function () {
                                self.mCurStatus = self.STATUS_FLYING;

                                self.tweenToTarget(this.mTargetPosition, () => {
                                    self.mCurStatus = self.STATUS_IDLE;

                                    self.tweenToRorate(this.mOwner.getRotationEuler().y - 90, () => {
                                        self.mStepIndex++;
                                        self.mLiftCallback = null;
                                        self.mCurStatus = self.STATUS_LAND;
                                    });
                                });
                            }
                        }
                        break;
                    case 2:
                        this.mIsCarFollow = true;
                        if (!this.mLiftCallback) {
                            this.takeOff(this.MAX_FLY_HEIGHT);
                            this.mTargetPosition = new Laya.Vector3(self.mRepairPosition.x, self.MAX_FLY_HEIGHT, self.mRepairPosition.z);
                            self.mLiftCallback = function () {
                                self.mCurStatus = self.STATUS_FLYING;
                                self.tweenToTarget(self.mTargetPosition, () => {
                                    let angle = Vector3Utils.getMinAngle(90, self.owner.getRotationEuler().y);
                                    self.mCurStatus = self.STATUS_IDLE;
                                    self.tweenToRorate(self.mNodeTractor.transform.rotationEuler.y + angle, () => {
                                        self.mStepIndex++;
                                        self.mLiftCallback = null;
                                        self.mCurStatus = self.STATUS_LAND;
                                    });
                                });
                            }
                        }
                        break;
                    case 4:
                        if (!this.mLiftCallback) {
                            this.takeOff(this.MAX_FLY_HEIGHT);
                            this.mTargetPosition = new Laya.Vector3(self.mPointPosition.x, self.MAX_FLY_HEIGHT, self.mPointPosition.z);
                            this.mIsHaul = false;
                            GameManager.instance.roleScript.enterFunction(self.mCamera);

                            EventUtils.dispatchEvent(MyGameConfig.EVENT_HIDE_MAIN_VIEW_DIALOG, true);

                            self.mLiftCallback = function () {
                                self.mCurStatus = self.STATUS_FLYING;
                                EventUtils.dispatchEvent(MyGameConfig.EVENT_REPAIR, "");
                                EventUtils.dispatchEvent(MyGameConfig.EVENT_HIDE_VIEW_DURABLE, true);

                                self.tweenToTarget(self.mTargetPosition, () => {
                                    self.tweenToRorate(-90, () => {
                                        self.mStepIndex++;
                                        self.mLiftCallback = null;
                                        self.mCurStatus = self.STATUS_LAND;
                                        self.forceLand();
                                    });
                                });
                            }
                        }
                        break;
                }
                break;
            case this.STATUS_FLYING:
                this.flying();
                break;
            case this.STATUS_LAND:
                switch (this.mStepIndex) {
                    case 1:
                        if (!this.mLiftCallback) {
                            this.land(0.8);
                            this.mLiftCallback = function () {
                                self.mStepIndex++;
                                self.mLiftCallback = null;
                                self.mCurStatus = self.STATUS_TAKE_OFF;
                            };
                        }
                        break;
                    case 3:
                        if (!this.mLiftCallback) {
                            this.land(0.8);
                            this.mLiftCallback = function () {
                                self.mIsCarFollow = false;
                                self.mStepIndex++;
                                self.mLiftCallback = null;
                                self.mCurStatus = self.STATUS_TAKE_OFF;
                            };
                        }
                        break;
                    case 5:
                        break;
                }
                break;
        }
    }

    public getStateKey(): number {
        return MyGameConfig.STATE_HAUL;
    }

    private addHandler(): void {
    }

    private takeOff(maxHeight: number): void {
        let pos = this.mNodeTractor.transform.position;
        this.mTempVec3.setValue(pos.x, pos.y, pos.z);

        let obj = {
            y: pos.y
        };

        Laya.Tween.to(obj, {
            y: maxHeight,
            update: new Laya.Handler(this, () => {
                if (this.mIsCarFollow) {
                    this.owner.getNodeRole().transform.position.y += obj.y - this.mNodeTractor.transform.position.y;
                    this.owner.getNodeRole().transform.position = this.owner.getNodeRole().transform.position;
                }
                this.mNodeTractor.transform.position.y = obj.y;
                this.mNodeTractor.transform.position = this.mNodeTractor.transform.position;
            })
        }, maxHeight / this.SPEED_LIFT, null, Laya.Handler.create(this, () => {
            if (this.mLiftCallback) {
                this.mLiftCallback();
            }
        }));
    }

    public flying(): void {
        let position = this.mNodeTractor.transform.position;
        var curRot = Vector3Utils.toTargetQuaternion(position, this.mTargetPosition);
        Laya.Quaternion.slerp(this.mNodeTractor.transform.rotation, curRot, 0.1, curRot);
        this.mNodeTractor.transform.rotation = curRot;

        if (this.mIsCarFollow) {
            this.owner.getNodeRole().transform.rotationEuler = new Laya.Vector3(0, this.mNodeTractor.transform.rotationEuler.y + 90, 0);
        }
    }

    private land(height: number): void {
        let pos = this.mNodeTractor.transform.position;
        this.mTempVec3.setValue(pos.x, pos.y, pos.z);

        let obj = {
            y: pos.y
        };

        Laya.Tween.to(obj, {
            y: height,
            update: new Laya.Handler(this, () => {
                if (this.mIsCarFollow) {
                    this.owner.getNodeRole().transform.position.y += obj.y - this.mNodeTractor.transform.position.y;
                    this.owner.getNodeRole().transform.position = this.owner.getNodeRole().transform.position;
                }
                this.mNodeTractor.transform.position.y = obj.y;
                this.mNodeTractor.transform.position = this.mNodeTractor.transform.position;
            })
        }, pos.y / this.SPEED_LIFT, null, Laya.Handler.create(this, () => {
            if (this.mIsCarFollow) {
                this.owner.getNodeRole().transform.position = new Laya.Vector3(this.owner.getPosition().x,
                    0, this.owner.getPosition().z);
            }

            this.mCurStatus = this.STATUS_IDLE;

            if (this.mLiftCallback) {
                this.mLiftCallback();
            }
        }));
    }

    private forceLand(): void {
        let position = this.mNodeTractor.transform.position;
        this.mTempVec3.setValue(position.x, 0, position.z);
        this.mNodeTractor.transform.position = this.mTempVec3;
        this.mTargetPosition = new Laya.Vector3(this.mOwner.getPosition().x,
            this.MAX_FLY_HEIGHT, this.mOwner.getPosition().z);

        this.mStepIndex = 0;
        this.mIsHaul = false;
        this.mLiftCallback = null;
        this.mCurStatus = this.STATUS_IDLE;
        this.mIsCarFollow = false;
    }

    private tweenToTarget(targetPos: Laya.Vector3, callback: Function): void {
        let distance = Laya.Vector3.distance(targetPos, this.mNodeTractor.transform.position);
        let time = distance / (GameManager.instance.timerDelta * this.SPEED) * 1000;

        Laya.Tween.to(this.mNodeTractor.transform.position, {
            x: targetPos.x,
            z: targetPos.z,
            update: new Laya.Handler(this, () => {
                this.mNodeTractor.transform.position = this.mNodeTractor.transform.position;
                if (this.mIsCarFollow) {
                    this.mTempVec3.setValue(this.mNodeTractor.transform.position.x,
                        this.owner.getPosition().y, this.mNodeTractor.transform.position.z);
                    this.owner.getNodeRole().transform.position = this.mTempVec3;
                }
            })
        }, time, null, Laya.Handler.create(this, () => {
            callback();
        }));
    }

    private tweenToRorate(targetRotateY: number, callback: Function): void {
        let rorationEuler = this.mNodeTractor.transform.rotationEuler;
        let rotationY = Vector3Utils.getMinAngle(targetRotateY, rorationEuler.y);
        let time = Math.abs(rotationY) * 10;
        let startRotationEulerY = rorationEuler.y + rotationY;

        let tempRotation = {
            y: 0,
        };

        this.mTempVec3.setValue(rorationEuler.x, rorationEuler.y, rorationEuler.z);

        Laya.Tween.from(tempRotation, {
            y: rotationY,
            update: new Laya.Handler(this, () => {
                this.mTempVec3.y = startRotationEulerY - tempRotation.y;
                this.mNodeTractor.transform.rotationEuler = this.mTempVec3;

                if (this.mIsCarFollow) {
                    this.mTempVec3.setValue(this.owner.getRotationEuler().x,
                        this.mNodeTractor.transform.rotationEuler.y + 90, this.owner.getRotationEuler().z);
                    this.owner.getNodeRole().transform.rotationEuler = this.mTempVec3;
                }
            })
        }, time, null, Laya.Handler.create(this, () => {
            callback();
        }));
    }
}
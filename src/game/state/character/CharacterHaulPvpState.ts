import GameManager from "../../../main/GameManager";
import MyGameConfig from "../../../main/MyGameConfig";
import EventUtils from "../../../utils/EventUtils";
import Vector3Utils from "../../../utils/Vector3Utils";
import RoleScript from "../../RoleScript";
import CharacterBaseState from "../CharacterBaseState";

export class CharacterHaulPvpState extends CharacterBaseState {

    private STATUS_IDLE: number = 0;

    private STATUS_TAKE_OFF: number = 1;

    private STATUS_FLYING: number = 2;

    private STATUS_LAND: number = 3;

    private SPEED_LIFT = 0.007;

    private MAX_FLY_HEIGHT = 5;

    private SPEED = 0.3;

    private mNodeTractor: Laya.Sprite3D;

    private mStartPosition: Laya.Vector3;

    private mStartRotationEuler: Laya.Vector3;

    private mCurStatus: number = this.STATUS_IDLE;

    private mIsHaul: boolean = false;

    private mIsCarFollow: boolean = false;

    private mStepIndex: number = 0;

    private mTargetPosition: Laya.Vector3;

    private mTempVec3: Laya.Vector3 = new Laya.Vector3();

    private mLiftCallback: Function;

    private mIsUpdate: boolean = false;

    constructor(owner: RoleScript) {
        super(owner);

        this.mPointPosition = this.getPoint(MyGameConfig.FUNCTION_ID_TRACTOR).position;
        this.mNodeTractor = this.getSceneNode(MyGameConfig.FUNCTION_ID_TRACTOR);
        this.mStartPosition = this.mNodeTractor.transform.position.clone();
        this.mStartRotationEuler = this.mNodeTractor.transform.rotationEuler.clone();
        this.mNodeScene = this.getSceneNode(MyGameConfig.FUNCTION_ID_REPAIR_STATION);
    }

    public onEnter(): void {
        this.mIsUpdate = true;

        if (this.mStepIndex == 0) {
            this.mCurStatus = this.STATUS_TAKE_OFF;
            this.mIsHaul = true;
            GameManager.instance.roleScript.getDirectionScript().showNode(false);
            GameManager.instance.mainViewDialog.showAllView(false);
        } else {
            this.mCurStatus = this.STATUS_LAND;
        }
    }

    public onUpdate(): void {
        if (!this.mIsUpdate) {
            return;
        }
        let self = this;

        switch (this.mCurStatus) {
            case this.STATUS_TAKE_OFF:
                let maxHeight = 5;

                switch (this.mStepIndex) {
                    case 0:
                        if (!this.mLiftCallback) {
                            this.takeOff(maxHeight);
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
                        maxHeight = 10;

                        if (!this.mLiftCallback) {
                            this.takeOff(maxHeight);
                            EventUtils.dispatchEvent(MyGameConfig.EVENT_PVP_PREPARE, 1);
                            self.mLiftCallback = function () {
                                EventUtils.dispatchEvent(MyGameConfig.EVENT_PVP_PREPARE, 2);
                                self.mLiftCallback = null;
                                self.mIsUpdate = false;
                                self.mStepIndex++;
                                self.mCurStatus = self.STATUS_LAND;
                            }
                        }
                        break;
                    case 4:
                        maxHeight = 15;
                        if (!this.mLiftCallback) {
                            this.takeOff(maxHeight);
                            self.mLiftCallback = function () {
                                self.mLiftCallback = null;
                                self.mIsUpdate = false;
                                self.mStepIndex++;
                                self.mCurStatus = self.STATUS_LAND;
                            }
                        }
                        break;
                    case 6:
                        this.mIsCarFollow = true;
                        maxHeight = 10;

                        if (!this.mLiftCallback) {
                            this.takeOff(maxHeight);
                            EventUtils.dispatchEvent(MyGameConfig.EVENT_PVP_PREPARE, 3);

                            self.mLiftCallback = function () {
                                self.mLiftCallback = null;
                                self.mIsUpdate = false;
                                self.mStepIndex++;
                                self.mCurStatus = self.STATUS_LAND;
                                EventUtils.dispatchEvent(MyGameConfig.EVENT_PVP_PREPARE, 4);
                            }
                        }
                        break;
                    case 8:
                        this.mIsCarFollow = false;
                        maxHeight = 15;
                        if (!this.mLiftCallback) {
                            this.takeOff(maxHeight);
                            self.mLiftCallback = function () {
                                self.forceLand();
                                GameManager.instance.roleScript.haulEnd();
                                GameManager.instance.mainViewDialog.showAllView(true);
                                GameManager.instance.roleScript.getDirectionScript().showNode(true);
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
                        this.mIsCarFollow = false;
                        if (!this.mLiftCallback) {
                            self.land(0.8);
                            this.mLiftCallback = function () {
                                self.mStepIndex++;
                                self.mLiftCallback = null;
                                self.mCurStatus = self.STATUS_TAKE_OFF;
                            };
                        }
                        break;
                    case 3:
                        this.mIsCarFollow = true;
                        if (!this.mLiftCallback) {
                            self.land(0.8);
                            this.mLiftCallback = function () {
                                self.mIsCarFollow = false;
                                self.mStepIndex++;
                                self.mLiftCallback = null;
                                self.mCurStatus = self.STATUS_TAKE_OFF;
                            };
                        }
                        break;
                    case 5:
                        this.mIsCarFollow = false;
                        if (!this.mLiftCallback) {
                            self.land(0.8);
                            this.mLiftCallback = function () {
                                self.mStepIndex++;
                                self.mLiftCallback = null;
                                self.mCurStatus = self.STATUS_TAKE_OFF;
                            };
                        }
                        break;
                    case 7:
                        this.mIsCarFollow = true;
                        if (!this.mLiftCallback) {
                            self.land(0.8);
                            this.mLiftCallback = function () {
                                self.mStepIndex++;
                                self.mLiftCallback = null;
                                self.mCurStatus = self.STATUS_TAKE_OFF;
                            };
                        }
                        break;
                }

                break;
        }
    }

    public getStateKey(): number {
        return MyGameConfig.STATE_HAUL_PVP;
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

    private forceLand(): void {
        this.mNodeTractor.transform.position = this.mStartPosition.clone();
        this.mNodeTractor.transform.rotationEuler = this.mStartRotationEuler.clone();

        this.mStepIndex = 0;
        this.mIsHaul = false;
        this.mLiftCallback = null;
        this.mCurStatus = this.STATUS_IDLE;
        this.mIsCarFollow = false;
    }

    public setUpdate(b: boolean): void {
        this.mIsUpdate = b;
    }

    public getNodeTractor(): Laya.Sprite3D {
        return this.mNodeTractor;
    }
}
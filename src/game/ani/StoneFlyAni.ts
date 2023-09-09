import MyGameConfig from "../../main/MyGameConfig";
import PoolManager from "../../main/PoolManager";
import GameManager from "../../main/GameManager";
import BaseAni from "./BaseAni";

export default class StoneFlyAni extends BaseAni {

    private mTargetScript;
    private mStartPosition: Laya.Vector3;
    private mEndPosition: Laya.Vector3;
    private mIsScale: boolean = false;
    private mPos: Laya.Vector3 = new Laya.Vector3();
    private mMaxHeightPosition: Laya.Vector3;
    private mArgs: any;
    private mFlyingTime: number;
    private mFlyTime: number = 2;
    private mTempScale: Laya.Vector3 = new Laya.Vector3();
    private mDeltaScale: number;

    private mTempRotate: Laya.Vector3 = new Laya.Vector3();

    private mLastStartPositionX: number;
    private mLastEndPositionX: number;
    private mLastStartPositionZ: number;
    private mLastEndPositionZ: number;

    private mIsForce: boolean = false;

    onUpdate() {
        if (!this.mIsUpdate || GameManager.instance.isPause) {
            return;
        }

        let timerDelta = GameManager.instance.timerDelta;

        this.mFlyingTime += Laya.timer.delta;
        var progress = this.mFlyingTime / this.mFlyTime;

        if (progress > 1) {
            progress = 1;
        }

        this.mLastStartPositionX += this.mTargetScript.getMoveDeltaX();
        this.mLastEndPositionX += this.mTargetScript.getMoveDeltaX();
        this.mLastStartPositionZ += this.mTargetScript.getMoveDeltaZ();
        this.mLastEndPositionZ += this.mTargetScript.getMoveDeltaZ();

        var x = (1 - progress) * (1 - progress) * this.mLastStartPositionX + 2 * progress * (1 - progress) * ((this.mLastStartPositionX + this.mLastEndPositionX) / 2) +
            progress * progress * this.mLastEndPositionX;
        var y = (1 - progress) * (1 - progress) * this.mStartPosition.y + 2 * progress * (1 - progress) * this.mMaxHeightPosition.y +
            progress * progress * this.mEndPosition.y;
        var z = (1 - progress) * (1 - progress) * this.mLastStartPositionZ + 2 * progress * (1 - progress) * ((this.mLastStartPositionZ + this.mLastEndPositionZ) / 2) +
            progress * progress * this.mLastEndPositionZ;

        this.mPos.setValue(x, y, z);

        if (this.mIsScale) {
            let scale = 1 - this.mDeltaScale * progress;
            this.mTempScale.setValue(scale, scale, scale);
            this.mNode.transform.setWorldLossyScale(this.mTempScale);
        }

        let rotateX = this.mTempRotate.x + (timerDelta / 2);
        this.mTempRotate.setValue(rotateX, this.mTempRotate.y, this.mTempRotate.z);
        this.mNode.transform.rotationEuler = this.mTempRotate;

        this.mNode.transform.position = this.mPos;

        if (this.mIsForce) {
            progress = 1;
        }

        if (progress >= 1) {
            this.mIsUpdate = false;
            this.mCallback(this, this.mArgs);

            PoolManager.recover(this.mNode.name, this.mNode);
        }
    }

    public init(node: Laya.Sprite3D, targetScript: any, startPosition: Laya.Vector3, endPosition: Laya.Vector3, iscale: boolean = true, callback: Function, args: any): void {
        this.mNode = node;
        this.mTargetScript = targetScript;
        this.mIsUpdate = true;
        this.mStartPosition = startPosition;
        this.mEndPosition = endPosition;
        this.mIsScale = iscale;
        this.mCallback = callback;
        this.mArgs = args;
        this.mFlyingTime = 0;
        this.mFlyTime = Laya.Vector3.distance(startPosition, endPosition) * (200 - GameManager.instance.roleScript.getSpeed() * 10000);
        this.mMaxHeightPosition = new Laya.Vector3((startPosition.x + endPosition.x) / 2, 3 + startPosition.y, (startPosition.z + endPosition.z) / 2);
        this.mDeltaScale = 1 - MyGameConfig.CONTAINER_STONE_SCALE;
        this.mIsForce = false;

        this.mTempRotate.setValue(node.transform.rotationEuler.x, node.transform.rotationEuler.y, node.transform.rotationEuler.z);

        this.mLastStartPositionX = startPosition.x;
        this.mLastStartPositionZ = startPosition.z;
        this.mLastEndPositionX = endPosition.x;
        this.mLastEndPositionZ = endPosition.z;
    }

    public forceComplete(): void {
        this.mIsForce = true;
    }
}
import MyGameConfig from "../../main/MyGameConfig";
import PoolManager from "../../main/PoolManager";
import GameManager from "../../main/GameManager";
import BaseAni from "./BaseAni";

export default class StoneSellAni extends BaseAni {

    private mStartPosition: Laya.Vector3;
    private mEndPosition: Laya.Vector3;
    private mIsLocal: boolean = false;
    private mPos: Laya.Vector3 = new Laya.Vector3();
    private mMaxHeightPosition: Laya.Vector3;
    private mArgs: any;
    private mFlyingTime: number;
    private mFlyTime: number = 2;
    private mTempScale: Laya.Vector3 = new Laya.Vector3();
    private mDeltaScale: number;

    onUpdate() {
        if (!this.mIsUpdate || GameManager.instance.isPause) {
            return;
        }

        let timerDelta = Laya.timer.delta;

        if (timerDelta > MyGameConfig.MAX_TIMER) {
            timerDelta = MyGameConfig.MAX_TIMER;
        }

        this.mFlyingTime += timerDelta;
        var progress = this.mFlyingTime / this.mFlyTime;

        var x = (1 - progress) * (1 - progress) * this.mStartPosition.x + 2 * progress * (1 - progress) * this.mMaxHeightPosition.x +
            progress * progress * this.mEndPosition.x;
        var y = (1 - progress) * (1 - progress) * this.mStartPosition.y + 2 * progress * (1 - progress) * this.mMaxHeightPosition.y +
            progress * progress * this.mEndPosition.y;
        var z = (1 - progress) * (1 - progress) * this.mStartPosition.z + 2 * progress * (1 - progress) * this.mMaxHeightPosition.z +
            progress * progress * this.mEndPosition.z;

        this.mPos.setValue(x, y, z);

        this.mNode.transform.position = this.mPos;

        if (progress >= 1) {
            this.mIsUpdate = false;
            PoolManager.recover(this.mNode.name, this.mNode);
        }
    }

    public init(node: Laya.Sprite3D, startPosition: Laya.Vector3, endPosition: Laya.Vector3, isLocal: boolean = false, callback: Function): void {
        this.mNode = node;
        this.mIsUpdate = true;
        this.mStartPosition = startPosition;
        this.mEndPosition = endPosition;
        this.mIsLocal = isLocal;
        this.mCallback = callback;
        this.mFlyingTime = 0;
        this.mFlyTime = Laya.Vector3.distance(startPosition, endPosition) * 150;
        this.mMaxHeightPosition = new Laya.Vector3((startPosition.x + endPosition.x) / 2, 5 + startPosition.y, (startPosition.z + endPosition.z) / 2);
    }
}
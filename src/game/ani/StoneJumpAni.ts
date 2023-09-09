import MyGameConfig from "../../main/MyGameConfig";
import MathUtils from "../../utils/MathUtils";
import GameManager from "../../main/GameManager";
import BaseAni from "./BaseAni";

export default class StoneJumpAni extends BaseAni {

    private mArgs: any;
    private mTempVec3: Laya.Vector3;
    private mTempRotate: Laya.Vector3;
    private isDown = 1;

    onUpdate() {
        if (!this.mIsUpdate || GameManager.instance.isPause) {
            return;
        }

        let timerDelta = GameManager.instance.timerDelta;

        let posY = this.mTempVec3.y + (timerDelta / 100) * this.isDown;
        this.mTempVec3.setValue(this.mTempVec3.x, posY, this.mTempVec3.z);
        this.mNode.transform.position = this.mTempVec3;
        let rotateX = this.mTempRotate.x + (timerDelta / 2);
        this.mTempRotate.setValue(rotateX, this.mTempRotate.y, this.mTempRotate.z);
        this.mNode.transform.rotationEuler = this.mTempRotate;

        if (this.mNode.transform.position.y > 3) {
            this.isDown = -1;
        } else if (this.mNode.transform.position.y < 0.1 && this.isDown == -1) {
            this.mNode.transform.position.y = 0.1;
            this.mNode.transform.position = this.mNode.transform.position;
            this.mIsUpdate = false;
            this.mCallback(this.mArgs);
        }
    }

    public init(node: Laya.Sprite3D, pos: Laya.Vector3, args: any, callback: Function): void {
        this.mNode = node;
        this.mArgs = args;
        this.isDown = 1;
        this.mIsUpdate = true;
        this.mTempVec3 = pos.clone();
        this.mTempRotate = node.transform.rotationEuler.clone();
        this.mTempRotate.setValue(MathUtils.nextInt(-180, 180), this.mTempRotate.y, this.mTempRotate.z);
        this.mCallback = callback;
    }

    public forceComplete(): void {
        if (this.mIsUpdate) {
            this.mNode.transform.position.y = 0.5;
            this.mNode.transform.position = this.mNode.transform.position;
            this.mIsUpdate = false;
            this.mCallback(this.mArgs);
        }
    }
}
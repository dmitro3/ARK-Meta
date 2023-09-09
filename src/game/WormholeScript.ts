import MyGameConfig from "../main/MyGameConfig";
import EventUtils from "../utils/EventUtils";
import Utils from "../utils/Utils";
import GameManager from "../main/GameManager";

export default class WormholeScript extends Laya.Script3D {

    private mNode: Laya.Sprite3D;
    private mIsMove: boolean = false;
    private mIsDispatchEvent: boolean = false;
    private mTempVec3: Laya.Vector3 = new Laya.Vector3();
    private mTempVecRotate: Laya.Vector3 = new Laya.Vector3();
    private mStartPosition: Laya.Vector3;
    private mChildIsland: Laya.Sprite3D;

    onAwake(): void {
        this.mNode = this.owner as Laya.Sprite3D;
        this.mStartPosition = this.mNode.transform.position.clone();
    }

    onUpdate(): void {
        if (GameManager.instance.isPause) {
            return;
        }

        this.mTempVecRotate.setValue(0, 0, 0.001 * GameManager.instance.timerDelta);

        this.mNode.transform.rotate(this.mTempVecRotate);

        if (this.mIsMove) {
            this.mTempVec3.setValue(0, 0, MyGameConfig.SHIP_MOVE_SPEED * GameManager.instance.timerDelta * 2);
            this.mNode.transform.translate(this.mTempVec3);

            if (!this.mIsDispatchEvent && this.mNode.transform.position.z > 0) {
                this.mIsDispatchEvent = true;
                this.mChildIsland = null;
                EventUtils.dispatchEvent(MyGameConfig.EVENT_TO_NEXT_ISLAND, "");
            }

            if (this.mChildIsland) {
                this.mChildIsland.transform.translate(this.mTempVec3);
            }
        }
    }

    public startMove(childIsland): void {
        this.mIsMove = true;
        this.mNode.active = true;
        this.mChildIsland = childIsland;
        this.mNode.transform.position = this.mStartPosition;
    }

    public reset(): void {
        this.mNode.active = false;
        this.mIsMove = false;
        this.mIsDispatchEvent = false;
        this.mChildIsland = null;
    }
}
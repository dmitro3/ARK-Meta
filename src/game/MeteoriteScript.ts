import MyGameConfig from "../main/MyGameConfig";
import PoolManager from "../main/PoolManager";
import GameManager from "../main/GameManager";

export default class MeteoriteScript extends Laya.Script3D {

    private mNode: Laya.Sprite3D;
    private mTempVec3: Laya.Vector3 = new Laya.Vector3();

    onAwake(): void {
        this.mNode = this.owner as Laya.Sprite3D;
    }

    onUpdate(): void {
        if (GameManager.instance.isPause) {
            return;
        }
        this.mTempVec3.setValue(0, 0, MyGameConfig.SHIP_MOVE_SPEED * GameManager.instance.timerDelta);
        this.mNode.transform.translate(this.mTempVec3);

        if (this.mNode.transform.position.z > 30) {
            PoolManager.recover(this.mNode.name, this.mNode);
        }
    }
}
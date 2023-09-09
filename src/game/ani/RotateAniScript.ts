import GameManager from "../../main/GameManager";

export default class RotateAniScript extends Laya.Script3D {

    private mNode: Laya.Sprite3D;
    private mRotateSpeed: Laya.Vector3 = new Laya.Vector3();
    private mTempRotate: Laya.Vector3 = new Laya.Vector3();

    onAwake() {
        this.mNode = this.owner as Laya.Sprite3D;
    }

    public init(rotateSpeed: Laya.Vector3): void {
        this.mRotateSpeed = rotateSpeed;
    }

    public onUpdate() {
        if (!this.mNode || GameManager.instance.isPause) {
            return;
        }

        this.mTempRotate.setValue(this.mRotateSpeed.x * GameManager.instance.timerDelta,
            this.mRotateSpeed.y * GameManager.instance.timerDelta,
            this.mRotateSpeed.z * GameManager.instance.timerDelta);

        this.mNode.transform.rotate(this.mTempRotate);
    }

    public getPosition(): Laya.Vector3 {
        return this.mNode.transform.position;
    }
}
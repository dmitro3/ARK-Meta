import MyGameConfig from "../main/MyGameConfig";
import GameManager from "../main/GameManager";
import ProspectingMapManager from "./ProspectingMapManager";

export default class RadarScript extends Laya.Script3D {

    private ROTATE_SPEED = 0.1;
    private mNode: Laya.Sprite3D;
    private mNodeRadar: Laya.Sprite3D;
    private mRotateVec: Laya.Vector3 = new Laya.Vector3();
    private mNodePointer: Laya.Sprite3D;
    private mEffectTime: number;
    private mRotateY: number = 0;

    onAwake(): void {
        this.mNode = this.owner as Laya.Sprite3D;
        this.mNodeRadar = this.mNode.getChildAt(0) as Laya.Sprite3D;
        this.mNodePointer = this.mNodeRadar.getChildByName("node_pointer") as Laya.Sprite3D;
        let range = MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_CRYSTAL_DETECTOR].range;
        this.mNode.transform.setWorldLossyScale(new Laya.Vector3(range, 1, range));
    }

    onUpdate(): void {
        if (!this.mNode || GameManager.instance.isPause) {
            return;
        }

        this.mRotateY -= this.ROTATE_SPEED * GameManager.instance.timerDelta;
        this.mRotateVec.setValue(0, this.mRotateY, 0);
        this.mNodePointer.transform.rotationEuler = this.mRotateVec;

        ProspectingMapManager.instance.surveyCrystal();

        this.mEffectTime -= GameManager.instance.timerDelta;

        if (this.mEffectTime < 0) {
            GameManager.instance.roleScript.showRadar(false);
        }
    }

    public show(): void {
        this.mRotateY = 0;
        this.mEffectTime = MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_CRYSTAL_DETECTOR].effectTime;
    }
}
import Vector3Utils from "../../utils/Vector3Utils";
import GameManager from "../../main/GameManager";

export default class DurableScript extends Laya.Script3D {

    private mNode: Laya.Sprite3D;

    onAwake(): void {
        this.mNode = this.owner as Laya.Sprite3D;
    }

    onUpdate(): void {
    }
}
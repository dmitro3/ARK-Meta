import AudioManager from "../main/AudioManager";
import DataManager from "../main/DataManager";
import MyGameConfig from "../main/MyGameConfig";
import GameManager from "../main/GameManager";
import SceneResManager from "./SceneResManager";

export default class MineralScript extends Laya.Script3D {

    private mNode: Laya.Sprite3D;
    private mIsCatch: boolean = false;

    onAwake(): void {
        this.mNode = this.owner as Laya.Sprite3D;
    }

    onUpdate(): void {
        if (!this.mNode || GameManager.instance.isPause) {
            return;
        }
    }

    public init(node: Laya.Sprite3D): void {
        this.mNode = node;
        this.mIsCatch = false;
    }

    public isCatch(): boolean {
        return this.mIsCatch;
    }

    public show(): void {
        this.mNode.active = true;
    }

    public hide(): void {
        this.mNode.active = false;
    }

    public catch(): void {
        AudioManager.playGetStars();
        SceneResManager.playEffectCatchCrystal(this.mNode.transform.position);
        this.mNode.active = false;
        this.mIsCatch = true;
        DataManager.addCrystalValue(5);
    }

    public getNode(): Laya.Sprite3D {
        return this.mNode;
    }

    public getPosition(): Laya.Vector3 {
        return this.mNode.transform.position;
    }

    public isShow(): boolean {
        return this.mNode.active;
    }
}

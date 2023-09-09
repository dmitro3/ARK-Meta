import AudioManager from "../main/AudioManager";
import DataManager from "../main/DataManager";
import MyGameConfig from "../main/MyGameConfig";
import PoolManager from "../main/PoolManager";
import GridInfo from "./bean/game/GridInfo";
import GameManager from "../main/GameManager";
import MapManager from "./map/MapManager";
import SceneResManager from "./SceneResManager";

export default class CrystalScript extends Laya.Script3D {

    private mNode: Laya.MeshSprite3D;
    private mGridInfo: GridInfo;
    private mTime: number;
    private mIsUpdate: boolean = false;
    private mAddAlpha: number = -1;
    private mAlpha: number = 0;
    private mMaterial: Laya.BlinnPhongMaterial;

    onAwake(): void {

    }

    onUpdate(): void {
        if (!this.mIsUpdate || GameManager.instance.isPause) {
            return;
        }

        this.mTime -= GameManager.instance.timerDelta;

        if (this.mTime < 5000) {
            this.mAlpha += this.mAddAlpha * GameManager.instance.timerDelta / 1000;

            if (this.mAlpha <= 0.2) {
                this.mAlpha = 0.2;
                this.mAddAlpha = 1;
            }

            if (this.mAlpha >= 1) {
                this.mAlpha = 1;
                this.mAddAlpha = -1;
            }

            this.mMaterial.albedoColorA = this.mAlpha;
        }

        if (this.mTime < 0) {
            this.clean();
        }
    }

    private clean(): void {
        PoolManager.recover(this.mNode.name, this.mNode);
        this.mIsUpdate = false;
        this.mGridInfo.crystalArr = [];
    }

    public init(node: Laya.MeshSprite3D, gridInfo: GridInfo): void {
        this.mNode = node;
        this.mGridInfo = gridInfo;
        this.mMaterial = this.mNode.meshRenderer.material as Laya.BlinnPhongMaterial;
        this.mMaterial.albedoColorA = 1;
        this.mTime = MyGameConfig.gameConfig.crystalTime;
        this.mIsUpdate = true;
        this.mAddAlpha = -1;
        this.mAlpha = 1;
    }

    public catch(): void {
        AudioManager.playGetStars();
        SceneResManager.playEffectCatchCrystal(this.mNode.transform.position);
        this.clean();
        DataManager.addCrystalValue(1);
    }

    public getPosition(): Laya.Vector3 {
        return this.mNode.transform.position;
    }
}
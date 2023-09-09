import MyGameConfig from "../main/MyGameConfig";
import EventUtils from "../utils/EventUtils";

export default class FullStoneTipScript extends Laya.Script3D {

    private mNode: Laya.MeshSprite3D;
    private mMaterial: Laya.BlinnPhongMaterial;
    private mStartAlbedoColorA: number;
    private mAddAlpha = 1;
    private mIsUpdate: boolean = false;

    onAwake() {
        this.mNode = this.owner as Laya.MeshSprite3D;
        this.mMaterial = this.mNode.meshRenderer.material as Laya.BlinnPhongMaterial;
        this.mStartAlbedoColorA = this.mMaterial.albedoColorA;
        let scale = this.mNode.transform.getWorldLossyScale();
        this.mNode.transform.setWorldLossyScale(new Laya.Vector3(scale.x, 0, scale.z));
    }

    onUpdate() {
        if (this.mNode && this.mIsUpdate) {
            this.mMaterial.albedoColorA += this.mAddAlpha * 0.01;

            if (this.mMaterial.albedoColorA >= this.mStartAlbedoColorA) {
                this.mAddAlpha = -1;
                this.mMaterial.albedoColorA = this.mStartAlbedoColorA;
            } else if (this.mMaterial.albedoColorA <= 0) {
                this.mAddAlpha = 1;
                this.mMaterial.albedoColorA = 0;
            }
        }

        if (!this.mIsUpdate) {
            this.mNode.active = false;
        }
    }

    public startAni(layerNum: number): void {
        if (!this.mIsUpdate) {
            this.mIsUpdate = true;
            this.mNode.active = true;
            let scale = this.mNode.transform.getWorldLossyScale();
            this.mNode.transform.setWorldLossyScale(new Laya.Vector3(scale.x, (layerNum + 1) * 0.075, scale.z));

            EventUtils.dispatchEvent(MyGameConfig.EVENT_SHOW_FULL_TIP, "");
        }
    }

    public stopAni(): void {
        this.mIsUpdate = false;
        this.mNode.active = false;
    }

    getNode(): Laya.Sprite3D {
        return this.mNode;
    }
}
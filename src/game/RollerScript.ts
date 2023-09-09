import DataManager from "../main/DataManager";
import MyGameConfig from "../main/MyGameConfig";
import MathUtils from "../utils/MathUtils";
import GameManager from "../main/GameManager";
import MapManager from "./map/MapManager";
import SceneResManager from "./SceneResManager";
import PvpMapManager from "./map/PvpMapManager";
import BaseRoleScript from "./role/BaseRoleScript";

export default class RollerScript extends Laya.Script3D {

    private mNode: Laya.Sprite3D;

    private mNodeSize: Laya.Sprite3D;

    private mNodeRoller: Laya.MeshSprite3D;

    private mNodeSpikeParent: Laya.Sprite3D;

    private mNodeEffectPower: Laya.Sprite3D;

    private mRoleScript: BaseRoleScript;

    private mStarColor: Laya.Vector4;

    private mRollerSpeed: number;

    private mLevelSpikeNum: number = 0;

    private mSpikeNum: number

    private mLevelSpikeCircleNum: number = 0;

    private mSpikeCircleNum: number

    private mLevelSpikeSize: number = 0;

    private mLevelRollerSize: number;
  
    private mSpikeSize: number;

    private mTotalForce: number;

    onAwake() {
        this.mRollerSpeed = 0.3;
    }

    onUpdate() {
        if (GameManager.instance.isPause) {
            return;
        }

        this.mNode.transform.rotate(new Laya.Vector3(-this.mRollerSpeed * Laya.timer.delta, 0, 0), true, false);
    }

    public init(node: Laya.Sprite3D): void {
        this.mNode = node;

        this.mNodeRoller = this.mNode.getChildByName("node_roller") as Laya.MeshSprite3D;
        this.mRoleScript = this.mNode.parent.parent.getComponent(BaseRoleScript);
        this.mNodeSize = this.mNode.parent.getChildByName("node_size") as Laya.Sprite3D;
        this.mNodeEffectPower = SceneResManager.createEffectPropPower(this.mNode, true);
        this.mStarColor = (this.mNodeRoller.meshRenderer.material as Laya.BlinnPhongMaterial).albedoColor.clone();

        this.mNodeEffectPower.active = false;
    }

    public initLevel(data: any): void {
        this.mLevelRollerSize = data[MyGameConfig.PROPERTY_CAR_ROLLER_SIZE];
        this.mLevelSpikeSize = data[MyGameConfig.PROPERTY_CAR_SPIKE_SIZE];
        this.mLevelSpikeNum = data[MyGameConfig.PROPERTY_CAR_SPIKE_NUM];
        this.mLevelSpikeCircleNum = data[MyGameConfig.PROPERTY_CAR_SPIKE_CIRCLE_NUM];

        this.calculateForce();

        this.scaleRoller(MyGameConfig.truckConfig[this.mLevelRollerSize].rollerSize);
    }

    public changeMap(): void {
        MapManager.instance.changeMap(this.mNodeSize, this.mRoleScript, 0);
    }

    public changePvpMap(): void {
        PvpMapManager.instance.changeMap(this.mNodeSize, this.mRoleScript, PvpMapManager.instance.islandOffsetX);
    }

    public craeteSpike(isDestroy: boolean = true, width = 0.6): void {
        this.mNodeSpikeParent = this.mNode.getChildByName("node_spike") as Laya.Sprite3D;

        if (isDestroy) {
            this.mNodeSpikeParent.destroyChildren();
        }

        let spikeSpace;
        let startX;
        let rollerScale = this.mNodeRoller.transform.getWorldLossyScale();

        width = ((rollerScale.x / 2) + 0.1) * 2;

        if (this.mSpikeCircleNum == 0) {
            spikeSpace = 0;
            startX = 0;
        } else if (this.mSpikeCircleNum % 2 == 0) {
            spikeSpace = width / this.mSpikeCircleNum;
            startX = -(this.mSpikeCircleNum - 1) * spikeSpace / 2;
        } else {
            spikeSpace = width / (this.mSpikeCircleNum + 2);
            startX = -Math.floor(this.mSpikeCircleNum / 2) * spikeSpace;
        }

        let spikeAngleSpace = 2 * Math.PI / this.mSpikeNum;
        let radius = 0.25;

        for (let i = 0; i < this.mSpikeCircleNum; i++) {
            for (let j = 0; j < this.mSpikeNum; j++) {
                let angle = spikeAngleSpace * j + i * Math.PI / 2;
                let position = new Laya.Vector3(startX + i * spikeSpace, 0, 0);
                let rotationEuler = new Laya.Vector3(MathUtils.radian2Angle(angle), 0, 0);
                let size = new Laya.Vector3(this.mSpikeSize, this.mSpikeSize, this.mSpikeSize);

                if (isDestroy) {
                    let nodeSpike = SceneResManager.createSpike(this.mNodeSpikeParent, position, rotationEuler, size);

                    this.mNodeSpikeParent.addChild(nodeSpike);
                } else {
                    let nodeSpike = this.mNodeSpikeParent.getChildAt(j + i * this.mSpikeNum) as Laya.Sprite3D;

                    nodeSpike.transform.localPosition = position;
                }
            }
        }
    }

    public setSpikeCircleNumLevel(level: number): void {
        this.mLevelSpikeCircleNum = level;
        this.mSpikeCircleNum = MyGameConfig.truckConfig[level].spikeCircleNum;
        this.calculateForce();
    }

    public setSpikeNumLevel(level: number): void {
        this.mLevelSpikeNum = level;
        this.mSpikeNum = MyGameConfig.truckConfig[level].spikeNum;
        this.calculateForce();
    }

    public setSpikeSizeLevel(level: number): void {
        this.mLevelSpikeSize = level;
        this.mSpikeSize = MyGameConfig.truckConfig[level].spikeSize;
        this.calculateForce();
    }

    public setRollerSpeedLevel(level: number): void {
    }

    public setRollerSizeLevel(level: number): void {
        this.mLevelRollerSize = level;
        this.scaleRoller(MyGameConfig.truckConfig[this.mLevelRollerSize].rollerSize);
    }

    public calculateForce(): number {
        this.mTotalForce = 0;
        this.mTotalForce += MyGameConfig.truckConfig[this.mLevelSpikeCircleNum].spikeCircleForce;
        this.mTotalForce += MyGameConfig.truckConfig[this.mLevelSpikeNum].spikeForce;
        this.mTotalForce += MyGameConfig.truckConfig[this.mLevelSpikeSize].spikeSizeForce;

        return this.mTotalForce;
    }

    public isAddColor(b: boolean): void {
    }

    public getNodeRoller(): Laya.Sprite3D {
        return this.mNodeRoller;
    }

    public getNodeSpikeParent(): Laya.Sprite3D {
        return this.mNodeSpikeParent;
    }

    public setTotalForce(num: number): void {
        this.mTotalForce = num;
    }

    public getPosition(): Laya.Vector3 {
        return this.mNode.transform.position;
    }

    public getTotalForce(): number {
        return this.mTotalForce;
    }

    public scaleRoller(scale: number): void {
        let range = (scale / 2);

        (this.mNodeSize.getChildAt(0) as Laya.Sprite3D).transform.localPosition = new Laya.Vector3(range, 0, 1.06);
        (this.mNodeSize.getChildAt(1) as Laya.Sprite3D).transform.localPosition = new Laya.Vector3(-range, 0, 1.06);
        (this.mNodeSize.getChildAt(2) as Laya.Sprite3D).transform.localPosition = new Laya.Vector3(-range, 0, 0);
        (this.mNodeSize.getChildAt(3) as Laya.Sprite3D).transform.localPosition = new Laya.Vector3(range, 0, 0);

        this.mNodeRoller.transform.setWorldLossyScale(new Laya.Vector3(scale, 1, 1));

        this.craeteSpike(false);
    }

    public showPower(): void {
        let scale = this.mNodeRoller.transform.getWorldLossyScale();

        for (let i = 0; i < this.mNodeEffectPower.getChildAt(0).numChildren; i++) {
            let node = this.mNodeEffectPower.getChildAt(0).getChildAt(i) as Laya.Sprite3D;

            node.transform.localPosition.x = -scale.x / 2 + scale.x * i;
            node.transform.localPosition = node.transform.localPosition;
        }

        this.mNodeEffectPower.active = true;
    }

    public hidePower(): void {
        this.mNodeEffectPower.active = false;
    }
}
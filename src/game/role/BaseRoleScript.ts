import DataManager from "../../main/DataManager";
import MyGameConfig from "../../main/MyGameConfig";
import MathUtils from "../../utils/MathUtils";
import UiUtils from "../../utils/UiUtils";
import CarConfigInfo from "../bean/config/CarConfigInfo";
import RollerScript from "../RollerScript";
import SceneResManager from "../SceneResManager";

export default class BaseRoleScript extends Laya.Script3D {

    protected STATUS_IDLE = 0;

    protected STATUS_MOVE = 1;

    protected STATUS_TOUCH_ROTATE = 2;

    protected STATUS_GO_TARGET = 3;

    protected CONTAINER_LAYER_ROW = 2;

    protected CONTAINER_LAYER_COL = 7;


    protected mNode: Laya.Sprite3D;

    protected mNodeRole: Laya.Sprite3D;

    protected mNodeRoleModel: Laya.Sprite3D;

    protected mNodeSize: Laya.Sprite3D;

    protected mNodeWheel: Laya.Sprite3D;

    protected mIsSelf: boolean = true;

    protected mCurStatus: number;

    protected mLastPosition: Laya.Vector3 = new Laya.Vector3();

    protected mDurable: number = 0;

    protected mMaxDurable: number = 0;

    protected mDurableProgress: number = 0;

    protected mSpeed: number;

    protected mSpeedRate: number = 1;

    protected mTargetRotateY: number = null;

    protected mRollerScript: RollerScript;

    protected mCharacterController: Laya.CharacterController;


    onAwake(): void {

    }

    public init(): void {
        this.mNode = this.owner as Laya.Sprite3D;
        this.mNodeRole = this.mNode.getChildByName("node_role") as Laya.Sprite3D;
        this.mNodeRoleModel = this.mNodeRole.getChildByName("node_car_model") as Laya.Sprite3D;
        let nodeRoller = this.mNodeRole.getChildByName("node_roller") as Laya.Sprite3D;
        this.mNodeSize = this.mNodeRole.getChildByName("node_size") as Laya.Sprite3D;
        this.mNodeWheel = this.mNodeRole.getChildByName("wheel") as Laya.Sprite3D;

        this.mRollerScript = nodeRoller.addComponent(RollerScript) as RollerScript;
        this.mRollerScript.init(nodeRoller);

        let characterController = this.mNodeRole.addComponent(Laya.CharacterController) as Laya.CharacterController;
        let shape = new Laya.CapsuleColliderShape(0.5, 1);

        characterController.colliderShape = shape;
        characterController.gravity = new Laya.Vector3(0, 0, 0);
        shape.localOffset = new Laya.Vector3(0, 0, 0);

        this.mCharacterController = characterController;
    }

    public createRoleModel(carConfig: CarConfigInfo, callback?: Function, releaseResources?: boolean): void {
        SceneResManager.createRole(carConfig.modelName, (nodeBody: Laya.MeshSprite3D) => {
            let saveDurable = DataManager.getDurable();

            if (saveDurable == -1) {
                this.mDurable = carConfig.durable;
            } else {
                if (this.mMaxDurable) {
                    let durableProgress = saveDurable / this.mMaxDurable;
                    this.mDurable = Math.floor(durableProgress * carConfig.durable);
                } else {
                    this.mDurable = saveDurable;
                }
            }

            if (!this.mIsSelf) {
                (nodeBody.meshRenderer.material as Laya.BlinnPhongMaterial).albedoColor = new Laya.Vector4(64 / 255, 204 / 255, 64 / 255, 1);
            }

            this.mMaxDurable = carConfig.durable;
            this.mDurableProgress = this.mDurable / this.mMaxDurable;

            this.mNodeRoleModel.destroyChildren();
            nodeBody.transform.localPosition = new Laya.Vector3(0, 0, 0);
            this.mNodeRoleModel.addChild(nodeBody);

            if (releaseResources) {
                Laya.Resource.destroyUnusedResources();
            }

            UiUtils.hideLoading();

            if (callback) {
                callback(nodeBody);
            }
        });
    }

    protected checkPvpMap(): void {
        let position = this.mNodeRole.transform.position;
        let distance = Laya.Vector3.distance(position, this.mLastPosition);

        if (distance > 0.1) {
            this.mLastPosition.setValue(position.x, position.y, position.z);
            this.mRollerScript.changePvpMap();
        }
    }

    public getNode(): Laya.Sprite3D {
        return this.mNode;
    }

    public setNode(node: Laya.Sprite3D): void {
        this.mNode = node;
    }

    public getNodeRole(): Laya.Sprite3D {
        return this.mNodeRole;
    }

    public setSpeedLevel(level: number): void {
        this.mSpeed = MyGameConfig.truckConfig[level].truckSpeed / 100000;
    }

    public setSpeedRate(rate: number): void {
        this.mSpeedRate = rate;
    }

    public getSpeed(): number {
        return this.mSpeed;
    }

    public getRollerScript(): RollerScript {
        return this.mRollerScript;
    }

    public isSelf(): boolean {
        return this.mIsSelf;
    }
}
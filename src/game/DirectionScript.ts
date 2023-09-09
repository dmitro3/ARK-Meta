import Vector3Utils from "../utils/Vector3Utils";
import GameManager from "../main/GameManager";
import FunctionUnlockConfigInfo from "./bean/config/FunctionUnlockConfigInfo";
import MyGameConfig from "../main/MyGameConfig";

export default class DirectionScript extends Laya.Script3D {

    public STATUS_IDLE = 0;

    public STATUS_MINING = 1;

    public STATUS_SELL = 2;

    public STATUS_REPAIR = 3;

    public STATUS_MAP = 4;

    private mNode: Laya.Sprite3D;
    private mTargetPos: Laya.Vector3;
    private mTargetMining: Laya.Vector3;
    private mTargetSell: Laya.Vector3;
    private mTargetRepair: Laya.Vector3;
    private mTargetMap: Laya.Vector3;
    private mIsCheck: boolean = false;
    private mNodeDirection: Laya.Sprite3D;

    onAwake() {
        this.mNode = this.owner as Laya.Sprite3D;
        this.mNodeDirection = this.mNode.getChildAt(0) as Laya.Sprite3D;
        this.mTargetMining = new Laya.Vector3(0, this.mNode.transform.position.y, 2);
        this.mTargetSell = this.getPoint(MyGameConfig.FUNCTION_ID_SELL).position.clone();
        this.mTargetSell.y = this.mNode.transform.position.y;
        this.mTargetSell.z += this.mNodeDirection.transform.localPosition.z;
        this.mTargetRepair = this.getPoint(MyGameConfig.FUNCTION_ID_REPAIR_STATION).position.clone();
        this.mTargetRepair.y = this.mNode.transform.position.y;
        this.mTargetRepair.z += this.mNodeDirection.transform.localPosition.z;
        this.mTargetMap = this.getPoint(MyGameConfig.FUNCTION_ID_MAP).position.clone();
        this.mTargetMap.y = this.mNode.transform.position.y;
        this.mTargetMap.z = this.mNodeDirection.transform.localPosition.z;

        this.mTargetPos = this.mTargetMining;
    }

    onUpdate() {
        if (!GameManager.instance.isPause) {
            this.mNodeDirection.transform.lookAt(this.mTargetPos, Vector3Utils.UP, false);
        }
    }

    protected getPoint(id: number): FunctionUnlockConfigInfo {
        for (let key in MyGameConfig.functionUnlockConfig) {
            let functionUnlock = MyGameConfig.functionUnlockConfig[key] as FunctionUnlockConfigInfo;
            if (id == functionUnlock.id) {
                return functionUnlock;
            }
        }
    }

    public init(node: Laya.Sprite3D): void {
        this.mNode = node;
    }

    public check(): void {
        if (this.mIsCheck) {
            if (GameManager.instance.roleScript.getCurState() == MyGameConfig.STATE_INVALID) {
                if (GameManager.instance.roleScript.getCatchStoneCoreProgress() == 1) {
                    if (GameManager.instance.roleScript.getContainerProgress() > 0) {
                        this.mTargetPos = this.mTargetSell;
                    } else {
                        this.mTargetPos = this.mTargetMap;
                    }
                    this.mNode.active = true;
                } else if (GameManager.instance.roleScript.getDurableProgress() < 0.2) {
                    this.mTargetPos = this.mTargetRepair;
                    this.mNode.active = true;
                } else if (GameManager.instance.roleScript.getContainerProgress() > 0.8) {
                    this.mTargetPos = this.mTargetSell;
                    this.mNode.active = true;
                } else if (GameManager.instance.roleScript.getPosition().z > 1) {
                    this.mTargetPos = this.mTargetMining;
                    this.mNode.active = true;
                } else {
                    this.mNode.active = false;
                }
            } else {
                this.mNode.active = false;
            }
        }
    }

    // public mining(): void {
    //     this.mCurStatus = this.STATUS_MINING;
    //     this.mNode.active = true;
    // }

    // public sell(): void {
    //     this.mCurStatus = this.STATUS_SELL;
    //     this.mNode.active = true;
    // }

    // public repair(): void {
    //     this.mCurStatus = this.STATUS_REPAIR;
    //     this.mNode.active = true;
    // }

    public start(): void {
        // this.mCurStatus = this.STATUS_IDLE;
        this.mIsCheck = true;
    }

    public hide(): void {
        // this.mCurStatus = this.STATUS_IDLE;
        this.mIsCheck = false;
    }


    public isActive(): boolean {
        return this.mNode.active;
    }

    public showNode(b: boolean): void {
        this.mNode.active = b;
    }
}
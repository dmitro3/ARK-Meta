import MyGameConfig from "../main/MyGameConfig";
import EventUtils from "../utils/EventUtils";
import MathUtils from "../utils/MathUtils";
import BaseAni from "./ani/BaseAni";
import StoneFlyAni from "./ani/StoneFlyAni";
import StoneJumpAni from "./ani/StoneJumpAni";
import StoneSellAni from "./ani/StoneSellAni";
import GameManager from "../main/GameManager";

export default class StoneCoreScript extends Laya.Script3D {

    private mNode: Laya.MeshSprite3D;
    private mCurAni: BaseAni;
    private mArgs: any;
    private mUuid: string;

    onAwake() {
    }

    onUpdate() {
        if (this.mCurAni) {
            this.mCurAni.onUpdate();
        }
    }

    public fly(startPosition: Laya.Vector3, endPosition: Laya.Vector3, isLocal: boolean = false, callback: Function, args: any): void {
        this.mCurAni = new StoneFlyAni();
        this.mArgs = args;

        (this.mCurAni as StoneFlyAni).init(this.mNode, GameManager.instance.roleScript, startPosition, endPosition, isLocal, () => {
            this.mCurAni = null;
            callback(this, this.mArgs);
        }, args);
    }

    public flyMineCar(startPosition: Laya.Vector3, endPosition: Laya.Vector3, isLocal: boolean = false, callback: Function, args: any): void {
    }

    public jump(pos: Laya.Vector3, args: any, callback: Function): void {
        this.mCurAni = new StoneJumpAni();
        this.mArgs = args;
        (this.mCurAni as StoneJumpAni).init(this.mNode, pos, args, () => {
            this.mCurAni = null;
            callback(this, this.mArgs);
        });
    }

    public sell(startPosition: Laya.Vector3, endPosition: Laya.Vector3, isLocal: boolean = false, callback: Function): void {
        this.mCurAni = new StoneSellAni();
        (this.mCurAni as StoneSellAni).init(this.mNode, startPosition, endPosition, isLocal, () => {
            this.mCurAni = null;
        });
    }

    public forceComplete(): void {
        if (this.mCurAni) {
            this.mCurAni.forceComplete();
        }
    }

    public setNode(node: Laya.MeshSprite3D): void {
        this.mNode = node;
        this.mUuid = MathUtils.generateUUID();
    }

    public getNode(): Laya.MeshSprite3D {
        return this.mNode;
    }

    public getUuid(): string {
        return this.mUuid;
    }
}
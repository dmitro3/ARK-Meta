import MyGameConfig from "../../main/MyGameConfig";
import FunctionUnlockConfigInfo from "../bean/config/FunctionUnlockConfigInfo";
import GameManager from "../../main/GameManager";
import RoleScript from "../RoleScript";
import BaseState from "./BaseState";

export default class CharacterBaseState extends BaseState {

    protected mPointPosition: Laya.Vector3;
    protected mNodeScene: Laya.Sprite3D;

    constructor(owner: RoleScript) {
        super(owner);
        this.mOwner = owner as RoleScript;
    }

    get owner(): RoleScript {
        return this.mOwner;
    }

    protected getPoint(id: number): FunctionUnlockConfigInfo {
        for (let key in MyGameConfig.functionUnlockConfig) {
            let functionUnlock = MyGameConfig.functionUnlockConfig[key] as FunctionUnlockConfigInfo;
            if (id == functionUnlock.id) {
                return functionUnlock;
            }
        }
    }

    protected getSceneNode(id: number): Laya.Sprite3D {
        let nodeMainIsland = GameManager.instance.scene3d.getChildByName("node_main_island") as Laya.Sprite3D;

        for (let key in MyGameConfig.functionUnlockConfig) {
            let functionUnlock = MyGameConfig.functionUnlockConfig[key] as FunctionUnlockConfigInfo;

            if (functionUnlock.id == id) {
                let nodeUnLock = nodeMainIsland.getChildByName(functionUnlock.nodeName) as Laya.Sprite3D;

                return nodeUnLock;
            }
        }
    }

}
import DataManager from "../../../main/DataManager";
import MyGameConfig from "../../../main/MyGameConfig";
import MathUtils from "../../../utils/MathUtils";
import UiUtils from "../../../utils/UiUtils";
import Vector3Utils from "../../../utils/Vector3Utils";
import UpgradeDialog from "../../dialog/UpgradeDialog";
import GameManager from "../../../main/GameManager";
import RoleScript from "../../RoleScript";
import CharacterBaseState from "../CharacterBaseState";

export default class CharacterUpgradeState extends CharacterBaseState {

    private mCamera: Laya.Camera;

    constructor(owner: any) {
        super(owner);
    }

    onEnter() {
        GameManager.instance.isControl = false;

        UiUtils.addChild(new UpgradeDialog());
    }

    onLeave() {
    }

    getStateKey() {
        return MyGameConfig.STATE_UPGRADE;
    }
}
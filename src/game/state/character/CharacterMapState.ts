import MyGameConfig from "../../../main/MyGameConfig";
import UiUtils from "../../../utils/UiUtils";
import MapDialog from "../../dialog/MapDialog";
import CharacterBaseState from "../CharacterBaseState";

export default class CharacterMapState extends CharacterBaseState {

    constructor(owner: any) {
        super(owner);

        this.mPointPosition = this.getPoint(MyGameConfig.FUNCTION_ID_MAP).position;
    }

    onEnter() {
        UiUtils.addChild(new MapDialog());
    }

    getStateKey() {
        return MyGameConfig.STATE_MAP;
    }
}
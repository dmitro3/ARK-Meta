import MyGameConfig from "../../../main/MyGameConfig";
import UiUtils from "../../../utils/UiUtils";
import CarShopDialog from "../../dialog/CarShopDialog";
import CharacterBaseState from "../CharacterBaseState";

export default class CharacterShopState extends CharacterBaseState {

    constructor(owner: any) {
        super(owner);

        this.mPointPosition = this.getPoint(MyGameConfig.FUNCTION_ID_TANK_SHOP).position;
    }

    onEnter() {
        UiUtils.addChild(new CarShopDialog());
    }

    getStateKey() {
        return MyGameConfig.STATE_TANK_SHOP;
    }
}
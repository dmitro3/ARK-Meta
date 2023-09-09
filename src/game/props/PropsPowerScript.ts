import DataManager from "../../main/DataManager";
import MyGameConfig from "../../main/MyGameConfig";
import EventUtils from "../../utils/EventUtils";
import GameManager from "../../main/GameManager";
import BasePropsScript from "./BasePropsScript";

export default class PropsPowerScript extends BasePropsScript {

    protected mType: number = MyGameConfig.PROPS_POWER;

    public start() {
        let force = GameManager.instance.roleScript.getRollerScript().calculateForce();
        GameManager.instance.roleScript.getRollerScript().setTotalForce(force * MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_POWER].range);
        GameManager.instance.roleScript.getRollerScript().showPower();
    }

    protected end() {
        GameManager.instance.roleScript.getRollerScript().calculateForce();
        GameManager.instance.roleScript.getRollerScript().hidePower();
    }
}
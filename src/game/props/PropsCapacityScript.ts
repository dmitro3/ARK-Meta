import DataManager from "../../main/DataManager";
import GameManager from "../../main/GameManager";
import MyGameConfig from "../../main/MyGameConfig";
import EventUtils from "../../utils/EventUtils";
import BasePropsScript from "./BasePropsScript";

export default class PropsCapacityScript extends BasePropsScript {

    protected mType: number = MyGameConfig.PROPS_CAPACITY;

    public start() {
        let level = DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_TRUCK_CAPACITY) + MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_CAPACITY].range;

        if (level > MyGameConfig.truckConfig.length - 1) {
            level = MyGameConfig.truckConfig.length - 1;
        }

        GameManager.instance.roleScript.setMaxCapacity(level);
    }

    protected end() {
        GameManager.instance.roleScript.setMaxCapacity(DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_TRUCK_CAPACITY));
    }
}
import MyGameConfig from "../../main/MyGameConfig";
import GameManager from "../../main/GameManager";
import BasePropsScript from "./BasePropsScript";
import DataManager from "../../main/DataManager";

export default class PropsRollerScript extends BasePropsScript {

    private mRollerLocalPosition: Laya.Vector3[];

    protected mType: number = MyGameConfig.PROPS_ROLLER;

    constructor() {
        super();
    }

    protected start() {
        let nodeSize = GameManager.instance.roleScript.getNodeSize();

        if (!this.mRollerLocalPosition) {
            this.mRollerLocalPosition = [];

            for (let i = 0; i < GameManager.instance.roleScript.getNodeSize().numChildren; i++) {
                this.mRollerLocalPosition.push((nodeSize.getChildAt(i) as Laya.Sprite3D).transform.localPosition.clone());
            }
        }
        let level = DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_ROLLER_SIZE) + MyGameConfig.factoryGoodsConfig[this.mType].range;

        if (level > MyGameConfig.truckConfig.length - 1) {
            level = MyGameConfig.truckConfig.length - 1;
        }

        GameManager.instance.roleScript.getRollerScript().scaleRoller(MyGameConfig.truckConfig[level].rollerSize);
    }

    protected end() {
        GameManager.instance.roleScript.getRollerScript().scaleRoller(MyGameConfig.truckConfig[DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_ROLLER_SIZE)].rollerSize);
    }
}
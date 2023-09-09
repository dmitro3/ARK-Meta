import GameManager from "../../main/GameManager";
import MyGameConfig from "../../main/MyGameConfig";
import MapManager from "../map/MapManager";
import BasePropsScript from "./BasePropsScript";

export default class PropsExplosiveScript extends BasePropsScript {

    protected mType: number = MyGameConfig.PROPS_EXPLOSIVE;

    protected takeEffect() {

    }

    protected start() {
        this.mTime = 1;

        MapManager.instance.circleBoom(GameManager.instance.roleScript.getPosition());
    }
}
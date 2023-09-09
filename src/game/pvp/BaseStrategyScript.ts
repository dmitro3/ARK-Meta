import MyGameConfig from "../../main/MyGameConfig";
import EventUtils from "../../utils/EventUtils";
import MathUtils from "../../utils/MathUtils";
import Utils from "../../utils/Utils";
import SceneResManager from "../SceneResManager";

export default abstract class BaseStrategyScript {

    protected mSelfScore: number = 0;

    protected mRobotScore: number = 0;

    protected mPlayerRateArr;
    protected mRobotRateArr;

    constructor(playerRateArr: number[], robotRateArr: number[]) {
        this.mPlayerRateArr = playerRateArr;
        this.mRobotRateArr = robotRateArr;
    }

    abstract check(isSelf: boolean, pos: Laya.Vector3): void;

    public clear(): void {
        this.mSelfScore = 0;
        this.mRobotScore = 0;
    }

    protected random(rate: number): boolean {
        let random = MathUtils.nextInt(0, 1000);

        if (random < rate) {
            return true;
        }

        return false;
    }

    protected updataScore(pos: Laya.Vector3): void {
        SceneResManager.playEffectCatchCrystal(pos);
        EventUtils.dispatchEvent(MyGameConfig.EVENT_PVP_SCORE, { "self": this.mSelfScore, "opponent": this.mRobotScore });
    }
}
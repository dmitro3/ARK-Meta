import MathUtils from "../../../utils/MathUtils";
import BaseStrategyScript from "../BaseStrategyScript";

export default class StrategyFailScript1 extends BaseStrategyScript {

    private mPlayerIndex: number = 0;
    private mRobotIndex: number = 0;

    check(isSelf: boolean, pos: Laya.Vector3): void {
        if (isSelf) {
            if (this.mSelfScore < this.mRobotScore - 1) {
                let rate;

                if (this.mPlayerIndex < this.mPlayerRateArr.length) {
                    rate = this.mPlayerRateArr[this.mPlayerIndex];
                } else {
                    rate = this.mPlayerRateArr[this.mPlayerRateArr.length - 1];
                }

                if (this.random(rate)) {
                    this.mSelfScore++;
                    this.mPlayerIndex++;
                    this.updataScore(pos);
                }
            }
        } else {
            let rate;

            if (this.mRobotIndex < this.mRobotRateArr.length) {
                rate = this.mRobotRateArr[this.mRobotIndex];
            } else {
                rate = this.mRobotRateArr[this.mRobotRateArr.length - 1];
            }

            if (this.random(rate)) {
                this.mRobotScore++;
                this.mRobotIndex++;
                this.updataScore(pos);
            }
        }
    }

    public clear(): void {
        super.clear();
        this.mPlayerIndex = 0;
        this.mRobotIndex = 0;
    }
}
import AudioManager from "../../main/AudioManager";
import GameManager from "../../main/GameManager";
import MyGameConfig from "../../main/MyGameConfig";
import { ui } from "../../ui/layaMaxUI";
import EventUtils from "../../utils/EventUtils";
import UiUtils from "../../utils/UiUtils";
import RockerView from "../ui/RockerView";
import CommonTipDialog from "./CommonTipDialog";

export default class PvpDialog extends ui.game.PvpDialogUI {

    private mSelfScore: number;
    private mOpponentScore: number;

    onAwake(): void {
        this.width = Laya.stage.width;
        this.addHandler();
        this.setTouch();
    }

    private addHandler(): void {
        EventUtils.onEvent(this, MyGameConfig.EVENT_PVP_SCORE, (data) => {
            this.mSelfScore = data.self;
            this.mOpponentScore = data.opponent;
            this.mLbScoreSelf.changeText(this.mSelfScore + "");
            this.mLbScoreOpponent.changeText(this.mOpponentScore + "");
        });
    }

    private setTouch(): void {
        var rockerView = new RockerView(this.mNodeTouch);
        this.addChild(rockerView);

        rockerView.setMoveCallback((event: Laya.Event) => {
            if (GameManager.instance.isControl) {
                GameManager.instance.roleScript.startMove();
            }
        }, (radians, angle) => {
            if (radians && GameManager.instance.isControl) {
                GameManager.instance.roleScript.controlMove(radians, angle);
            }
        }, () => {
            if (GameManager.instance.isControl) {
                GameManager.instance.roleScript.stopMove();
            }
        });
    }

    public coutDown(callback: Function): void {
        let count: number = 2;

        this.mLbCountTime.changeText(count + "");
        this.mLbCountTime.visible = true;

        let self = this;

        AudioManager.playCountDown();

        Laya.timer.loop(1000, this, function s() {
            count--;

            if (count == 0) {
                self.mLbCountTime.changeText("START");
                self.mNodeScore.visible = true;
                self.start();
                callback();
            } else if (count < 0) {
                this.mLbCountTime.visible = false;
                Laya.timer.clear(self, s);
            } else {
                self.mLbCountTime.changeText(count + "");
            }
        });
    }

    private start(): void {
        let time = MyGameConfig.gameConfig.pvpTime;

        this.mNodeTime.visible = true;
        this.mLbTime.changeText(time + "");

        Laya.timer.loop(1000, this, () => {
            time -= 1;

            this.mLbTime.changeText("" + time);

            if (time <= 0) {
                Laya.timer.clearAll(this);

                EventUtils.dispatchEvent(MyGameConfig.EVENT_PVP_END, this.mSelfScore > this.mOpponentScore);
            }
        });
    }

    private onCloseClick(): void {
        this.removeSelf();
    }
}
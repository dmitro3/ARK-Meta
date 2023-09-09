import MyGameConfig from "../../main/MyGameConfig";
import { ui } from "../../ui/layaMaxUI";
import UiUtils from "../../utils/UiUtils";
import GameManager from "../../main/GameManager";
import SceneResManager from "../SceneResManager";

export default class NextChildLoadingDialog extends ui.game.NextChildLoadingDialogUI {

    private mCallback: Function;
    private mTime: number;

    constructor(callback: Function, time: number = 1500) {
        super();
        this.mTime = time;
        this.mCallback = callback;
    }

    onAwake(): void {
        this.width = Laya.stage.width;

        Laya.Tween.to(this.mImg, {
            alpha: 1,
            update: new Laya.Handler(this, () => {
            })
        }, 1500, null, new Laya.Handler(this, () => {
            this.mCallback();
        }));

        UiUtils.hideLoading();
    }

    public hide(): void {
        Laya.Tween.clearAll(this);
        this.mImg.alpha = 1;

        Laya.Tween.to(this.mImg, {
            alpha: 0,
            update: new Laya.Handler(this, () => {
            })
        }, this.mTime, null, new Laya.Handler(this, () => {
            this.removeSelf();
        }));
    }
}
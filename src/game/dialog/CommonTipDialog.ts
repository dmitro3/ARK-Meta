import { ui } from "../../ui/layaMaxUI";
import UiUtils from "../../utils/UiUtils";
import GameManager from "../../main/GameManager";

export default class CommonTipDialog extends ui.game.CommonTipDialogUI {

    private mContent: string;
    private mOkCallback: Function;
    private mCancelCalback: Function;
    private mOkName: string;
    private mCancelName: string;

    constructor(content: string, okCallback?: Function, cancalCallback?: Function, okName?: string, cancelName?: string) {
        super();

        this.mContent = content;
        this.mOkCallback = okCallback;
        this.mCancelCalback = cancalCallback;
        this.mOkName = okName;
        this.mCancelName = cancelName;
    }

    onAwake(): void {
        this.width = Laya.stage.width;
        this.mLbContent.changeText(this.mContent);

        if (this.mOkName) {
            this.mLbOkName.changeText(this.mOkName);
        }

        if (this.mCancelName) {
            this.mLbCancelName.changeText(this.mCancelName);
        }

        if (!this.mCancelCalback) {
            this.mBtnOk.centerX = 0;
            this.mBtnCancel.visible = false;
        }

        UiUtils.click(this.mBtnOk, this, () => {
            if (this.mOkCallback) {
                this.mOkCallback();
            }
            this.onCloseClick();
        });

        UiUtils.click(this.mBtnCancel, this, () => {
            if (this.mCancelCalback) {
                this.mCancelCalback();
            }
            this.onCloseClick();
        });

        UiUtils.hideLoading();
    }

    private onCloseClick(): void {
        this.removeSelf();
    }
}
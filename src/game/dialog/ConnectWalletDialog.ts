import { ui } from "../../ui/layaMaxUI";
import UiUtils from "../../utils/UiUtils";
import WalletUtils from "../../utils/WalletUtils";

export default class ConnectTipDialog extends ui.game.ConnectWalletDialogUI {
    private mCallback: Function;

    constructor(callback: Function) {
        super();
        this.mCallback = callback;
    }

    onAwake(): void {
        this.width = Laya.stage.width;

        UiUtils.click(this.mBtnConnect, this, () => {
            WalletUtils.getInstance().connect(() => {
                this.removeSelf();
                this.mCallback();
            });
        });

    }
}
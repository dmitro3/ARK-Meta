import CommonTipDialog from "../game/dialog/CommonTipDialog";
import LoadingResDialog from "../loading/LoadingResDialog";
import MyGameConfig from "../main/MyGameConfig";
import UiUtils from "./UiUtils";

export default class WalletUtils {

    private static mInstance: WalletUtils;

    private mWallet: any;
    private mAddress: string;

    public static getInstance(): WalletUtils {
        if (!this.mInstance) {
            this.mInstance = new WalletUtils();
            this.mInstance.init();
        }

        return this.mInstance;
    }

    private init(): void {
        this.mWallet = new Laya.Browser.window.Wallet();
    }

    public connect(callback: Function) {
        UiUtils.showLoading();
        let loadingDialog = new LoadingResDialog();
        loadingDialog.zOrder = MyGameConfig.ZORDER_101;
        Laya.stage.addChild(loadingDialog)

        this.mWallet.connect((res) => {
            if (res.code === -1) {
                loadingDialog.removeSelf();
                let commonTipDialog = new CommonTipDialog(res.msg);
                commonTipDialog.zOrder = MyGameConfig.ZORDER_101;
                Laya.stage.addChild(commonTipDialog);
            } else {
                this.mAddress = res.data;
                loadingDialog.removeSelf();
                callback();
            }
        });

    }

    public send() {
        this.mWallet.send();
    }

    public getAddress(): string {
        return this.mAddress;
    }
}
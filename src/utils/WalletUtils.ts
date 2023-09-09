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
    }

    public connect(callback: Function) {
    }

    public send() {
    }

    public getAddress(): string {
        return this.mAddress;
    }
}
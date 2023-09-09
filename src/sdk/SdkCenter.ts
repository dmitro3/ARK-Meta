import DataManager from "../main/DataManager";

export default class SdkCenter {

    private static mInstance: SdkCenter;

    private mIsVibrate: any;

    private mLastVibrateTime: number = 0;

    private mIsSupplyVibrate: boolean = false;

    public static get instance(): SdkCenter {
        if (!SdkCenter.mInstance) {
            SdkCenter.mInstance = new SdkCenter();
        }

        return SdkCenter.mInstance;
    }

    public init(): void {
        if (Laya.Browser.window.navigator) {
            let vibrate = Laya.Browser.window.navigator.vibrate
                || Laya.Browser.window.navigator.webkitVibrate
                || Laya.Browser.window.navigator.mozVibrate
                || Laya.Browser.window.navigator.msVibrate;
            if (vibrate) {
                this.mIsVibrate = DataManager.isVibrate();
                Laya.Browser.window.navigator.useVibrate = vibrate;
                this.mIsSupplyVibrate = true;
            }
        }
    }

    public showRewardVideo(success: Function, fail: Function): void {
        if (success) {
            success();
        }
    }

    public showToast(content: string): void {
    }

    public vibrateShort(): void {
        if (this.mIsSupplyVibrate && this.mIsVibrate) {
            let time = new Date().getTime();

            if (time - this.mLastVibrateTime >= 30) {
                this.mLastVibrateTime = time;
                Laya.Browser.window.navigator.useVibrate(30);
            }
        }
    }

    public setVibrate(b: boolean) {
        this.mIsVibrate = b;
    }

    public isSupplyVibrate(): boolean {
        return this.mIsSupplyVibrate;
    }
}
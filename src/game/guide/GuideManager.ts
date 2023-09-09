import DataManager from "../../main/DataManager";
import MyGameConfig from "../../main/MyGameConfig";

export default class GuideManager {

    private static mInstance: GuideManager;

    private mView: Laya.View;

    private mCompleteGuideEvent: any = {};

    public static getInstance(): GuideManager {
        if (!this.mInstance) {
            this.mInstance = new GuideManager();
        }

        return this.mInstance;
    }

    public init(): void {
        this.addHandler();
        this.createView();
        this.mCompleteGuideEvent = DataManager.getCompletedGuideEvent();
    }

    private addHandler(): void {
    }

    private createView(): void {
        this.mView = new Laya.View();
        this.mView.zOrder = MyGameConfig.ZORDER_100;
        this.mView.width = Laya.stage.width;
        this.mView.height = Laya.stage.height;
        this.mView.mouseThrough = true;

        Laya.stage.addChild(this.mView);
    }

    private addCompleteEvent(eventId: string): void {
        this.mCompleteGuideEvent[eventId] = true;
        DataManager.addCompleteGuideEvent(eventId);
    }
}
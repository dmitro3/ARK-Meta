import MyGameConfig from "../main/MyGameConfig";
import { ui } from "../ui/layaMaxUI";

export default class LoadingDialog extends ui.laoding.LoadingDIalogUI {

    private mCallback: Function;

    constructor(callback: Function) {
        super();
        this.mCallback = callback;
    }

    onAwake() {
        this.zOrder = 100;
        this.name = MyGameConfig.NAME_DIALOG_LOADING;
        this.width = Laya.stage.width;

        this.setPretendLoading();

        this.mProgress.graphics.clear();
        this.mProgress.graphics.drawRect(0, 0, 0, this.mProgress.height, "#ff0000");

        this.on(Laya.Event.MOUSE_DOWN, this, function () {
        });

        this.on(Laya.Event.MOUSE_MOVE, this, function () {
        });

        this.on(Laya.Event.MOUSE_UP, this, function () {
        });

        if (this.mCallback) {
            this.mCallback();
        }
    }

    onDisable() {
        Laya.timer.clearAll(this);
    }

    updataProgress(progress): void {
        if (this.mProgress) {
            this.mProgress.graphics.drawRect(0, 0, this.mProgress.width * progress, this.mProgress.height, "#ff0000");
        }
    }

    public setPretendLoading(): void {
        var progress = 0;

        Laya.timer.frameLoop(5, this, () => {
            progress += 0.002;

            if (this.mProgress && progress <= 0.9) {
                this.mProgress.graphics.drawRect(0, 0, this.mProgress.width * progress, this.mProgress.height, "#ff0000");
            }
        });
    }
}
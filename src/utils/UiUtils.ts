import AudioManager from "../main/AudioManager";
import GameManager from "../main/GameManager";
import ToastView from "../game/ui/ToastView";
import LoadingResDialog from "../loading/LoadingResDialog";
import MyGameConfig from "../main/MyGameConfig";
import PoolManager from "../main/PoolManager";

export default class UiUtils {

    private static mContainerView: Laya.View;

    private static loadingResDialog: LoadingResDialog;

    public static init(): void {
        this.mContainerView = new Laya.View();
        this.mContainerView.width = Laya.stage.width;
        this.mContainerView.height = Laya.stage.height;
        this.mContainerView.zOrder = MyGameConfig.ZORDER_1;
        Laya.stage.addChild(this.mContainerView);

        this.loadingResDialog = new LoadingResDialog();
        this.loadingResDialog.zOrder = MyGameConfig.ZORDER_100;
        this.mContainerView.addChild(this.loadingResDialog);

        Laya.stage.on(Laya.Event.RESIZE, this, () => {
            for (let i = 0; i < this.mContainerView.numChildren; i++) {
                let view = this.mContainerView.getChildAt(i) as Laya.View;

                view.width = Laya.stage.width;
            }
        });
    }

    public static isAllScreen(): boolean {
        var clientWidth = Laya.Browser.clientWidth;
        var clientHeight = Laya.Browser.clientHeight;

        if (clientHeight / clientWidth >= 1.9) {
            return true;
        }

        return false;
    }

    public static getClientScale(): number {
        return Laya.Browser.clientWidth / 720;
    }

    public static addChild(node: Laya.Node, parent?: Laya.Node): void {
        this.showLoading();

        if (parent) {
            parent.addChild(node);
        } else {
            this.mContainerView.addChild(node);
        }
    }

    public static loadJson(url: string, callback: Function) {
        url += ".json";

        Laya.loader.load(url, Laya.Handler.create(this, () => {
            let obj = Laya.loader.getRes(url);

            if (callback) {
                callback(obj);
            }
        }), null, Laya.Loader.JSON);
    }

    private static mergeFunction(functionA: Function, functionB: Function, caller: any, args: any[]): Function {
        if (!functionA || !functionB) return
        var merge = functionB
        functionB = (function () {
            merge.call(caller, args);
            functionA.call(UiUtils);
        })
        return functionB;
    }

    public static click(view: any, caller: any, listener: Function, args?: any[], soundName?: string): void {
        if (view) {
            let callback = this.mergeFunction((function () {
                if (!soundName) {
                } else if (soundName.length == 0) {
                    AudioManager.playClick();
                } else {
                    AudioManager.playSound(soundName);
                }
            }), listener, caller, args);

            view.offAll();
            view.on(Laya.Event.CLICK, caller, callback, args);

            view.on(Laya.Event.MOUSE_DOWN, this, function mouseDown() {
                view.alpha = 0.6;
            })

            view.on(Laya.Event.MOUSE_UP, this, function mouseUp() {
                view.alpha = 1;
            });

            view.on(Laya.Event.MOUSE_OUT, this, function mouseUp() {
                view.alpha = 1;
            });
        }
    }

    public static removeSelf(view: any): void {
        view.removeSelf();
    }

    public static showLoading(): void {
        this.loadingResDialog.visible = true;

    }

    public static hideLoading(): void {
        this.loadingResDialog.visible = false;
    }

    public static showToast(content: string): void {
        let view = PoolManager.getItemUI(MyGameConfig.NAME_TOAST) as ToastView;

        if (!view) {
            view = new ToastView();
            this.mContainerView.addChild(view);
        }

        view.show(content);
    }
}
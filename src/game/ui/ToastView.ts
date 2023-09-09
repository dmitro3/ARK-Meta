import MyGameConfig from "../../main/MyGameConfig";
import PoolManager from "../../main/PoolManager";
import { ui } from "../../ui/layaMaxUI"

export default class ToastView extends ui.game.ToastViewUI {

    onAwake(): void {
        this.name = MyGameConfig.NAME_TOAST;
        this.zOrder = MyGameConfig.ZORDER_100;
    }

    public show(content: string): void {
        this.centerX = 0;
        this.centerY = 0;

        this.mLbContent.changeText(content);

        Laya.Tween.to(this, {
            centerY: -150,
            update: Laya.Handler.create(this, () => {
            })
        }, 800, null, Laya.Handler.create(this, () => {
            PoolManager.recoverUI(this.name, this);
        }));
    }
}
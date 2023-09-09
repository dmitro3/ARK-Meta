import PoolManager from "../../main/PoolManager";

export default class SellLabel extends Laya.Label {

    private mIsInit: boolean = false;


    private init(): void {
        this.name = "lbSell";
        this.font = "num1";
        this.anchorX = 0.5;
    }

    show(x: number, y: number, text: string): void {
        if (!this.mIsInit) {
            this.mIsInit = true;
            this.init();
        }

        this.x = x;
        this.y = y;
        this.text = text;

        Laya.Tween.to(this, {
            y: 300,
            update: Laya.Handler.create(this, () => {

            })
        }, 800, null, Laya.Handler.create(this, () => {
            PoolManager.recoverUI(this.name, this);
        }));
    }
}
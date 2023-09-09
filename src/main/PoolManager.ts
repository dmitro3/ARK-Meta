export default class PoolManager {

    public static poolNameObj: any = {};

    constructor() {
    }

    public static recover(sign: string, item: any): void {
        if (!this.poolNameObj[sign]) {
            this.poolNameObj[sign] = sign;
        }
        if (item) {
            item.active = false;
            item._scene._removeScript(this);
        }
        Laya.Pool.recover(sign, item);
    }

    public static getItem(sign: string): any {
        var item = Laya.Pool.getItem(sign);
        if (item) {
            item.active = true;
        }

        return item;
    }

    public static recoverUI(sign: string, item: any): void {
        if (!this.poolNameObj[sign]) {
            this.poolNameObj[sign] = sign;
        }
        if (item) {
            item.visible = false;
        }
        Laya.Pool.recover(sign, item);
    }

    public static getItemUI(sign: string): any {
        var item = Laya.Pool.getItem(sign);
        if (item) {
            item.visible = true;
        }

        return item;
    }

    public static recoverParticle(sign: string, item: any): void {
        if (!this.poolNameObj[sign]) {
            this.poolNameObj[sign] = sign;
        }
        if (item) {
            item.active = false;
        }
        Laya.Pool.recover(sign, item);
    }


    public static getItemParticle(sign: string): any {
        var item = Laya.Pool.getItem(sign);
        let curTime = new Date().getTime();

        if (item && (curTime - item._createTime > 3000)) {
            if (item) {
                item.active = true;
            }

            return item;
        } else {
            return null;
        }

    }

    public static clearAll(): void {
        for (var key in this.poolNameObj) {
            Laya.Pool.clearBySign(key);
        }

        this.poolNameObj = {};
    }
}
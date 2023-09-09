import MyGameConfig from "../../main/MyGameConfig";
import GameManager from "../../main/GameManager";

export default class BasePropsScript {

    protected mTime: number = 0;
    protected mIsUpdate: boolean = false;
    protected mType: number = -1;

    constructor() {

    }

    public update() {
        if (this.mIsUpdate) {
            if (this.mTime < 0) {
                this.mIsUpdate = false;
                this.end();
            } else {
                this.mTime -= GameManager.instance.timerDelta;
                this.takeEffect();
            }
        }
    }

    protected start() {

    }

    protected takeEffect() {

    }

    protected end() {

    }

    protected refresh() {
        this.mTime = MyGameConfig.factoryGoodsConfig[this.mType].effectTime;
        this.mIsUpdate = true;
        this.start();
    }

    protected clear() {
        if (this.mTime > 0) {
            this.mTime = -1;
            this.mIsUpdate = false;
            this.end();
        }
    }
}
import DataManager from "../../main/DataManager";
import MyGameConfig from "../../main/MyGameConfig";
import { ui } from "../../ui/layaMaxUI";
import EventUtils from "../../utils/EventUtils";

export default class CurrencyValueView extends ui.game.CurrencyValueViewUI {

    onAwake(): void {
        this.zOrder = MyGameConfig.ZORDER_1;
        this.width = Laya.stage.width;
        this.addHandler();
        this.initGoldValueView();
    }

    private addHandler(): void {
        EventUtils.onEvent(this, MyGameConfig.EVENT_REFRESH_GOLD_VIEW, () => {
            this.initGoldValueView();
        });
    }

    private initGoldValueView(): void {
        this.mLbGoldValue.changeText(DataManager.getGoldValue() + "");
        this.mLbCrystalValue.changeText(DataManager.getCrystalValue() + "");
    }
}
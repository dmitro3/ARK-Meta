import DataManager from "../../main/DataManager";
import MyGameConfig from "../../main/MyGameConfig";
import { ui } from "../../ui/layaMaxUI";
import EventUtils from "../../utils/EventUtils";
import UiUtils from "../../utils/UiUtils";
import AudioManager from "../../main/AudioManager";
import FactoryGoodsConfigInfo from "../bean/config/FactoryGoodsConfigInfo";
import GameManager from "../../main/GameManager";

export default class FactoryDialog extends ui.game.FactoryDialogUI {

    private mGoodsInfoArr: FactoryGoodsConfigInfo[] = [];

    private mSpeedReduceTime: number;

    private mQualityAddSell: number;

    private mMaxCapacity: number;

    private mProductLastUnlock: number;

    private mRewardNum: number;

    onAwake() {
        this.name = MyGameConfig.NAME_DIALOG_FACTORY;
        this.width = Laya.stage.width;

        EventUtils.onEvent(this, MyGameConfig.EVENT_REFRESH_PRODUCT, (num: number) => {
            this.initFactoryView(num);
        });

        this.initData();
        this.initView();

        UiUtils.hideLoading();
    }

    onDisable() {
        EventUtils.offAllEventByNode(this);
    }

    private initData(): void {
        let propValue = DataManager.getPropsInfo();

        for (let key in MyGameConfig.factoryGoodsConfig) {
            let propInfo = MyGameConfig.factoryGoodsConfig[key] as FactoryGoodsConfigInfo;
            propInfo.num = propValue[propInfo.id];
            if (!propInfo.num) {
                propInfo.num = 0;
            }

            for (let i = 0; i < MyGameConfig.designDiagramConfig.length; i++) {
                let designDiagramInfo = MyGameConfig.designDiagramConfig[i];

                if (designDiagramInfo.goodsId == propInfo.id) {
                    if (designDiagramInfo.isUnlock && designDiagramInfo.productionTime &&
                        (GameManager.instance.curTime - designDiagramInfo.productionTime) >= designDiagramInfo.time) {
                        propInfo.isUnlock = true;
                        break;
                    }
                }
            }

            this.mGoodsInfoArr.push(MyGameConfig.factoryGoodsConfig[key]);
        }

        this.mProductLastUnlock = DataManager.getLevelByKey(MyGameConfig.KEY_DATA_PRODUCT_LAST_UNLOCK) + 1;
        this.initFactoryData();
        this.initFactoryView(DataManager.getRewardGoods());
    }

    private initFactoryData(): void {
    }

    private initFactoryView(num: number): void {
        this.mRewardNum = num;

        this.mLbStorage.changeText("Stored: " + num + "/" + MyGameConfig.gameConfig.rewardMax);
        let progress = num / MyGameConfig.gameConfig.rewardMax;
        this.mMaskCapacityProgress.graphics.clear();
        this.mNodeCapacityProgress.visible = progress != 0;

        this.mMaskCapacityProgress.graphics.drawRect(0, 0, this.mNodeCapacityProgress.width * progress, this.mNodeCapacityProgress.height, "#ff0000");

        this.mBtnSell.disabled = num == 0;
    }

    private initView(): void {
        this.mListProduct.renderHandler = new Laya.Handler(this, this.updateListProductItem);
        this.mListProduct.array = this.mGoodsInfoArr;

        UiUtils.click(this.mBtnSell, this, this.onSellClick);
        UiUtils.click(this.mBtnClose, this, this.onCloseClick);
    }

    private initTab(index: number): void {
    }

    private updateListProductItem(ceil: Laya.Box, index: number): void {
        let imgIc = ceil.getChildByName("imgIc") as Laya.Image;
        let lbName = ceil.getChildByName("lbName") as Laya.Label;
        let lbNum = ceil.getChildByName("lbNum") as Laya.Label;
        let btnBuy = ceil.getChildByName("btnBuy") as Laya.Image;
        let lbBtn = btnBuy.getChildAt(0) as Laya.Label;
        let nodeCostGold = ceil.getChildByName("nodeCostGold") as Laya.Box;
        let lbCostGold = nodeCostGold.getChildByName("lbGoldValue") as Laya.Label;
        let nodeCostCrystal = ceil.getChildByName("nodeCostCrystal") as Laya.Box;
        let lbCostCrystal = nodeCostCrystal.getChildByName("lbCrystalValue") as Laya.Label;

        let data = ceil.dataSource as FactoryGoodsConfigInfo;
        let goldValue = DataManager.getGoldValue();
        let crystalValue = DataManager.getCrystalValue();

        imgIc.skin = "common/" + data.imgName;

        lbName.changeText(data.name);
        lbNum.changeText("x" + data.num);

        nodeCostCrystal.visible = data.costCrystal != 0;

        if (data.isUnlock) {
            lbBtn.changeText("Buy");
        } else {
            lbBtn.changeText("Lock");
            btnBuy.disabled = true;
        }

        UiUtils.click(btnBuy, this, (args) => {
            let data = args[0] as FactoryGoodsConfigInfo;
            DataManager.addPropValue(data.id, 1, () => {
                DataManager.addGoldValue(-data.costGold);
                DataManager.addCrystalValue(-data.costCrystal);
                this.mListProduct.refresh();
            });
        }, [data], AudioManager.NAME_BUY);
    }

    private onSellClick(): void {
        if (this.mRewardNum > 0) {
            let price = this.mRewardNum * MyGameConfig.gameConfig.rewardPrice;

            DataManager.addGoldValue(price);
            DataManager.setRewardGoods(0);

            this.initFactoryView(0);
        }
    }

    private onCloseClick(): void {
        this.removeSelf();
        GameManager.instance.isControl = true;
    }
}
import DataManager from "../../main/DataManager";
import MyGameConfig from "../../main/MyGameConfig";
import SdkCenter from "../../sdk/SdkCenter";
import { ui } from "../../ui/layaMaxUI";
import EventUtils from "../../utils/EventUtils";
import TimeUtils from "../../utils/TimeUtils";
import UiUtils from "../../utils/UiUtils";
import GameManager from "../../main/GameManager";
import CommonTipDialog from "./CommonTipDialog";
import LayaZip from "../../../libs/LayaZip";

export default class MapDialog extends ui.game.MapDialogUI {

    private mCurSelectLevel: number;
    private mIsCanClick: boolean = true;

    onAwake() {
        this.width = Laya.stage.width;
        this.mCurSelectLevel = GameManager.instance.curLevel;


        UiUtils.click(this.mBtnPre, this, this.onPreClick);
        UiUtils.click(this.mBtnNext, this, this.onNextClick);
        UiUtils.click(this.mBtnDelivery, this, this.onDeliveryClick);
        UiUtils.click(this.mBtnClose, this, this.onCloseClick);

        let zipArr = [
            { url: MyGameConfig.URL_RES2D + "map.zip", type: LayaZip.ZIP },
        ];

        Laya.loader.create(zipArr, Laya.Handler.create(this, () => {
            this.refreshView();
            UiUtils.hideLoading();
        }));
    }

    onDisable() {
    }

    private tweenAni(): void {

    }

    private refreshView(): void {
        this.mImgPre.visible = true;
        this.mImgNext.visible = true;
        let passLevel = DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_PASS);


        if (this.mCurSelectLevel == 0) {
            this.mImgPre.visible = false;
        } else {
            this.mImgPre.skin = MyGameConfig.URL_MAP + MyGameConfig.levelConfig[this.mCurSelectLevel - 1].imgName;
        }

        if (this.mCurSelectLevel == MyGameConfig.levelConfig.length - 1) {
            this.mImgNext.visible = false;
        } else {
            this.mImgPre.skin = MyGameConfig.URL_MAP + MyGameConfig.levelConfig[this.mCurSelectLevel + 1].imgName;
        }

        let curSelectLevelConfig = MyGameConfig.levelConfig[this.mCurSelectLevel];

        this.mImgCur.skin = MyGameConfig.URL_MAP + curSelectLevelConfig.imgName;

        if (this.mCurSelectLevel > passLevel) {
            this.mImgCur.gray = true;
            this.mBtnDelivery.visible = false;
            this.mImgLockCur.visible = true;
            this.mNodeLockInfo.visible = true;
            this.mLbUnlockGoldValue.changeText(curSelectLevelConfig.costGold + "");
            this.mLbUnlockCrystalValue.changeText(curSelectLevelConfig.costCrystl + "");
        } else {
            this.mImgCur.gray = false;
            this.mBtnDelivery.visible = true;
            this.mImgLockCur.visible = false;
            this.mNodeLockInfo.visible = false;

        }

        if (this.mCurSelectLevel == passLevel + 1) {
            UiUtils.click(this.mImgCur, this, this.onUnlockClick);
        } else {
            this.mImgCur.offAll();
        }

        this.mImgPre.gray = this.mCurSelectLevel - 1 > passLevel;
        this.mImgLockPre.visible = this.mCurSelectLevel - 1 > passLevel;
        this.mImgNext.gray = this.mCurSelectLevel + 1 > passLevel;
        this.mImgLockNext.visible = this.mCurSelectLevel + 1 > passLevel;
    }

    private onPreClick(): void {
        if (this.mCurSelectLevel == 0 || !this.mIsCanClick) {
            return;
        }

        this.mCurSelectLevel--;
        this.refreshView();
    }

    private onNextClick(): void {
        if (this.mCurSelectLevel == MyGameConfig.levelConfig.length - 1 || !this.mIsCanClick) {
            return;
        }

        this.mCurSelectLevel++;
        this.refreshView();
    }

    private onDeliveryClick(): void {
        if (GameManager.instance.roleScript.getContainerNum() > 0) {
            UiUtils.showToast("please sell the ore first");
            return;
        }

        this.onCloseClick();

        DataManager.setLastSelectLevel(this.mCurSelectLevel);
        EventUtils.dispatchEvent(MyGameConfig.EVENT_GO_NEXT_ISLAND, "");
    }

    private onUnlockClick(): void {
        let passLevel = DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_PASS);

        if ((this.mCurSelectLevel - 1) > passLevel) {
            return;
        }

        UiUtils.addChild(new CommonTipDialog("whether to unlock the island", () => {
            let goldValue = DataManager.getGoldValue();
            let crystalValue = DataManager.getCrystalValue();

            if (goldValue < MyGameConfig.levelConfig[this.mCurSelectLevel].costGold
                || crystalValue < MyGameConfig.levelConfig[this.mCurSelectLevel].costCrystl) {
                UiUtils.showToast("lack of resources");
                return;
            }

            DataManager.addGoldValue(-MyGameConfig.levelConfig[this.mCurSelectLevel].costGold);
            DataManager.addGoldValue(-MyGameConfig.levelConfig[this.mCurSelectLevel].costCrystl);
            DataManager.addLevel(MyGameConfig.KEY_DATA_LEVEL_PASS);
            this.refreshView();
            UiUtils.showToast("unlocked successfully");
        }));
    }

    private onCloseClick(): void {
        this.destroy(true);
        Laya.Resource.destroyUnusedResources();
    }
}
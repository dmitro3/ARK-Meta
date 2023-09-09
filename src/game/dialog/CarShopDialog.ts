import DataManager from "../../main/DataManager";
import MyGameConfig from "../../main/MyGameConfig";
import { ui } from "../../ui/layaMaxUI";
import EventUtils from "../../utils/EventUtils";
import UiUtils from "../../utils/UiUtils";
import CarConfigInfo from "../bean/config/CarConfigInfo";
import GameManager from "../../main/GameManager";

export default class CarShopDialog extends ui.game.CarShopDialogUI {

    private mCarData: CarConfigInfo[] = [];
    private mCurSelectIndex: number;
    private mUseCardIndex: number;

    onAwake(): void {
        this.width = Laya.stage.width;

        this.initData();
        this.initView();
        this.refreshCarInfoView(this.mCarData[this.mCurSelectIndex]);

        UiUtils.click(this.mBtnClose, this, this.onCloseClick);

        UiUtils.hideLoading();
    }

    private initData(): void {
        let useCardId = DataManager.getUseCarId();
        let carData = DataManager.getUnlockCarInfo();

        for (let key in carData) {
            let carInfo = carData[key] as CarConfigInfo;

            this.mCarData.push(carInfo);

            if (carInfo.id == useCardId) {
                this.mUseCardIndex = this.mCarData.length - 1;
                this.mCurSelectIndex = this.mCarData.length - 1;
            }
        }
    }

    private initView(): void {
        this.mListCar.renderHandler = new Laya.Handler(this, this.updateListCarItem);
        this.mListCar.array = this.mCarData;

        this.mListCar.scrollBar.height = 11;

        UiUtils.click(this.mBtnEquip, this, () => {
            this.mUseCardIndex = this.mCurSelectIndex;
            DataManager.setUseCarId(this.mCarData[this.mUseCardIndex].id);
            this.mBtnEquip.visible = false;
            this.mListCar.refresh();
            GameManager.instance.roleScript.createRoleModel(this.mCarData[this.mUseCardIndex], null, true);
        });
    }

    private refreshCarInfoView(carInfo: CarConfigInfo): void {
        this.mLbCarName.changeText(carInfo.name);
        this.mLbDes.changeText(carInfo.des);
        this.mImgCar.skin = "carshop/icon/" + carInfo.imgName;

        this.mBtnEquip.visible = carInfo.id != this.mCarData[this.mUseCardIndex].id;
    }

    private updateListCarItem(ceil: Laya.Box, index: number): void {
        let imgIc = ceil.getChildByName("imgIc") as Laya.Image;
        let imgUse = ceil.getChildByName("imgUse") as Laya.Image;
        let imgSelect = ceil.getChildByName("imgSelect") as Laya.Image;
        let data = this.mCarData[index];

        imgIc.skin = "carshop/icon/" + data.imgName;

        if (index == this.mUseCardIndex) {
            imgUse.visible = true;
            imgSelect.visible = false;
        } else {
            imgSelect.visible = this.mCurSelectIndex == index;
            imgUse.visible = false;
        }

        UiUtils.click(imgIc, this, (args) => {
            let carInfo = args[0] as CarConfigInfo;
            this.mCurSelectIndex = args[1];
            this.refreshCarInfoView(carInfo);
            this.mListCar.refresh();
        }, [data, index]);
    }

    private onCloseClick(): void {
        UiUtils.removeSelf(this);
    }
}
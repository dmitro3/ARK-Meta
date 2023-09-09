import LayaZip from "../../../libs/LayaZip";
import DataManager from "../../main/DataManager";
import MyGameConfig from "../../main/MyGameConfig";
import { ui } from "../../ui/layaMaxUI";
import UiUtils from "../../utils/UiUtils";

export default class GuideDialog extends ui.game.GuideDialogUI {

    private MODEL_NORMAL_DATA: any[] = [
        { "img": "imgGuide1_1.jpg", "des": "Control the minecart to mine ore and sell it" },
        { "img": "imgGuide1_2.jpg", "des": "During the mining of ore, crystals will appear. The crystal will disappear after a certain period of time, please dig it in time" },
        { "img": "imgGuide1_3.jpg", "des": "In the process of mining ore, there is a chance that a design will appear. You can unlock the relevant props through the laboratory and produce the props through the factory" },
        { "img": "imgGuide1_4.jpg", "des": "After the container is full, the ore will no longer be obtained, please sell the ore in time" },
        { "img": "imgGuide1_5.jpg", "des": "After the durability is exhausted, it will be forced to be taken to the repair shop, and the repair time will be greatly increased. Pay attention to the durability and send the minecart to the repair shop for repair in time" },
    ]

    private MODEL_PROSPECTING: any[] = [
        { "img": "imgGuide2_1.jpg", "des": "For a limited time, dig hidden crystals" },
        { "img": "imgGuide2_2.jpg", "des": "Using props will help you find the location of the crystal faster" },
    ];

    private mData: any[];

    private mCurIndex: number = 0;

    constructor(model: number) {
        super();

        switch (model) {
            case MyGameConfig.PLAY_MODEL_NORMAL:
                this.mData = this.MODEL_NORMAL_DATA;
                break;
            case MyGameConfig.PLAY_MODEL_PROSPECTING:
                this.mData = this.MODEL_PROSPECTING;
                break;
        }

        DataManager.setShowGuide(model);
    }

    onAwake(): void {
        this.width = Laya.stage.width;

        let zipArr = [
            { url: MyGameConfig.URL_RES2D + "guide.zip", type: LayaZip.ZIP },
        ];

        Laya.loader.create(zipArr, Laya.Handler.create(this, () => {
            this.initView();
            UiUtils.hideLoading();
        }));
    }

    private initView(): void {
        this.mList.width = this.mList.cells[0].width * this.mData.length;
        this.mList.renderHandler = new Laya.Handler(this, this.updateItemList);
        this.mList.array = this.mData;
        this.refreshContentView();

        UiUtils.click(this.mBtnPre, this, this.onPreClick);
        UiUtils.click(this.mBtnNext, this, this.onNextClick);
        UiUtils.click(this.mBtnClose, this, this.onCloseClick);
    }

    private refreshContentView(): void {
        let data = this.mData[this.mCurIndex];

        this.mImgGuide.skin = MyGameConfig.URL_GUIDE + data.img;
        this.mLbDes.text = data.des;

        this.mBtnPre.visible = true;
        this.mBtnNext.visible = true;

        if (this.mCurIndex == 0) {
            this.mBtnPre.visible = false;
        }

        if (this.mCurIndex == this.mData.length - 1) {
            this.mBtnNext.visible = false;
        }

        this.mList.refresh();
    }

    private updateItemList(ceil: Laya.Box, index: number): void {
        let img = ceil.getChildAt(0) as Laya.Image;

        if (this.mCurIndex == index) {
            img.skin = "guide/bgItemGuideSelect.png"
        } else {
            img.skin = "guide/bgItemGuide.png";
        }
    }

    private onPreClick(): void {
        if (this.mCurIndex == 0) {
            return;
        }

        this.mCurIndex--;
        this.refreshContentView();
    }

    private onNextClick(): void {
        if (this.mCurIndex == this.mData.length - 1) {
            return;
        }

        this.mCurIndex++;
        this.refreshContentView();
    }

    private onCloseClick(): void {
        this.destroy(true);
        Laya.Resource.destroyUnusedResources();
    }
}
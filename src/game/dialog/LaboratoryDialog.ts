import DataManager from "../../main/DataManager";
import MyGameConfig from "../../main/MyGameConfig";
import { ui } from "../../ui/layaMaxUI";
import UiUtils from "../../utils/UiUtils";
import DesignDiagramConfigInfo from "../bean/config/DesignDiagramConfigInfo";
import GameManager from "../../main/GameManager";

export default class LaboratoryDialog extends ui.game.LaboratoryDialogUI {

    private mDesignDiagram: DesignDiagramConfigInfo[] = [];
    private mCurSelectIndex: number = 0;
    private mUseCardIndex: number = 0;

    onAwake(): void {
        this.width = Laya.stage.width;
        this.initData();
        this.initView();
        this.refreshInfoView(this.mDesignDiagram[this.mCurSelectIndex]);

        UiUtils.hideLoading();

        Laya.timer.loop(1, this, () => {
            let designInfo = this.mDesignDiagram[this.mCurSelectIndex];

            if (designInfo.productionTime) {
                let progress = (GameManager.instance.curTime - designInfo.productionTime) / designInfo.time;

                if (progress > 1) {
                    progress = 1;
                }

                this.mNodeProgress.visible = true;
                this.mMaskProgress.graphics.clear();
                this.mMaskProgress.graphics.drawRect(0, 0, this.mMaskProgress.width * progress, this.mMaskProgress.height, "#ff0000");
            }
        });
    }

    onDisable(): void {
        Laya.timer.clearAll(this);
    }

    private onCloseClick(): void {
        UiUtils.removeSelf(this);
    }

    private initData(): void {
        this.mDesignDiagram = MyGameConfig.designDiagramConfig;
    }

    private initView(): void {
        this.mListDesignDiagram.renderHandler = new Laya.Handler(this, this.updateListCarItem);
        this.mListDesignDiagram.array = this.mDesignDiagram;
        this.mListDesignDiagram.hScrollBarSkin = "";

        UiUtils.click(this.mBtnResearch, this, () => {
            let designInfo = this.mDesignDiagram[this.mCurSelectIndex];
            DataManager.addProductDesignDiagram(designInfo.id, (time: number) => {
                designInfo.productionTime = time;

                this.refreshInfoView(designInfo);
            });
        });
        UiUtils.click(this.mBtnClose, this, this.onCloseClick);
    }

    private refreshInfoView(designInfo: DesignDiagramConfigInfo): void {
        this.mLbDesignDiagramName.changeText(designInfo.name);
        this.mImgDesignDiagram.skin = "laboratory/" + designInfo.imgName;


        if (designInfo.productionTime) {
            this.mBtnResearch.visible = false;
        } else {
            this.mBtnResearch.disabled = !designInfo.isUnlock;
            this.mNodeProgress.visible = false;
            this.mBtnResearch.visible = true;
        }
    }

    private updateListCarItem(ceil: Laya.Box, index: number): void {
        let imgIc = ceil.getChildByName("imgIc") as Laya.Image;
        let imgUse = ceil.getChildByName("imgUse") as Laya.Image;
        let imgSelect = ceil.getChildByName("imgSelect") as Laya.Image;
        let data = this.mDesignDiagram[index];

        if (data.isUnlock) {
            imgIc.skin = "laboratory/" + data.imgName;
        } else {
            imgIc.skin = "laboratory/" + data.lockImgName;
        }

        imgUse.visible = false;
        imgSelect.visible = this.mCurSelectIndex == index;

        UiUtils.click(imgIc, this, (args) => {
            let info = args[0] as DesignDiagramConfigInfo;
            this.mCurSelectIndex = args[1];
            this.refreshInfoView(info);
            this.mListDesignDiagram.refresh();
        }, [data, index]);
    }
}
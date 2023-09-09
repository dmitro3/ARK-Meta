import DataManager from "../../main/DataManager";
import { ui } from "../../ui/layaMaxUI";
import UiUtils from "../../utils/UiUtils";
import DesignDiagramConfigInfo from "../bean/config/DesignDiagramConfigInfo";
import GameManager from "../../main/GameManager";

export default class GetDesigndiagramDialog extends ui.game.GetDesigndiagramUI {

    private mDesignDiagramInfo: DesignDiagramConfigInfo;

    constructor(info: DesignDiagramConfigInfo) {
        super();

        this.mDesignDiagramInfo = info;
    }

    onAwake(): void {
        this.width = Laya.stage.width;

        DataManager.addUnlockDesignDiagram(this.mDesignDiagramInfo.id);
        this.mImgIc.skin = "laboratory/" + this.mDesignDiagramInfo.imgName;
        this.mLbContent.changeText(this.mDesignDiagramInfo.name)
        GameManager.instance.isPause = true;
        GameManager.instance.isControl = false;
        GameManager.instance.roleScript.stopMove();

        UiUtils.click(this.mBtnOk, this, this.onCloseClick);
        UiUtils.hideLoading();
    }

    private onCloseClick(): void {
        GameManager.instance.isPause = false;
        GameManager.instance.isControl = true;
        this.removeSelf();
    }
}
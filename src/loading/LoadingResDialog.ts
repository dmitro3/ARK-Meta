import GameManager from "../main/GameManager";
import MyGameConfig from "../main/MyGameConfig";
import { ui } from "../ui/layaMaxUI";

export default class LoadingResDialog extends ui.laoding.LoadingResDialogUI {

    onAwake(): void {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
    }
}
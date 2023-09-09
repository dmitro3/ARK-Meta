import MainViewDialog from "../game/dialog/MainViewDialog";
import GameManager from "./GameManager";
import MapManager from "../game/map/MapManager";
import SceneResManager from "../game/SceneResManager";
import LoadingDialog from "../loading/LoadingDialog";
import SdkCenter from "../sdk/SdkCenter";
import AudioUtils from "../utils/AudioUtils";
import EventUtils from "../utils/EventUtils";
import LsUtils from "../utils/LsUtils";
import MathUtils from "../utils/MathUtils";
import UiUtils from "../utils/UiUtils";
import Vector3Utils from "../utils/Vector3Utils";
import AudioManager from "./AudioManager";
import DataManager from "./DataManager";
import HttpManager from "./HttpManager";
import MyGameConfig from "./MyGameConfig";
import PvpMapManager from "../game/map/PvpMapManager";
import AstarUtils from "../utils/AstarUtils";
import MultiplePassOutlineMaterial from "../materials/MultiplePassOutlineMaterial";
import MultiplePassOutline from "../materials/shader/MultiplePassOutline";
import LanguageData from "../i18n/LanguageData";

export default class LaunchScript {

    constructor() {
        if (Laya.Browser.onMac || Laya.Browser.onPC) {
        } else {
            Laya.stage.frameRate = Laya.Stage.FRAME_SLOW;
        }

        this.prepare();
    }

    private addHandler(): void {

    }

    private prepare(): void {
        let loadingDialog = new LoadingDialog(() => {

            Laya.loader.load("fonts/berlin_sans_fb.ttf", Laya.Handler.create(this, (ttf) => {
                Laya.Text.defaultFont = ttf.fontName;
                let totalRequestCount: number = 2;
                let requestCount: number = 0;

                let requestCallback = function () {
                    requestCount++;

                    if (totalRequestCount == requestCount) {
                        Laya.Shader3D.compileShaderByDefineNames("PARTICLESHURIKEN", 0, 0,
                            ["DIFFUSEMAP", "ADDTIVEFOG", "SPHERHBILLBOARD", "COLOROVERLIFETIME", "TEXTURESHEETANIMATIONCURVE",
                                "SHAPE", "TINTCOLOR"]);
                        EventUtils.dispatchEvent(MyGameConfig.EVENT_REFRESH_MAIN_VIEW_DIALOG, "");
                        loadingDialog.destroy();
                    };
                };

                this.loadRes(() => {
                    requestCallback();
                });

                HttpManager.instance.request.login(() => {
                    requestCallback();
                });
            }));
            LanguageData.getInstance().init();
            MultiplePassOutlineMaterial.initShader();
            AudioManager.init();
            MapManager.instance.init();
            PvpMapManager.instance.init();
            GameManager.instance.init();
            HttpManager.instance.init();
            SdkCenter.instance.init();
            AudioUtils.init();
            UiUtils.init();
            AstarUtils.init();
        });

        Laya.stage.addChild(loadingDialog);
    }

    private loadRes(callback: Function): void {
        SceneResManager.loadStartRes(() => {
            DataManager.init();
            AudioManager.playBgm();
            GameManager.instance.mainViewDialog = new MainViewDialog();
            UiUtils.addChild(GameManager.instance.mainViewDialog);

            SceneResManager.createScene(() => {
                callback();
            });
        });
    }
}
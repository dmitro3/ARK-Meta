import DataManager from "../../main/DataManager";
import MyGameConfig from "../../main/MyGameConfig";
import PoolManager from "../../main/PoolManager";
import SdkCenter from "../../sdk/SdkCenter";
import { ui } from "../../ui/layaMaxUI";
import EventUtils from "../../utils/EventUtils";
import MathUtils from "../../utils/MathUtils";
import TimeUtils from "../../utils/TimeUtils";
import UiUtils from "../../utils/UiUtils";
import GameManager from "../../main/GameManager";
import MapManager from "../map/MapManager";
import ProspectingMapManager from "../ProspectingMapManager";
import RockerView from "../ui/RockerView";
import SellLabel from "../ui/SellLabel";
import CommonTipDialog from "./CommonTipDialog";
import CurrencyValueView from "../ui/CurrencyValueView";
import SettingDialog from "./SettingDialog";
import GuideDialog from "./GuideDialog";
import LanguageData from "../../i18n/LanguageData";
import Utils from "../../utils/Utils";
import WalletUtils from "../../utils/WalletUtils";

export default class MainViewDialog extends ui.game.MainViewDialogUI {

    private mPropPowerTime: number = 0;
    private mPropRollerTime: number = 0;
    private mPropCapacityTime: number = 0;
    private mPropExplosiveTime: number = 0;
    private mCatchCrystalTime: number = 0;
    private mPropSurveyCrystalTime: number = 0;

    private mProspectingTimer: number = 60;
    private mIsPauseProspectingTimer: boolean = true;

    private mPlayModel: number;

    private mCurrencyValueView: CurrencyValueView;

    onAwake() {
        this.width = Laya.stage.width;
        this.mCurrencyValueView = new CurrencyValueView()
        UiUtils.addChild(this.mCurrencyValueView);
        this.addHandler();
    }

    onDisable() {
        EventUtils.offAllEventByNode(this);
    }

    private addHandler(): void {
        EventUtils.onEvent(this, MyGameConfig.EVENT_REFRESH_MAIN_VIEW_DIALOG, () => {
            this.initView();
            this.initPropsValueView();
            this.setTouch();
        });

        EventUtils.onEvent(this, MyGameConfig.EVENT_REFRESH_PROPS_VIEW, () => {
            this.initPropsValueView();
        });

        EventUtils.onEvent(this, MyGameConfig.EVENT_SHOW_SELL, (num: number) => {
        });

        EventUtils.onEvent(this, MyGameConfig.EVENT_GO_NEXT_ISLAND, () => {
            this.mNodeModelNormal.visible = false;
            this.mNodeModelProspecting.visible = false;
            // this.mNodeDurable.visible = false;
            this.mBtnRule.visible = false;
            this.mBtnPvp.visible = false;
            Laya.timer.clearAll(this);
        });

        EventUtils.onEvent(this, MyGameConfig.EVENT_UPGRADE_TRUCK, () => {
            this.mLbContinerProgress.changeText(GameManager.instance.roleScript.getContainerNum() + "/" + GameManager.instance.roleScript.getMaxCapacity());
        });

        EventUtils.onEvent(this, MyGameConfig.EVENT_START, (playModel: number) => {
            this.mPlayModel = playModel;
            this.mNodeStartTip.visible = true;
            this.mBtnRule.visible = true;
            this.mBtnPvp.visible = true;

            if (playModel == MyGameConfig.PLAY_MODEL_NORMAL) {
                this.initModelNormalView();
            } else if (playModel == MyGameConfig.PLAY_MODEL_PROSPECTING) {
                this.initModelProspectingView();
            }
        });

        EventUtils.onEvent(this, MyGameConfig.EVENT_PROSPECTING_TIMER_PAUSE, (b: boolean) => {
            this.mIsPauseProspectingTimer = b;
        });

        EventUtils.onEvent(this, MyGameConfig.EVENT_PROSPECTING_END, () => {
            Laya.timer.clearAll(this);
            this.mNodeModelProspecting.visible = false;
            ProspectingMapManager.instance.clear();
            UiUtils.addChild(new CommonTipDialog("Exploration Ends"));
        });

        EventUtils.onEvent(this, MyGameConfig.EVENT_HIDE_MAIN_VIEW_DIALOG, (isHide: boolean) => {
            switch (this.mPlayModel) {
                case MyGameConfig.PLAY_MODEL_NORMAL:
                    this.mNodeModelNormal.visible = !isHide;
                    break;
                case MyGameConfig.PLAY_MODEL_PROSPECTING:
                    this.mNodeModelProspecting.visible = !isHide;
                    break;
            }
        });

        EventUtils.onEvent(this, MyGameConfig.EVENT_HIDE_VIEW_DURABLE, (isHide: boolean) => {
        });

        EventUtils.onEvent(this, MyGameConfig.EVENT_CATCH_END, () => {
            this.mNodeProps.visible = false;
            this.mNodePropsCrystal.visible = false;
        });
    }

    private initModelNormalView(): void {
        this.mNodeModelNormal.visible = true;
        this.mNodeDurable.visible = false;
        let continerProgress = 0;

        let progress = GameManager.instance.roleScript.getCatchStoneProgress();
        let catchStoneNum = GameManager.instance.roleScript.getCatchStoneNum();

        this.mMaskIslandProgress.graphics.clear();
        this.mMaskIslandProgress.graphics.drawRect(0, 0, this.mNodeIslandProgress.width * progress, this.mNodeIslandProgress.height, "#ff0000");

        this.mNodeIslandProgress.visible = !!progress;

        this.mNodeProps.visible = true;

        let curDurableProgress = GameManager.instance.roleScript.getDurableProgress();

        this.refreshDurableView(curDurableProgress);

        Laya.timer.frameLoop(5, this, () => {
            catchStoneNum = this.refreshGameProgressView(catchStoneNum);

            if (continerProgress != GameManager.instance.roleScript.getContainerProgress()) {
                continerProgress = GameManager.instance.roleScript.getContainerProgress();

                this.mMaskContinerProgress.graphics.clear();
                this.mMaskContinerProgress.graphics.drawRect(0, 0, this.mNodeContinerProgress.width, this.mNodeContinerProgress.height * continerProgress, "#ff0000");

                this.mNodeContinerProgress.visible = continerProgress != 0;

                this.mLbContinerProgress.changeText(GameManager.instance.roleScript.getContainerNum() + "/" + GameManager.instance.roleScript.getMaxCapacity());
            }

            if (curDurableProgress != GameManager.instance.roleScript.getDurableProgress()) {
                curDurableProgress = GameManager.instance.roleScript.getDurableProgress();

                this.refreshDurableView(curDurableProgress);
            }
        });

        let camera: Laya.Camera = GameManager.instance.roleScript.getCamera();
        let outPos: Laya.Vector4 = new Laya.Vector4();

        Laya.timer.frameLoop(1, this, () => {
            if (this.mPropPowerTime >= 0) {
                this.mPropPowerTime = this.refreshPropMask(this.mPropPowerTime, this.mNodeMaskPropPower,
                    this.mMaskPropPower, MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_POWER].effectTime);
            }

            if (this.mPropRollerTime >= 0) {
                this.mPropRollerTime = this.refreshPropMask(this.mPropRollerTime, this.mNodeMaskPropRoller,
                    this.mMaskPropRoller, MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_ROLLER].effectTime);
            }

            if (this.mPropCapacityTime >= 0) {
                this.mPropCapacityTime = this.refreshPropMask(this.mPropCapacityTime, this.mNodeMaskPropCapacity,
                    this.mMaskPropCapacity, MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_CAPACITY].effectTime);
            }

            if (this.mPropExplosiveTime >= 0) {
                this.mPropExplosiveTime = this.refreshPropMask(this.mPropExplosiveTime, this.mNodeMaskPropExplosive,
                    this.mMaskPropExplosive, MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_EXPLOSIVE].effectTime);
            }

            camera.viewport.project(GameManager.instance.roleScript.getPosition(), camera.projectionViewMatrix, outPos);
        });
    }

    private initModelProspectingView(): void {
        this.mNodeModelProspecting.visible = true;
        this.mNodePropsCrystal.visible = true;
        this.mProspectingTimer = MyGameConfig.gameConfig.surveyTime;
        this.mLbProspectingTimer.changeText((this.mProspectingTimer / 1000) + "");
        this.mNodeDurable.visible = false;

        Laya.timer.loop(1000, this, () => {
            if (!this.mIsPauseProspectingTimer) {
                this.mProspectingTimer -= 1000;
                this.mLbProspectingTimer.changeText((this.mProspectingTimer / 1000) + "");

                if (this.mProspectingTimer == 0) {
                    EventUtils.dispatchEvent(MyGameConfig.EVENT_PROSPECTING_END, "");
                }
            }
        });

        Laya.timer.frameLoop(1, this, () => {
            if (this.mCatchCrystalTime >= 0) {
                this.mCatchCrystalTime = this.refreshPropMask(this.mCatchCrystalTime, this.mNodeMaskCatchCrystal,
                    this.mMaskCatchCrystal, MyGameConfig.gameConfig.catchCrystalCd);
            }

            if (this.mPropSurveyCrystalTime >= 0) {
                this.mPropSurveyCrystalTime = this.refreshPropMask(this.mPropSurveyCrystalTime, this.mNodeMaskPropSurvey,
                    this.mMaskPropSurvey, MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_CRYSTAL_DETECTOR].effectTime);
            }
        });
    }

    private initView(): void {
        this.mLbContinerProgress.changeText(0 + "/" + GameManager.instance.roleScript.getMaxCapacity());
        this.mLbRepairPrice.changeText("$" + MyGameConfig.gameConfig.repairPrice);

        let progress = GameManager.instance.roleScript.getCatchStoneProgress();
        this.mMaskIslandProgress.graphics.clear();
        this.mMaskIslandProgress.graphics.drawRect(0, 0, this.mNodeIslandProgress.width * progress, this.mNodeIslandProgress.height, "#ff0000");

        this.mNodeIslandProgress.visible = !!progress;

        if (Laya.Browser.onPC) {
            this.mLbStartTip.text = LanguageData.getInstance().t("pc_control_tip");
        } else {
            this.mLbStartTip.text = LanguageData.getInstance().t("control_tip");
        }

        const address = WalletUtils.getInstance().getAddress();

        if (address) {
            this.mLbAccount.text = Utils.formatAccountAddress(address, 7, 7, 14);
        } else {
            ((this.mLbAccount.parent) as any).visible = false;
        }

        UiUtils.click(this.mBtnPropPower, this, this.onPropPowerClick);
        UiUtils.click(this.mBtnPropRoller, this, this.onPropRollerClick);
        UiUtils.click(this.mBtnPropCapacity, this, this.onPropCapacityClick);
        UiUtils.click(this.mBtnPropExplosive, this, this.onPropExplosiveClick);
        UiUtils.click(this.mBtnCatchCrystal, this, this.onCatchCrystalClick)
        UiUtils.click(this.mBtnSurveyCrystal, this, this.onSurveyCrystalClick);
        UiUtils.click(this.mBtnRepair, this, this.onRepairClick);
        UiUtils.click(this.mBtnSetting, this, this.onSettingClick);
        UiUtils.click(this.mBtnRule, this, this.onRuleClick);
        UiUtils.click(this.mBtnPvp, this, this.onPvpClick);
    }

    private refreshDurableView(progress: number): void {
        this.mMaskDurable.graphics.clear();
        this.mMaskDurable.graphics.drawRect(0, 0, this.mNodeMaskDurable.width * progress, this.mNodeMaskDurable.height, "#ffffff");
        this.mNodeMaskDurable.visible = progress != 0;
    }

    private refreshGameProgressView(catchStoneNum: number): number {
        if (catchStoneNum != GameManager.instance.roleScript.getCatchStoneNum()) {
            catchStoneNum = GameManager.instance.roleScript.getCatchStoneNum();

            let progress = GameManager.instance.roleScript.getCatchStoneProgress();

            this.mMaskIslandProgress.graphics.clear();
            this.mMaskIslandProgress.graphics.drawRect(0, 0, this.mNodeIslandProgress.width * progress, this.mNodeIslandProgress.height, "#ff0000");

            this.mNodeIslandProgress.visible = !!progress;
        }

        return catchStoneNum;
    }

    private initPropsValueView(): void {
        this.mLbPropPower.changeText(DataManager.getPropsInfo()[MyGameConfig.PROPS_POWER] + "");
        this.mLbPropCapacity.changeText(DataManager.getPropsInfo()[MyGameConfig.PROPS_CAPACITY] + "");
        this.mLbPropRoller.changeText(DataManager.getPropsInfo()[MyGameConfig.PROPS_ROLLER] + "");
        this.mLbPropExplosive.changeText(DataManager.getPropsInfo()[MyGameConfig.PROPS_EXPLOSIVE] + "");
        this.mLbSurveyCrystal.changeText(DataManager.getPropsInfo()[MyGameConfig.PROPS_CRYSTAL_DETECTOR] + "");
    }

    private refreshPropMask(propTime: number, nodeMakProp: Laya.Sprite, maskProp: Laya.Sprite, effectTime: number): number {
        propTime -= GameManager.instance.timerDelta;

        let progress = 1 - propTime / effectTime;

        maskProp.graphics.clear();
        maskProp.graphics.drawPie(nodeMakProp.width / 2, nodeMakProp.height / 2,
            80, -90 + 360 * progress, 270, "#ffffff");

        if (propTime <= 0) {
            nodeMakProp.visible = false;
        }

        return propTime;
    }

    private setTouch(): void {
        var rockerView = new RockerView(this.mNodeTouch);
        this.addChild(rockerView);

        let isFirtMove: boolean = true;

        rockerView.setMoveCallback((event: Laya.Event) => {
            if (GameManager.instance.isControl) {
                if (isFirtMove) {
                    if (GameManager.instance.roleScript.getDurableProgress() == 0) {
                        GameManager.instance.isControl = false;
                        isFirtMove = false;
                        GameManager.instance.roleScript.addDurable(-1);
                        return;
                    }
                    isFirtMove = false;
                }
                GameManager.instance.roleScript.startMove();
                this.mNodeStartTip.visible = false;
            }
        }, (radians, angle) => {
            if (radians && GameManager.instance.isControl) {
                this.mNodeStartTip.visible = false;
                GameManager.instance.roleScript.controlMove(radians, angle);
            }
        }, () => {
            if (GameManager.instance.isControl) {
                GameManager.instance.roleScript.stopMove();
            }
        });
    }

    public showBtnRepair(b: boolean): void {
        this.mBtnRepair.visible = b;
    }

    private onPropPowerClick(): void {
        if (this.mPropPowerTime > 0 || DataManager.getPropsInfo()[MyGameConfig.PROPS_POWER] <= 0) {
            return;
        }
        EventUtils.dispatchEvent(MyGameConfig.EVENT_CATCH_PROPS, { type: MyGameConfig.PROPS_POWER });
        this.receivePropPower();
    }

    private receivePropPower(): void {
        this.mPropPowerTime = MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_POWER].effectTime;
        this.mNodeMaskPropPower.visible = true;
        DataManager.addPropValue(MyGameConfig.PROPS_POWER, -1, () => {
        });
    }

    private onPropRollerClick(): void {
        if (this.mPropRollerTime > 0 || DataManager.getPropsInfo()[MyGameConfig.PROPS_ROLLER] <= 0) {
            return;
        }
        EventUtils.dispatchEvent(MyGameConfig.EVENT_CATCH_PROPS, { type: MyGameConfig.PROPS_ROLLER });
        this.receivePropRoller();
    }

    private receivePropRoller(): void {
        this.mPropRollerTime = MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_ROLLER].effectTime;
        this.mNodeMaskPropRoller.visible = true;
        DataManager.addPropValue(MyGameConfig.PROPS_ROLLER, -1, () => {
        });
    }

    private onPropCapacityClick(): void {
        if (this.mPropCapacityTime > 0 || DataManager.getPropsInfo()[MyGameConfig.PROPS_CAPACITY] <= 0) {
            return;
        }

        EventUtils.dispatchEvent(MyGameConfig.EVENT_CATCH_PROPS, { type: MyGameConfig.PROPS_CAPACITY });
        this.receivePropCapacity();
    }

    private receivePropCapacity(): void {
        this.mPropCapacityTime = MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_CAPACITY].effectTime;
        this.mNodeMaskPropCapacity.visible = true;
        DataManager.addPropValue(MyGameConfig.PROPS_CAPACITY, -1, () => {
        });
    }

    private onPropExplosiveClick(): void {
        if (this.mPropExplosiveTime > 0 || DataManager.getPropsInfo()[MyGameConfig.PROPS_EXPLOSIVE] <= 0) {
            return;
        }

        EventUtils.dispatchEvent(MyGameConfig.EVENT_CATCH_PROPS, { type: MyGameConfig.PROPS_EXPLOSIVE });
        this.receivePropExplosive();
    }

    private receivePropExplosive(): void {
        this.mPropExplosiveTime = MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_EXPLOSIVE].effectTime;
        this.mNodeMaskPropExplosive.visible = true;
        DataManager.addPropValue(MyGameConfig.PROPS_EXPLOSIVE, -1, () => {
        });
    }

    private onCatchCrystalClick(): void {
        if (this.mCatchCrystalTime > 0) {
            return;
        }

        this.mCatchCrystalTime = MyGameConfig.gameConfig.catchCrystalCd;
        GameManager.instance.roleScript.catchCrystal();
        this.mNodeMaskCatchCrystal.visible = true;
    }

    private onSurveyCrystalClick(): void {
        if (this.mPropSurveyCrystalTime > 0 || DataManager.getPropsInfo()[MyGameConfig.PROPS_CRYSTAL_DETECTOR] <= 0) {
            return;
        }
        this.mPropSurveyCrystalTime = MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_CRYSTAL_DETECTOR].effectTime;
        GameManager.instance.roleScript.surveyCrystal();
        this.mNodeMaskPropSurvey.visible = true;
        DataManager.addPropValue(MyGameConfig.PROPS_CRYSTAL_DETECTOR, -1, () => {
        });
    }

    private onRepairClick(): void {
        let goldValue = DataManager.getGoldValue();

        if (goldValue < MyGameConfig.gameConfig.repairPrice) {
            UiUtils.showToast("gold shortage");
            return;
        }
        GameManager.instance.roleScript.addDurable(99999999999);
        DataManager.addGoldValue(MyGameConfig.gameConfig.repairPrice)
    }

    private onSettingClick(): void {
        UiUtils.addChild(new SettingDialog());
    }

    private onRuleClick(): void {
        UiUtils.addChild(new GuideDialog(MyGameConfig.levelConfig[GameManager.instance.curLevel].model));
    }

    private onPvpClick(): void {
        if (GameManager.instance.roleScript.getContainerProgress() > 0) {
            UiUtils.showToast("please sell the ore first");
            return;
        }
        GameManager.instance.roleScript.clearProps();
        GameManager.instance.roleScript.pvpPrepare(true);
    }

    public showAllView(b): void {
        this.visible = b;
        this.mCurrencyValueView.visible = b;
    }

    public showBtnPvp(b): void {
        this.mBtnPvp.visible = b;
    }
}
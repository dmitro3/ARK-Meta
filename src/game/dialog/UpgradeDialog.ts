import DataManager from "../../main/DataManager";
import MyGameConfig from "../../main/MyGameConfig";
import SdkCenter from "../../sdk/SdkCenter";
import { ui } from "../../ui/layaMaxUI";
import EventUtils from "../../utils/EventUtils";
import UiUtils from "../../utils/UiUtils";
import AudioManager from "../../main/AudioManager";
import GameManager from "../../main/GameManager";

export default class UpgradeDialog extends ui.game.UpgradeDialogUI {

    private mRollerConfig = [
        { type: 1, icon: "icUpgradeSpikeCircleNum.png", title: "spikes", key: MyGameConfig.KEY_DATA_LEVEL_SPIKE_CIRCLE_NUM, cost: "spikeCircleCost" },    // 增加一圈钉刺
        { type: 2, icon: "icUpgradeSpikeNum.png", title: "spikes per turn", key: MyGameConfig.KEY_DATA_LEVEL_SPIKE_NUM, cost: "spikeCost" }, // 每圈增加钉刺
        { type: 3, icon: "icUpgradeSpikeSize.png", title: "spike size", key: MyGameConfig.KEY_DAY_LEVEL_SPIKE_SIZE, cost: "spikeSizeCost" },  // 增大钉刺尺寸
        { type: 7, icon: "icUpgradeDurabilitySpeed.png", title: "durability recovery", key: MyGameConfig.KEY_DATA_LEVEL_DURABLE_SPEED, cost: "durableSpeedCost" }, // 提高耐久度恢复速度
        { type: 5, icon: "icTruckSpeed.png", title: "truck speed", key: MyGameConfig.KEY_DATA_LEVEL_TRUCK_SPEED, cost: "truckSpeedCost" }, // 提高卡车速度
        { type: 6, icon: "icTruckCapacity.png", title: "truck capacity", key: MyGameConfig.KEY_DATA_LEVEL_TRUCK_CAPACITY, cost: "truckCapacityCost" }, // 增加卡车容量
        { type: 4, icon: "icUpgradeSpikeCircleNum.png", title: "roller size", key: MyGameConfig.KEY_DATA_LEVEL_ROLLER_SIZE, cost: "truckCapacityCost" }, // 增加滚轴长度
    ];

    onAwake() {
        this.width = Laya.stage.width;

        this.initView();

        UiUtils.click(this.mBtnClose, this, this.onCloseClick);

        UiUtils.hideLoading();
    }

    private initView(): void {
        this.mListUpgradeRoller.renderHandler = new Laya.Handler(this, this.updateListRollerItem);
        this.mListUpgradeRoller.array = this.mRollerConfig;

        this.mListUpgradeRoller.scrollBar.height = 254;
    }

    private updateListRollerItem(ceil: Laya.Box, index: number): void {
        this.updateDetailontentItem(ceil, index);

        let btnUpgrade = ceil.getChildByName("btnUpgrade") as Laya.Image;
        let self = this;

        let callback = function (data) {
            data = data[0];

            if (DataManager.getLevelByKey(data.key) == MyGameConfig.truckConfig.length - 1) {
                return;
            }
            let level = DataManager.addLevel(data.key);

            switch (data.type) {
                case 1:
                    GameManager.instance.roleScript.getRollerScript().setSpikeCircleNumLevel(level);
                    break;
                case 2:
                    GameManager.instance.roleScript.getRollerScript().setSpikeNumLevel(level);
                    break;
                case 3:
                    GameManager.instance.roleScript.getRollerScript().setSpikeSizeLevel(level);
                    break;
                case 4:
                    GameManager.instance.roleScript.getRollerScript().setRollerSizeLevel(level);
                    break;
                case 5:
                    GameManager.instance.roleScript.setSpeedLevel(level);
                    break;
                case 6:
                    EventUtils.dispatchEvent(MyGameConfig.EVENT_UPGRADE_TRUCK, level);
                    GameManager.instance.roleScript.setMaxCapacity(level);
                    break;
            }
            GameManager.instance.roleScript.getRollerScript().craeteSpike();
            self.mListUpgradeRoller.refresh();
        };

        UiUtils.click(btnUpgrade, this, (data) => {
            callback(data);
        }, [ceil.dataSource], AudioManager.NAME_BUY);
    }

    private onCloseClick(): void {
        UiUtils.removeSelf(this);
        EventUtils.dispatchEvent(MyGameConfig.EVENT_LEAVE_REPAIR_FACTORY, "");
    }

    private updateDetailontentItem(ceil: Laya.Box, index: number): void {
        let data = ceil.dataSource;

        let imgIc = ceil.getChildByName("imgIc") as Laya.Image;
        let lbTitle = ceil.getChildByName("lbTitle") as Laya.Label;
        let btnUpgrade = ceil.getChildByName("btnUpgrade") as Laya.Image;
        let lbPrice = btnUpgrade.getChildByName("lbPrice") as Laya.Label;
        let bgPb = ceil.getChildByName("bgPb") as Laya.Image;
        let imgPbBar = bgPb.getChildByName("pbBar") as Laya.Image;
        let goldValue = DataManager.getGoldValue();

        imgIc.skin = "upgrade/" + data.icon;
        lbTitle.changeText(data.title);

        let curLevel = DataManager.getLevelByKey(data.key);
        let nextLevel = curLevel + 1;

        data.nextLevel = nextLevel;

        if (nextLevel == MyGameConfig.truckConfig.length) {
            lbPrice.changeText("MAX");
            btnUpgrade.disabled = true;
        } else {
            lbPrice.changeText("UPGRADE");
            btnUpgrade.disabled = false;
        }

        let progress = curLevel / (MyGameConfig.truckConfig.length - 1);
        imgPbBar.visible = progress != 0;
        imgPbBar.mask.graphics.clear();
        imgPbBar.mask.graphics.drawRect(0, 0, imgPbBar.width * progress, imgPbBar.height, "#ff0000");
    }
}
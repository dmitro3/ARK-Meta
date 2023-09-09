import AudioManager from "./AudioManager";
import CarConfigInfo from "../game/bean/config/CarConfigInfo";
import DesignDiagramConfigInfo from "../game/bean/config/DesignDiagramConfigInfo";
import FactoryGoodsConfigInfo from "../game/bean/config/FactoryGoodsConfigInfo";
import GameManager from "./GameManager";
import EventUtils from "../utils/EventUtils";
import LsUtils from "../utils/LsUtils";
import MyGameConfig from "./MyGameConfig";

export default class DataManager {

    private static mData: Data;

    public static init(): void {
        this.mData = new Data();

        this.initDesignDiagram();
        this.initPropsData();

        this.mData.goldValue = LsUtils.getInt("gold_value", 0);
        this.mData.crystalValue = LsUtils.getInt("crystal_value", 0);
    }

    public static getGoldValue(): number {
        return this.mData.goldValue;
    }

    public static addGoldValue(value: number): void {
        this.mData.goldValue += value;
        LsUtils.setInt("gold_value", this.getGoldValue() + value);
        EventUtils.dispatchEvent(MyGameConfig.EVENT_REFRESH_GOLD_VIEW, "");
    }

    public static getCrystalValue(): number {
        return this.mData.crystalValue;
    }

    public static addCrystalValue(value: number): void {
        this.mData.crystalValue += value;
        LsUtils.setInt("crystal_value", this.getCrystalValue() + value);
        EventUtils.dispatchEvent(MyGameConfig.EVENT_REFRESH_GOLD_VIEW, "");
    }

    public static getUseCarId(): number {
        return LsUtils.getInt("use_car_id", 1);
    }

    public static setUseCarId(id: number): void {
        LsUtils.setInt("use_car_id", id);
    }

    public static getUnlockCarInfo(): any {
        return MyGameConfig.carConfig;
    }

    public static addUnlockCar(): void {

    }

    public static getUnlockFunction(): any {
        return LsUtils.getJson("unlock_function", {});
    }

    public static addUnlockFunction(id: number, callback: Function): void {
        let obj = this.getUnlockFunction();

        obj[id] = true;

        LsUtils.setJson("unlock_function", obj);

        callback();
    }

    public static getLevelByKey(key: string): number {
        return LsUtils.getInt(key, 0);
    }

    public static addLevel(key: string): number {
        let level = this.getLevelByKey(key) + 1;

        this.setLevelByKey(key, level);

        return level;
    }

    public static setLevelByKey(key: string, num: number): void {
        LsUtils.setInt(key, num);
    }

    public static getLastSelectLevel(): number {
        return LsUtils.getInt("last_select_level", 0);
    }

    public static setLastSelectLevel(level: number): void {
        LsUtils.setInt("last_select_level", level);
    }

    public static getRewardGoods(): number {
        return LsUtils.getInt("reward_goods", 0);
    }

    public static addRewardGoods(): number {
        return this.setRewardGoods(this.getRewardGoods() + 1)
    }

    public static setRewardGoods(num: number): number {
        return LsUtils.setInt("reward_goods", num);
    }

    public static getMapStarsData(): any {
        return LsUtils.getJson("map_stars_data", {});
    }

    public static addMapStarsByLevel(level: number): void {
        let data = this.getMapStarsData();

        if (!data[level]) {
            data[level] = 0;
        }

        data[level]++;

        this.setMapStarsData(data);
        AudioManager.playGetStars();
    }

    public static setMapStarsData(data): void {
        return LsUtils.setJson("map_stars_data", data);
    }

    public static getMapData(): any {
        return LsUtils.getJson("map_data", {});
    }

    public static setMapData(data): void {
    }

    public static getMapRefreshTimeData(): any {
        return LsUtils.getJson("map_refresh_time_data", {});
    }

    public static setMapRefreshTimeData(data): void {
        LsUtils.setJson("map_refresh_time_data", data);
    }

    public static getTruckData(): any {
        return LsUtils.getJson("truck_data", {
            "capacity": {},
            "catchStoneNum": 0,
            "stars": 0
        });
    }

    public static setTruckData(data): void {
    }

    public static isTipMap(): boolean {
        return LsUtils.getBoolean("is_tip_map", false);
    }

    public static setTipMap(b: boolean): boolean {
        return LsUtils.setBoolean("is_tip_map", b);
    }

    public static getCompletedGuideEvent(): any {
        return LsUtils.getJson("completed_guide_event", {});
    }

    public static addCompleteGuideEvent(eventId: string): void {
        var completedGuideEvent = this.getCompletedGuideEvent();

        completedGuideEvent[eventId] = true;

        LsUtils.setJson("completed_guide_event", completedGuideEvent);
    }

    public static getUnlockDesignDiagram(): any {
        return MyGameConfig.designDiagramConfig;
    }

    private static initDesignDiagram(): void {
        let unlockDesignDiagram = LsUtils.getJson("unlock_design_diagram", {});

        for (let i = 0; i < MyGameConfig.designDiagramConfig.length; i++) {
            let info = MyGameConfig.designDiagramConfig[i];

            if (unlockDesignDiagram[info.id]) {
                info.isUnlock = true;
                info.productionTime = unlockDesignDiagram[info.id].productionTime;
            } else {
                info.isUnlock = false;
                this.mData.lockDesignDiagram.push(info);
            }
        }
    }

    public static getLockDesignDiagram(): DesignDiagramConfigInfo[] {
        return this.mData.lockDesignDiagram;
    }

    public static addUnlockDesignDiagram(id: number): void {
        let unlockDesignDiagram = LsUtils.getJson("unlock_design_diagram", {});

        let obj: any = {};

        obj.productionTime = 0;
        unlockDesignDiagram[id] = obj;

        for (let i = 0; i < this.mData.lockDesignDiagram.length; i++) {
            let info = this.mData.lockDesignDiagram[i];

            if (info.id == id) {
                this.mData.lockDesignDiagram.splice(i, 1);

                for (let i = 0; i < MyGameConfig.designDiagramConfig.length; i++) {
                    if (info.id == MyGameConfig.designDiagramConfig[i].id) {
                        MyGameConfig.designDiagramConfig[i].isUnlock = true;

                        break;
                    }
                }

                break;
            }
        }

        LsUtils.setJson("unlock_design_diagram", unlockDesignDiagram);
    }

    public static addProductDesignDiagram(id: number, callback: Function): void {
        let obj = LsUtils.getJson("unlock_design_diagram", {});

        if (obj[id]) {
            obj[id].productionTime = GameManager.instance.curTime;

            for (let i = 0; i < MyGameConfig.designDiagramConfig.length; i++) {
                if (id == MyGameConfig.designDiagramConfig[i].id) {
                    MyGameConfig.designDiagramConfig[i].productionTime = GameManager.instance.curTime;

                    break;
                }
            }

            LsUtils.setJson("unlock_design_diagram", obj);
            callback(GameManager.instance.curTime);
        }
    }

    private static initPropsData(): void {
        let propsValue = LsUtils.getJson("props_value", {});

        for (let key in MyGameConfig.factoryGoodsConfig) {
            let propInfo = MyGameConfig.factoryGoodsConfig[key] as FactoryGoodsConfigInfo;
            propInfo.num = propsValue[propInfo.id];
            if (!propInfo.num) {
                propInfo.num = 0;
            }
            this.mData.propsInfo[key] = propInfo.num;

            for (let i = 0; i < MyGameConfig.designDiagramConfig.length; i++) {
                let designDiagramInfo = MyGameConfig.designDiagramConfig[i];

                if (designDiagramInfo.goodsId == propInfo.id) {
                    propInfo.isUnlock = false;
                    if (designDiagramInfo.isUnlock && designDiagramInfo.productionTime &&
                        (GameManager.instance.curTime - designDiagramInfo.productionTime) >= designDiagramInfo.time) {
                        propInfo.isUnlock = true;
                        break;
                    }
                }

            }
        }

    }

    public static getPropsInfo(): any {
        return this.mData.propsInfo;
    }

    public static addPropValue(id: number, value: number, callback: Function): void {
        let obj = this.getPropsInfo();
        obj[id] += value;
        MyGameConfig.factoryGoodsConfig[id].num += value;
        LsUtils.setJson("props_value", obj);
        EventUtils.dispatchEvent(MyGameConfig.EVENT_REFRESH_PROPS_VIEW, "");
        callback();
    }

    public static isShowGuide(model: number): boolean {
        return LsUtils.getJson("is_show_guide", {})[model];
    }

    public static setShowGuide(model: number): void {
        let obj = LsUtils.getJson("is_show_guide", {});

        obj[model] = true;

        LsUtils.setJson("is_show_guide", obj);
    }

    public static setDurable(durable: number): void {
        LsUtils.setInt("durable_value", durable);
    }

    public static getDurable(): number {
        return LsUtils.getInt("durable_value", -1);
    }

    public static isVibrate(): boolean {
        return LsUtils.getBoolean("setting_vibrate", true);
    }

    public static setVibrate(b): void {
        LsUtils.setBoolean("setting_vibrate", b);
    }

    public static isSound(): boolean {
        return LsUtils.getBoolean("setting_sound", true);
    }

    public static setSound(b): void {
        LsUtils.setBoolean("setting_sound", b);
    }

    public static isBgm(): boolean {
        return LsUtils.getBoolean("setting_bgm", true);
    }

    public static setBgm(b): void {
        LsUtils.setBoolean("setting_bgm", b);
    }
}

class Data {
    public goldValue: number;
    public crystalValue: number;
    public lockDesignDiagram: DesignDiagramConfigInfo[] = [];
    public propsInfo: any = {};
}
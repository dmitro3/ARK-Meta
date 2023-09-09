import CarConfigInfo from "../game/bean/config/CarConfigInfo";
import DesignDiagramConfigInfo from "../game/bean/config/DesignDiagramConfigInfo";
import GameConfigInfo from "../game/bean/config/GameConfigInfo";
import LevelConfigInfo from "../game/bean/config/LevelConfigInfo";
import MineCarConfigInfo from "../game/bean/config/MineCarConfigInfo";
import TruckConfigInfo from "../game/bean/config/TruckConfigInfo";
import HttpManager from "./HttpManager";

export default class MyGameConfig {

    public static BASE_URL = HttpManager.instance.isTest ? "" : "";

    public static URL_RES2D = MyGameConfig.BASE_URL + "res2d/";

    public static URL_RES3D = MyGameConfig.BASE_URL + "res3d/";

    public static URL_RES3D_MAIN = MyGameConfig.BASE_URL + "res3d/LayaScene_MainScene/Conventional/";

    public static URL_RES3D_FIRST = MyGameConfig.BASE_URL + "res3d/LayaScene_FirstScene/Conventional/";

    public static URL_RES3D_OTHER = MyGameConfig.BASE_URL + "res3d/LayaScene_OtherScene/Conventional/";

    public static URL_RES3D_ISLAND = MyGameConfig.BASE_URL + "res3d/LayaScene_IslandScene/Conventional/";

    public static URL_RES3D_STONE = MyGameConfig.BASE_URL + "res3d/LayaScene_StoneScene/Conventional/";

    public static URL_RES3D_ROLE = MyGameConfig.BASE_URL + "res3d/LayaScene_RoleScene/Conventional/";

    public static URL_RES3D_SKY = MyGameConfig.BASE_URL + "res3d/LayaScene_SkyScene/Conventional/";

    public static URL_CONFIG = MyGameConfig.BASE_URL + "res2d/config/";

    public static URL_SOUNDS = MyGameConfig.BASE_URL + "res2d/sounds/";

    public static URL_GUIDE = MyGameConfig.BASE_URL + "res2d/guide/";

    public static URL_MAP = MyGameConfig.BASE_URL + "res2d/map/";

    public static PROPERTY_CAR_SPEED = 1;

    public static PROPERTY_CAR_CAPACITY = 2;

    public static PROPERTY_CAR_REPAIR = 3;

    public static PROPERTY_CAR_SPIKE_CIRCLE_NUM = 4;

    public static PROPERTY_CAR_SPIKE_NUM = 5;

    public static PROPERTY_CAR_SPIKE_SIZE = 6;

    public static PROPERTY_CAR_ROLLER_SIZE = 7;

    public static PLAY_MODEL_NORMAL = 1;

    public static PLAY_MODEL_PROSPECTING = 2;

    public static PLAY_MODEL_PVP = 3;

    public static levelConfig: LevelConfigInfo[];

    public static pvpLevelConfig: LevelConfigInfo[];

    public static carConfig: any = {};

    public static factoryGoodsConfig: any = {};

    public static functionUnlockConfig: any;

    public static stoneConfig: any = {};

    public static truckConfig: TruckConfigInfo[];

    public static gameConfig: GameConfigInfo;

    public static designDiagramConfig: DesignDiagramConfigInfo[];

    public static FUNCTION_ID_SELL = 1;

    public static FUNCTION_ID_REPAIR_STATION = 2;

    public static FUNCTION_ID_LABORATORY = 3;

    public static FUNCTION_ID_FACTORY = 4;

    public static FUNCTION_ID_UPGRADE = 121212;

    public static FUNCTION_ID_TANK_SHOP = 5;

    public static FUNCTION_ID_TRACTOR = 7;

    public static FUNCTION_ID_MAP = 8;

    public static STATE_INVALID = -1;

    public static STATE_SELL = 1;

    public static STATE_REPAIR = 2;

    public static STATE_LABORATORY = 3;

    public static STATE_FACTORY = 4;

    public static STATE_TANK_SHOP = 5;

    public static STATE_UPGRADE = 6;

    public static STATE_HAUL = 7;

    public static STATE_MAP = 8;

    public static STATE_REPAIR_FACTORY = 9;

    public static STATE_HAUL_PVP = 10;

    public static REWARD_TYPE_GOLD = 1;

    public static REWARD_TYPE_CRYSTAL = 2;


    public static POSITION_SCALE = 100;

    public static RADIUS = 0.82;

    public static MAX_TIMER = 40;

    public static CONTAINER_STONE_SCALE = 0.7;

    public static SHIP_MOVE_SPEED = 0.01;

    public static SKY_ROTATE_SPEED = 0.00002;


    public static EVENT_REFRESH_PRODUCT = "0";

    public static EVENT_GO_NEXT_ISLAND = "1";

    public static EVENT_TO_NEXT_ISLAND = "2";

    public static EVENT_REFRESH_GOLD_VIEW = "3";

    public static EVENT_REFRESH_PROPS_VIEW = "4";

    public static EVENT_SHOW_SELL = "5";

    public static EVENT_START = "6";

    public static EVENT_UPGRADE_TRUCK = "7";

    public static EVENT_SHOW_FULL_TIP = "8";

    public static EVENT_SHOW_MAP_TIP = "9";

    public static EVENT_PROPS_EFFECT = "10";

    public static EVENT_CATCH_PROPS = "11";

    public static EVENT_REFRESH_MAIN_VIEW_DIALOG = "12";

    public static EVENT_REPAIR = "13";

    public static EVENT_LEAVE_REPAIR_FACTORY = "14";

    public static EVENT_PROSPECTING_TIMER_PAUSE = "15";

    public static EVENT_PROSPECTING_END = "16";

    public static EVENT_HIDE_MAIN_VIEW_DIALOG = "17";

    public static EVENT_HIDE_VIEW_DURABLE = "18";

    public static EVENT_PVP_PREPARE = "19";

    public static EVENT_PVP_SCORE = "20";

    public static EVENT_PVP_END = "21";

    public static EVENT_CATCH_END = "22";

    public static ZORDER_0 = 0;
    public static ZORDER_1 = 1;
    public static ZORDER_100 = 100;
    public static ZORDER_101 = 101;

    public static NAME_DIALOG_LOADING = "dialog_loading";

    public static NAME_DIALOG_FACTORY = "dialog_factory";

    public static NAME_DIALOG_PROPS = "dialog_props";

    public static NAME_TOAST = "toast";

    public static PROPS_ROLLER = 1;

    public static PROPS_POWER = 2;

    public static PROPS_CAPACITY = 3;

    public static PROPS_EXPLOSIVE = 4;

    public static PROPS_CRYSTAL_DETECTOR = 5;

    public static KEY_DATA_LEVEL_PASS = "level_pass";

    public static KEY_DATA_LEVEL_DURABLE = "level_durable";

    public static KEY_DATA_LEVEL_DURABLE_SPEED = "level_durable_speed";

    public static KEY_DATA_LEVEL_SPIKE_CIRCLE_NUM = "level_spike_circle_num";

    public static KEY_DATA_LEVEL_SPIKE_NUM = "level_spike_num";

    public static KEY_DAY_LEVEL_SPIKE_SIZE = "level_spike_size";

    public static KEY_DATA_LEVEL_ROLLER_SIZE = "level_roller_size";

    public static KEY_DATA_LEVEL_TRUCK_SPEED = "level_truck_speed";

    public static KEY_DATA_LEVEL_TRUCK_CAPACITY = "level_truck_capacity";

    public static KEY_DATA_LEVEL_FACTORY_SPEED = "level_factory_speed";

    public static KEY_DATA_LEVEL_FACTORY_QUALITY_ADD_SELL = "level_factory_quality_add_sell";

    public static KEY_DATA_LEVEL_FACTORY_CAPACITY = "level_factory_quality_capacity";

    public static KEY_DATA_PRODUCT_LAST_UNLOCK = "product_last_unlock";
}
import DataManager from "../../../main/DataManager";
import MyGameConfig from "../../../main/MyGameConfig";
import EventUtils from "../../../utils/EventUtils";
import MathUtils from "../../../utils/MathUtils";
import Vector3Utils from "../../../utils/Vector3Utils";
import GameManager from "../../../main/GameManager";
import RoleScript from "../../RoleScript";
import CharacterBaseState from "../CharacterBaseState";

export default class CharacterRepairState extends CharacterBaseState {

    private mIsRepair: boolean = false;
    private mDurableSpeed: number;
    private mTime: number;

    constructor(owner: any) {
        super(owner);

        this.mPointPosition = this.getPoint(MyGameConfig.FUNCTION_ID_REPAIR_STATION).position;
    }

    onEnter() {
        GameManager.instance.isControl = false;

        this.mDurableSpeed = MyGameConfig.truckConfig[DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_DURABLE_SPEED)].durableSpeed * 20;
        this.mDurableSpeed *= GameManager.instance.roleScript.getRepairRate();
        this.mTime = 0;
        this.mIsRepair = true;

        GameManager.instance.mainViewDialog.showBtnRepair(true);
    }

    onUpdate(): void {
        if (GameManager.instance.isPause || !this.mIsRepair) {
            return;
        }

        this.mTime += GameManager.instance.timerDelta;

        if (this.mTime >= 1000) {
            this.mTime -= 1000;

            if (GameManager.instance.roleScript.addDurable(this.mDurableSpeed)) {
                this.mIsRepair = false;
                EventUtils.dispatchEvent(MyGameConfig.EVENT_LEAVE_REPAIR_FACTORY, "");
                GameManager.instance.mainViewDialog.showBtnRepair(false);
                GameManager.instance.roleScript.setRepairRate(1);
            }
        }
    }

    onLeave() {
        this.mIsRepair = false;
    }

    getStateKey() {
        return MyGameConfig.STATE_REPAIR;
    }
}
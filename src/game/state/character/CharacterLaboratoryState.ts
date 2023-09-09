import DataManager from "../../../main/DataManager";
import MyGameConfig from "../../../main/MyGameConfig";
import UiUtils from "../../../utils/UiUtils";
import FunctionUnlockConfigInfo from "../../bean/config/FunctionUnlockConfigInfo";
import CommonTipDialog from "../../dialog/CommonTipDialog";
import LaboratoryDialog from "../../dialog/LaboratoryDialog";
import CharacterBaseState from "../CharacterBaseState";

export default class CharacterLaboratoryState extends CharacterBaseState {

    private mFunctionInfo: FunctionUnlockConfigInfo;

    constructor(owner: any) {
        super(owner);

        this.mPointPosition = this.getPoint(MyGameConfig.FUNCTION_ID_LABORATORY).position;
        this.mFunctionInfo = MyGameConfig.functionUnlockConfig[MyGameConfig.FUNCTION_ID_LABORATORY];
    }

    onEnter() {
        if (this.mFunctionInfo.isUnlock) {
            UiUtils.addChild(new LaboratoryDialog());
        } else {
            UiUtils.addChild(new CommonTipDialog("Are you willing to spend " + this.mFunctionInfo.unLockCostGold +
                " gold coins and\n" + this.mFunctionInfo.unlockCostCrystal + " crystal construction laboratory?", () => {
                    let goldValue = DataManager.getGoldValue();
                    let crystalValue = DataManager.getCrystalValue();

                    if (goldValue < this.mFunctionInfo.unLockCostGold || crystalValue < this.mFunctionInfo.unlockCostCrystal) {
                        UiUtils.showToast("lack of resources");
                        return;
                    }

                    DataManager.addUnlockFunction(this.mFunctionInfo.id, () => {
                        this.mFunctionInfo.isUnlock = true;
                        UiUtils.addChild(new LaboratoryDialog());
                        UiUtils.showToast("unlocked successfully");
                    });
                }, () => {

                }, "Ok", "No"));
        }
    }

    getStateKey() {
        return MyGameConfig.STATE_LABORATORY;
    }
}
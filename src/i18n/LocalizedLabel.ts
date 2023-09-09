import MathUtils from "../utils/MathUtils";
import LanguageData from "./LanguageData";

export default class LocalizedLabel extends Laya.Script {
    public key: string;
    private mUuid: string;

    onAwake(): void {
        this.mUuid = MathUtils.generateUUID();
        LanguageData.getInstance().addLabel(this.mUuid, this);
        this.updateLabel();
    }

    onDisable(): void {
        LanguageData.getInstance().deleteLabel(this.mUuid);
    }

    public updateLabel() {
        this.getLabel().text = LanguageData.getInstance().t(this.key);
    }

    public getLabel(): Laya.Label {
        return this.owner as Laya.Label;
    }
}
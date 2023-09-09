import LsUtils from "../utils/LsUtils";
import LocalizedLabel from "./LocalizedLabel";

export default class LanguageData {

    private static mInstance: LanguageData;
    private mLanguageMap: any = {};
    private mCurLanguage: string;
    private mLabelMap: any = {};

    public static getInstance(): LanguageData {
        if (!this.mInstance) {
            this.mInstance = new LanguageData();
        }

        return this.mInstance;
    }

    public init() {
        this.getLanguage();
    }

    public addLanguageData(language: string, data: any) {
        this.mLanguageMap[language] = data;
    }

    public t(key: string): string {
        this.mCurLanguage = "en";
        let languageData = this.mLanguageMap[this.mCurLanguage];

        if (!languageData) {
            return key;
        }

        let data = languageData[key];

        return data || "";
    }

    public updateSceneRenderers() {
        for (let key in this.mLabelMap) {
            let label = this.mLabelMap[key] as LocalizedLabel;

            if (label.destroyed) {
                this.mLabelMap[key] = null;

                continue;
            }

            label.updateLabel();
        }
    }

    public addLabel(uuid: string, label: LocalizedLabel) {
        this.mLabelMap[uuid] = label;
    }

    public deleteLabel(uuid) {
        delete this.mLabelMap[uuid];
    }

    public getLanguage(): string {
        if (this.mCurLanguage) {
            return this.mCurLanguage;
        }

        this.mCurLanguage = LsUtils.getString("language", "en");

        return this.mCurLanguage;
    }
}
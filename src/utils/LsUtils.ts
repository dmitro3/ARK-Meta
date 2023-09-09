export default class LsUtils {

    private static GAME_NAME = "ark_"

    constructor() {
    }

    public static setInt(key: string, value: number): number {
        Laya.LocalStorage.setItem(this.GAME_NAME + key, value + "");

        return value;
    }

    public static getInt(key: string, defaultValue: number): number {
        var str: any = Laya.LocalStorage.getItem(this.GAME_NAME + key);

        if (str) {
            return parseInt(str);
        } else {
            return defaultValue;
        }
    }

    public static setFloat(key: string, value: number) {
        Laya.LocalStorage.setItem(this.GAME_NAME + key, value + "");
    }

    public static getFloat(key: string, defaultValue: number): number {
        var str = Laya.LocalStorage.getItem(this.GAME_NAME + key);

        if (str) {
            return parseFloat(str);
        } else {
            return defaultValue;
        }
    }

    public static setJson(key: string, value: any) {
        if (value) {
            Laya.LocalStorage.setItem(this.GAME_NAME + key, JSON.stringify(value));
        } else {
            this.removeItem(this.GAME_NAME + key);
        }
    }

    public static getJson(key: string, defaultValue: any): any {
        var str = Laya.LocalStorage.getItem(this.GAME_NAME + key);

        if (str) {
            return JSON.parse(str);
        } else {
            return defaultValue;
        }
    }

    public static getBoolean(key: string, defaultValue: boolean): boolean {
        var str = Laya.LocalStorage.getItem(this.GAME_NAME + key);

        if (str == "true") {
            return true;
        } else if (str == "false") {
            return false;
        } else {
            return defaultValue;
        }
    }

    public static setBoolean(key: string, value: any): boolean {
        if (value) {
            Laya.LocalStorage.setItem(this.GAME_NAME + key, "true");

            return true;
        } else {
            Laya.LocalStorage.setItem(this.GAME_NAME + key, "false");

            return false; 
        }
    }

    public static setString(key: string, value: string): void {
        Laya.LocalStorage.setItem(this.GAME_NAME + key, value);
    }

    public static getString(key: string, defaultValue: string): string {
        var str = Laya.LocalStorage.getItem(this.GAME_NAME + key);

        if (str) {
            return str;
        } else {
            return defaultValue;
        }
    }

    public static removeItem(key: string): void {
        Laya.LocalStorage.removeItem(this.GAME_NAME + key);
    }
}
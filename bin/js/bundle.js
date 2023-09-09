(function () {
    'use strict';

    class MathUtils {
        static generateUUID() {
            if (this._lut.length == 0) {
                for (var i = 0; i < 256; i++) {
                    this._lut[i] = (i < 16 ? "0" : "") + i.toString(16);
                }
            }
            var d0 = 4294967295 * Math.random() | 0, d1 = 4294967295 * Math.random() | 0, d2 = 4294967295 * Math.random() | 0, d3 = 4294967295 * Math.random() | 0;
            return (this._lut[255 & d0] + this._lut[d0 >> 8 & 255] + this._lut[d0 >> 16 & 255] + this._lut[d0 >> 24 & 255] + "-" + this._lut[255 & d1] + this._lut[d1 >> 8 & 255] + "-" + this._lut[d1 >> 16 & 15 | 64] + this._lut[d1 >> 24 & 255] + "-" + this._lut[63 & d2 | 128] + this._lut[d2 >> 8 & 255] + "-" + this._lut[d2 >> 16 & 255] + this._lut[d2 >> 24 & 255] + this._lut[255 & d3] + this._lut[d3 >> 8 & 255] + this._lut[d3 >> 16 & 255] + this._lut[d3 >> 24 & 255]).toUpperCase();
        }
        static toFixed(num, fractionDigits) {
            return parseFloat(num.toFixed(fractionDigits));
        }
        static angle2Radian(angle) {
            return Math.PI / 180 * angle;
        }
        static radian2Angle(radian) {
            return 180 / Math.PI * radian;
        }
        static nextInt(n, m) {
            var random = Math.floor(Math.random() * (m - n + 1) + n);
            return random;
        }
        static nextFloat(n, m) {
            var random = Math.random() * (m - n) + n;
            return random;
        }
        static pointIsRotateRect(rectX, rectY, width, height, angle, pointX, pointY) {
            let hw = width / 2;
            let hh = height / 2;
            let O = angle;
            let X = pointX;
            let Y = pointY;
            let r = -O * (Math.PI / 180);
            let nTempX = rectX + (X - rectX) * Math.cos(r) - (Y - rectY) * Math.sin(r);
            let nTempY = rectY + (X - rectX) * Math.sin(r) + (Y - rectY) * Math.cos(r);
            if (nTempX > rectX - hw && nTempX < rectX + hw && nTempY > rectY - hh && nTempY < rectY + hh) {
                return true;
            }
            return false;
        }
        static pointInPolygon(pt, path) {
            var result = 0, cnt = path.length;
            if (cnt < 3)
                return 0;
            var ip = path[0];
            for (var i = 1; i <= cnt; ++i) {
                var ipNext = (i === cnt ? path[0] : path[i]);
                if (ipNext.Y === pt.Y) {
                    if ((ipNext.X === pt.X) || (ip.Y === pt.Y && ((ipNext.X > pt.X) === (ip.X < pt.X))))
                        return -1;
                }
                if ((ip.Y < pt.Y) !== (ipNext.Y < pt.Y)) {
                    if (ip.X >= pt.X) {
                        if (ipNext.X > pt.X)
                            result = 1 - result;
                        else {
                            var d = (ip.X - pt.X) * (ipNext.Y - pt.Y) - (ipNext.X - pt.X) * (ip.Y - pt.Y);
                            if (d === 0)
                                return -1;
                            else if ((d > 0) === (ipNext.Y > ip.Y))
                                result = 1 - result;
                        }
                    }
                    else {
                        if (ipNext.X > pt.X) {
                            var d = (ip.X - pt.X) * (ipNext.Y - pt.Y) - (ipNext.X - pt.X) * (ip.Y - pt.Y);
                            if (d === 0)
                                return -1;
                            else if ((d > 0) === (ipNext.Y > ip.Y))
                                result = 1 - result;
                        }
                    }
                }
                ip = ipNext;
            }
            return result;
        }
        static randomRate(rateArr) {
            var leng = 0;
            for (var i = 0; i < rateArr.length; i++) {
                leng += rateArr[i];
            }
            for (var i = 0; i < rateArr.length; i++) {
                var random = Math.random() * leng;
                if (random < rateArr[i]) {
                    return i;
                }
                else {
                    leng -= rateArr[i];
                }
            }
            return 0;
        }
    }
    MathUtils._lut = [];

    class LsUtils {
        constructor() {
        }
        static setInt(key, value) {
            Laya.LocalStorage.setItem(this.GAME_NAME + key, value + "");
            return value;
        }
        static getInt(key, defaultValue) {
            var str = Laya.LocalStorage.getItem(this.GAME_NAME + key);
            if (str) {
                return parseInt(str);
            }
            else {
                return defaultValue;
            }
        }
        static setFloat(key, value) {
            Laya.LocalStorage.setItem(this.GAME_NAME + key, value + "");
        }
        static getFloat(key, defaultValue) {
            var str = Laya.LocalStorage.getItem(this.GAME_NAME + key);
            if (str) {
                return parseFloat(str);
            }
            else {
                return defaultValue;
            }
        }
        static setJson(key, value) {
            if (value) {
                Laya.LocalStorage.setItem(this.GAME_NAME + key, JSON.stringify(value));
            }
            else {
                this.removeItem(this.GAME_NAME + key);
            }
        }
        static getJson(key, defaultValue) {
            var str = Laya.LocalStorage.getItem(this.GAME_NAME + key);
            if (str) {
                return JSON.parse(str);
            }
            else {
                return defaultValue;
            }
        }
        static getBoolean(key, defaultValue) {
            var str = Laya.LocalStorage.getItem(this.GAME_NAME + key);
            if (str == "true") {
                return true;
            }
            else if (str == "false") {
                return false;
            }
            else {
                return defaultValue;
            }
        }
        static setBoolean(key, value) {
            if (value) {
                Laya.LocalStorage.setItem(this.GAME_NAME + key, "true");
                return true;
            }
            else {
                Laya.LocalStorage.setItem(this.GAME_NAME + key, "false");
                return false;
            }
        }
        static setString(key, value) {
            Laya.LocalStorage.setItem(this.GAME_NAME + key, value);
        }
        static getString(key, defaultValue) {
            var str = Laya.LocalStorage.getItem(this.GAME_NAME + key);
            if (str) {
                return str;
            }
            else {
                return defaultValue;
            }
        }
        static removeItem(key) {
            Laya.LocalStorage.removeItem(this.GAME_NAME + key);
        }
    }
    LsUtils.GAME_NAME = "ark_";

    class LanguageData {
        constructor() {
            this.mLanguageMap = {};
            this.mLabelMap = {};
        }
        static getInstance() {
            if (!this.mInstance) {
                this.mInstance = new LanguageData();
            }
            return this.mInstance;
        }
        init() {
            this.getLanguage();
        }
        addLanguageData(language, data) {
            this.mLanguageMap[language] = data;
        }
        t(key) {
            this.mCurLanguage = "en";
            let languageData = this.mLanguageMap[this.mCurLanguage];
            if (!languageData) {
                return key;
            }
            let data = languageData[key];
            return data || "";
        }
        updateSceneRenderers() {
            for (let key in this.mLabelMap) {
                let label = this.mLabelMap[key];
                if (label.destroyed) {
                    this.mLabelMap[key] = null;
                    continue;
                }
                label.updateLabel();
            }
        }
        addLabel(uuid, label) {
            this.mLabelMap[uuid] = label;
        }
        deleteLabel(uuid) {
            delete this.mLabelMap[uuid];
        }
        getLanguage() {
            if (this.mCurLanguage) {
                return this.mCurLanguage;
            }
            this.mCurLanguage = LsUtils.getString("language", "en");
            return this.mCurLanguage;
        }
    }

    class LocalizedLabel extends Laya.Script {
        onAwake() {
            this.mUuid = MathUtils.generateUUID();
            LanguageData.getInstance().addLabel(this.mUuid, this);
            this.updateLabel();
        }
        onDisable() {
            LanguageData.getInstance().deleteLabel(this.mUuid);
        }
        updateLabel() {
            this.getLabel().text = LanguageData.getInstance().t(this.key);
        }
        getLabel() {
            return this.owner;
        }
    }

    class FingerView extends Laya.Image {
        onAwake() {
            let angle = 0;
            let startX = this.x;
            let startY = this.y;
            let radius = 62;
            let deltaCurveX = 170 / 180;
            let circleX;
            let circleY;
            let x;
            let y;
            let index = 0;
            Laya.timer.frameLoop(1, this, () => {
                if (this.parent.parent.visible) {
                    if (index == 0) {
                        angle += Laya.timer.delta / 5;
                        if (angle > 180) {
                            x = 256;
                            y = 147;
                            angle = -90;
                            circleX = x;
                            circleY = y - radius;
                            index++;
                        }
                        else {
                            x = deltaCurveX * angle + startX;
                            y = (1 - Math.cos(MathUtils.angle2Radian(angle))) * 62 + startY;
                        }
                    }
                    else if (index == 1) {
                        angle += Laya.timer.delta / 5;
                        if (angle > 90) {
                            angle = -90;
                            x = 256;
                            y = 23;
                            index++;
                            angle = 0;
                            startX = x;
                            startY = y;
                        }
                        else {
                            x = Math.cos(MathUtils.angle2Radian(angle)) * radius + circleX;
                            y = -Math.sin(MathUtils.angle2Radian(angle)) * radius + circleY;
                        }
                    }
                    else if (index == 2) {
                        angle -= Laya.timer.delta / 5;
                        if (angle < -180) {
                            angle = -90;
                            x = 85;
                            y = 147;
                            circleX = x;
                            circleY = y - radius;
                            index++;
                        }
                        else {
                            x = deltaCurveX * angle + startX;
                            y = (1 - Math.cos(MathUtils.angle2Radian(angle))) * 62 + startY;
                        }
                    }
                    else if (index == 3) {
                        angle -= Laya.timer.delta / 5;
                        if (angle <= -270) {
                            angle = -270;
                            x = 85;
                            y = 23;
                            index = 0;
                            angle = 0;
                            startX = x;
                            startY = y;
                            index = 0;
                        }
                        else {
                            x = Math.cos(MathUtils.angle2Radian(angle)) * radius + circleX;
                            y = -Math.sin(MathUtils.angle2Radian(angle)) * radius + circleY;
                        }
                    }
                    this.pos(x, y);
                }
            });
        }
    }

    var View = Laya.View;
    var Dialog = Laya.Dialog;
    var Scene = Laya.Scene;
    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        var game;
        (function (game) {
            class CarShopDialogUI extends Dialog {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(CarShopDialogUI.uiView);
                }
            }
            CarShopDialogUI.uiView = { "type": "Dialog", "props": { "width": 1920, "height": 1080 }, "compId": 2, "child": [{ "type": "Image", "props": { "top": 0, "skin": "common/bgMaskDialog.png", "right": 0, "left": 0, "bottom": 0, "sizeGrid": "12,17,14,15" }, "compId": 55 }, { "type": "Box", "props": { "y": -114, "x": 0, "centerX": 0, "bottom": 57 }, "compId": 4, "child": [{ "type": "Image", "props": { "width": 1076, "skin": "common/bgDialogUpgrade.png", "height": 615, "centerY": 34, "centerX": 0 }, "compId": 5, "child": [{ "type": "List", "props": { "y": 326, "width": 780, "var": "mListCar", "spaceX": 36, "height": 112, "centerX": 0 }, "compId": 6, "child": [{ "type": "HScrollBar", "props": { "y": 144, "width": 560, "skin": "common/hscroll.png", "showButtons": false, "name": "scrollBar", "height": 11, "centerX": 0 }, "compId": 53 }, { "type": "Box", "props": { "y": 0, "x": 0, "width": 116, "renderType": "render", "height": 112 }, "compId": 49, "child": [{ "type": "Image", "props": { "y": 1, "x": 0, "width": 116, "visible": false, "skin": "common/imgUse.png", "name": "imgUse", "height": 112 }, "compId": 51 }, { "type": "Image", "props": { "y": 1, "x": 0, "width": 116, "visible": false, "skin": "common/imgSelect.png", "name": "imgSelect", "height": 112 }, "compId": 52 }, { "type": "Image", "props": { "y": 7, "x": 9, "width": 99, "name": "imgIc", "height": 99 }, "compId": 50 }] }] }, { "type": "Image", "props": { "y": 94, "x": 71.5, "width": 933, "skin": "common/bgInfo.png", "height": 202 }, "compId": 43, "child": [{ "type": "Label", "props": { "y": 36, "x": 210, "width": 506, "var": "mLbCarName", "text": "label", "height": 36, "fontSize": 36, "color": "#ffffff" }, "compId": 44 }, { "type": "Label", "props": { "y": 108, "x": 210, "width": 486, "var": "mLbDes", "valign": "middle", "overflow": "hidden", "height": 70, "fontSize": 30, "color": "#ffffff" }, "compId": 48 }, { "type": "Image", "props": { "y": 25, "x": 28, "width": 158, "skin": "common/bgIc.png", "height": 152 }, "compId": 41 }, { "type": "Image", "props": { "y": 34, "x": 38, "width": 136, "visible": true, "var": "mImgCar", "height": 136 }, "compId": 42 }, { "type": "Image", "props": { "y": 133, "x": 728, "width": 160, "var": "mBtnEquip", "skin": "common/bgBtn1.png", "height": 64 }, "compId": 46, "child": [{ "type": "Label", "props": { "y": 18, "x": 8, "width": 150, "var": "mLbBtn", "text": "Equip", "fontSize": 43, "color": "#ffffff", "align": "center" }, "compId": 47, "child": [{ "type": "Script", "props": { "key": "equip", "runtime": "i18n/LocalizedLabel.ts" }, "compId": 58 }] }] }] }, { "type": "Box", "props": { "y": 60, "width": 79, "var": "mBtnClose", "right": 48, "height": 89 }, "compId": 18, "child": [{ "type": "Image", "props": { "width": 59, "skin": "common/btnClose.png", "height": 69, "centerY": 0, "centerX": 0 }, "compId": 19 }] }] }, { "type": "Image", "props": { "width": 537, "skin": "common/bgTitle.png", "height": 100, "centerX": 0 }, "compId": 20, "child": [{ "type": "Label", "props": { "y": 29, "text": "TANK SHOP", "fontSize": 42, "color": "#ffffff", "centerX": 0 }, "compId": 21, "child": [{ "type": "Script", "props": { "key": "tank_shop", "runtime": "i18n/LocalizedLabel.ts" }, "compId": 57 }] }] }] }], "loadList": ["common/bgMaskDialog.png", "common/bgDialogUpgrade.png", "common/hscroll.png", "common/imgUse.png", "common/imgSelect.png", "common/bgInfo.png", "common/bgIc.png", "common/bgBtn1.png", "common/btnClose.png", "common/bgTitle.png"], "loadList3D": [] };
            game.CarShopDialogUI = CarShopDialogUI;
            REG("ui.game.CarShopDialogUI", CarShopDialogUI);
            class CommonTipDialogUI extends Dialog {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(CommonTipDialogUI.uiView);
                }
            }
            CommonTipDialogUI.uiView = { "type": "Dialog", "props": { "width": 1920, "height": 1080 }, "compId": 2, "child": [{ "type": "Image", "props": { "top": 0, "skin": "common/bgMaskDialog.png", "right": 0, "left": 0, "bottom": 0, "sizeGrid": "12,17,14,15" }, "compId": 9 }, { "type": "Image", "props": { "width": 1048, "skin": "common/bgDialogTip.png", "height": 387, "centerY": 0, "centerX": 0 }, "compId": 3, "child": [{ "type": "Label", "props": { "y": 107, "width": 800, "var": "mLbContent", "valign": "middle", "text": "label", "leading": 40, "height": 200, "fontSize": 48, "color": "#ffffff", "centerX": 9, "align": "center" }, "compId": 8 }, { "type": "Image", "props": { "y": 324, "width": 346, "var": "mBtnOk", "skin": "common/bgBtn2.png", "height": 119, "centerX": 244 }, "compId": 5, "child": [{ "type": "Label", "props": { "width": 300, "var": "mLbOkName", "text": "Ok", "fontSize": 48, "color": "#ffffff", "centerY": 0, "centerX": 0, "align": "center" }, "compId": 6, "child": [{ "type": "Script", "props": { "key": "ok", "runtime": "i18n/LocalizedLabel.ts" }, "compId": 10 }] }] }, { "type": "Image", "props": { "y": 324, "width": 346, "var": "mBtnCancel", "skin": "common/bgBtn2.png", "height": 119, "centerX": -244 }, "compId": 4, "child": [{ "type": "Label", "props": { "x": 0, "width": 300, "var": "mLbCancelName", "text": "Cancel", "fontSize": 48, "color": "#ffffff", "centerY": 0, "centerX": 0, "align": "center" }, "compId": 7, "child": [{ "type": "Script", "props": { "key": "cancel", "runtime": "i18n/LocalizedLabel.ts" }, "compId": 11 }] }] }] }], "loadList": ["common/bgMaskDialog.png", "common/bgDialogTip.png", "common/bgBtn2.png"], "loadList3D": [] };
            game.CommonTipDialogUI = CommonTipDialogUI;
            REG("ui.game.CommonTipDialogUI", CommonTipDialogUI);
            class ConnectWalletDialogUI extends Dialog {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(ConnectWalletDialogUI.uiView);
                }
            }
            ConnectWalletDialogUI.uiView = { "type": "Dialog", "props": { "width": 1920, "height": 1080 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "top": 0, "skin": "common/bgMaskDialog.png", "right": 0, "left": 0, "bottom": 0, "sizeGrid": "12,17,14,15" }, "compId": 4 }, { "type": "Image", "props": { "zOrder": 101, "y": 0, "x": 0, "width": 1048, "skin": "common/bgDialogTip.png", "height": 387, "centerY": 0, "centerX": 0 }, "compId": 5, "child": [{ "type": "Label", "props": { "y": 107, "width": 800, "var": "mLbContent", "valign": "middle", "text": "Please Connect The Wallet First", "leading": 40, "height": 200, "fontSize": 48, "color": "#ffffff", "centerX": 9, "align": "center" }, "compId": 6 }, { "type": "Image", "props": { "y": 324, "width": 346, "var": "mBtnConnect", "skin": "common/bgBtn2.png", "height": 119, "centerX": 0 }, "compId": 7, "child": [{ "type": "Label", "props": { "width": 300, "var": "mLbOkName", "text": "Connect", "fontSize": 48, "color": "#ffffff", "centerY": 0, "centerX": 0, "align": "center" }, "compId": 8 }] }] }], "loadList": ["common/bgMaskDialog.png", "common/bgDialogTip.png", "common/bgBtn2.png"], "loadList3D": [] };
            game.ConnectWalletDialogUI = ConnectWalletDialogUI;
            REG("ui.game.ConnectWalletDialogUI", ConnectWalletDialogUI);
            class CurrencyValueViewUI extends View {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(CurrencyValueViewUI.uiView);
                }
            }
            CurrencyValueViewUI.uiView = { "type": "View", "props": { "width": 1920, "mouseThrough": true, "mouseEnabled": false, "height": 1080 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 90, "x": 0, "width": 470, "skin": "common/bgValue.png", "left": 46, "height": 27 }, "compId": 3, "child": [{ "type": "Sprite", "props": { "y": -46, "x": -6, "width": 82, "texture": "common/icGold.png", "height": 82 }, "compId": 5 }, { "type": "Label", "props": { "y": -29, "x": 90, "width": 335, "var": "mLbGoldValue", "text": "label", "height": 48, "fontSize": 48, "color": "#ffffff", "align": "left" }, "compId": 6 }] }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 470, "top": 196, "skin": "common/bgValue.png", "left": 46, "height": 27 }, "compId": 4, "child": [{ "type": "Sprite", "props": { "y": -55, "x": -6, "width": 82, "texture": "common/icCrystal.png", "height": 82 }, "compId": 7 }, { "type": "Label", "props": { "y": -29, "x": 90, "width": 347, "var": "mLbCrystalValue", "text": "label", "height": 48, "fontSize": 48, "color": "#ffffff", "align": "left" }, "compId": 8 }] }], "loadList": ["common/bgValue.png", "common/icGold.png", "common/icCrystal.png"], "loadList3D": [] };
            game.CurrencyValueViewUI = CurrencyValueViewUI;
            REG("ui.game.CurrencyValueViewUI", CurrencyValueViewUI);
            class FactoryDialogUI extends Dialog {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(FactoryDialogUI.uiView);
                }
            }
            FactoryDialogUI.uiView = { "type": "Dialog", "props": { "width": 1920, "height": 1080 }, "compId": 2, "child": [{ "type": "Image", "props": { "top": -35, "skin": "common/bgMaskDialog.png", "right": 0, "left": -81, "bottom": 0, "sizeGrid": "12,17,14,15" }, "compId": 133 }, { "type": "Box", "props": { "y": -228, "x": 0, "centerX": 0, "bottom": 57 }, "compId": 96, "child": [{ "type": "Image", "props": { "width": 1076, "skin": "common/bgDialogUpgrade.png", "height": 615, "centerY": 34, "centerX": 0 }, "compId": 97, "child": [{ "type": "List", "props": { "y": 142, "width": 840, "var": "mListProduct", "spaceY": 8, "height": 330, "centerX": -1 }, "compId": 98, "child": [{ "type": "VScrollBar", "props": { "y": 20, "x": 891, "width": 11, "skin": "common/vscroll.png", "name": "scrollBar", "height": 254 }, "compId": 123 }, { "type": "Box", "props": { "y": 1, "x": 0, "width": 840, "renderType": "render", "height": 112 }, "compId": 100, "child": [{ "type": "Label", "props": { "y": 12, "width": 494, "text": "label", "name": "lbName", "left": 134, "height": 40, "fontSize": 40, "color": "#ffffff" }, "compId": 119 }, { "type": "Image", "props": { "x": 676, "width": 160, "skin": "common/bgBtn1.png", "name": "btnBuy", "height": 64, "centerY": 0 }, "compId": 121, "child": [{ "type": "Label", "props": { "y": 20, "x": 7, "width": 150, "text": "Buy", "fontSize": 34, "color": "#ffffff", "align": "center" }, "compId": 122, "child": [{ "type": "Script", "props": { "key": "buy", "runtime": "i18n/LocalizedLabel.ts" }, "compId": 136 }] }] }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 116, "skin": "common/bgIc.png", "height": 112 }, "compId": 118 }, { "type": "Image", "props": { "y": 12, "width": 88, "name": "imgIc", "left": 14, "height": 88 }, "compId": 101 }, { "type": "Label", "props": { "y": 64, "width": 80, "text": "888", "name": "lbNum", "left": 20, "height": 40, "fontSize": 36, "color": "#ffffff", "align": "right" }, "compId": 120 }, { "type": "Box", "props": { "y": 62, "x": 134, "name": "nodeCostGold" }, "compId": 125, "child": [{ "type": "Image", "props": { "width": 50, "skin": "common/icGold.png", "height": 50 }, "compId": 124 }, { "type": "Label", "props": { "y": 5, "x": 60, "width": 143, "text": "99999", "name": "lbGoldValue", "height": 40, "fontSize": 40, "color": "#ffffff" }, "compId": 126 }] }, { "type": "Box", "props": { "y": 64, "x": 350, "name": "nodeCostCrystal" }, "compId": 130, "child": [{ "type": "Image", "props": { "y": -5, "x": 0, "width": 50, "skin": "common/icCrystal.png", "height": 50 }, "compId": 131 }, { "type": "Label", "props": { "y": 5, "x": 60, "width": 143, "text": "99999", "name": "lbCrystalValue", "height": 40, "fontSize": 40, "color": "#ffffff" }, "compId": 132 }] }] }] }, { "type": "Image", "props": { "y": 94, "x": 71, "width": 933, "visible": false, "skin": "common/bgInfo.png", "height": 202 }, "compId": 104, "child": [{ "type": "Label", "props": { "y": 94, "x": 198, "width": 513, "var": "mLbStorage", "text": "label", "height": 36, "fontSize": 36, "color": "#ffffff", "align": "left" }, "compId": 105 }, { "type": "Image", "props": { "y": 24, "x": 28, "width": 158, "skin": "common/bgIc.png", "height": 152 }, "compId": 107 }, { "type": "Image", "props": { "y": 38, "x": 44, "width": 126, "var": "mImgCar", "skin": "factory/icReword.png", "height": 126 }, "compId": 106 }, { "type": "Image", "props": { "y": 114, "x": 722, "width": 160, "var": "mBtnSell", "skin": "common/bgBtn1.png", "height": 64 }, "compId": 108, "child": [{ "type": "Label", "props": { "y": 20, "x": 7, "width": 150, "var": "mLbBtn", "text": "Sell", "fontSize": 34, "color": "#ffffff", "align": "center" }, "compId": 109, "child": [{ "type": "Script", "props": { "runtime": "i18n/LocalizedLabel.ts" }, "compId": 135 }] }] }, { "type": "Image", "props": { "y": 141, "x": 180, "width": 430, "skin": "common/bgProgress.png", "height": 35 }, "compId": 110, "child": [{ "type": "Image", "props": { "y": 7, "x": 3, "width": 428, "var": "mNodeCapacityProgress", "skin": "common/bgProgressBar.png", "height": 27 }, "compId": 111, "child": [{ "type": "Sprite", "props": { "y": 1, "x": 0, "width": 428, "var": "mMaskCapacityProgress", "renderType": "mask", "height": 27 }, "compId": 112 }] }] }] }, { "type": "Box", "props": { "y": 60, "width": 79, "var": "mBtnClose", "right": 48, "height": 89 }, "compId": 113, "child": [{ "type": "Image", "props": { "width": 59, "skin": "common/btnClose.png", "height": 69, "centerY": 0, "centerX": 0 }, "compId": 114 }] }] }, { "type": "Image", "props": { "y": 1, "width": 537, "skin": "common/bgTitle.png", "height": 100, "centerX": 0 }, "compId": 115, "child": [{ "type": "Label", "props": { "y": 29, "text": "FACTORY", "fontSize": 42, "color": "#ffffff", "centerX": 0 }, "compId": 116, "child": [{ "type": "Script", "props": { "key": "factory", "runtime": "i18n/LocalizedLabel.ts" }, "compId": 134 }] }] }] }], "loadList": ["common/bgMaskDialog.png", "common/bgDialogUpgrade.png", "common/vscroll.png", "common/bgBtn1.png", "common/bgIc.png", "common/icGold.png", "common/icCrystal.png", "common/bgInfo.png", "factory/icReword.png", "common/bgProgress.png", "common/bgProgressBar.png", "common/btnClose.png", "common/bgTitle.png"], "loadList3D": [] };
            game.FactoryDialogUI = FactoryDialogUI;
            REG("ui.game.FactoryDialogUI", FactoryDialogUI);
            class GetDesigndiagramUI extends Dialog {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(GetDesigndiagramUI.uiView);
                }
            }
            GetDesigndiagramUI.uiView = { "type": "Dialog", "props": { "width": 1920, "height": 1080 }, "compId": 2, "child": [{ "type": "Image", "props": { "top": 0, "skin": "common/bgMaskDialog.png", "right": 0, "left": 0, "bottom": 0, "sizeGrid": "12,17,14,15" }, "compId": 13 }, { "type": "Box", "props": { "centerY": 0, "centerX": 0 }, "compId": 10, "child": [{ "type": "Image", "props": { "width": 662, "skin": "game/bgDialogGetDesignDiagram.png", "height": 182 }, "compId": 4, "child": [{ "type": "Image", "props": { "y": 39, "x": 16, "width": 106, "var": "mImgIc", "height": 106 }, "compId": 11 }, { "type": "Label", "props": { "y": 22, "x": 169, "wordWrap": false, "width": 459, "var": "mLbContent", "valign": "middle", "height": 140, "fontSize": 44, "color": "#ffffff" }, "compId": 12 }] }, { "type": "Image", "props": { "y": 226, "x": 158, "width": 346, "var": "mBtnOk", "skin": "common/bgBtn2.png", "height": 119, "centerX": 0 }, "compId": 6, "child": [{ "type": "Label", "props": { "width": 300, "visible": true, "var": "mLbOkName", "text": "Ok", "fontSize": 48, "color": "#ffffff", "centerY": 0, "centerX": 0, "align": "center" }, "compId": 7, "child": [{ "type": "Script", "props": { "key": "ok", "runtime": "i18n/LocalizedLabel.ts" }, "compId": 14 }] }] }] }], "loadList": ["common/bgMaskDialog.png", "game/bgDialogGetDesignDiagram.png", "common/bgBtn2.png"], "loadList3D": [] };
            game.GetDesigndiagramUI = GetDesigndiagramUI;
            REG("ui.game.GetDesigndiagramUI", GetDesigndiagramUI);
            class GuideDialogUI extends Dialog {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(GuideDialogUI.uiView);
                }
            }
            GuideDialogUI.uiView = { "type": "Dialog", "props": { "width": 1920, "height": 1080 }, "compId": 2, "child": [{ "type": "Image", "props": { "top": 0, "skin": "common/bgMaskDialog.png", "right": 0, "left": 0, "bottom": 0, "sizeGrid": "12,17,14,15" }, "compId": 4 }, { "type": "Box", "props": { "centerY": 28, "centerX": 0 }, "compId": 3, "child": [{ "type": "Image", "props": { "y": 82, "x": 0, "var": "mImgGuide", "skin": "guide/imgGuide1_1.jpg" }, "compId": 6 }, { "type": "Image", "props": { "y": 1, "x": 0, "width": 862, "skin": "guide/bgDialogGuide.png", "height": 651 }, "compId": 5 }, { "type": "List", "props": { "y": 592, "x": 683, "width": 188, "var": "mList", "repeatY": 1, "height": 12, "anchorX": 1 }, "compId": 8, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 9, "child": [{ "type": "Image", "props": { "width": 23, "skin": "guide/bgItemGuide.png", "height": 12 }, "compId": 10 }] }] }, { "type": "Label", "props": { "y": 640, "wordWrap": true, "width": 862, "var": "mLbDes", "text": "label", "leading": 12, "height": 213, "fontSize": 42, "color": "#ffffff", "centerX": 0, "align": "left" }, "compId": 11 }] }, { "type": "Box", "props": { "width": 120, "var": "mBtnNext", "right": 151, "height": 120, "centerY": 0 }, "compId": 13, "child": [{ "type": "Sprite", "props": { "y": 11, "x": 19, "width": 82, "texture": "common/btnNext.png", "height": 98 }, "compId": 15 }] }, { "type": "Box", "props": { "width": 120, "var": "mBtnPre", "left": 160, "height": 120, "centerY": 0 }, "compId": 14, "child": [{ "type": "Sprite", "props": { "y": 11, "x": 19, "width": 82, "texture": "common/btnPre.png", "height": 98 }, "compId": 16 }] }, { "type": "Box", "props": { "y": 78, "width": 79, "var": "mBtnClose", "right": 106, "height": 89 }, "compId": 17, "child": [{ "type": "Image", "props": { "width": 59, "skin": "common/btnClose.png", "height": 69, "centerY": 0, "centerX": 0 }, "compId": 18 }] }], "loadList": ["common/bgMaskDialog.png", "guide/imgGuide1_1.jpg", "guide/bgDialogGuide.png", "guide/bgItemGuide.png", "common/btnNext.png", "common/btnPre.png", "common/btnClose.png"], "loadList3D": [] };
            game.GuideDialogUI = GuideDialogUI;
            REG("ui.game.GuideDialogUI", GuideDialogUI);
            class LaboratoryDialogUI extends Dialog {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(LaboratoryDialogUI.uiView);
                }
            }
            LaboratoryDialogUI.uiView = { "type": "Dialog", "props": { "width": 1920, "height": 1080 }, "compId": 2, "child": [{ "type": "Image", "props": { "top": 0, "skin": "common/bgMaskDialog.png", "right": 0, "left": 0, "bottom": 0, "sizeGrid": "12,17,14,15" }, "compId": 28 }, { "type": "Box", "props": { "y": -228, "x": 0, "centerX": 0, "bottom": 57 }, "compId": 4, "child": [{ "type": "Image", "props": { "width": 1076, "skin": "common/bgDialogUpgrade.png", "height": 615, "centerY": 34, "centerX": 0 }, "compId": 5, "child": [{ "type": "List", "props": { "y": 334, "width": 724, "var": "mListDesignDiagram", "spaceX": 36, "height": 112, "centerX": 0 }, "compId": 6, "child": [{ "type": "Box", "props": { "width": 116, "renderType": "render", "height": 112 }, "compId": 8, "child": [{ "type": "Image", "props": { "y": 6.5, "x": 8.5, "width": 99, "name": "imgIc", "height": 99 }, "compId": 9 }, { "type": "Image", "props": { "width": 116, "visible": false, "skin": "common/imgUse.png", "name": "imgUse", "height": 112 }, "compId": 24 }, { "type": "Image", "props": { "width": 116, "visible": false, "skin": "common/imgSelect.png", "name": "imgSelect", "height": 112 }, "compId": 26 }] }] }, { "type": "Image", "props": { "y": 94, "x": 71, "width": 933, "skin": "common/bgInfo.png", "height": 202 }, "compId": 10, "child": [{ "type": "Label", "props": { "y": 94, "x": 198, "width": 300, "var": "mLbDesignDiagramName", "text": "label", "fontSize": 36, "color": "#ffffff", "align": "left" }, "compId": 11 }, { "type": "Image", "props": { "y": 24, "x": 28, "width": 158, "skin": "common/bgIc.png", "height": 152 }, "compId": 13 }, { "type": "Image", "props": { "y": 33, "x": 38, "width": 136, "var": "mImgDesignDiagram", "height": 136 }, "compId": 12 }, { "type": "Image", "props": { "y": 114, "x": 722, "width": 160, "var": "mBtnResearch", "skin": "common/bgBtn1.png", "height": 64 }, "compId": 14, "child": [{ "type": "Label", "props": { "y": 20, "x": 7, "width": 150, "var": "mLbBtn", "text": "Research", "fontSize": 34, "color": "#ffffff", "align": "center" }, "compId": 15, "child": [{ "type": "Script", "props": { "key": "refresh", "runtime": "i18n/LocalizedLabel.ts" }, "compId": 30 }] }] }, { "type": "Image", "props": { "y": 141, "x": 180, "width": 430, "skin": "common/bgProgress.png", "height": 35 }, "compId": 20, "child": [{ "type": "Image", "props": { "y": 7, "x": 3, "width": 428, "var": "mNodeProgress", "skin": "common/bgProgressBar.png", "height": 27 }, "compId": 21, "child": [{ "type": "Sprite", "props": { "y": 1, "x": 0, "width": 428, "var": "mMaskProgress", "renderType": "mask", "height": 27 }, "compId": 23 }] }] }] }, { "type": "Box", "props": { "y": 60, "width": 79, "var": "mBtnClose", "right": 48, "height": 89 }, "compId": 16, "child": [{ "type": "Image", "props": { "width": 59, "skin": "common/btnClose.png", "height": 69, "centerY": 0, "centerX": 0 }, "compId": 17 }] }] }, { "type": "Image", "props": { "y": 1, "width": 537, "skin": "common/bgTitle.png", "height": 100, "centerX": 0 }, "compId": 18, "child": [{ "type": "Label", "props": { "y": 29, "text": "LABORATORY", "fontSize": 42, "color": "#ffffff", "centerX": 0 }, "compId": 19, "child": [{ "type": "Script", "props": { "key": "laboratory", "runtime": "i18n/LocalizedLabel.ts" }, "compId": 29 }] }] }] }], "loadList": ["common/bgMaskDialog.png", "common/bgDialogUpgrade.png", "common/imgUse.png", "common/imgSelect.png", "common/bgInfo.png", "common/bgIc.png", "common/bgBtn1.png", "common/bgProgress.png", "common/bgProgressBar.png", "common/btnClose.png", "common/bgTitle.png"], "loadList3D": [] };
            game.LaboratoryDialogUI = LaboratoryDialogUI;
            REG("ui.game.LaboratoryDialogUI", LaboratoryDialogUI);
            class MainViewDialogUI extends Dialog {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(MainViewDialogUI.uiView);
                }
            }
            MainViewDialogUI.uiView = { "type": "Dialog", "props": { "width": 1920, "height": 1080, "drawCallOptimize": true }, "compId": 2, "child": [{ "type": "Box", "props": { "var": "mNodeTouch", "top": 0, "right": 0, "name": "nodeTouch", "left": 0, "bottom": 0 }, "compId": 3 }, { "type": "Image", "props": { "y": -250, "x": 219, "width": 310, "var": "mNodeDurable", "skin": "game/naijiuY01.png", "sizeGrid": "0,256,0,58", "scaleY": 0.6, "scaleX": 0.6, "height": 36, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 112, "child": [{ "type": "Image", "props": { "width": 299, "var": "mNodeMaskDurable", "skin": "game/naijiuY02.png", "sizeGrid": "0,117,0,82", "height": 25, "centerY": 0, "centerX": 0 }, "compId": 113, "child": [{ "type": "Sprite", "props": { "width": 299, "var": "mMaskDurable", "renderType": "mask", "height": 25 }, "compId": 115 }] }] }, { "type": "Image", "props": { "y": 477, "x": 1732, "width": 146, "visible": false, "var": "mBtnRepair", "skin": "game/bgBtnProp.png", "right": 42, "height": 126, "centerY": 0 }, "compId": 122, "child": [{ "type": "Sprite", "props": { "y": 32, "x": 30, "width": 86, "texture": "game/icon_Restore dura.png", "height": 86 }, "compId": 123 }, { "type": "Label", "props": { "y": 94, "width": 160, "var": "mLbRepairPrice", "text": "$20000", "height": 48, "fontSize": 48, "color": "#ffffff", "centerX": 0, "align": "center" }, "compId": 126 }] }, { "type": "Image", "props": { "width": 105, "var": "mBtnSetting", "top": 90, "skin": "game/btnSetting.png", "right": 42, "height": 101 }, "compId": 127 }, { "type": "Image", "props": { "width": 105, "visible": false, "var": "mBtnRule", "top": 90, "skin": "game/btnRule.png", "right": 187, "height": 101 }, "compId": 128 }, { "type": "Image", "props": { "y": 292, "width": 470, "skin": "common/bgValue.png", "left": 46, "height": 27 }, "compId": 138, "child": [{ "type": "Label", "props": { "y": -29, "x": 13, "width": 430, "var": "mLbAccount", "text": "labellabellabellabellabel", "overflow": "hidden", "height": 48, "fontSize": 48, "color": "#ffffff", "align": "left" }, "compId": 140 }] }, { "type": "Image", "props": { "width": 105, "visible": false, "var": "mBtnPvp", "top": 90, "skin": "game/btnPvp.png", "right": 332, "height": 101 }, "compId": 129 }, { "type": "Box", "props": { "visible": false, "var": "mNodeModelNormal", "top": 0, "right": 0, "mouseThrough": true, "left": 0, "bottom": 0 }, "compId": 32, "child": [{ "type": "Image", "props": { "y": 142, "width": 728, "var": "mNodeGameProgress", "skin": "game/bgPbIsland.png", "height": 36, "centerX": 0 }, "compId": 7, "child": [{ "type": "Image", "props": { "width": 716, "var": "mNodeIslandProgress", "skin": "game/bgPbIslandBar.png", "height": 25, "centerY": 0, "centerX": 0 }, "compId": 6, "child": [{ "type": "Sprite", "props": { "width": 716, "var": "mMaskIslandProgress", "renderType": "mask", "height": 25 }, "compId": 20 }] }] }, { "type": "Image", "props": { "width": 43, "var": "mImgContinerStatus", "skin": "game/imgStoneUnfull.png", "left": 22, "height": 39, "centerY": -180 }, "compId": 17 }, { "type": "Image", "props": { "width": 35, "skin": "game/bgPbCapacity.png", "left": 26, "height": 430, "centerY": 57 }, "compId": 18, "child": [{ "type": "Image", "props": { "width": 24, "var": "mNodeContinerProgress", "skin": "game/bgPbCapacityBar.png", "rotation": 180, "pivotY": 0.5, "pivotX": 0.5, "height": 421, "centerY": 420, "centerX": 23 }, "compId": 19, "child": [{ "type": "Sprite", "props": { "y": 1, "x": 0, "width": 24, "var": "mMaskContinerProgress", "rotation": 0, "renderType": "mask", "height": 421 }, "compId": 24 }] }, { "type": "Label", "props": { "width": 421, "var": "mLbContinerProgress", "valign": "middle", "text": "0/100", "strokeColor": "#000000", "stroke": 1, "rotation": -90, "height": 24, "fontSize": 18, "color": "#ffffff", "centerY": 226, "centerX": 199, "align": "center" }, "compId": 25 }] }, { "type": "VBox", "props": { "width": 146, "var": "mNodeProps", "space": 34, "right": 42, "centerY": 0 }, "compId": 64, "child": [{ "type": "Image", "props": { "x": 0, "width": 146, "var": "mBtnPropPower", "skin": "game/bgBtnProp.png", "height": 126 }, "compId": 36, "child": [{ "type": "Sprite", "props": { "y": 32, "x": 30, "width": 86, "texture": "common/icPropPower.png", "height": 86 }, "compId": 62 }, { "type": "Sprite", "props": { "y": 0, "x": 0, "width": 146, "visible": false, "var": "mNodeMaskPropPower", "texture": "game/bgBtnPropMask.png", "height": 126 }, "compId": 61, "child": [{ "type": "Sprite", "props": { "y": 0, "x": 0, "width": 146, "var": "mMaskPropPower", "renderType": "mask", "height": 126 }, "compId": 81 }] }, { "type": "Label", "props": { "y": 81, "x": 89, "width": 60, "var": "mLbPropPower", "text": "1", "fontSize": 48, "color": "#ffffff", "align": "center" }, "compId": 63 }] }, { "type": "Image", "props": { "width": 146, "var": "mBtnPropRoller", "skin": "game/bgBtnProp.png", "height": 126 }, "compId": 65, "child": [{ "type": "Sprite", "props": { "y": 32, "x": 30, "width": 86, "texture": "common/icPropRoller.png", "height": 86 }, "compId": 66 }, { "type": "Sprite", "props": { "y": 0, "x": 0, "width": 146, "visible": false, "var": "mNodeMaskPropRoller", "texture": "game/bgBtnPropMask.png", "height": 126 }, "compId": 67, "child": [{ "type": "Sprite", "props": { "y": 0, "x": 0, "width": 146, "var": "mMaskPropRoller", "renderType": "mask", "height": 126 }, "compId": 80 }] }, { "type": "Label", "props": { "y": 81, "x": 89, "width": 60, "var": "mLbPropRoller", "text": "1", "fontSize": 48, "color": "#ffffff", "align": "center" }, "compId": 68 }] }, { "type": "Image", "props": { "width": 146, "var": "mBtnPropCapacity", "skin": "game/bgBtnProp.png", "height": 126 }, "compId": 69, "child": [{ "type": "Sprite", "props": { "y": 32, "x": 30, "width": 86, "texture": "common/icCapaticy.png", "height": 86 }, "compId": 70 }, { "type": "Sprite", "props": { "y": 0, "x": 0, "width": 146, "visible": false, "var": "mNodeMaskPropCapacity", "texture": "game/bgBtnPropMask.png", "height": 126 }, "compId": 71, "child": [{ "type": "Sprite", "props": { "y": 0, "x": 0, "width": 146, "var": "mMaskPropCapacity", "renderType": "mask", "height": 126 }, "compId": 79 }] }, { "type": "Label", "props": { "y": 81, "x": 89, "width": 60, "var": "mLbPropCapacity", "text": "1", "fontSize": 48, "color": "#ffffff", "align": "center" }, "compId": 72 }] }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 146, "var": "mBtnPropExplosive", "skin": "game/bgBtnProp.png", "height": 126 }, "compId": 73, "child": [{ "type": "Sprite", "props": { "y": 32, "x": 30, "width": 86, "texture": "common/icExplosive.png", "height": 86 }, "compId": 74 }, { "type": "Sprite", "props": { "y": 0, "x": 0, "width": 146, "visible": false, "var": "mNodeMaskPropExplosive", "texture": "game/bgBtnPropMask.png", "height": 126 }, "compId": 75, "child": [{ "type": "Sprite", "props": { "width": 146, "var": "mMaskPropExplosive", "renderType": "mask", "height": 126 }, "compId": 78 }] }, { "type": "Label", "props": { "y": 81, "x": 89, "width": 60, "var": "mLbPropExplosive", "text": "1", "fontSize": 48, "color": "#ffffff", "align": "center" }, "compId": 76 }] }] }] }, { "type": "Box", "props": { "visible": false, "var": "mNodeModelProspecting", "top": 0, "right": 0, "mouseThrough": true, "left": 0, "bottom": 0 }, "compId": 49, "child": [{ "type": "Image", "props": { "y": 87, "skin": "game/bgTimer.png", "centerX": 0 }, "compId": 83, "child": [{ "type": "Label", "props": { "y": 74, "x": 71, "width": 110, "var": "mLbProspectingTimer", "valign": "middle", "text": "120", "height": 80, "fontSize": 60, "color": "#ffffff", "centerY": 0, "centerX": 0, "anchorY": 0.5, "anchorX": 0.5, "align": "center" }, "compId": 84 }] }, { "type": "VBox", "props": { "y": 0, "x": 0, "width": 146, "var": "mNodePropsCrystal", "space": 34, "right": 42, "centerY": 0 }, "compId": 85, "child": [{ "type": "Image", "props": { "x": 0, "width": 146, "var": "mBtnCatchCrystal", "skin": "game/bgBtnProp.png", "height": 126 }, "compId": 86, "child": [{ "type": "Sprite", "props": { "y": 32, "x": 30, "width": 86, "texture": "game/icMining.png", "height": 86 }, "compId": 87 }, { "type": "Sprite", "props": { "y": 0, "x": 0, "width": 146, "visible": false, "var": "mNodeMaskCatchCrystal", "texture": "game/bgBtnPropMask.png", "height": 126 }, "compId": 88, "child": [{ "type": "Sprite", "props": { "y": 0, "x": 0, "width": 146, "var": "mMaskCatchCrystal", "renderType": "mask", "height": 126 }, "compId": 89 }] }] }, { "type": "Image", "props": { "width": 146, "var": "mBtnSurveyCrystal", "skin": "game/bgBtnProp.png", "height": 126 }, "compId": 91, "child": [{ "type": "Sprite", "props": { "y": 32, "x": 30, "width": 86, "texture": "common/icPropExploration.png", "height": 86 }, "compId": 92 }, { "type": "Sprite", "props": { "y": 0, "x": 0, "width": 146, "visible": false, "var": "mNodeMaskPropSurvey", "texture": "game/bgBtnPropMask.png", "height": 126 }, "compId": 93, "child": [{ "type": "Sprite", "props": { "y": 0, "x": 0, "width": 146, "var": "mMaskPropSurvey", "renderType": "mask", "height": 126 }, "compId": 94 }] }, { "type": "Label", "props": { "y": 81, "x": 89, "width": 60, "var": "mLbSurveyCrystal", "text": "1", "fontSize": 48, "color": "#ffffff", "align": "center" }, "compId": 95 }] }] }] }, { "type": "Box", "props": { "y": 0, "x": 0, "visible": false, "var": "mNodeStartTip", "top": 0, "right": 0, "mouseThrough": false, "left": 0, "bottom": 0 }, "compId": 26, "child": [{ "type": "Image", "props": { "x": 436, "width": 1048, "skin": "game/bgControlTip.png", "height": 387, "centerY": 0, "centerX": 0 }, "compId": 31, "child": [{ "type": "Label", "props": { "wordWrap": true, "width": 910, "var": "mLbStartTip", "valign": "middle", "text": "Follow the arrow to guide the mining!\\n Start the slide game.", "leading": 50, "height": 270, "fontSize": 48, "font": "Arial", "color": "#ffffff", "centerY": 3, "centerX": 0, "align": "center" }, "compId": 56, "child": [{ "type": "Script", "props": { "runtime": "i18n/LocalizedLabel.ts" }, "compId": 133 }] }] }, { "type": "Image", "props": { "y": 664, "width": 338, "skin": "game/imgTrack.png", "height": 170, "centerX": 0 }, "compId": 28, "child": [{ "type": "Image", "props": { "y": 23, "x": 85, "width": 77, "skin": "game/imgFinger.png", "runtime": "game/ui/FingerView.ts", "pivotX": 31, "height": 96 }, "compId": 29 }] }] }], "animations": [{ "nodes": [{ "target": 29, "keyframes": { "y": [{ "value": 18, "tweenMethod": "linearNone", "tween": true, "target": 29, "key": "y", "index": 0 }, { "value": 22, "tweenMethod": "linearNone", "tween": true, "target": 29, "key": "y", "index": 3 }, { "value": 101, "tweenMethod": "linearNone", "tween": true, "target": 29, "key": "y", "index": 21 }, { "value": 48, "tweenMethod": "linearNone", "tween": true, "target": 29, "key": "y", "index": 34 }], "x": [{ "value": 50, "tweenMethod": "linearNone", "tween": true, "target": 29, "key": "x", "index": 0 }, { "value": 27, "tweenMethod": "linearNone", "tween": true, "target": 29, "key": "x", "index": 5 }, { "value": -8, "tweenMethod": "linearNone", "tween": false, "target": 29, "key": "x", "index": 21 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 29, "key": "x", "index": 34 }] } }], "name": "ani1", "id": 1, "frameRate": 24, "action": 0 }], "loadList": ["game/naijiuY01.png", "game/naijiuY02.png", "game/bgBtnProp.png", "game/icon_Restore dura.png", "game/btnSetting.png", "game/btnRule.png", "common/bgValue.png", "game/btnPvp.png", "game/bgPbIsland.png", "game/bgPbIslandBar.png", "game/imgStoneUnfull.png", "game/bgPbCapacity.png", "game/bgPbCapacityBar.png", "common/icPropPower.png", "game/bgBtnPropMask.png", "common/icPropRoller.png", "common/icCapaticy.png", "common/icExplosive.png", "game/bgTimer.png", "game/icMining.png", "common/icPropExploration.png", "game/bgControlTip.png", "game/imgTrack.png", "game/imgFinger.png"], "loadList3D": [] };
            game.MainViewDialogUI = MainViewDialogUI;
            REG("ui.game.MainViewDialogUI", MainViewDialogUI);
            class MapDialogUI extends Dialog {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(MapDialogUI.uiView);
                }
            }
            MapDialogUI.uiView = { "type": "Dialog", "props": { "width": 1920, "height": 1080 }, "compId": 2, "child": [{ "type": "Image", "props": { "top": 0, "skin": "common/bgMaskDialog.png", "right": 0, "left": 0, "bottom": 0, "sizeGrid": "12,17,14,15" }, "compId": 163 }, { "type": "Box", "props": { "var": "mNodeContent", "top": 0, "right": 0, "left": 0, "bottom": 0 }, "compId": 164, "child": [{ "type": "Image", "props": { "width": 696, "var": "mImgCur", "height": 459, "centerY": 0, "centerX": 0 }, "compId": 165, "child": [{ "type": "Image", "props": { "var": "mImgLockCur", "skin": "map/imgLock.png", "centerY": 0, "centerX": 0 }, "compId": 177 }] }, { "type": "Image", "props": { "width": 696, "var": "mImgNext", "scaleY": 0.5, "scaleX": 0.5, "height": 459, "centerY": 0, "centerX": 666 }, "compId": 171, "child": [{ "type": "Image", "props": { "var": "mImgLockNext", "skin": "map/imgLock.png", "centerY": 0, "centerX": 0 }, "compId": 178 }] }, { "type": "Image", "props": { "y": 425, "width": 696, "var": "mImgPre", "scaleY": 0.5, "scaleX": 0.5, "height": 459, "centerY": 0, "centerX": -666 }, "compId": 172, "child": [{ "type": "Image", "props": { "var": "mImgLockPre", "skin": "map/imgLock.png", "centerY": 0, "centerX": 0 }, "compId": 179 }] }, { "type": "Box", "props": { "width": 120, "var": "mBtnNext", "height": 120, "centerY": 314, "centerX": 500 }, "compId": 167, "child": [{ "type": "Sprite", "props": { "y": 11, "x": 19, "width": 82, "texture": "common/btnNext.png", "height": 98 }, "compId": 166 }] }, { "type": "Box", "props": { "y": 0, "width": 120, "var": "mBtnPre", "height": 120, "centerY": 314, "centerX": -500 }, "compId": 168, "child": [{ "type": "Sprite", "props": { "y": 11, "x": 19, "width": 82, "texture": "common/btnPre.png", "height": 98 }, "compId": 169 }] }, { "type": "Image", "props": { "visible": false, "var": "mBtnDelivery", "skin": "common/bgBtn2.png", "centerY": 313, "centerX": 0 }, "compId": 173, "child": [{ "type": "Label", "props": { "y": 35.5, "x": 120.95703125, "text": "Send", "fontSize": 48, "color": "#ffffff" }, "compId": 174, "child": [{ "type": "Script", "props": { "key": "send", "runtime": "i18n/LocalizedLabel.ts" }, "compId": 193 }] }] }, { "type": "Box", "props": { "y": 106, "width": 79, "var": "mBtnClose", "right": 78, "height": 89 }, "compId": 175, "child": [{ "type": "Image", "props": { "width": 59, "skin": "common/btnClose.png", "height": 69, "centerY": 0, "centerX": 0 }, "compId": 176 }] }, { "type": "Box", "props": { "y": 840.5, "visible": false, "var": "mNodeLockInfo", "centerX": 0 }, "compId": 180, "child": [{ "type": "Image", "props": { "width": 470, "skin": "common/bgValue.png", "height": 27 }, "compId": 181, "child": [{ "type": "Image", "props": { "y": -39, "x": -10, "width": 82, "skin": "common/icGold.png", "name": "", "height": 82 }, "compId": 182 }, { "type": "Label", "props": { "y": -24, "x": 72, "width": 169, "var": "mLbUnlockGoldValue", "text": "999999", "name": "", "height": 48, "fontSize": 48, "color": "#ffffff" }, "compId": 183 }, { "type": "Image", "props": { "y": -47, "x": 248, "width": 82, "skin": "common/icCrystal.png", "name": "", "height": 82 }, "compId": 184 }, { "type": "Label", "props": { "y": -24, "x": 328, "width": 119, "var": "mLbUnlockCrystalValue", "text": "2000", "name": "", "height": 48, "fontSize": 48, "color": "#ffffff" }, "compId": 185 }] }] }, { "type": "Image", "props": { "y": 968, "width": 470, "skin": "common/bgValue.png", "height": 27, "centerX": 0 }, "compId": 186, "child": [{ "type": "Image", "props": { "y": -50, "x": 9, "width": 28, "skin": "common/icResources.png", "height": 100 }, "compId": 191 }, { "type": "Label", "props": { "y": -24, "x": 50, "width": 400, "var": "mLbRemainingResources", "text": "10000/10000", "name": "", "height": 48, "fontSize": 48, "color": "#ffffff" }, "compId": 192 }] }] }], "loadList": ["common/bgMaskDialog.png", "map/imgLock.png", "common/btnNext.png", "common/btnPre.png", "common/bgBtn2.png", "common/btnClose.png", "common/bgValue.png", "common/icGold.png", "common/icCrystal.png", "common/icResources.png"], "loadList3D": [] };
            game.MapDialogUI = MapDialogUI;
            REG("ui.game.MapDialogUI", MapDialogUI);
            class NextChildLoadingDialogUI extends Dialog {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(NextChildLoadingDialogUI.uiView);
                }
            }
            NextChildLoadingDialogUI.uiView = { "type": "Dialog", "props": { "width": 1920, "height": 1080 }, "compId": 2, "child": [{ "type": "Image", "props": { "var": "mImg", "top": 0, "skin": "game/bgLoadingIsland.jpg", "right": 0, "left": 0, "bottom": 0, "alpha": 0, "sizeGrid": "16,18,12,13" }, "compId": 3 }], "loadList": ["game/bgLoadingIsland.jpg"], "loadList3D": [] };
            game.NextChildLoadingDialogUI = NextChildLoadingDialogUI;
            REG("ui.game.NextChildLoadingDialogUI", NextChildLoadingDialogUI);
            class PvpDialogUI extends Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("game/PvpDialog");
                }
            }
            game.PvpDialogUI = PvpDialogUI;
            REG("ui.game.PvpDialogUI", PvpDialogUI);
            class RockerViewUI extends View {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(RockerViewUI.uiView);
                }
            }
            RockerViewUI.uiView = { "type": "View", "props": { "width": 176, "height": 176, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 88, "x": 88, "width": 176, "var": "mRocker", "height": 176, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 5, "child": [{ "type": "Sprite", "props": { "width": 170, "texture": "game/bgRocker.png", "height": 170 }, "compId": 3 }, { "type": "Image", "props": { "var": "mImgPoint", "skin": "game/rockerPoint.png", "centerY": 0, "centerX": 0, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 4 }] }], "loadList": ["game/bgRocker.png", "game/rockerPoint.png"], "loadList3D": [] };
            game.RockerViewUI = RockerViewUI;
            REG("ui.game.RockerViewUI", RockerViewUI);
            class SettingDialogUI extends Dialog {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(SettingDialogUI.uiView);
                }
            }
            SettingDialogUI.uiView = { "type": "Dialog", "props": { "width": 1920, "height": 1080 }, "compId": 2, "child": [{ "type": "Box", "props": { "centerY": 0, "centerX": 0 }, "compId": 3, "child": [{ "type": "Image", "props": { "y": 64, "width": 1076, "skin": "common/bgDialogUpgrade.png", "height": 615, "centerX": 1 }, "compId": 4, "child": [{ "type": "Box", "props": { "y": 60, "width": 79, "var": "mBtnClose", "right": 48, "height": 89 }, "compId": 20, "child": [{ "type": "Image", "props": { "width": 59, "skin": "common/btnClose.png", "height": 69, "centerY": 0, "centerX": 0 }, "compId": 21 }] }, { "type": "VBox", "props": { "y": 307, "space": 50, "centerX": 25, "anchorY": 0.5 }, "compId": 23, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "width": 772, "height": 84 }, "compId": 28, "child": [{ "type": "Label", "props": { "x": 0, "text": "MUSIC", "fontSize": 48, "color": "#ffffff", "centerY": 0 }, "compId": 27, "child": [{ "type": "Script", "props": { "key": "music", "runtime": "i18n/LocalizedLabel.ts" }, "compId": 45 }] }, { "type": "Image", "props": { "y": 0, "x": 358, "width": 413, "var": "mBtnMusic", "skin": "game/bgSwitch.png", "height": 84 }, "compId": 24, "child": [{ "type": "Image", "props": { "y": 4, "x": 0, "width": 214, "visible": false, "skin": "game/switchBar.png", "height": 86, "gray": true }, "compId": 25 }, { "type": "Image", "props": { "y": 4, "x": 199, "width": 214, "visible": false, "skin": "game/switchBar.png", "height": 86 }, "compId": 26 }] }] }, { "type": "Box", "props": { "y": 0, "x": 0, "width": 772, "height": 84 }, "compId": 34, "child": [{ "type": "Label", "props": { "x": 0, "text": "SOUND", "fontSize": 48, "color": "#ffffff", "centerY": 0 }, "compId": 35, "child": [{ "type": "Script", "props": { "key": "sound", "runtime": "i18n/LocalizedLabel.ts" }, "compId": 46 }] }, { "type": "Image", "props": { "y": 0, "x": 358, "width": 413, "var": "mBtnSound", "skin": "game/bgSwitch.png", "height": 84 }, "compId": 36, "child": [{ "type": "Image", "props": { "y": 4, "x": 0, "width": 214, "visible": false, "skin": "game/switchBar.png", "height": 86, "gray": true }, "compId": 37 }, { "type": "Image", "props": { "y": 4, "x": 199, "width": 214, "visible": false, "skin": "game/switchBar.png", "height": 86 }, "compId": 38 }] }] }, { "type": "Box", "props": { "y": 0, "x": 0, "width": 772, "visible": false, "var": "mNodeVibrate", "height": 84 }, "compId": 39, "child": [{ "type": "Label", "props": { "x": 0, "text": "VIBRATE", "fontSize": 48, "color": "#ffffff", "centerY": 0 }, "compId": 40, "child": [{ "type": "Script", "props": { "key": "vibrate", "runtime": "i18n/LocalizedLabel.ts" }, "compId": 47 }] }, { "type": "Image", "props": { "y": 0, "x": 358, "width": 413, "var": "mBtnVibrate", "skin": "game/bgSwitch.png", "height": 84 }, "compId": 41, "child": [{ "type": "Image", "props": { "y": 4, "x": 0, "width": 214, "visible": false, "skin": "game/switchBar.png", "height": 86, "gray": true }, "compId": 42 }, { "type": "Image", "props": { "y": 4, "x": 199, "width": 214, "visible": false, "skin": "game/switchBar.png", "height": 86 }, "compId": 43 }] }] }] }] }, { "type": "Image", "props": { "y": 1, "x": 0, "width": 537, "skin": "common/bgTitle.png", "height": 100, "centerX": 0 }, "compId": 5, "child": [{ "type": "Label", "props": { "y": 29, "text": "SETTING", "fontSize": 42, "color": "#ffffff", "centerX": 0 }, "compId": 22, "child": [{ "type": "Script", "props": { "key": "setting", "runtime": "i18n/LocalizedLabel.ts" }, "compId": 48 }] }] }] }, { "type": "Script", "props": { "key": "setting", "runtime": "i18n/LocalizedLabel.ts" }, "compId": 44 }], "loadList": ["common/bgDialogUpgrade.png", "common/btnClose.png", "game/bgSwitch.png", "game/switchBar.png", "common/bgTitle.png"], "loadList3D": [] };
            game.SettingDialogUI = SettingDialogUI;
            REG("ui.game.SettingDialogUI", SettingDialogUI);
            class ToastViewUI extends View {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(ToastViewUI.uiView);
                }
            }
            ToastViewUI.uiView = { "type": "View", "props": { "width": 600, "mouseThrough": true, "mouseEnabled": false, "height": 200 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 600, "skin": "common/bgToast.png", "sizeGrid": "0,174,0,325", "mouseThrough": true, "mouseEnabled": false, "height": 200 }, "compId": 3, "child": [{ "type": "Label", "props": { "var": "mLbContent", "fontSize": 46, "color": "#ffffff", "centerY": 4, "centerX": 0 }, "compId": 4 }] }], "loadList": ["common/bgToast.png"], "loadList3D": [] };
            game.ToastViewUI = ToastViewUI;
            REG("ui.game.ToastViewUI", ToastViewUI);
            class UpgradeDialogUI extends Dialog {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(UpgradeDialogUI.uiView);
                }
            }
            UpgradeDialogUI.uiView = { "type": "Dialog", "props": { "width": 1920, "height": 1080 }, "compId": 2, "child": [{ "type": "Box", "props": { "centerX": 0, "bottom": 57 }, "compId": 6, "child": [{ "type": "Image", "props": { "width": 1076, "skin": "common/bgDialogUpgrade.png", "height": 615, "centerY": 34, "centerX": 0 }, "compId": 4, "child": [{ "type": "List", "props": { "y": 147, "width": 780, "var": "mListUpgradeRoller", "spaceY": 36, "height": 330, "centerX": 0 }, "compId": 10, "child": [{ "type": "VScrollBar", "props": { "y": 29, "x": 859, "width": 11, "skin": "common/vscroll.png", "name": "scrollBar", "height": 254 }, "compId": 105 }, { "type": "Box", "props": { "width": 780, "renderType": "render", "height": 136 }, "compId": 11, "child": [{ "type": "Image", "props": { "y": 62, "x": 128, "width": 643, "skin": "upgrade/bgProgress.png", "height": 46 }, "compId": 102 }, { "type": "Image", "props": { "y": 13, "x": 123, "skin": "upgrade/bgUpgradePrice.png", "name": "btnUpgrade" }, "compId": 101, "child": [{ "type": "Label", "props": { "y": 16.5, "x": 14, "width": 210, "text": "BUY $1230", "name": "lbPrice", "fontSize": 37, "color": "#ffffff", "align": "center" }, "compId": 41 }] }, { "type": "Image", "props": { "width": 141, "skin": "upgrade/bgUpgrageIcon.png", "height": 136 }, "compId": 100 }, { "type": "Image", "props": { "y": 26, "x": 27, "width": 86, "name": "imgIc", "height": 86 }, "compId": 12 }, { "type": "Label", "props": { "y": 26, "x": 363, "width": 450, "text": "dd a circle of spikes", "name": "lbTitle", "fontSize": 36, "color": "#ffffff", "align": "left" }, "compId": 13 }, { "type": "Image", "props": { "y": 62, "x": 143, "width": 612, "skin": "upgrade/bgPbUpgrade.png", "name": "bgPb", "height": 46 }, "compId": 14, "child": [{ "type": "Image", "props": { "width": 612, "skin": "upgrade/bgPbUpgradeBar.png", "name": "pbBar", "height": 46 }, "compId": 15, "child": [{ "type": "Sprite", "props": { "y": 0, "x": 0, "width": 612, "renderType": "mask", "height": 46 }, "compId": 96 }] }] }] }] }, { "type": "Box", "props": { "y": 59, "width": 79, "var": "mBtnClose", "right": 48, "height": 89 }, "compId": 7, "child": [{ "type": "Image", "props": { "width": 59, "skin": "common/btnClose.png", "height": 69, "centerY": 0, "centerX": 0 }, "compId": 5 }] }] }, { "type": "Image", "props": { "width": 537, "skin": "common/bgTitle.png", "height": 100, "centerX": 0 }, "compId": 103, "child": [{ "type": "Label", "props": { "y": 36, "text": "UPGRADE", "fontSize": 42, "color": "#ffffff", "centerX": 0 }, "compId": 104, "child": [{ "type": "Script", "props": { "key": "upgrade", "runtime": "i18n/LocalizedLabel.ts" }, "compId": 107 }] }] }] }, { "type": "Script", "props": { "key": "upgrade", "runtime": "i18n/LocalizedLabel.ts" }, "compId": 106 }], "loadList": ["common/bgDialogUpgrade.png", "common/vscroll.png", "upgrade/bgProgress.png", "upgrade/bgUpgradePrice.png", "upgrade/bgUpgrageIcon.png", "upgrade/bgPbUpgrade.png", "upgrade/bgPbUpgradeBar.png", "common/btnClose.png", "common/bgTitle.png"], "loadList3D": [] };
            game.UpgradeDialogUI = UpgradeDialogUI;
            REG("ui.game.UpgradeDialogUI", UpgradeDialogUI);
        })(game = ui.game || (ui.game = {}));
    })(ui || (ui = {}));
    (function (ui) {
        var laoding;
        (function (laoding) {
            class LoadingDIalogUI extends Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("laoding/LoadingDIalog");
                }
            }
            laoding.LoadingDIalogUI = LoadingDIalogUI;
            REG("ui.laoding.LoadingDIalogUI", LoadingDIalogUI);
            class LoadingResDialogUI extends Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("laoding/LoadingResDialog");
                }
            }
            laoding.LoadingResDialogUI = LoadingResDialogUI;
            REG("ui.laoding.LoadingResDialogUI", LoadingResDialogUI);
        })(laoding = ui.laoding || (ui.laoding = {}));
    })(ui || (ui = {}));
    (function (ui) {
        var test;
        (function (test) {
            class TestSceneUI extends Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("test/TestScene");
                }
            }
            test.TestSceneUI = TestSceneUI;
            REG("ui.test.TestSceneUI", TestSceneUI);
        })(test = ui.test || (ui.test = {}));
    })(ui || (ui = {}));

    class GameUI extends ui.test.TestSceneUI {
        constructor() {
            super();
            var scene = Laya.stage.addChild(new Laya.Scene3D());
            var camera = (scene.addChild(new Laya.Camera(0, 0.1, 100)));
            camera.transform.translate(new Laya.Vector3(0, 3, 3));
            camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
            var directionLight = scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
            directionLight.transform.worldMatrix.setForward(new Laya.Vector3(1, -1, 0));
            var box = scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1)));
            box.transform.rotate(new Laya.Vector3(0, 45, 0), false, false);
            var material = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load("res/layabox.png", Laya.Handler.create(null, function (tex) {
                material.albedoTexture = tex;
            }));
            box.meshRenderer.material = material;
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("i18n/LocalizedLabel.ts", LocalizedLabel);
            reg("game/ui/FingerView.ts", FingerView);
            reg("script/GameUI.ts", GameUI);
        }
    }
    GameConfig.width = 1920;
    GameConfig.height = 1080;
    GameConfig.scaleMode = "fixedheight";
    GameConfig.screenMode = "horizontal";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "game/CommonTipDialog.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class BaseHttpRequestData {
        get(url, data, completeHandler, errorHandler) {
            var xhr = new Laya.HttpRequest();
            xhr.http.timeout = 30000;
            xhr.once(Laya.Event.COMPLETE, this, (data) => {
            });
            xhr.once(Laya.Event.ERROR, this, errorHandler);
            xhr.send(url, data, "get", "json");
        }
        post(url, data, completeHandler, errorHandler) {
            var xhr = new Laya.HttpRequest();
            xhr.http.timeout = 30000;
            xhr.once(Laya.Event.COMPLETE, this, (data) => {
            });
            xhr.once(Laya.Event.ERROR, this, errorHandler);
            xhr.send(url, data, "post", "json");
        }
    }

    class HttpRequestData extends BaseHttpRequestData {
        login(callback) {
        }
    }

    class UserManager {
        static get instance() {
            if (!this.mInstance) {
                this.mInstance = new UserManager();
            }
            return this.mInstance;
        }
        setUserData(data) {
        }
    }

    class TestRequestData extends BaseHttpRequestData {
        login(callback) {
            UserManager.instance.setUserData({});
            callback();
        }
    }

    class HttpManager {
        constructor() {
            this.mIsTest = true;
        }
        static get instance() {
            if (!this.mInstance) {
                this.mInstance = new HttpManager();
            }
            return this.mInstance;
        }
        get request() {
            return this.mRequest;
        }
        init() {
            if (this.mIsTest) {
                this.mRequest = new TestRequestData();
            }
            else {
                this.mRequest = new HttpRequestData();
            }
        }
        get isTest() {
            return this.mIsTest;
        }
    }

    class MyGameConfig {
    }
    MyGameConfig.BASE_URL = HttpManager.instance.isTest ? "" : "";
    MyGameConfig.URL_RES2D = MyGameConfig.BASE_URL + "res2d/";
    MyGameConfig.URL_RES3D = MyGameConfig.BASE_URL + "res3d/";
    MyGameConfig.URL_RES3D_MAIN = MyGameConfig.BASE_URL + "res3d/LayaScene_MainScene/Conventional/";
    MyGameConfig.URL_RES3D_FIRST = MyGameConfig.BASE_URL + "res3d/LayaScene_FirstScene/Conventional/";
    MyGameConfig.URL_RES3D_OTHER = MyGameConfig.BASE_URL + "res3d/LayaScene_OtherScene/Conventional/";
    MyGameConfig.URL_RES3D_ISLAND = MyGameConfig.BASE_URL + "res3d/LayaScene_IslandScene/Conventional/";
    MyGameConfig.URL_RES3D_STONE = MyGameConfig.BASE_URL + "res3d/LayaScene_StoneScene/Conventional/";
    MyGameConfig.URL_RES3D_ROLE = MyGameConfig.BASE_URL + "res3d/LayaScene_RoleScene/Conventional/";
    MyGameConfig.URL_RES3D_SKY = MyGameConfig.BASE_URL + "res3d/LayaScene_SkyScene/Conventional/";
    MyGameConfig.URL_CONFIG = MyGameConfig.BASE_URL + "res2d/config/";
    MyGameConfig.URL_SOUNDS = MyGameConfig.BASE_URL + "res2d/sounds/";
    MyGameConfig.URL_GUIDE = MyGameConfig.BASE_URL + "res2d/guide/";
    MyGameConfig.URL_MAP = MyGameConfig.BASE_URL + "res2d/map/";
    MyGameConfig.PROPERTY_CAR_SPEED = 1;
    MyGameConfig.PROPERTY_CAR_CAPACITY = 2;
    MyGameConfig.PROPERTY_CAR_REPAIR = 3;
    MyGameConfig.PROPERTY_CAR_SPIKE_CIRCLE_NUM = 4;
    MyGameConfig.PROPERTY_CAR_SPIKE_NUM = 5;
    MyGameConfig.PROPERTY_CAR_SPIKE_SIZE = 6;
    MyGameConfig.PROPERTY_CAR_ROLLER_SIZE = 7;
    MyGameConfig.PLAY_MODEL_NORMAL = 1;
    MyGameConfig.PLAY_MODEL_PROSPECTING = 2;
    MyGameConfig.PLAY_MODEL_PVP = 3;
    MyGameConfig.carConfig = {};
    MyGameConfig.factoryGoodsConfig = {};
    MyGameConfig.stoneConfig = {};
    MyGameConfig.FUNCTION_ID_SELL = 1;
    MyGameConfig.FUNCTION_ID_REPAIR_STATION = 2;
    MyGameConfig.FUNCTION_ID_LABORATORY = 3;
    MyGameConfig.FUNCTION_ID_FACTORY = 4;
    MyGameConfig.FUNCTION_ID_UPGRADE = 121212;
    MyGameConfig.FUNCTION_ID_TANK_SHOP = 5;
    MyGameConfig.FUNCTION_ID_TRACTOR = 7;
    MyGameConfig.FUNCTION_ID_MAP = 8;
    MyGameConfig.STATE_INVALID = -1;
    MyGameConfig.STATE_SELL = 1;
    MyGameConfig.STATE_REPAIR = 2;
    MyGameConfig.STATE_LABORATORY = 3;
    MyGameConfig.STATE_FACTORY = 4;
    MyGameConfig.STATE_TANK_SHOP = 5;
    MyGameConfig.STATE_UPGRADE = 6;
    MyGameConfig.STATE_HAUL = 7;
    MyGameConfig.STATE_MAP = 8;
    MyGameConfig.STATE_REPAIR_FACTORY = 9;
    MyGameConfig.STATE_HAUL_PVP = 10;
    MyGameConfig.REWARD_TYPE_GOLD = 1;
    MyGameConfig.REWARD_TYPE_CRYSTAL = 2;
    MyGameConfig.POSITION_SCALE = 100;
    MyGameConfig.RADIUS = 0.82;
    MyGameConfig.MAX_TIMER = 40;
    MyGameConfig.CONTAINER_STONE_SCALE = 0.7;
    MyGameConfig.SHIP_MOVE_SPEED = 0.01;
    MyGameConfig.SKY_ROTATE_SPEED = 0.00002;
    MyGameConfig.EVENT_REFRESH_PRODUCT = "0";
    MyGameConfig.EVENT_GO_NEXT_ISLAND = "1";
    MyGameConfig.EVENT_TO_NEXT_ISLAND = "2";
    MyGameConfig.EVENT_REFRESH_GOLD_VIEW = "3";
    MyGameConfig.EVENT_REFRESH_PROPS_VIEW = "4";
    MyGameConfig.EVENT_SHOW_SELL = "5";
    MyGameConfig.EVENT_START = "6";
    MyGameConfig.EVENT_UPGRADE_TRUCK = "7";
    MyGameConfig.EVENT_SHOW_FULL_TIP = "8";
    MyGameConfig.EVENT_SHOW_MAP_TIP = "9";
    MyGameConfig.EVENT_PROPS_EFFECT = "10";
    MyGameConfig.EVENT_CATCH_PROPS = "11";
    MyGameConfig.EVENT_REFRESH_MAIN_VIEW_DIALOG = "12";
    MyGameConfig.EVENT_REPAIR = "13";
    MyGameConfig.EVENT_LEAVE_REPAIR_FACTORY = "14";
    MyGameConfig.EVENT_PROSPECTING_TIMER_PAUSE = "15";
    MyGameConfig.EVENT_PROSPECTING_END = "16";
    MyGameConfig.EVENT_HIDE_MAIN_VIEW_DIALOG = "17";
    MyGameConfig.EVENT_HIDE_VIEW_DURABLE = "18";
    MyGameConfig.EVENT_PVP_PREPARE = "19";
    MyGameConfig.EVENT_PVP_SCORE = "20";
    MyGameConfig.EVENT_PVP_END = "21";
    MyGameConfig.EVENT_CATCH_END = "22";
    MyGameConfig.ZORDER_0 = 0;
    MyGameConfig.ZORDER_1 = 1;
    MyGameConfig.ZORDER_100 = 100;
    MyGameConfig.ZORDER_101 = 101;
    MyGameConfig.NAME_DIALOG_LOADING = "dialog_loading";
    MyGameConfig.NAME_DIALOG_FACTORY = "dialog_factory";
    MyGameConfig.NAME_DIALOG_PROPS = "dialog_props";
    MyGameConfig.NAME_TOAST = "toast";
    MyGameConfig.PROPS_ROLLER = 1;
    MyGameConfig.PROPS_POWER = 2;
    MyGameConfig.PROPS_CAPACITY = 3;
    MyGameConfig.PROPS_EXPLOSIVE = 4;
    MyGameConfig.PROPS_CRYSTAL_DETECTOR = 5;
    MyGameConfig.KEY_DATA_LEVEL_PASS = "level_pass";
    MyGameConfig.KEY_DATA_LEVEL_DURABLE = "level_durable";
    MyGameConfig.KEY_DATA_LEVEL_DURABLE_SPEED = "level_durable_speed";
    MyGameConfig.KEY_DATA_LEVEL_SPIKE_CIRCLE_NUM = "level_spike_circle_num";
    MyGameConfig.KEY_DATA_LEVEL_SPIKE_NUM = "level_spike_num";
    MyGameConfig.KEY_DAY_LEVEL_SPIKE_SIZE = "level_spike_size";
    MyGameConfig.KEY_DATA_LEVEL_ROLLER_SIZE = "level_roller_size";
    MyGameConfig.KEY_DATA_LEVEL_TRUCK_SPEED = "level_truck_speed";
    MyGameConfig.KEY_DATA_LEVEL_TRUCK_CAPACITY = "level_truck_capacity";
    MyGameConfig.KEY_DATA_LEVEL_FACTORY_SPEED = "level_factory_speed";
    MyGameConfig.KEY_DATA_LEVEL_FACTORY_QUALITY_ADD_SELL = "level_factory_quality_add_sell";
    MyGameConfig.KEY_DATA_LEVEL_FACTORY_CAPACITY = "level_factory_quality_capacity";
    MyGameConfig.KEY_DATA_PRODUCT_LAST_UNLOCK = "product_last_unlock";

    class AudioUtils {
        static init() {
            AudioUtils.resetAudio();
            Laya.SoundManager.autoReleaseSound = false;
            Laya.SoundManager.autoStopMusic = false;
        }
        static resetAudio() {
            AudioUtils.mBgmVolume = AudioUtils.getBgmVolume();
            this.setBgmVolume(AudioUtils.mBgmVolume);
            AudioUtils.mSoundVolume = AudioUtils.getSoundVolume();
            this.setSoundVolume(AudioUtils.mSoundVolume);
        }
        static setSoundVolume(v) {
            AudioUtils.mSoundVolume = v;
            Laya.SoundManager.setSoundVolume(AudioUtils.mSoundVolume);
            Laya.LocalStorage.setItem("ark_sound_volume", AudioUtils.mSoundVolume + "");
        }
        static getSoundVolume() {
            var soundVolumeStr = Laya.LocalStorage.getItem("ark_sound_volume");
            if (soundVolumeStr) {
                AudioUtils.mSoundVolume = parseInt(soundVolumeStr);
            }
            else {
                AudioUtils.mSoundVolume = AudioUtils.DEFAULT_VOLUME;
            }
            return AudioUtils.mSoundVolume;
        }
        static setBgmVolume(v) {
            AudioUtils.mBgmVolume = v;
            Laya.SoundManager.setMusicVolume(AudioUtils.mBgmVolume);
            Laya.LocalStorage.setItem("ark_bgm_volume", AudioUtils.mBgmVolume + "");
        }
        static getBgmVolume() {
            var bgmVolumeStr = Laya.LocalStorage.getItem("ark_bgm_volume");
            if (bgmVolumeStr) {
                AudioUtils.mBgmVolume = parseInt(bgmVolumeStr);
            }
            else {
                AudioUtils.mBgmVolume = AudioUtils.DEFAULT_VOLUME;
            }
            return AudioUtils.mBgmVolume;
        }
        static setTempBgmVolume(v) {
            if (this.mBgmChannel) {
                this.mBgmChannel.volume = v;
            }
        }
        static playBgm(path, startTime) {
            startTime = startTime ? startTime : 0;
            this.mBgmIsOver = false;
            this.mBgmPath = path;
            this.mBgmChannel = Laya.SoundManager.playMusic(path, 0);
        }
        static playSound(path, loops, complete) {
            if (AudioUtils.mSoundVolume > 0) {
                if (loops !== null || loops !== undefined) {
                    return Laya.SoundManager.playSound(path, loops, complete);
                }
                else {
                    return Laya.SoundManager.playSound(path, 1, complete);
                }
            }
        }
        static openAll() {
            AudioUtils.setBgmVolume(AudioUtils.DEFAULT_VOLUME);
            AudioUtils.setSoundVolume(AudioUtils.DEFAULT_VOLUME);
            this.setSound(true);
        }
        static stopBgm() {
            if (this.mBgmChannel) {
                this.mBgmChannel.stop();
            }
        }
        static destroyBgm() {
            Laya.SoundManager.destroySound(this.mBgmPath);
        }
        static muted() {
            AudioUtils.setBgmVolume(0);
            AudioUtils.setSoundVolume(0);
            this.setSound(false);
        }
        static resumeBgm() {
            if (this.mBgmChannel) {
                this.mBgmChannel.resume();
            }
        }
        static pauseBgm() {
            if (this.mBgmChannel) {
                this.mBgmChannel.pause();
            }
        }
        static resumeAll() {
            if (AudioUtils.mBgmChannel) {
                AudioUtils.mBgmChannel.resume();
            }
            Laya.SoundManager.setMusicVolume(AudioUtils.mBgmVolume);
            Laya.SoundManager.setSoundVolume(AudioUtils.mSoundVolume);
        }
        static pauseAll() {
            if (AudioUtils.mBgmChannel) {
                AudioUtils.mBgmChannel.pause();
            }
            Laya.SoundManager.setMusicVolume(0);
            Laya.SoundManager.setSoundVolume(0);
        }
        static isSound() {
            return this.getBoolean("setting_sound", true);
        }
        static setSound(b) {
            this.setBoolean("setting_sound", b);
        }
        static getBoolean(key, defaultValue) {
            var str = Laya.LocalStorage.getItem(key);
            if (str == "true") {
                return true;
            }
            else if (str == "false") {
                return false;
            }
            else {
                return defaultValue;
            }
        }
        static setBoolean(key, value) {
            if (value) {
                Laya.LocalStorage.setItem(key, "true");
            }
            else {
                Laya.LocalStorage.setItem(key, "false");
            }
        }
    }
    AudioUtils.mBgmVolume = 1;
    AudioUtils.mSoundVolume = 1;
    AudioUtils.DEFAULT_VOLUME = 1;
    AudioUtils.mBgmIsOver = false;

    class AudioManager {
        static init() {
            this.mCollectStoneHandler = Laya.Handler.create(this, () => {
                this.mIsPlaySoundCollectStone = false;
            }, [], false);
        }
        static closeSound() {
            AudioUtils.setSoundVolume(0);
        }
        static openSound() {
            AudioUtils.setSoundVolume(1);
        }
        static closeMusic() {
            AudioUtils.setBgmVolume(0);
        }
        static openMusic() {
            AudioUtils.setBgmVolume(1);
        }
        static playBgm() {
            AudioUtils.playBgm("res2d/sounds/bgm.mp3");
        }
        static playClick() {
            this.playSound("click");
        }
        static playTruck() {
            if (!this.mIsPlayTruck) {
                this.mIsPlayTruck = true;
                if (this.mTruckSoundChannel) {
                    this.mTruckSoundChannel.play();
                }
                else {
                    this.mTruckSoundChannel = this.playSound("truck", 0);
                }
            }
        }
        static stopTruck() {
            if (this.mTruckSoundChannel) {
                this.mTruckSoundChannel.pause();
                this.mIsPlayTruck = false;
            }
        }
        static playCollectStone() {
            if (!this.mIsPlaySoundCollectStone) {
                this.mIsPlaySoundCollectStone = true;
                this.playSound("collectStone", 1, this.mCollectStoneHandler);
            }
        }
        static playGetStars() {
            this.playSound("getStars");
        }
        static playSell() {
            this.playSound("sell");
        }
        static playKnockDown() {
            this.playSound("knockDown");
        }
        static playBoom() {
            this.playSound("boom");
        }
        static playCountDown() {
            this.playSound("countDown");
        }
        static playSound(name, loops, complete) {
            return AudioUtils.playSound(MyGameConfig.URL_SOUNDS + name + ".mp3", loops, complete);
        }
    }
    AudioManager.NAME_BUY = "buy";
    AudioManager.mIsPlayTruck = false;
    AudioManager.mIsPlaySoundCollectStone = false;

    class PoolManager {
        constructor() {
        }
        static recover(sign, item) {
            if (!this.poolNameObj[sign]) {
                this.poolNameObj[sign] = sign;
            }
            if (item) {
                item.active = false;
                item._scene._removeScript(this);
            }
            Laya.Pool.recover(sign, item);
        }
        static getItem(sign) {
            var item = Laya.Pool.getItem(sign);
            if (item) {
                item.active = true;
            }
            return item;
        }
        static recoverUI(sign, item) {
            if (!this.poolNameObj[sign]) {
                this.poolNameObj[sign] = sign;
            }
            if (item) {
                item.visible = false;
            }
            Laya.Pool.recover(sign, item);
        }
        static getItemUI(sign) {
            var item = Laya.Pool.getItem(sign);
            if (item) {
                item.visible = true;
            }
            return item;
        }
        static recoverParticle(sign, item) {
            if (!this.poolNameObj[sign]) {
                this.poolNameObj[sign] = sign;
            }
            if (item) {
                item.active = false;
            }
            Laya.Pool.recover(sign, item);
        }
        static getItemParticle(sign) {
            var item = Laya.Pool.getItem(sign);
            let curTime = new Date().getTime();
            if (item && (curTime - item._createTime > 3000)) {
                if (item) {
                    item.active = true;
                }
                return item;
            }
            else {
                return null;
            }
        }
        static clearAll() {
            for (var key in this.poolNameObj) {
                Laya.Pool.clearBySign(key);
            }
            this.poolNameObj = {};
        }
    }
    PoolManager.poolNameObj = {};

    class EventUtils {
        static onEvent(node, type, event) {
            var eventInfo = new EventInfo(node, type, event);
            this.eventArr.push(eventInfo);
        }
        static dispatchEvent(type, data) {
            for (var i = 0; i < this.eventArr.length; i++) {
                var event = this.eventArr[i];
                if (event.type == type) {
                    event.envent.call(event.envent, data);
                }
            }
        }
        static offAllEventByNode(node) {
            var tempEventArr = new Array();
            for (var i = 0; i < this.eventArr.length; i++) {
                var event = this.eventArr[i];
                if (event.name != node._tempUUID) {
                    tempEventArr.push(event);
                }
            }
            this.eventArr = tempEventArr;
        }
    }
    EventUtils.eventArr = new Array();
    class EventInfo {
        constructor(node, type, event) {
            if (!node._tempUUID) {
                node._tempUUID = MathUtils.generateUUID();
            }
            this.name = node._tempUUID;
            this.envent = event;
            this.type = type;
        }
    }

    class GameManager {
        constructor() {
            this.isPause = false;
            this.isControl = false;
            this.functionPointArr = [];
            this.mTimerDelta = 0;
        }
        static get instance() {
            if (!this.mInstance) {
                this.mInstance = new GameManager();
            }
            return this.mInstance;
        }
        init() {
            this.mCurTime = new Date().getTime();
            Laya.timer.frameLoop(1, this, () => {
                this.mCurTime += Laya.timer.delta;
                this.mTimerDelta = Laya.timer.delta;
                if (this.mTimerDelta > 45) {
                    this.mTimerDelta = 45;
                }
            });
        }
        get timerDelta() {
            if (this.isPause) {
                return 0;
            }
            return this.mTimerDelta;
        }
        get curTime() {
            return this.mCurTime;
        }
        receivePrize(rewardArr) {
            for (let i = 0; i < rewardArr.length; i++) {
                let rewaedInfo = rewardArr[i];
                let num = rewaedInfo.num;
                switch (rewaedInfo.type) {
                    case MyGameConfig.REWARD_TYPE_GOLD:
                        DataManager.addGoldValue(num);
                        break;
                    case MyGameConfig.REWARD_TYPE_CRYSTAL:
                        DataManager.addCrystalValue(num);
                        break;
                }
            }
        }
        showTipMapAni() {
            let b = DataManager.isTipMap();
            if (!b) {
                GameManager.instance.isControl = false;
                GameManager.instance.roleScript.stopMove();
                let camera = GameManager.instance.roleScript.getCamera();
                let cameraPosition = camera.transform.position.clone();
                let targetPos = new Laya.Vector3(0, cameraPosition.y, 30);
                let distance = Laya.Vector3.distance(cameraPosition, targetPos);
                let tempPosition = camera.transform.position;
                Laya.Tween.to(tempPosition, {
                    x: targetPos.x,
                    y: targetPos.y,
                    z: targetPos.z,
                    update: new Laya.Handler(this, () => {
                        camera.transform.position = tempPosition;
                    })
                }, distance * 100, null, Laya.Handler.create(this, () => {
                    Laya.timer.once(1000, this, () => {
                        Laya.Tween.to(tempPosition, {
                            x: cameraPosition.x,
                            y: cameraPosition.y,
                            z: cameraPosition.z,
                            update: new Laya.Handler(this, () => {
                                camera.transform.position = tempPosition;
                            })
                        }, distance * 100, null, Laya.Handler.create(this, () => {
                            GameManager.instance.isControl = true;
                            DataManager.setTipMap(true);
                        }));
                    });
                }));
            }
        }
        createGoods() {
            Laya.timer.clear(this, this.createGoodsCallback);
            let maxCapacity = MyGameConfig.gameConfig.rewardMax;
            let time = MyGameConfig.gameConfig.rewardTime;
            Laya.timer.loop(time, this, this.createGoodsCallback, [maxCapacity]);
        }
        createGoodsCallback(maxCapacity) {
            let factoryGoodsNum = DataManager.getRewardGoods();
            if (factoryGoodsNum < maxCapacity) {
                EventUtils.dispatchEvent(MyGameConfig.EVENT_REFRESH_PRODUCT, DataManager.addRewardGoods());
            }
        }
        toFixed(num) {
            return MathUtils.toFixed(num, 0);
        }
        pauseAll() {
            this.isControl = false;
            this.isPause = true;
            Laya.timer.pause();
        }
        resumeAll() {
            this.isControl = true;
            this.isPause = false;
            Laya.timer.resume();
        }
        clearAll() {
            this.curChildIsland = null;
            PoolManager.clearAll();
        }
    }

    class DataManager {
        static init() {
            this.mData = new Data();
            this.initDesignDiagram();
            this.initPropsData();
            this.mData.goldValue = LsUtils.getInt("gold_value", 0);
            this.mData.crystalValue = LsUtils.getInt("crystal_value", 0);
        }
        static getGoldValue() {
            return this.mData.goldValue;
        }
        static addGoldValue(value) {
            this.mData.goldValue += value;
            LsUtils.setInt("gold_value", this.getGoldValue() + value);
            EventUtils.dispatchEvent(MyGameConfig.EVENT_REFRESH_GOLD_VIEW, "");
        }
        static getCrystalValue() {
            return this.mData.crystalValue;
        }
        static addCrystalValue(value) {
            this.mData.crystalValue += value;
            LsUtils.setInt("crystal_value", this.getCrystalValue() + value);
            EventUtils.dispatchEvent(MyGameConfig.EVENT_REFRESH_GOLD_VIEW, "");
        }
        static getUseCarId() {
            return LsUtils.getInt("use_car_id", 1);
        }
        static setUseCarId(id) {
            LsUtils.setInt("use_car_id", id);
        }
        static getUnlockCarInfo() {
            return MyGameConfig.carConfig;
        }
        static addUnlockCar() {
        }
        static getUnlockFunction() {
            return LsUtils.getJson("unlock_function", {});
        }
        static addUnlockFunction(id, callback) {
            let obj = this.getUnlockFunction();
            obj[id] = true;
            LsUtils.setJson("unlock_function", obj);
            callback();
        }
        static getLevelByKey(key) {
            return LsUtils.getInt(key, 0);
        }
        static addLevel(key) {
            let level = this.getLevelByKey(key) + 1;
            this.setLevelByKey(key, level);
            return level;
        }
        static setLevelByKey(key, num) {
            LsUtils.setInt(key, num);
        }
        static getLastSelectLevel() {
            return LsUtils.getInt("last_select_level", 0);
        }
        static setLastSelectLevel(level) {
            LsUtils.setInt("last_select_level", level);
        }
        static getRewardGoods() {
            return LsUtils.getInt("reward_goods", 0);
        }
        static addRewardGoods() {
            return this.setRewardGoods(this.getRewardGoods() + 1);
        }
        static setRewardGoods(num) {
            return LsUtils.setInt("reward_goods", num);
        }
        static getMapStarsData() {
            return LsUtils.getJson("map_stars_data", {});
        }
        static addMapStarsByLevel(level) {
            let data = this.getMapStarsData();
            if (!data[level]) {
                data[level] = 0;
            }
            data[level]++;
            this.setMapStarsData(data);
            AudioManager.playGetStars();
        }
        static setMapStarsData(data) {
            return LsUtils.setJson("map_stars_data", data);
        }
        static getMapData() {
            return LsUtils.getJson("map_data", {});
        }
        static setMapData(data) {
        }
        static getMapRefreshTimeData() {
            return LsUtils.getJson("map_refresh_time_data", {});
        }
        static setMapRefreshTimeData(data) {
            LsUtils.setJson("map_refresh_time_data", data);
        }
        static getTruckData() {
            return LsUtils.getJson("truck_data", {
                "capacity": {},
                "catchStoneNum": 0,
                "stars": 0
            });
        }
        static setTruckData(data) {
        }
        static isTipMap() {
            return LsUtils.getBoolean("is_tip_map", false);
        }
        static setTipMap(b) {
            return LsUtils.setBoolean("is_tip_map", b);
        }
        static getCompletedGuideEvent() {
            return LsUtils.getJson("completed_guide_event", {});
        }
        static addCompleteGuideEvent(eventId) {
            var completedGuideEvent = this.getCompletedGuideEvent();
            completedGuideEvent[eventId] = true;
            LsUtils.setJson("completed_guide_event", completedGuideEvent);
        }
        static getUnlockDesignDiagram() {
            return MyGameConfig.designDiagramConfig;
        }
        static initDesignDiagram() {
            let unlockDesignDiagram = LsUtils.getJson("unlock_design_diagram", {});
            for (let i = 0; i < MyGameConfig.designDiagramConfig.length; i++) {
                let info = MyGameConfig.designDiagramConfig[i];
                if (unlockDesignDiagram[info.id]) {
                    info.isUnlock = true;
                    info.productionTime = unlockDesignDiagram[info.id].productionTime;
                }
                else {
                    info.isUnlock = false;
                    this.mData.lockDesignDiagram.push(info);
                }
            }
        }
        static getLockDesignDiagram() {
            return this.mData.lockDesignDiagram;
        }
        static addUnlockDesignDiagram(id) {
            let unlockDesignDiagram = LsUtils.getJson("unlock_design_diagram", {});
            let obj = {};
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
        static addProductDesignDiagram(id, callback) {
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
        static initPropsData() {
            let propsValue = LsUtils.getJson("props_value", {});
            for (let key in MyGameConfig.factoryGoodsConfig) {
                let propInfo = MyGameConfig.factoryGoodsConfig[key];
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
        static getPropsInfo() {
            return this.mData.propsInfo;
        }
        static addPropValue(id, value, callback) {
            let obj = this.getPropsInfo();
            obj[id] += value;
            MyGameConfig.factoryGoodsConfig[id].num += value;
            LsUtils.setJson("props_value", obj);
            EventUtils.dispatchEvent(MyGameConfig.EVENT_REFRESH_PROPS_VIEW, "");
            callback();
        }
        static isShowGuide(model) {
            return LsUtils.getJson("is_show_guide", {})[model];
        }
        static setShowGuide(model) {
            let obj = LsUtils.getJson("is_show_guide", {});
            obj[model] = true;
            LsUtils.setJson("is_show_guide", obj);
        }
        static setDurable(durable) {
            LsUtils.setInt("durable_value", durable);
        }
        static getDurable() {
            return LsUtils.getInt("durable_value", -1);
        }
        static isVibrate() {
            return LsUtils.getBoolean("setting_vibrate", true);
        }
        static setVibrate(b) {
            LsUtils.setBoolean("setting_vibrate", b);
        }
        static isSound() {
            return LsUtils.getBoolean("setting_sound", true);
        }
        static setSound(b) {
            LsUtils.setBoolean("setting_sound", b);
        }
        static isBgm() {
            return LsUtils.getBoolean("setting_bgm", true);
        }
        static setBgm(b) {
            LsUtils.setBoolean("setting_bgm", b);
        }
    }
    class Data {
        constructor() {
            this.lockDesignDiagram = [];
            this.propsInfo = {};
        }
    }

    class ToastView extends ui.game.ToastViewUI {
        onAwake() {
            this.name = MyGameConfig.NAME_TOAST;
            this.zOrder = MyGameConfig.ZORDER_100;
        }
        show(content) {
            this.centerX = 0;
            this.centerY = 0;
            this.mLbContent.changeText(content);
            Laya.Tween.to(this, {
                centerY: -150,
                update: Laya.Handler.create(this, () => {
                })
            }, 800, null, Laya.Handler.create(this, () => {
                PoolManager.recoverUI(this.name, this);
            }));
        }
    }

    class LoadingResDialog extends ui.laoding.LoadingResDialogUI {
        onAwake() {
            this.width = Laya.stage.width;
            this.height = Laya.stage.height;
        }
    }

    class UiUtils {
        static init() {
            this.mContainerView = new Laya.View();
            this.mContainerView.width = Laya.stage.width;
            this.mContainerView.height = Laya.stage.height;
            this.mContainerView.zOrder = MyGameConfig.ZORDER_1;
            Laya.stage.addChild(this.mContainerView);
            this.loadingResDialog = new LoadingResDialog();
            this.loadingResDialog.zOrder = MyGameConfig.ZORDER_100;
            this.mContainerView.addChild(this.loadingResDialog);
            Laya.stage.on(Laya.Event.RESIZE, this, () => {
                for (let i = 0; i < this.mContainerView.numChildren; i++) {
                    let view = this.mContainerView.getChildAt(i);
                    view.width = Laya.stage.width;
                }
            });
        }
        static isAllScreen() {
            var clientWidth = Laya.Browser.clientWidth;
            var clientHeight = Laya.Browser.clientHeight;
            if (clientHeight / clientWidth >= 1.9) {
                return true;
            }
            return false;
        }
        static getClientScale() {
            return Laya.Browser.clientWidth / 720;
        }
        static addChild(node, parent) {
            this.showLoading();
            if (parent) {
                parent.addChild(node);
            }
            else {
                this.mContainerView.addChild(node);
            }
        }
        static loadJson(url, callback) {
            url += ".json";
            Laya.loader.load(url, Laya.Handler.create(this, () => {
                let obj = Laya.loader.getRes(url);
                if (callback) {
                    callback(obj);
                }
            }), null, Laya.Loader.JSON);
        }
        static mergeFunction(functionA, functionB, caller, args) {
            if (!functionA || !functionB)
                return;
            var merge = functionB;
            functionB = (function () {
                merge.call(caller, args);
                functionA.call(UiUtils);
            });
            return functionB;
        }
        static click(view, caller, listener, args, soundName) {
            if (view) {
                let callback = this.mergeFunction((function () {
                    if (!soundName) {
                    }
                    else if (soundName.length == 0) {
                        AudioManager.playClick();
                    }
                    else {
                        AudioManager.playSound(soundName);
                    }
                }), listener, caller, args);
                view.offAll();
                view.on(Laya.Event.CLICK, caller, callback, args);
                view.on(Laya.Event.MOUSE_DOWN, this, function mouseDown() {
                    view.alpha = 0.6;
                });
                view.on(Laya.Event.MOUSE_UP, this, function mouseUp() {
                    view.alpha = 1;
                });
                view.on(Laya.Event.MOUSE_OUT, this, function mouseUp() {
                    view.alpha = 1;
                });
            }
        }
        static removeSelf(view) {
            view.removeSelf();
        }
        static showLoading() {
            this.loadingResDialog.visible = true;
        }
        static hideLoading() {
            this.loadingResDialog.visible = false;
        }
        static showToast(content) {
            let view = PoolManager.getItemUI(MyGameConfig.NAME_TOAST);
            if (!view) {
                view = new ToastView();
                this.mContainerView.addChild(view);
            }
            view.show(content);
        }
    }

    class ParticleScript extends Laya.Script3D {
        constructor() {
            super();
            this.mPlayRate = 1;
            this.mIsDestroy = false;
        }
        onAwake() {
            this.mNode = this.owner;
            this.mParticleSystem = this.owner.getChildAt(0).particleSystem;
            this.mPlayRate = 1;
            if (this.mParticleSystem) {
                this.mParticleSystem.simulationSpeed = this.mPlayRate;
            }
        }
        onEnable() {
        }
        onDisable() {
        }
        onUpdate() {
            if (this.mParticleSystem && !this.mParticleSystem.isPlaying && !this.mIsPlayEnd) {
                this.mIsPlayEnd = true;
                if (this.mIsDestroy) {
                    this.mNode.destroy(true);
                }
                else {
                    this.mNode.active = false;
                    PoolManager.recoverParticle(this.mName, this.owner);
                }
            }
        }
        init(name, rate) {
            this.mName = name;
            this.mPlayRate = rate ? rate : 1;
            this.mIsPlayEnd = false;
            if (this.mParticleSystem) {
                this.mParticleSystem.play();
            }
        }
        setParticleSystem(particleSystem) {
            this.mParticleSystem = particleSystem;
            this.init(this.mName, this.mPlayRate);
        }
        setDestroy() {
            this.mIsDestroy = true;
        }
    }

    class GuideDialog extends ui.game.GuideDialogUI {
        constructor(model) {
            super();
            this.MODEL_NORMAL_DATA = [
                { "img": "imgGuide1_1.jpg", "des": "Control the minecart to mine ore and sell it" },
                { "img": "imgGuide1_2.jpg", "des": "During the mining of ore, crystals will appear. The crystal will disappear after a certain period of time, please dig it in time" },
                { "img": "imgGuide1_3.jpg", "des": "In the process of mining ore, there is a chance that a design will appear. You can unlock the relevant props through the laboratory and produce the props through the factory" },
                { "img": "imgGuide1_4.jpg", "des": "After the container is full, the ore will no longer be obtained, please sell the ore in time" },
                { "img": "imgGuide1_5.jpg", "des": "After the durability is exhausted, it will be forced to be taken to the repair shop, and the repair time will be greatly increased. Pay attention to the durability and send the minecart to the repair shop for repair in time" },
            ];
            this.MODEL_PROSPECTING = [
                { "img": "imgGuide2_1.jpg", "des": "For a limited time, dig hidden crystals" },
                { "img": "imgGuide2_2.jpg", "des": "Using props will help you find the location of the crystal faster" },
            ];
            this.mCurIndex = 0;
            switch (model) {
                case MyGameConfig.PLAY_MODEL_NORMAL:
                    this.mData = this.MODEL_NORMAL_DATA;
                    break;
                case MyGameConfig.PLAY_MODEL_PROSPECTING:
                    this.mData = this.MODEL_PROSPECTING;
                    break;
            }
            DataManager.setShowGuide(model);
        }
        onAwake() {
            this.width = Laya.stage.width;
            let zipArr = [
                { url: MyGameConfig.URL_RES2D + "guide.zip", type: LayaZip.ZIP },
            ];
            Laya.loader.create(zipArr, Laya.Handler.create(this, () => {
                this.initView();
                UiUtils.hideLoading();
            }));
        }
        initView() {
            this.mList.width = this.mList.cells[0].width * this.mData.length;
            this.mList.renderHandler = new Laya.Handler(this, this.updateItemList);
            this.mList.array = this.mData;
            this.refreshContentView();
            UiUtils.click(this.mBtnPre, this, this.onPreClick);
            UiUtils.click(this.mBtnNext, this, this.onNextClick);
            UiUtils.click(this.mBtnClose, this, this.onCloseClick);
        }
        refreshContentView() {
            let data = this.mData[this.mCurIndex];
            this.mImgGuide.skin = MyGameConfig.URL_GUIDE + data.img;
            this.mLbDes.text = data.des;
            this.mBtnPre.visible = true;
            this.mBtnNext.visible = true;
            if (this.mCurIndex == 0) {
                this.mBtnPre.visible = false;
            }
            if (this.mCurIndex == this.mData.length - 1) {
                this.mBtnNext.visible = false;
            }
            this.mList.refresh();
        }
        updateItemList(ceil, index) {
            let img = ceil.getChildAt(0);
            if (this.mCurIndex == index) {
                img.skin = "guide/bgItemGuideSelect.png";
            }
            else {
                img.skin = "guide/bgItemGuide.png";
            }
        }
        onPreClick() {
            if (this.mCurIndex == 0) {
                return;
            }
            this.mCurIndex--;
            this.refreshContentView();
        }
        onNextClick() {
            if (this.mCurIndex == this.mData.length - 1) {
                return;
            }
            this.mCurIndex++;
            this.refreshContentView();
        }
        onCloseClick() {
            this.destroy(true);
            Laya.Resource.destroyUnusedResources();
        }
    }

    class NextChildLoadingDialog extends ui.game.NextChildLoadingDialogUI {
        constructor(callback, time = 1500) {
            super();
            this.mTime = time;
            this.mCallback = callback;
        }
        onAwake() {
            this.width = Laya.stage.width;
            Laya.Tween.to(this.mImg, {
                alpha: 1,
                update: new Laya.Handler(this, () => {
                })
            }, 1500, null, new Laya.Handler(this, () => {
                this.mCallback();
            }));
            UiUtils.hideLoading();
        }
        hide() {
            Laya.Tween.clearAll(this);
            this.mImg.alpha = 1;
            Laya.Tween.to(this.mImg, {
                alpha: 0,
                update: new Laya.Handler(this, () => {
                })
            }, this.mTime, null, new Laya.Handler(this, () => {
                this.removeSelf();
            }));
        }
    }

    class GetDesigndiagramDialog extends ui.game.GetDesigndiagramUI {
        constructor(info) {
            super();
            this.mDesignDiagramInfo = info;
        }
        onAwake() {
            this.width = Laya.stage.width;
            DataManager.addUnlockDesignDiagram(this.mDesignDiagramInfo.id);
            this.mImgIc.skin = "laboratory/" + this.mDesignDiagramInfo.imgName;
            this.mLbContent.changeText(this.mDesignDiagramInfo.name);
            GameManager.instance.isPause = true;
            GameManager.instance.isControl = false;
            GameManager.instance.roleScript.stopMove();
            UiUtils.click(this.mBtnOk, this, this.onCloseClick);
            UiUtils.hideLoading();
        }
        onCloseClick() {
            GameManager.instance.isPause = false;
            GameManager.instance.isControl = true;
            this.removeSelf();
        }
    }

    class SdkCenter {
        constructor() {
            this.mLastVibrateTime = 0;
            this.mIsSupplyVibrate = false;
        }
        static get instance() {
            if (!SdkCenter.mInstance) {
                SdkCenter.mInstance = new SdkCenter();
            }
            return SdkCenter.mInstance;
        }
        init() {
            if (Laya.Browser.window.navigator) {
                let vibrate = Laya.Browser.window.navigator.vibrate
                    || Laya.Browser.window.navigator.webkitVibrate
                    || Laya.Browser.window.navigator.mozVibrate
                    || Laya.Browser.window.navigator.msVibrate;
                if (vibrate) {
                    this.mIsVibrate = DataManager.isVibrate();
                    Laya.Browser.window.navigator.useVibrate = vibrate;
                    this.mIsSupplyVibrate = true;
                }
            }
        }
        showRewardVideo(success, fail) {
            if (success) {
                success();
            }
        }
        showToast(content) {
        }
        vibrateShort() {
            if (this.mIsSupplyVibrate && this.mIsVibrate) {
                let time = new Date().getTime();
                if (time - this.mLastVibrateTime >= 30) {
                    this.mLastVibrateTime = time;
                    Laya.Browser.window.navigator.useVibrate(30);
                }
            }
        }
        setVibrate(b) {
            this.mIsVibrate = b;
        }
        isSupplyVibrate() {
            return this.mIsSupplyVibrate;
        }
    }

    class CubeUvsDetail {
    }

    class CubeUvs {
        constructor() {
            this.top = [];
            this.bottom = [];
            this.north = [];
            this.east = [];
            this.south = [];
            this.west = [];
            this.topUvsDetail = new CubeUvsDetail();
            this.bottomUvsDetail = new CubeUvsDetail();
            this.northUvsDetail = new CubeUvsDetail();
            this.eastUvsDetail = new CubeUvsDetail();
            this.southUvsDetail = new CubeUvsDetail();
            this.westUvsDetail = new CubeUvsDetail();
        }
        addUvs(positions, uvs, arr, index) {
            for (let i = index; i < 4 + index; i++) {
                arr.push({ index: i, pos: positions[i], uv: uvs[i] });
            }
        }
        generate() {
            this.generateTop();
            this.generateNorth();
            this.generateEast();
            this.generateSouth();
            this.generateWest();
        }
        generateTop() {
            this.topUvsDetail.mUvEndX = this.top[2].uv.x;
            this.topUvsDetail.mUvStartX = this.top[0].uv.x;
            this.topUvsDetail.mUvEndY = this.top[2].uv.y;
            this.topUvsDetail.mUvStartY = this.top[0].uv.y;
            this.topUvsDetail.percentUvX = this.topUvsDetail.mUvEndX - this.topUvsDetail.mUvStartX;
            this.topUvsDetail.percentUvY = this.topUvsDetail.mUvEndY - this.topUvsDetail.mUvStartY;
        }
        generateNorth() {
            this.northUvsDetail.mUvEndX = this.north[2].uv.x;
            this.northUvsDetail.mUvStartX = this.north[0].uv.x;
            this.northUvsDetail.mUvEndY = this.north[2].uv.y;
            this.northUvsDetail.mUvStartY = this.north[0].uv.y;
            this.northUvsDetail.percentUvX = this.northUvsDetail.mUvEndX - this.northUvsDetail.mUvStartX;
            this.northUvsDetail.percentUvY = this.northUvsDetail.mUvEndY - this.northUvsDetail.mUvStartY;
        }
        generateEast() {
            this.eastUvsDetail.mUvEndX = this.east[2].uv.x;
            this.eastUvsDetail.mUvStartX = this.east[0].uv.x;
            this.eastUvsDetail.mUvEndY = this.east[2].uv.y;
            this.eastUvsDetail.mUvStartY = this.east[0].uv.y;
            this.eastUvsDetail.percentUvX = this.eastUvsDetail.mUvEndX - this.eastUvsDetail.mUvStartX;
            this.eastUvsDetail.percentUvY = this.eastUvsDetail.mUvEndY - this.eastUvsDetail.mUvStartY;
        }
        generateSouth() {
            this.southUvsDetail.mUvEndX = this.south[2].uv.x;
            this.southUvsDetail.mUvStartX = this.south[0].uv.x;
            this.southUvsDetail.mUvEndY = this.south[2].uv.y;
            this.southUvsDetail.mUvStartY = this.south[0].uv.y;
            this.southUvsDetail.percentUvX = this.southUvsDetail.mUvEndX - this.southUvsDetail.mUvStartX;
            this.southUvsDetail.percentUvY = this.southUvsDetail.mUvEndY - this.southUvsDetail.mUvStartY;
        }
        generateWest() {
            this.westUvsDetail.mUvEndX = this.west[2].uv.x;
            this.westUvsDetail.mUvStartX = this.west[0].uv.x;
            this.westUvsDetail.mUvEndY = this.west[2].uv.y;
            this.westUvsDetail.mUvStartY = this.west[0].uv.y;
            this.westUvsDetail.percentUvX = this.westUvsDetail.mUvEndX - this.westUvsDetail.mUvStartX;
            this.westUvsDetail.percentUvY = this.westUvsDetail.mUvEndY - this.westUvsDetail.mUvStartY;
        }
    }

    class CurveUvs {
        init(positions, uvs, index) {
            let arr = [];
            for (let i = index; i < 4 + index; i++) {
                arr.push({ index: i, pos: positions[i], uv: uvs[i] });
            }
            this.mUvEndX = arr[2].uv.x;
            this.mUvStartX = arr[0].uv.x;
            this.mUvEndY = arr[2].uv.y;
            this.mUvStartY = arr[0].uv.y;
            this.percentUvX = this.mUvEndX - this.mUvStartX;
            this.percentUvY = this.mUvEndY - this.mUvStartY;
        }
    }

    class GridInfo {
        constructor(x, z) {
            this.stoneInfoArr = [];
            this.crushedStoneArr = [];
            this.stoneCoreArr = [];
            this.crystalArr = [];
            this.x = x;
            this.z = z;
            this.key = x + "" + z;
        }
    }

    class BaseMapManager {
        constructor() {
            this.CUBE_NORTH = 1;
            this.CUBE_EAST = 2;
            this.CUBE_SOUTH = 3;
            this.CUBE_WEST = 4;
            this.mIsPvp = false;
            this.mCubeVerticeArr = [
                0, 1, -1,
                1, 1, -1,
                1, 1, 0,
                0, 1, 0
            ];
            this.mCubeIndicesArr = [1, 2, 0, 2, 3, 0];
            this.mCubeUvsMap = [];
            this.mCurveUvsMap = [];
            this.mRenderableSprite3Ds = {};
            this.curIslandTotalCatchStoneCore = 0;
            this.curIslandTotalCatchStone = 0;
        }
        init() {
            this.ClipperLib = Laya.Browser.window.ClipperLib;
            this.Poly2Tri = Laya.Browser.window.poly2tri;
        }
        createMesh(cubeType, verticeArr, indicesArr, startPosX, startPosZ) {
            let slices = verticeArr.length / 3;
            var vertexCount = slices + slices * 4;
            var indexCount = indicesArr.length + slices * 6;
            var vertexDeclaration = Laya.VertexMesh.getVertexDeclaration("POSITION,NORMAL,UV");
            var vertexFloatStride = vertexDeclaration.vertexStride / 4;
            var vertices = new Float32Array(vertexCount * vertexFloatStride);
            var indices = new Uint16Array(indexCount);
            var verticeCount = 0;
            var posX = 0;
            var posY = 0;
            var posZ = 0;
            var vc = 0;
            var ic = 0;
            let uvsCount = 0;
            let uvs = [];
            for (let i = 0; i < vertexCount; i++) {
                uvs[i] = { x: 0, y: 0 };
            }
            for (let tv = 0; tv < slices; tv++) {
                posX = verticeArr[tv * 3 + 0];
                posY = verticeArr[tv * 3 + 1];
                posZ = verticeArr[tv * 3 + 2];
                uvs[uvsCount++] = {
                    x: Math.abs((posX - startPosX)) * this.mCubeUvsMap[cubeType].topUvsDetail.percentUvX + this.mCubeUvsMap[cubeType].topUvsDetail.mUvStartX,
                    y: Math.abs(posZ - startPosZ) * this.mCubeUvsMap[cubeType].topUvsDetail.percentUvY + this.mCubeUvsMap[cubeType].topUvsDetail.mUvStartY
                };
                vertices[vc++] = posX;
                vertices[vc++] = posY;
                vertices[vc++] = posZ;
                vertices[vc++] = 0;
                vertices[vc++] = 1;
                vertices[vc++] = 0;
                vertices[vc++] = 0.5;
                vertices[vc++] = 0.5;
            }
            verticeCount += slices;
            for (let ti = 0; ti < indicesArr.length; ti++) {
                indices[ic++] = indicesArr[ti];
            }
            let northVerticesInfoArr = [];
            let eastVerticesInfoArr = [];
            let southVerticesInfoArr = [];
            let westVerticesInfoArr = [];
            let curveVerticesInfoArr = [];
            let curveVerticesIndex = 0;
            curveVerticesInfoArr[curveVerticesIndex] = [];
            for (let rv = 0; rv < slices; rv++) {
                posX = verticeArr[rv * 3 + 0];
                posY = verticeArr[rv * 3 + 1];
                posZ = verticeArr[rv * 3 + 2];
                let nextIndex = rv == slices - 1 ? 0 : rv + 1;
                let nextPosX = verticeArr[nextIndex * 3 + 0];
                let nextPosY = verticeArr[nextIndex * 3 + 1];
                let nextPosZ = verticeArr[nextIndex * 3 + 2];
                vertices[vc++] = posX;
                vertices[vc++] = posY;
                vertices[vc++] = posZ;
                vertices[vc++] = 0;
                vertices[vc++] = 1;
                vertices[vc++] = 0;
                vertices[vc++] = 0.5;
                vertices[vc++] = 0.5;
                vertices[vc++] = posX;
                vertices[vc++] = 0;
                vertices[vc++] = posZ;
                vertices[vc++] = 0;
                vertices[vc++] = 1;
                vertices[vc++] = 0;
                vertices[vc++] = 0.5;
                vertices[vc++] = 0.5;
                vertices[vc++] = nextPosX;
                vertices[vc++] = 0;
                vertices[vc++] = nextPosZ;
                vertices[vc++] = 0;
                vertices[vc++] = 1;
                vertices[vc++] = 0;
                vertices[vc++] = 0.5;
                vertices[vc++] = 0.5;
                vertices[vc++] = nextPosX;
                vertices[vc++] = nextPosY;
                vertices[vc++] = nextPosZ;
                vertices[vc++] = 0;
                vertices[vc++] = 1;
                vertices[vc++] = 0;
                vertices[vc++] = 0.5;
                vertices[vc++] = 0.5;
                indices[ic++] = rv * 4 + verticeCount;
                indices[ic++] = rv * 4 + 1 + verticeCount;
                indices[ic++] = rv * 4 + 2 + verticeCount;
                indices[ic++] = rv * 4 + verticeCount;
                indices[ic++] = rv * 4 + 2 + verticeCount;
                indices[ic++] = rv * 4 + 3 + verticeCount;
                let deltaX = posX - startPosX;
                let deltaZ = posZ - startPosZ;
                let nextDeltaX = nextPosX - startPosX;
                let nextDeltaZ = nextPosZ - startPosZ;
                let isBorderPoint = false;
                if (deltaZ == -1 && nextDeltaZ == -1) {
                    isBorderPoint = true;
                    northVerticesInfoArr.push({ index: rv * 4 + verticeCount, pos: { x: posX, y: 1, z: posZ }, i: startPosX, j: startPosZ });
                    northVerticesInfoArr.push({ index: rv * 4 + 1 + verticeCount, pos: { x: posX, y: 0, z: posZ }, i: startPosX, j: startPosZ });
                    northVerticesInfoArr.push({ index: rv * 4 + 2 + verticeCount, pos: { x: nextPosX, y: 0, z: nextPosZ }, i: startPosX, j: startPosZ });
                    northVerticesInfoArr.push({ index: rv * 4 + 3 + verticeCount, pos: { x: nextPosX, y: 1, z: nextPosZ }, i: startPosX, j: startPosZ });
                }
                else if (deltaX == 1 && nextDeltaX == 1) {
                    isBorderPoint = true;
                    eastVerticesInfoArr.push({ index: rv * 4 + verticeCount, pos: { x: posX, y: 1, z: posZ }, i: startPosX, j: startPosZ });
                    eastVerticesInfoArr.push({ index: rv * 4 + 1 + verticeCount, pos: { x: posX, y: 0, z: posZ }, i: startPosX, j: startPosZ });
                    eastVerticesInfoArr.push({ index: rv * 4 + 2 + verticeCount, pos: { x: nextPosX, y: 0, z: nextPosZ }, i: startPosX, j: startPosZ });
                    eastVerticesInfoArr.push({ index: rv * 4 + 3 + verticeCount, pos: { x: nextPosX, y: 1, z: nextPosZ }, i: startPosX, j: startPosZ, isBorderPoint: true });
                }
                else if (deltaZ == 0 && nextDeltaZ == 0) {
                    isBorderPoint = true;
                    southVerticesInfoArr.push({ index: rv * 4 + verticeCount, pos: { x: posX, y: 1, z: posZ }, i: startPosX, j: startPosZ });
                    southVerticesInfoArr.push({ index: rv * 4 + 1 + verticeCount, pos: { x: posX, y: 0, z: posZ }, i: startPosX, j: startPosZ });
                    southVerticesInfoArr.push({ index: rv * 4 + 2 + verticeCount, pos: { x: nextPosX, y: 0, z: nextPosZ }, i: startPosX, j: startPosZ });
                    southVerticesInfoArr.push({ index: rv * 4 + 3 + verticeCount, pos: { x: nextPosX, y: 1, z: nextPosZ }, i: startPosX, j: startPosZ });
                }
                else if (deltaX == 0 && nextDeltaX == 0) {
                    isBorderPoint = true;
                    westVerticesInfoArr.push({ index: rv * 4 + verticeCount, pos: { x: posX, y: 1, z: posZ }, i: startPosX, j: startPosZ });
                    westVerticesInfoArr.push({ index: rv * 4 + 1 + verticeCount, pos: { x: posX, y: 0, z: posZ }, i: startPosX, j: startPosZ });
                    westVerticesInfoArr.push({ index: rv * 4 + 2 + verticeCount, pos: { x: nextPosX, y: 0, z: nextPosZ }, i: startPosX, j: startPosZ });
                    westVerticesInfoArr.push({ index: rv * 4 + 3 + verticeCount, pos: { x: nextPosX, y: 1, z: nextPosZ }, i: startPosX, j: startPosZ });
                }
                if (isBorderPoint && curveVerticesInfoArr[curveVerticesIndex].length != 0) {
                    curveVerticesIndex++;
                    curveVerticesInfoArr[curveVerticesIndex] = [];
                }
                else if (!isBorderPoint) {
                    curveVerticesInfoArr[curveVerticesIndex].push({ index: rv * 4 + verticeCount, pos: { x: posX, y: 1, z: posZ }, i: startPosX, j: startPosZ });
                    curveVerticesInfoArr[curveVerticesIndex].push({ index: rv * 4 + 1 + verticeCount, pos: { x: posX, y: 0, z: posZ }, i: startPosX, j: startPosZ });
                    curveVerticesInfoArr[curveVerticesIndex].push({ index: rv * 4 + 2 + verticeCount, pos: { x: nextPosX, y: 0, z: nextPosZ }, i: startPosX, j: startPosZ });
                    curveVerticesInfoArr[curveVerticesIndex].push({ index: rv * 4 + 3 + verticeCount, pos: { x: nextPosX, y: 1, z: nextPosZ }, i: startPosX, j: startPosZ });
                }
            }
            this.setBorderUvs(cubeType, this.CUBE_NORTH, northVerticesInfoArr, uvs, slices);
            this.setBorderUvs(cubeType, this.CUBE_EAST, eastVerticesInfoArr, uvs, slices);
            this.setBorderUvs(cubeType, this.CUBE_SOUTH, southVerticesInfoArr, uvs, slices);
            this.setBorderUvs(cubeType, this.CUBE_WEST, westVerticesInfoArr, uvs, slices);
            this.setIncisionUv(cubeType, curveVerticesInfoArr, uvs, slices);
            let mesh = Laya.PrimitiveMesh._createMesh(vertexDeclaration, vertices, indices);
            mesh.setUVs(uvs);
            let node = new Laya.MeshSprite3D(mesh);
            node._myCreateMesh = mesh;
            node.meshRenderer.material = this.mCubeUvsMap[cubeType].stoneMaterial;
            node.meshRenderer.castShadow = true;
            node.meshRenderer.receiveShadow = true;
            return node;
        }
        setBorderUvs(cubeType, type, verticesInfoArr, uvs, slices) {
            for (let verticesInfo of verticesInfoArr) {
                let index = verticesInfo.index;
                let pos = verticesInfo.pos;
                let i = verticesInfo.i;
                let j = verticesInfo.j;
                switch (type) {
                    case this.CUBE_NORTH:
                        uvs[index] = {
                            x: (pos.x - i) * this.mCubeUvsMap[cubeType].northUvsDetail.percentUvX + this.mCubeUvsMap[cubeType].northUvsDetail.mUvStartX,
                            y: pos.y * this.mCubeUvsMap[cubeType].northUvsDetail.percentUvY + this.mCubeUvsMap[cubeType].northUvsDetail.mUvStartY,
                        };
                        break;
                    case this.CUBE_EAST:
                        uvs[index] = {
                            x: -(pos.z - j) * this.mCubeUvsMap[cubeType].eastUvsDetail.percentUvX + this.mCubeUvsMap[cubeType].eastUvsDetail.mUvStartX,
                            y: pos.y * this.mCubeUvsMap[cubeType].eastUvsDetail.percentUvY + this.mCubeUvsMap[cubeType].eastUvsDetail.mUvStartY,
                        };
                        break;
                    case this.CUBE_SOUTH:
                        uvs[index] = {
                            x: (pos.x - i) * this.mCubeUvsMap[cubeType].southUvsDetail.percentUvX + this.mCubeUvsMap[cubeType].southUvsDetail.mUvStartX,
                            y: pos.y * this.mCubeUvsMap[cubeType].southUvsDetail.percentUvY + this.mCubeUvsMap[cubeType].southUvsDetail.mUvStartY,
                        };
                        break;
                    case this.CUBE_WEST:
                        uvs[index] = {
                            x: -(pos.z - j) * this.mCubeUvsMap[cubeType].westUvsDetail.percentUvX + this.mCubeUvsMap[cubeType].westUvsDetail.mUvStartX,
                            y: pos.y * this.mCubeUvsMap[cubeType].westUvsDetail.percentUvY + this.mCubeUvsMap[cubeType].westUvsDetail.mUvStartY,
                        };
                        break;
                }
            }
        }
        setIncisionUv(cubeType, verticesInfoArr, uvs, slices) {
            for (let i = 0; i < verticesInfoArr.length; i++) {
                for (let j = 0; j < verticesInfoArr[i].length; j++) {
                    let verticesInfo = verticesInfoArr[i][j];
                    let index = verticesInfo.index;
                    let pos = verticesInfo.pos;
                    let x = verticesInfo.i;
                    let z = verticesInfo.j;
                    uvs[index] = {
                        x: (pos.x - x) * this.mCurveUvsMap[cubeType].percentUvX + this.mCurveUvsMap[cubeType].mUvStartX,
                        y: pos.y * this.mCurveUvsMap[cubeType].percentUvY + this.mCurveUvsMap[cubeType].mUvStartY,
                    };
                }
            }
        }
        cutMesh(gridInfo, saveGridInfo, clipPaths, positionScale) {
            let stoneInfoArr = new Array();
            for (let k = 0; k < gridInfo.stoneInfoArr.length; k++) {
                let cpr = new this.ClipperLib.Clipper();
                let stoneInfo = gridInfo.stoneInfoArr[k];
                if (stoneInfo.stonePointArr.length == 0) {
                    continue;
                }
                let subJPaths = stoneInfo.stonePointArr;
                cpr.AddPaths(subJPaths, this.ClipperLib.PolyType.ptSubject, true);
                cpr.AddPaths(clipPaths, this.ClipperLib.PolyType.ptClip, true);
                let solutionPolytree = new this.ClipperLib.PolyTree();
                let succeeded = cpr.Execute(this.ClipperLib.ClipType.ctDifference, solutionPolytree, this.ClipperLib.PolyFillType.pftEvenOdd, this.ClipperLib.PolyFillType.pftEvenOdd);
                if (succeeded) {
                    let solutionExpolygons = this.ClipperLib.JS.PolyTreeToExPolygons(solutionPolytree);
                    let polys = this.ClipperLib.Clipper.PolyTreeToPaths(solutionPolytree);
                    let isDestroy = true;
                    if (polys.length > 0 && stoneInfo.node.meshFilter.sharedMesh) {
                        for (let expolygon of solutionExpolygons) {
                            let countor = this.convertClipperPathToPoly2triPoint(expolygon.outer);
                            let triangles;
                            try {
                                let swctx = new this.Poly2Tri.SweepContext(countor);
                                let holes = expolygon.holes.map(h => {
                                    return this.convertClipperPathToPoly2triPoint(h);
                                });
                                swctx.addHoles(holes);
                                triangles = swctx.triangulate();
                            }
                            catch (error) {
                                isDestroy = false;
                                stoneInfoArr.push(stoneInfo);
                                break;
                            }
                            let indices = [];
                            let vertices = [];
                            let obj = {};
                            obj.height = stoneInfo.height;
                            obj.type = stoneInfo.type;
                            obj.stonePointArr = [];
                            let savePos = [];
                            obj.stonePointArr[0] = [];
                            let indicesIndex = 0;
                            let x;
                            let y;
                            let indicesMap = {};
                            for (let points of expolygon.outer) {
                                x = GameManager.instance.toFixed(points.X);
                                y = GameManager.instance.toFixed(points.Y);
                                indices.push(x / positionScale);
                                indices.push(stoneInfo.height);
                                indices.push(y / positionScale);
                                obj.stonePointArr[0].push({ X: x, Y: y });
                                savePos.push({ X: x, Y: y });
                                indicesMap[x + "_" + y] = indicesIndex;
                                indicesIndex++;
                            }
                            for (let triangle of triangles.triangles_) {
                                for (let points of triangle.points_) {
                                    vertices.push(indicesMap[points.x + "_" + points.y]);
                                }
                            }
                            let node = this.createMesh(stoneInfo.type, indices, vertices, gridInfo.x, gridInfo.z);
                            obj.node = node;
                            stoneInfoArr.push(obj);
                            this.mCurChildIsland.addChild(node);
                        }
                        if (!this.mRenderableSprite3Ds[gridInfo.key]) {
                            this.mRenderableSprite3Ds[gridInfo.key] = {};
                        }
                        this.mRenderableSprite3Ds[gridInfo.key] = stoneInfoArr;
                    }
                    if (isDestroy) {
                        gridInfo.stoneInfoArr[k].node.active = false;
                        if (gridInfo.stoneInfoArr[k].node.meshFilter.sharedMesh) {
                            gridInfo.stoneInfoArr[k].node.meshFilter.sharedMesh.destroy();
                        }
                        gridInfo.stoneInfoArr[k].node.destroy(true);
                    }
                }
                else {
                    stoneInfoArr.push(stoneInfo);
                }
            }
            gridInfo.stoneInfoArr = stoneInfoArr;
        }
        convertClipperPathToPoly2triPoint(poly) {
            return poly.map((p) => { return new Laya.Browser.window.poly2tri.Point(GameManager.instance.toFixed(p.X), GameManager.instance.toFixed(p.Y)); });
        }
        generateCubeUvs(type, nodeCube) {
            let uvs = [];
            this.mCubeUvsMap[type] = new CubeUvs();
            this.mCubeUvsMap[type].stoneMaterial = nodeCube.meshRenderer.material;
            nodeCube.meshFilter.sharedMesh.getUVs(uvs);
            let positions = [];
            nodeCube.meshFilter.sharedMesh.getPositions(positions);
            for (let i = 0; i < positions.length; i++) {
                let position = positions[i];
                position.x = GameManager.instance.toFixed(position.x);
                position.y = GameManager.instance.toFixed(position.y);
                position.z = GameManager.instance.toFixed(position.z);
            }
            for (let i = 0; i < positions.length / 4; i++) {
                let index = i * 4;
                if (positions[index].y > 0 && positions[index + 1].y > 0 && positions[index + 2].y > 0 && positions[index + 3].y > 0) {
                    this.mCubeUvsMap[type].addUvs(positions, uvs, this.mCubeUvsMap[type].top, index);
                }
                if (positions[index].y < 0 && positions[index + 1].y < 0 && positions[index + 2].y < 0 && positions[index + 3].y < 0) {
                    this.mCubeUvsMap[type].addUvs(positions, uvs, this.mCubeUvsMap[type].bottom, index);
                }
                if (positions[index].z == -1 && positions[index + 1].z == -1 && positions[index + 2].z == -1 && positions[index + 3].z == -1) {
                    this.mCubeUvsMap[type].addUvs(positions, uvs, this.mCubeUvsMap[type].north, index);
                }
                if (positions[index].x == 1 && positions[index + 1].x == 1 && positions[index + 2].x == 1 && positions[index + 3].x == 1) {
                    this.mCubeUvsMap[type].addUvs(positions, uvs, this.mCubeUvsMap[type].east, index);
                }
                if (positions[index].z == 0 && positions[index + 1].z == 0 && positions[index + 2].z == 0 && positions[index + 3].z == 0) {
                    this.mCubeUvsMap[type].addUvs(positions, uvs, this.mCubeUvsMap[type].south, index);
                }
                if (positions[index].x == 0 && positions[index + 1].x == 0 && positions[index + 2].x == 0 && positions[index + 3].x == 0) {
                    this.mCubeUvsMap[type].addUvs(positions, uvs, this.mCubeUvsMap[type].west, index);
                }
            }
            this.mCubeUvsMap[type].generate();
        }
        generateCurveUvs(type, nodeCube) {
            let uvs = [];
            this.mCurveUvsMap[type] = new CurveUvs();
            this.mCurveUvsMap[type].stoneMaterial = nodeCube.meshRenderer.material;
            nodeCube.meshFilter.sharedMesh.getUVs(uvs);
            let positions = [];
            nodeCube.meshFilter.sharedMesh.getPositions(positions);
            for (let i = 0; i < positions.length; i++) {
                let position = positions[i];
                position.x = GameManager.instance.toFixed(position.x);
                position.y = GameManager.instance.toFixed(position.y);
                position.z = GameManager.instance.toFixed(position.z);
            }
            for (let i = 0; i < positions.length / 4; i++) {
                let index = i * 4;
                if (positions[index].z == 0 && positions[index + 1].z == 0 && positions[index + 2].z == 0 && positions[index + 3].z == 0) {
                    this.mCurveUvsMap[type].init(positions, uvs, index);
                }
            }
        }
        changeMap(nodeSize, roleScript, islandOffsetX) {
            let clipPaths = [];
            let positionScale = MyGameConfig.POSITION_SCALE;
            let percentRadian = 2 * Math.PI / 32;
            let rollerPosition = roleScript.getRollerScript().getPosition();
            clipPaths[0] = new Array();
            let startX = 9999;
            let endX = -9999;
            let startZ = 9999;
            let endZ = -9999;
            let centerX;
            let centerZ;
            let sizePath = [];
            for (let i = 0; i < nodeSize.numChildren; i++) {
                let pos = nodeSize.getChildAt(i).transform.position;
                pos.x -= islandOffsetX;
                startX = Math.min(startX, pos.x);
                endX = Math.max(endX, pos.x);
                startZ = Math.min(startZ, pos.z);
                endZ = Math.max(endZ, pos.z);
                clipPaths[0].push({ X: GameManager.instance.toFixed(pos.x * positionScale), Y: GameManager.instance.toFixed(pos.z * positionScale) });
                sizePath.push(clipPaths[0][i]);
            }
            centerX = (endX - startX) / 2;
            centerZ = (endZ - startZ) / 2;
            startX = Math.floor(startX);
            endX = Math.ceil(endX);
            startZ = Math.floor(startZ);
            endZ = Math.ceil(endZ);
            let stoneType = -1;
            let nearStoneType = -1;
            for (let i = startX; i <= endX; i++) {
                for (let j = startZ; j <= endZ; j++) {
                    let gridInfo = this.mMap[i + "" + j];
                    if (gridInfo) {
                        this.cutMesh(gridInfo, null, clipPaths, positionScale);
                        for (let q = 0; q < gridInfo.crystalArr.length; q++) {
                            let script = gridInfo.crystalArr[q];
                            let distance = Laya.Vector3.distance(script.getPosition(), rollerPosition);
                            if (distance < MyGameConfig.RADIUS) {
                                script.catch();
                            }
                            else {
                                let num = this.ClipperLib.Clipper.PointInPolygon({
                                    X: GameManager.instance.toFixed(script.getPosition().x * MyGameConfig.POSITION_SCALE),
                                    Y: GameManager.instance.toFixed(script.getPosition().z * MyGameConfig.POSITION_SCALE)
                                }, sizePath);
                                if (num == -1 || num == 1) {
                                    script.catch();
                                }
                            }
                        }
                        let crushedStoneArr = [];
                        let saveCrushedStoneArr = [];
                        for (let q = 0; q < gridInfo.crushedStoneArr.length; q++) {
                            let info = gridInfo.crushedStoneArr[q];
                            let distance = Laya.Vector3.distance(info.pos, rollerPosition);
                            let b;
                            if (distance < MyGameConfig.RADIUS) {
                                b = GameManager.instance.roleScript.catchStone(info, true, info.node);
                            }
                            if (!b) {
                                crushedStoneArr.push(info);
                            }
                        }
                        gridInfo.crushedStoneArr = crushedStoneArr;
                        let tempStoneCoreArr = [];
                        let isCatchCore = false;
                        let coverPos = new Laya.Vector3();
                        for (let q = 0; q < gridInfo.stoneCoreArr.length; q++) {
                            let info = gridInfo.stoneCoreArr[q];
                            let distance = Laya.Vector3.distance(info.pos, rollerPosition);
                            let num = this.ClipperLib.Clipper.PointInPolygon({ X: GameManager.instance.toFixed((info.pos.x - islandOffsetX) * MyGameConfig.POSITION_SCALE), Y: GameManager.instance.toFixed(info.pos.z * MyGameConfig.POSITION_SCALE) }, sizePath);
                            if (num == -1 || num == 1) {
                                this.catchStoneCore(info, gridInfo, roleScript);
                                isCatchCore = true;
                            }
                            else {
                                tempStoneCoreArr.push(info);
                            }
                            if (distance < MyGameConfig.RADIUS + 0.2) {
                                nearStoneType = info.type;
                            }
                        }
                        gridInfo.stoneCoreArr = tempStoneCoreArr;
                        if (isCatchCore && tempStoneCoreArr.length == 0) {
                            this.clearedGrid(gridInfo);
                        }
                    }
                }
            }
            if (stoneType != -1) {
                SdkCenter.instance.vibrateShort();
            }
            if (nearStoneType != -1) {
                let stoneInfo = MyGameConfig.stoneConfig[nearStoneType];
                let force = GameManager.instance.roleScript.getRollerScript().getTotalForce();
                if (force > stoneInfo.life) {
                    roleScript.setSpeedRate(1);
                }
                else {
                    roleScript.setSpeedRate(1 / (stoneInfo.life / force));
                }
            }
            else {
                roleScript.setSpeedRate(1);
            }
        }
        createGride(x, z) {
            let index = x + "" + z;
            if (!this.mMap[index]) {
                this.mMap[index] = new GridInfo(x, z);
            }
            return this.mMap[index];
        }
        catchStoneCore(info, gridInfo, roleScript) {
        }
        clearedGrid(gridInfo) {
        }
        clearAll() {
            this.mMap = {};
            this.mCubeUvsMap = [];
            this.mCurveUvsMap = [];
        }
    }

    class MapManager extends BaseMapManager {
        constructor() {
            super(...arguments);
            this.mCreatedOreNum = 0;
            this.mCurCrystalArr = [];
            this.mRenderContainerContainer = [];
            this.mRenderContainerDestroyArr = [];
        }
        static get instance() {
            if (!this.mInstance) {
                this.mInstance = new MapManager();
            }
            return this.mInstance;
        }
        init() {
            super.init();
            this.mIsPvp = false;
        }
        start() {
            Laya.timer.frameLoop(200, this, () => {
                this.destroyNode();
                let render = [];
                for (let kej in this.mRenderableSprite3Ds) {
                    let stoneInfoArr = this.mRenderableSprite3Ds[kej];
                    for (let i = 0; i < stoneInfoArr.length; i++) {
                        if (!stoneInfoArr[i].node.destroyed) {
                            render.push(stoneInfoArr[i].node);
                        }
                    }
                }
                this.mRenderableSprite3Ds = {};
                if (render.length > 0) {
                    Laya.StaticBatchManager.combine(this.mCurChildIsland, render);
                }
                this.mRenderContainerContainer = [];
            });
        }
        createMap(level, callback) {
            this.mMap = {};
            this.curIslandTotalCatchStoneCore = 0;
            this.curIslandTotalCatchStone = 0;
            UiUtils.loadJson(MyGameConfig.URL_CONFIG + "level/" + MyGameConfig.levelConfig[level].configName, (json) => {
                let res3dArr = [];
                let stoneArr = json["stone"];
                for (let key in json["useStone"]) {
                    let stoneConfig = MyGameConfig.stoneConfig[key];
                    res3dArr.push(MyGameConfig.URL_RES3D_STONE + stoneConfig.stoneModel);
                    res3dArr.push(MyGameConfig.URL_RES3D_STONE + stoneConfig.stoneCurveModel);
                    res3dArr.push(MyGameConfig.URL_RES3D_STONE + stoneConfig.stoneFloorModel);
                    res3dArr.push(MyGameConfig.URL_RES3D_STONE + stoneConfig.stoneCatchModel);
                }
                let childIslandConfigInfo = MyGameConfig.levelConfig[level];
                res3dArr.push(MyGameConfig.URL_RES3D_ISLAND + childIslandConfigInfo.modelName);
                Laya.loader.create(res3dArr, new Laya.Handler(this, () => {
                    this.mCurChildIsland = Laya.loader.getRes(MyGameConfig.URL_RES3D_ISLAND + childIslandConfigInfo.modelName).clone();
                    GameManager.instance.scene3d.addChild(this.mCurChildIsland);
                    GameManager.instance.curChildIsland = this.mCurChildIsland;
                    this.mCurChildIsland.transform.position = new Laya.Vector3(0, 0, -70);
                    let totalStoneCount = 0;
                    for (let key in json["useStone"]) {
                        totalStoneCount += json["useStone"][key];
                    }
                    for (let key in json["useStone"]) {
                        let stoneConfig = MyGameConfig.stoneConfig[key];
                        let nodeStone = Laya.loader.getRes(MyGameConfig.URL_RES3D_STONE + stoneConfig.stoneModel);
                        let nodeCurveStone = Laya.loader.getRes(MyGameConfig.URL_RES3D_STONE + stoneConfig.stoneCurveModel);
                        this.generateCubeUvs(stoneConfig.type, nodeStone);
                        this.generateCurveUvs(stoneConfig.type, nodeCurveStone);
                        stoneConfig.loss = childIslandConfigInfo.costDurable / totalStoneCount / 16;
                    }
                    let stoneCoreWidth = 1 / MyGameConfig.gameConfig.stoneCoreComposeStone;
                    let savaData = DataManager.getMapData();
                    let tempInfoArr = [];
                    for (let i = 0; i < stoneArr.length; i++) {
                        let stoneConfigInfo = stoneArr[i];
                        let scale = stoneConfigInfo.scale;
                        let startPos = stoneConfigInfo.pos;
                        let type = stoneConfigInfo.name;
                        for (let j = 0; j < scale.x; j++) {
                            for (let k = 0; k < scale.z; k++) {
                                tempInfoArr.push({ scale: scale, startPos: startPos, type: type, pos: new Laya.Vector3(startPos.x + j, 0, startPos.z - k), height: 1 });
                                this.curIslandTotalCatchStoneCore += 16;
                                this.curIslandTotalCatchStone += (16 / MyGameConfig.gameConfig.stoneCoreComposeStone);
                            }
                        }
                    }
                    this.mCurCrystalArr = json["crystal"];
                    let index = 0;
                    let createNum = 40;
                    Laya.timer.frameLoop(1, this, function s() {
                        if (index >= tempInfoArr.length - 1) {
                            Laya.timer.clear(this, s);
                        }
                        let renderableSprite3Ds = [];
                        for (let i = index; i < tempInfoArr.length && i < index + createNum; i++) {
                            let info = tempInfoArr[i];
                            let pos = info.pos;
                            info.height = 0.7;
                            let height = info.height;
                            let type = info.type;
                            let gridInfo = this.createGride(pos.x, pos.z);
                            let obj = {};
                            obj.height = height;
                            obj.type = type;
                            obj.stonePointArr = [];
                            if (savaData[pos.x + "" + pos.z]) {
                            }
                            else {
                                let cubeVerticeArr = JSON.parse(JSON.stringify(this.mCubeVerticeArr));
                                for (let q = 0; q < cubeVerticeArr.length / 3; q++) {
                                    cubeVerticeArr[q * 3 + 0] += pos.x;
                                    cubeVerticeArr[q * 3 + 1] = height;
                                    cubeVerticeArr[q * 3 + 2] += pos.z;
                                }
                                let nodeStone = this.createMesh(type, cubeVerticeArr, this.mCubeIndicesArr, pos.x, pos.z);
                                obj.node = nodeStone;
                                obj.stonePointArr[0] = [];
                                let leftUpPoint = { X: GameManager.instance.toFixed(pos.x * MyGameConfig.POSITION_SCALE), Y: GameManager.instance.toFixed((pos.z - 1) * MyGameConfig.POSITION_SCALE) };
                                let rightUpPoint = { X: GameManager.instance.toFixed((pos.x + 1) * MyGameConfig.POSITION_SCALE), Y: GameManager.instance.toFixed((pos.z - 1) * MyGameConfig.POSITION_SCALE) };
                                let rightDownPoint = { X: GameManager.instance.toFixed((pos.x + 1) * MyGameConfig.POSITION_SCALE), Y: GameManager.instance.toFixed(pos.z * MyGameConfig.POSITION_SCALE) };
                                let leftDownPoint = { X: GameManager.instance.toFixed(pos.x * MyGameConfig.POSITION_SCALE), Y: GameManager.instance.toFixed(pos.z * MyGameConfig.POSITION_SCALE) };
                                obj.stonePointArr[0].push(leftUpPoint);
                                obj.stonePointArr[0].push(rightUpPoint);
                                obj.stonePointArr[0].push(rightDownPoint);
                                obj.stonePointArr[0].push(leftDownPoint);
                                let preLength = gridInfo.stoneCoreArr.length;
                                for (let q = preLength; q < preLength + 4; q++) {
                                    for (let t = 0; t < 4; t++) {
                                        gridInfo.stoneCoreArr.push({ type: type, pos: new Laya.Vector3(pos.x + stoneCoreWidth / 2 + q * stoneCoreWidth, 0, pos.z - stoneCoreWidth / 2 - stoneCoreWidth * t) });
                                    }
                                }
                                gridInfo.stoneInfoArr.push(obj);
                                this.mCurChildIsland.addChild(nodeStone);
                                renderableSprite3Ds.push(nodeStone);
                            }
                        }
                        Laya.StaticBatchManager.combine(this.mCurChildIsland, renderableSprite3Ds);
                        index += createNum;
                    });
                    callback(this.mCurChildIsland);
                }));
            });
        }
        circleBoom(position) {
            let radius = MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_EXPLOSIVE].range;
            let startX = Math.floor(position.x - radius);
            let endX = Math.ceil(position.x + radius);
            let startZ = Math.floor(position.z - radius);
            let endZ = Math.ceil(position.z + radius);
            let clipPaths = [];
            let percentRadian = 2 * Math.PI / 16;
            clipPaths[0] = new Array();
            for (let i = 0; i < 16; i++) {
                let x = Math.cos(i * percentRadian) * radius + position.x;
                let y = Math.sin(i * percentRadian) * radius + position.z;
                clipPaths[0].push({ X: GameManager.instance.toFixed(x * MyGameConfig.POSITION_SCALE), Y: GameManager.instance.toFixed(y * MyGameConfig.POSITION_SCALE) });
            }
            SceneResManager.playEffectBoom(position);
            for (let i = startX; i <= endX; i++) {
                for (let j = startZ; j <= endZ; j++) {
                    let gridInfo = this.mMap[i + "" + j];
                    if (gridInfo) {
                        this.cutMesh(gridInfo, null, clipPaths, MyGameConfig.POSITION_SCALE);
                        let tempStoneCoreArr = [];
                        let saveTempStoneCoreArr = [];
                        for (let q = 0; q < gridInfo.stoneCoreArr.length; q++) {
                            let info = gridInfo.stoneCoreArr[q];
                            let distance = Laya.Vector3.distance(info.pos, position);
                            if (distance < radius) {
                                GameManager.instance.roleScript.catchStoneCoreCreateStone(info, gridInfo);
                            }
                            else {
                                tempStoneCoreArr.push(info);
                                saveTempStoneCoreArr.push({ x: info.pos.x, z: info.pos.z });
                            }
                        }
                        gridInfo.stoneCoreArr = tempStoneCoreArr;
                    }
                }
            }
        }
        createFloorStone(info, gridInfo) {
            if (!gridInfo) {
                let floorX = Math.floor(info.pos.x);
                let floorZ = Math.floor(info.pos.z);
                gridInfo = this.createGride(floorX, floorZ);
            }
            if (gridInfo.crushedStoneArr.length == 0) {
                let script = SceneResManager.createCrushedStone(this.mCurChildIsland, info.type, new Laya.Vector3(info.pos.x, 0, info.pos.z), GameManager.instance.roleScript.getNodeRole().transform.rotationEuler);
                let obj = { type: info.type, node: script.getNode(), pos: info.pos, num: 1 };
                script.jump(info.pos, obj, (script, data) => {
                    PoolManager.recover(script.getNode().name, script.getNode());
                    let newNode = SceneResManager.createStaticCrushedStone(this.mCurChildIsland, data.type, data.node.transform.position, data.node.transform.rotationEuler);
                    data.node = newNode;
                    let floorX = Math.floor(info.pos.x);
                    let floorZ = Math.floor(info.pos.z);
                    if (!this.mRenderableSprite3Ds[floorX + "" + floorZ]) {
                        this.mRenderableSprite3Ds[floorX + "" + floorZ] = {};
                    }
                    this.mRenderableSprite3Ds[floorX + "" + floorZ] = data;
                });
                gridInfo.crushedStoneArr.push(obj);
            }
            else {
                gridInfo.crushedStoneArr[0].num++;
                let scale = 1 + gridInfo.crushedStoneArr[0].num / 5;
            }
        }
        createCrystal() {
            if (this.mCreatedOreNum < MyGameConfig.levelConfig[GameManager.instance.curLevel].crystalNum) {
                let rate = MathUtils.nextInt(0, 100);
                if (rate < MyGameConfig.gameConfig.createCrystalRate) {
                    let index = MathUtils.nextInt(0, this.mCurCrystalArr.length - 1);
                    let startPos = this.mCurCrystalArr[index].pos;
                    let scale = this.mCurCrystalArr[index].scale;
                    let pos = new Laya.Vector3(MathUtils.nextFloat(startPos.x + 0.3, startPos.x + scale.x - 0.3), 0, MathUtils.nextFloat(startPos.z - 0.3, startPos.z - scale.z + 0.3));
                    let gridInfo = this.createGride(Math.floor(pos.x), Math.floor(pos.z));
                    if (gridInfo.crystalArr.length > 0) {
                        return;
                    }
                    let script = SceneResManager.createCrystal(this.mCurChildIsland, pos, gridInfo);
                    gridInfo.crystalArr.push(script);
                    this.mCreatedOreNum++;
                }
            }
        }
        createDesignDiagram() {
            let lockDesignDiagram = DataManager.getLockDesignDiagram();
            if (lockDesignDiagram.length > 0) {
                let index = MathUtils.nextInt(0, lockDesignDiagram.length - 1);
                let rate = MathUtils.nextInt(0, 100);
                if (rate < lockDesignDiagram[index].rate) {
                    UiUtils.addChild(new GetDesigndiagramDialog(lockDesignDiagram[index]));
                }
            }
        }
        saveMapData() {
        }
        saveTruckData() {
            DataManager.setTruckData(GameManager.instance.roleScript.getTruckData());
        }
        destroyNode() {
            for (let i = 0; i < this.mRenderContainerDestroyArr.length; i++) {
                let node = this.mRenderContainerDestroyArr[i];
                if (!node.destroyed) {
                    node.destroy(true);
                }
            }
            this.mRenderContainerDestroyArr = [];
        }
        pushContainerStatic(node) {
            this.mRenderContainerContainer.push(node);
        }
        pushMinCarStatic(node) {
        }
        pushDestroyStatic(node) {
            node.active = false;
            this.mRenderContainerDestroyArr.push(node);
        }
        catchStoneCore(info, gridInfo, roleScript) {
            GameManager.instance.roleScript.catchStoneCore(info, gridInfo);
        }
        clearAll() {
            super.clearAll();
            this.mCurCrystalArr = [];
            this.curIslandTotalCatchStoneCore = 0;
            this.mCreatedOreNum = 0;
            DataManager.setMapData(null);
            DataManager.setTruckData(null);
            GameManager.instance.roleScript.refresh();
            Laya.timer.clearAll(this);
        }
    }

    class CameraMoveScript extends Laya.Script3D {
        constructor() {
            super();
            this._tempVector3 = new Laya.Vector3();
            this.yawPitchRoll = new Laya.Vector3();
            this.resultRotation = new Laya.Quaternion();
            this.tempRotationZ = new Laya.Quaternion();
            this.tempRotationX = new Laya.Quaternion();
            this.tempRotationY = new Laya.Quaternion();
            this.rotaionSpeed = 0.00006;
        }
        _updateRotation() {
            if (Math.abs(this.yawPitchRoll.y) < 1.50) {
                Laya.Quaternion.createFromYawPitchRoll(this.yawPitchRoll.x, this.yawPitchRoll.y, this.yawPitchRoll.z, this.tempRotationZ);
                this.tempRotationZ.cloneTo(this.camera.transform.localRotation);
                this.camera.transform.localRotation = this.camera.transform.localRotation;
            }
        }
        onAwake() {
            Laya.stage.on(Laya.Event.RIGHT_MOUSE_DOWN, this, this.mouseDown);
            Laya.stage.on(Laya.Event.RIGHT_MOUSE_UP, this, this.mouseUp);
            this.camera = this.owner;
        }
        onUpdate() {
            var elapsedTime = Laya.timer.delta;
            if (!isNaN(this.lastMouseX) && !isNaN(this.lastMouseY) && this.isMouseDown) {
                var scene = this.owner.scene;
                Laya.KeyBoardManager.hasKeyDown(87) && this.moveForward(-0.01 * elapsedTime);
                Laya.KeyBoardManager.hasKeyDown(83) && this.moveForward(0.01 * elapsedTime);
                Laya.KeyBoardManager.hasKeyDown(65) && this.moveRight(-0.01 * elapsedTime);
                Laya.KeyBoardManager.hasKeyDown(68) && this.moveRight(0.01 * elapsedTime);
                Laya.KeyBoardManager.hasKeyDown(81) && this.moveVertical(0.01 * elapsedTime);
                Laya.KeyBoardManager.hasKeyDown(69) && this.moveVertical(-0.01 * elapsedTime);
                var offsetX = Laya.stage.mouseX - this.lastMouseX;
                var offsetY = Laya.stage.mouseY - this.lastMouseY;
                var yprElem = this.yawPitchRoll;
                yprElem.x -= offsetX * this.rotaionSpeed * elapsedTime;
                yprElem.y -= offsetY * this.rotaionSpeed * elapsedTime;
                this._updateRotation();
            }
            this.lastMouseX = Laya.stage.mouseX;
            this.lastMouseY = Laya.stage.mouseY;
        }
        onDestroy() {
            Laya.stage.off(Laya.Event.RIGHT_MOUSE_DOWN, this, this.mouseDown);
            Laya.stage.off(Laya.Event.RIGHT_MOUSE_UP, this, this.mouseUp);
        }
        mouseDown(e) {
            this.camera.transform.localRotation.getYawPitchRoll(this.yawPitchRoll);
            this.lastMouseX = Laya.stage.mouseX;
            this.lastMouseY = Laya.stage.mouseY;
            this.isMouseDown = true;
        }
        mouseUp(e) {
            this.isMouseDown = false;
        }
        mouseOut(e) {
            this.isMouseDown = false;
        }
        moveForward(distance) {
            this._tempVector3.x = this._tempVector3.y = 0;
            this._tempVector3.z = distance;
            this.camera.transform.translate(this._tempVector3);
        }
        moveRight(distance) {
            this._tempVector3.y = this._tempVector3.z = 0;
            this._tempVector3.x = distance;
            this.camera.transform.translate(this._tempVector3);
        }
        moveVertical(distance) {
            this._tempVector3.x = this._tempVector3.z = 0;
            this._tempVector3.y = distance;
            this.camera.transform.translate(this._tempVector3, false);
        }
    }

    class Vector3Utils {
        static getMinAngle(targetRotation, currentOrientation) {
            var rotationY = (targetRotation % 360) - (currentOrientation % 360);
            if (rotationY > 180) {
                rotationY = rotationY - 360;
            }
            else if (rotationY < -180) {
                rotationY = 360 + rotationY;
            }
            return rotationY;
        }
        static toTargetQuaternion(selfPos, targetPos) {
            var currentDirction = new Laya.Vector3(0, 0, 0);
            Laya.Vector3.subtract(selfPos, targetPos, currentDirction);
            Laya.Vector3.normalize(currentDirction, currentDirction);
            currentDirction = new Laya.Vector3(-currentDirction.x, 0, -currentDirction.z);
            var targetRot = new Laya.Quaternion();
            Laya.Quaternion.rotationLookAt(currentDirction, Vector3Utils.UP, targetRot);
            targetRot.invert(targetRot);
            return targetRot;
        }
    }
    Vector3Utils.ZERO = new Laya.Vector3(0, 0, 0);
    Vector3Utils.UP = new Laya.Vector3(0, 1, 0);

    class DirectionScript extends Laya.Script3D {
        constructor() {
            super(...arguments);
            this.STATUS_IDLE = 0;
            this.STATUS_MINING = 1;
            this.STATUS_SELL = 2;
            this.STATUS_REPAIR = 3;
            this.STATUS_MAP = 4;
            this.mIsCheck = false;
        }
        onAwake() {
            this.mNode = this.owner;
            this.mNodeDirection = this.mNode.getChildAt(0);
            this.mTargetMining = new Laya.Vector3(0, this.mNode.transform.position.y, 2);
            this.mTargetSell = this.getPoint(MyGameConfig.FUNCTION_ID_SELL).position.clone();
            this.mTargetSell.y = this.mNode.transform.position.y;
            this.mTargetSell.z += this.mNodeDirection.transform.localPosition.z;
            this.mTargetRepair = this.getPoint(MyGameConfig.FUNCTION_ID_REPAIR_STATION).position.clone();
            this.mTargetRepair.y = this.mNode.transform.position.y;
            this.mTargetRepair.z += this.mNodeDirection.transform.localPosition.z;
            this.mTargetMap = this.getPoint(MyGameConfig.FUNCTION_ID_MAP).position.clone();
            this.mTargetMap.y = this.mNode.transform.position.y;
            this.mTargetMap.z = this.mNodeDirection.transform.localPosition.z;
            this.mTargetPos = this.mTargetMining;
        }
        onUpdate() {
            if (!GameManager.instance.isPause) {
                this.mNodeDirection.transform.lookAt(this.mTargetPos, Vector3Utils.UP, false);
            }
        }
        getPoint(id) {
            for (let key in MyGameConfig.functionUnlockConfig) {
                let functionUnlock = MyGameConfig.functionUnlockConfig[key];
                if (id == functionUnlock.id) {
                    return functionUnlock;
                }
            }
        }
        init(node) {
            this.mNode = node;
        }
        check() {
            if (this.mIsCheck) {
                if (GameManager.instance.roleScript.getCurState() == MyGameConfig.STATE_INVALID) {
                    if (GameManager.instance.roleScript.getCatchStoneCoreProgress() == 1) {
                        if (GameManager.instance.roleScript.getContainerProgress() > 0) {
                            this.mTargetPos = this.mTargetSell;
                        }
                        else {
                            this.mTargetPos = this.mTargetMap;
                        }
                        this.mNode.active = true;
                    }
                    else if (GameManager.instance.roleScript.getDurableProgress() < 0.2) {
                        this.mTargetPos = this.mTargetRepair;
                        this.mNode.active = true;
                    }
                    else if (GameManager.instance.roleScript.getContainerProgress() > 0.8) {
                        this.mTargetPos = this.mTargetSell;
                        this.mNode.active = true;
                    }
                    else if (GameManager.instance.roleScript.getPosition().z > 1) {
                        this.mTargetPos = this.mTargetMining;
                        this.mNode.active = true;
                    }
                    else {
                        this.mNode.active = false;
                    }
                }
                else {
                    this.mNode.active = false;
                }
            }
        }
        start() {
            this.mIsCheck = true;
        }
        hide() {
            this.mIsCheck = false;
        }
        isActive() {
            return this.mNode.active;
        }
        showNode(b) {
            this.mNode.active = b;
        }
    }

    class FullStoneTipScript extends Laya.Script3D {
        constructor() {
            super(...arguments);
            this.mAddAlpha = 1;
            this.mIsUpdate = false;
        }
        onAwake() {
            this.mNode = this.owner;
            this.mMaterial = this.mNode.meshRenderer.material;
            this.mStartAlbedoColorA = this.mMaterial.albedoColorA;
            let scale = this.mNode.transform.getWorldLossyScale();
            this.mNode.transform.setWorldLossyScale(new Laya.Vector3(scale.x, 0, scale.z));
        }
        onUpdate() {
            if (this.mNode && this.mIsUpdate) {
                this.mMaterial.albedoColorA += this.mAddAlpha * 0.01;
                if (this.mMaterial.albedoColorA >= this.mStartAlbedoColorA) {
                    this.mAddAlpha = -1;
                    this.mMaterial.albedoColorA = this.mStartAlbedoColorA;
                }
                else if (this.mMaterial.albedoColorA <= 0) {
                    this.mAddAlpha = 1;
                    this.mMaterial.albedoColorA = 0;
                }
            }
            if (!this.mIsUpdate) {
                this.mNode.active = false;
            }
        }
        startAni(layerNum) {
            if (!this.mIsUpdate) {
                this.mIsUpdate = true;
                this.mNode.active = true;
                let scale = this.mNode.transform.getWorldLossyScale();
                this.mNode.transform.setWorldLossyScale(new Laya.Vector3(scale.x, (layerNum + 1) * 0.075, scale.z));
                EventUtils.dispatchEvent(MyGameConfig.EVENT_SHOW_FULL_TIP, "");
            }
        }
        stopAni() {
            this.mIsUpdate = false;
            this.mNode.active = false;
        }
        getNode() {
            return this.mNode;
        }
    }

    class BasePropsScript {
        constructor() {
            this.mTime = 0;
            this.mIsUpdate = false;
            this.mType = -1;
        }
        update() {
            if (this.mIsUpdate) {
                if (this.mTime < 0) {
                    this.mIsUpdate = false;
                    this.end();
                }
                else {
                    this.mTime -= GameManager.instance.timerDelta;
                    this.takeEffect();
                }
            }
        }
        start() {
        }
        takeEffect() {
        }
        end() {
        }
        refresh() {
            this.mTime = MyGameConfig.factoryGoodsConfig[this.mType].effectTime;
            this.mIsUpdate = true;
            this.start();
        }
        clear() {
            if (this.mTime > 0) {
                this.mTime = -1;
                this.mIsUpdate = false;
                this.end();
            }
        }
    }

    class PropsCapacityScript extends BasePropsScript {
        constructor() {
            super(...arguments);
            this.mType = MyGameConfig.PROPS_CAPACITY;
        }
        start() {
            let level = DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_TRUCK_CAPACITY) + MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_CAPACITY].range;
            if (level > MyGameConfig.truckConfig.length - 1) {
                level = MyGameConfig.truckConfig.length - 1;
            }
            GameManager.instance.roleScript.setMaxCapacity(level);
        }
        end() {
            GameManager.instance.roleScript.setMaxCapacity(DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_TRUCK_CAPACITY));
        }
    }

    class PropsExplosiveScript extends BasePropsScript {
        constructor() {
            super(...arguments);
            this.mType = MyGameConfig.PROPS_EXPLOSIVE;
        }
        takeEffect() {
        }
        start() {
            this.mTime = 1;
            MapManager.instance.circleBoom(GameManager.instance.roleScript.getPosition());
        }
    }

    class PropsPowerScript extends BasePropsScript {
        constructor() {
            super(...arguments);
            this.mType = MyGameConfig.PROPS_POWER;
        }
        start() {
            let force = GameManager.instance.roleScript.getRollerScript().calculateForce();
            GameManager.instance.roleScript.getRollerScript().setTotalForce(force * MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_POWER].range);
            GameManager.instance.roleScript.getRollerScript().showPower();
        }
        end() {
            GameManager.instance.roleScript.getRollerScript().calculateForce();
            GameManager.instance.roleScript.getRollerScript().hidePower();
        }
    }

    class PropsRollerScript extends BasePropsScript {
        constructor() {
            super();
            this.mType = MyGameConfig.PROPS_ROLLER;
        }
        start() {
            let nodeSize = GameManager.instance.roleScript.getNodeSize();
            if (!this.mRollerLocalPosition) {
                this.mRollerLocalPosition = [];
                for (let i = 0; i < GameManager.instance.roleScript.getNodeSize().numChildren; i++) {
                    this.mRollerLocalPosition.push(nodeSize.getChildAt(i).transform.localPosition.clone());
                }
            }
            let level = DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_ROLLER_SIZE) + MyGameConfig.factoryGoodsConfig[this.mType].range;
            if (level > MyGameConfig.truckConfig.length - 1) {
                level = MyGameConfig.truckConfig.length - 1;
            }
            GameManager.instance.roleScript.getRollerScript().scaleRoller(MyGameConfig.truckConfig[level].rollerSize);
        }
        end() {
            GameManager.instance.roleScript.getRollerScript().scaleRoller(MyGameConfig.truckConfig[DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_ROLLER_SIZE)].rollerSize);
        }
    }

    class CommonTipDialog extends ui.game.CommonTipDialogUI {
        constructor(content, okCallback, cancalCallback, okName, cancelName) {
            super();
            this.mContent = content;
            this.mOkCallback = okCallback;
            this.mCancelCalback = cancalCallback;
            this.mOkName = okName;
            this.mCancelName = cancelName;
        }
        onAwake() {
            this.width = Laya.stage.width;
            this.mLbContent.changeText(this.mContent);
            if (this.mOkName) {
                this.mLbOkName.changeText(this.mOkName);
            }
            if (this.mCancelName) {
                this.mLbCancelName.changeText(this.mCancelName);
            }
            if (!this.mCancelCalback) {
                this.mBtnOk.centerX = 0;
                this.mBtnCancel.visible = false;
            }
            UiUtils.click(this.mBtnOk, this, () => {
                if (this.mOkCallback) {
                    this.mOkCallback();
                }
                this.onCloseClick();
            });
            UiUtils.click(this.mBtnCancel, this, () => {
                if (this.mCancelCalback) {
                    this.mCancelCalback();
                }
                this.onCloseClick();
            });
            UiUtils.hideLoading();
        }
        onCloseClick() {
            this.removeSelf();
        }
    }

    class FactoryDialog extends ui.game.FactoryDialogUI {
        constructor() {
            super(...arguments);
            this.mGoodsInfoArr = [];
        }
        onAwake() {
            this.name = MyGameConfig.NAME_DIALOG_FACTORY;
            this.width = Laya.stage.width;
            EventUtils.onEvent(this, MyGameConfig.EVENT_REFRESH_PRODUCT, (num) => {
                this.initFactoryView(num);
            });
            this.initData();
            this.initView();
            UiUtils.hideLoading();
        }
        onDisable() {
            EventUtils.offAllEventByNode(this);
        }
        initData() {
            let propValue = DataManager.getPropsInfo();
            for (let key in MyGameConfig.factoryGoodsConfig) {
                let propInfo = MyGameConfig.factoryGoodsConfig[key];
                propInfo.num = propValue[propInfo.id];
                if (!propInfo.num) {
                    propInfo.num = 0;
                }
                for (let i = 0; i < MyGameConfig.designDiagramConfig.length; i++) {
                    let designDiagramInfo = MyGameConfig.designDiagramConfig[i];
                    if (designDiagramInfo.goodsId == propInfo.id) {
                        if (designDiagramInfo.isUnlock && designDiagramInfo.productionTime &&
                            (GameManager.instance.curTime - designDiagramInfo.productionTime) >= designDiagramInfo.time) {
                            propInfo.isUnlock = true;
                            break;
                        }
                    }
                }
                this.mGoodsInfoArr.push(MyGameConfig.factoryGoodsConfig[key]);
            }
            this.mProductLastUnlock = DataManager.getLevelByKey(MyGameConfig.KEY_DATA_PRODUCT_LAST_UNLOCK) + 1;
            this.initFactoryData();
            this.initFactoryView(DataManager.getRewardGoods());
        }
        initFactoryData() {
        }
        initFactoryView(num) {
            this.mRewardNum = num;
            this.mLbStorage.changeText("Stored: " + num + "/" + MyGameConfig.gameConfig.rewardMax);
            let progress = num / MyGameConfig.gameConfig.rewardMax;
            this.mMaskCapacityProgress.graphics.clear();
            this.mNodeCapacityProgress.visible = progress != 0;
            this.mMaskCapacityProgress.graphics.drawRect(0, 0, this.mNodeCapacityProgress.width * progress, this.mNodeCapacityProgress.height, "#ff0000");
            this.mBtnSell.disabled = num == 0;
        }
        initView() {
            this.mListProduct.renderHandler = new Laya.Handler(this, this.updateListProductItem);
            this.mListProduct.array = this.mGoodsInfoArr;
            UiUtils.click(this.mBtnSell, this, this.onSellClick);
            UiUtils.click(this.mBtnClose, this, this.onCloseClick);
        }
        initTab(index) {
        }
        updateListProductItem(ceil, index) {
            let imgIc = ceil.getChildByName("imgIc");
            let lbName = ceil.getChildByName("lbName");
            let lbNum = ceil.getChildByName("lbNum");
            let btnBuy = ceil.getChildByName("btnBuy");
            let lbBtn = btnBuy.getChildAt(0);
            let nodeCostGold = ceil.getChildByName("nodeCostGold");
            let lbCostGold = nodeCostGold.getChildByName("lbGoldValue");
            let nodeCostCrystal = ceil.getChildByName("nodeCostCrystal");
            let lbCostCrystal = nodeCostCrystal.getChildByName("lbCrystalValue");
            let data = ceil.dataSource;
            let goldValue = DataManager.getGoldValue();
            let crystalValue = DataManager.getCrystalValue();
            imgIc.skin = "common/" + data.imgName;
            lbName.changeText(data.name);
            lbNum.changeText("x" + data.num);
            nodeCostCrystal.visible = data.costCrystal != 0;
            if (data.isUnlock) {
                lbBtn.changeText("Buy");
            }
            else {
                lbBtn.changeText("Lock");
                btnBuy.disabled = true;
            }
            UiUtils.click(btnBuy, this, (args) => {
                let data = args[0];
                DataManager.addPropValue(data.id, 1, () => {
                    DataManager.addGoldValue(-data.costGold);
                    DataManager.addCrystalValue(-data.costCrystal);
                    this.mListProduct.refresh();
                });
            }, [data], AudioManager.NAME_BUY);
        }
        onSellClick() {
            if (this.mRewardNum > 0) {
                let price = this.mRewardNum * MyGameConfig.gameConfig.rewardPrice;
                DataManager.addGoldValue(price);
                DataManager.setRewardGoods(0);
                this.initFactoryView(0);
            }
        }
        onCloseClick() {
            this.removeSelf();
            GameManager.instance.isControl = true;
        }
    }

    class BaseState {
        constructor(owner) {
            this.mOwner = owner;
        }
        get owner() {
            return this.owner;
        }
        onEnter() {
        }
        onUpdate() {
        }
        onLeave() {
        }
        getStateKey() {
            return MyGameConfig.STATE_INVALID;
        }
    }

    class CharacterBaseState extends BaseState {
        constructor(owner) {
            super(owner);
            this.mOwner = owner;
        }
        get owner() {
            return this.mOwner;
        }
        getPoint(id) {
            for (let key in MyGameConfig.functionUnlockConfig) {
                let functionUnlock = MyGameConfig.functionUnlockConfig[key];
                if (id == functionUnlock.id) {
                    return functionUnlock;
                }
            }
        }
        getSceneNode(id) {
            let nodeMainIsland = GameManager.instance.scene3d.getChildByName("node_main_island");
            for (let key in MyGameConfig.functionUnlockConfig) {
                let functionUnlock = MyGameConfig.functionUnlockConfig[key];
                if (functionUnlock.id == id) {
                    let nodeUnLock = nodeMainIsland.getChildByName(functionUnlock.nodeName);
                    return nodeUnLock;
                }
            }
        }
    }

    class CharacterFactoryState extends CharacterBaseState {
        constructor(owner) {
            super(owner);
            this.mPointPosition = this.getPoint(MyGameConfig.FUNCTION_ID_FACTORY).position;
            this.mFunctionInfo = MyGameConfig.functionUnlockConfig[MyGameConfig.FUNCTION_ID_FACTORY];
        }
        onEnter() {
            if (this.mFunctionInfo.isUnlock) {
                UiUtils.addChild(new FactoryDialog());
            }
            else {
                UiUtils.addChild(new CommonTipDialog("Are you willing to spend " + this.mFunctionInfo.unLockCostGold +
                    " gold coins and\n" + this.mFunctionInfo.unlockCostCrystal + " crystal construction factory?", () => {
                    let goldValue = DataManager.getGoldValue();
                    let crystalValue = DataManager.getCrystalValue();
                    if (goldValue < this.mFunctionInfo.unLockCostGold || crystalValue < this.mFunctionInfo.unlockCostCrystal) {
                        UiUtils.showToast("lack of resources");
                        return;
                    }
                    DataManager.addUnlockFunction(this.mFunctionInfo.id, () => {
                        this.mFunctionInfo.isUnlock = true;
                        UiUtils.addChild(new FactoryDialog());
                        UiUtils.showToast("unlocked successfully");
                    });
                }, () => {
                }, "Ok", "No"));
            }
        }
        getStateKey() {
            return MyGameConfig.STATE_FACTORY;
        }
    }

    class CharacterHaulState extends CharacterBaseState {
        constructor(owner) {
            super(owner);
            this.STATUS_IDLE = 0;
            this.STATUS_TAKE_OFF = 1;
            this.STATUS_FLYING = 2;
            this.STATUS_LAND = 3;
            this.SPEED_LIFT = 0.007;
            this.MAX_FLY_HEIGHT = 5;
            this.SPEED = 0.3;
            this.mCurStatus = this.STATUS_IDLE;
            this.mTempVec3 = new Laya.Vector3();
            this.mIsHaul = false;
            this.mIsCarFollow = false;
            this.mStepIndex = 0;
            this.mPointPosition = this.getPoint(MyGameConfig.FUNCTION_ID_TRACTOR).position;
            this.mRepairPosition = this.getPoint(MyGameConfig.FUNCTION_ID_REPAIR_STATION).position;
            this.mNodeTractor = this.getSceneNode(MyGameConfig.FUNCTION_ID_TRACTOR);
            this.mNodeScene = this.getSceneNode(MyGameConfig.FUNCTION_ID_REPAIR_STATION);
            this.mCamera = this.mNodeScene.getChildByName("Main Camera");
            this.addHandler();
        }
        onEnter() {
            this.mCurStatus = this.STATUS_TAKE_OFF;
            this.mIsHaul = true;
            EventUtils.dispatchEvent(MyGameConfig.EVENT_HIDE_VIEW_DURABLE, false);
            GameManager.instance.roleScript.setRepairRate(MyGameConfig.gameConfig.repairPunish);
        }
        onUpdate() {
            let self = this;
            switch (this.mCurStatus) {
                case this.STATUS_TAKE_OFF:
                    switch (this.mStepIndex) {
                        case 0:
                            if (!this.mLiftCallback) {
                                this.takeOff(this.MAX_FLY_HEIGHT);
                                this.mTargetPosition = new Laya.Vector3(this.mOwner.getPosition().x, this.MAX_FLY_HEIGHT, this.owner.getPosition().z);
                                this.mLiftCallback = function () {
                                    self.mCurStatus = self.STATUS_FLYING;
                                    self.tweenToTarget(this.mTargetPosition, () => {
                                        self.mCurStatus = self.STATUS_IDLE;
                                        self.tweenToRorate(this.mOwner.getRotationEuler().y - 90, () => {
                                            self.mStepIndex++;
                                            self.mLiftCallback = null;
                                            self.mCurStatus = self.STATUS_LAND;
                                        });
                                    });
                                };
                            }
                            break;
                        case 2:
                            this.mIsCarFollow = true;
                            if (!this.mLiftCallback) {
                                this.takeOff(this.MAX_FLY_HEIGHT);
                                this.mTargetPosition = new Laya.Vector3(self.mRepairPosition.x, self.MAX_FLY_HEIGHT, self.mRepairPosition.z);
                                self.mLiftCallback = function () {
                                    self.mCurStatus = self.STATUS_FLYING;
                                    self.tweenToTarget(self.mTargetPosition, () => {
                                        let angle = Vector3Utils.getMinAngle(90, self.owner.getRotationEuler().y);
                                        self.mCurStatus = self.STATUS_IDLE;
                                        self.tweenToRorate(self.mNodeTractor.transform.rotationEuler.y + angle, () => {
                                            self.mStepIndex++;
                                            self.mLiftCallback = null;
                                            self.mCurStatus = self.STATUS_LAND;
                                        });
                                    });
                                };
                            }
                            break;
                        case 4:
                            if (!this.mLiftCallback) {
                                this.takeOff(this.MAX_FLY_HEIGHT);
                                this.mTargetPosition = new Laya.Vector3(self.mPointPosition.x, self.MAX_FLY_HEIGHT, self.mPointPosition.z);
                                this.mIsHaul = false;
                                GameManager.instance.roleScript.enterFunction(self.mCamera);
                                EventUtils.dispatchEvent(MyGameConfig.EVENT_HIDE_MAIN_VIEW_DIALOG, true);
                                self.mLiftCallback = function () {
                                    self.mCurStatus = self.STATUS_FLYING;
                                    EventUtils.dispatchEvent(MyGameConfig.EVENT_REPAIR, "");
                                    EventUtils.dispatchEvent(MyGameConfig.EVENT_HIDE_VIEW_DURABLE, true);
                                    self.tweenToTarget(self.mTargetPosition, () => {
                                        self.tweenToRorate(-90, () => {
                                            self.mStepIndex++;
                                            self.mLiftCallback = null;
                                            self.mCurStatus = self.STATUS_LAND;
                                            self.forceLand();
                                        });
                                    });
                                };
                            }
                            break;
                    }
                    break;
                case this.STATUS_FLYING:
                    this.flying();
                    break;
                case this.STATUS_LAND:
                    switch (this.mStepIndex) {
                        case 1:
                            if (!this.mLiftCallback) {
                                this.land(0.8);
                                this.mLiftCallback = function () {
                                    self.mStepIndex++;
                                    self.mLiftCallback = null;
                                    self.mCurStatus = self.STATUS_TAKE_OFF;
                                };
                            }
                            break;
                        case 3:
                            if (!this.mLiftCallback) {
                                this.land(0.8);
                                this.mLiftCallback = function () {
                                    self.mIsCarFollow = false;
                                    self.mStepIndex++;
                                    self.mLiftCallback = null;
                                    self.mCurStatus = self.STATUS_TAKE_OFF;
                                };
                            }
                            break;
                        case 5:
                            break;
                    }
                    break;
            }
        }
        getStateKey() {
            return MyGameConfig.STATE_HAUL;
        }
        addHandler() {
        }
        takeOff(maxHeight) {
            let pos = this.mNodeTractor.transform.position;
            this.mTempVec3.setValue(pos.x, pos.y, pos.z);
            let obj = {
                y: pos.y
            };
            Laya.Tween.to(obj, {
                y: maxHeight,
                update: new Laya.Handler(this, () => {
                    if (this.mIsCarFollow) {
                        this.owner.getNodeRole().transform.position.y += obj.y - this.mNodeTractor.transform.position.y;
                        this.owner.getNodeRole().transform.position = this.owner.getNodeRole().transform.position;
                    }
                    this.mNodeTractor.transform.position.y = obj.y;
                    this.mNodeTractor.transform.position = this.mNodeTractor.transform.position;
                })
            }, maxHeight / this.SPEED_LIFT, null, Laya.Handler.create(this, () => {
                if (this.mLiftCallback) {
                    this.mLiftCallback();
                }
            }));
        }
        flying() {
            let position = this.mNodeTractor.transform.position;
            var curRot = Vector3Utils.toTargetQuaternion(position, this.mTargetPosition);
            Laya.Quaternion.slerp(this.mNodeTractor.transform.rotation, curRot, 0.1, curRot);
            this.mNodeTractor.transform.rotation = curRot;
            if (this.mIsCarFollow) {
                this.owner.getNodeRole().transform.rotationEuler = new Laya.Vector3(0, this.mNodeTractor.transform.rotationEuler.y + 90, 0);
            }
        }
        land(height) {
            let pos = this.mNodeTractor.transform.position;
            this.mTempVec3.setValue(pos.x, pos.y, pos.z);
            let obj = {
                y: pos.y
            };
            Laya.Tween.to(obj, {
                y: height,
                update: new Laya.Handler(this, () => {
                    if (this.mIsCarFollow) {
                        this.owner.getNodeRole().transform.position.y += obj.y - this.mNodeTractor.transform.position.y;
                        this.owner.getNodeRole().transform.position = this.owner.getNodeRole().transform.position;
                    }
                    this.mNodeTractor.transform.position.y = obj.y;
                    this.mNodeTractor.transform.position = this.mNodeTractor.transform.position;
                })
            }, pos.y / this.SPEED_LIFT, null, Laya.Handler.create(this, () => {
                if (this.mIsCarFollow) {
                    this.owner.getNodeRole().transform.position = new Laya.Vector3(this.owner.getPosition().x, 0, this.owner.getPosition().z);
                }
                this.mCurStatus = this.STATUS_IDLE;
                if (this.mLiftCallback) {
                    this.mLiftCallback();
                }
            }));
        }
        forceLand() {
            let position = this.mNodeTractor.transform.position;
            this.mTempVec3.setValue(position.x, 0, position.z);
            this.mNodeTractor.transform.position = this.mTempVec3;
            this.mTargetPosition = new Laya.Vector3(this.mOwner.getPosition().x, this.MAX_FLY_HEIGHT, this.mOwner.getPosition().z);
            this.mStepIndex = 0;
            this.mIsHaul = false;
            this.mLiftCallback = null;
            this.mCurStatus = this.STATUS_IDLE;
            this.mIsCarFollow = false;
        }
        tweenToTarget(targetPos, callback) {
            let distance = Laya.Vector3.distance(targetPos, this.mNodeTractor.transform.position);
            let time = distance / (GameManager.instance.timerDelta * this.SPEED) * 1000;
            Laya.Tween.to(this.mNodeTractor.transform.position, {
                x: targetPos.x,
                z: targetPos.z,
                update: new Laya.Handler(this, () => {
                    this.mNodeTractor.transform.position = this.mNodeTractor.transform.position;
                    if (this.mIsCarFollow) {
                        this.mTempVec3.setValue(this.mNodeTractor.transform.position.x, this.owner.getPosition().y, this.mNodeTractor.transform.position.z);
                        this.owner.getNodeRole().transform.position = this.mTempVec3;
                    }
                })
            }, time, null, Laya.Handler.create(this, () => {
                callback();
            }));
        }
        tweenToRorate(targetRotateY, callback) {
            let rorationEuler = this.mNodeTractor.transform.rotationEuler;
            let rotationY = Vector3Utils.getMinAngle(targetRotateY, rorationEuler.y);
            let time = Math.abs(rotationY) * 10;
            let startRotationEulerY = rorationEuler.y + rotationY;
            let tempRotation = {
                y: 0,
            };
            this.mTempVec3.setValue(rorationEuler.x, rorationEuler.y, rorationEuler.z);
            Laya.Tween.from(tempRotation, {
                y: rotationY,
                update: new Laya.Handler(this, () => {
                    this.mTempVec3.y = startRotationEulerY - tempRotation.y;
                    this.mNodeTractor.transform.rotationEuler = this.mTempVec3;
                    if (this.mIsCarFollow) {
                        this.mTempVec3.setValue(this.owner.getRotationEuler().x, this.mNodeTractor.transform.rotationEuler.y + 90, this.owner.getRotationEuler().z);
                        this.owner.getNodeRole().transform.rotationEuler = this.mTempVec3;
                    }
                })
            }, time, null, Laya.Handler.create(this, () => {
                callback();
            }));
        }
    }

    class MapDialog extends ui.game.MapDialogUI {
        constructor() {
            super(...arguments);
            this.mIsCanClick = true;
        }
        onAwake() {
            this.width = Laya.stage.width;
            this.mCurSelectLevel = GameManager.instance.curLevel;
            UiUtils.click(this.mBtnPre, this, this.onPreClick);
            UiUtils.click(this.mBtnNext, this, this.onNextClick);
            UiUtils.click(this.mBtnDelivery, this, this.onDeliveryClick);
            UiUtils.click(this.mBtnClose, this, this.onCloseClick);
            let zipArr = [
                { url: MyGameConfig.URL_RES2D + "map.zip", type: LayaZip.ZIP },
            ];
            Laya.loader.create(zipArr, Laya.Handler.create(this, () => {
                this.refreshView();
                UiUtils.hideLoading();
            }));
        }
        onDisable() {
        }
        tweenAni() {
        }
        refreshView() {
            this.mImgPre.visible = true;
            this.mImgNext.visible = true;
            let passLevel = DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_PASS);
            if (this.mCurSelectLevel == 0) {
                this.mImgPre.visible = false;
            }
            else {
                this.mImgPre.skin = MyGameConfig.URL_MAP + MyGameConfig.levelConfig[this.mCurSelectLevel - 1].imgName;
            }
            if (this.mCurSelectLevel == MyGameConfig.levelConfig.length - 1) {
                this.mImgNext.visible = false;
            }
            else {
                this.mImgPre.skin = MyGameConfig.URL_MAP + MyGameConfig.levelConfig[this.mCurSelectLevel + 1].imgName;
            }
            let curSelectLevelConfig = MyGameConfig.levelConfig[this.mCurSelectLevel];
            this.mImgCur.skin = MyGameConfig.URL_MAP + curSelectLevelConfig.imgName;
            if (this.mCurSelectLevel > passLevel) {
                this.mImgCur.gray = true;
                this.mBtnDelivery.visible = false;
                this.mImgLockCur.visible = true;
                this.mNodeLockInfo.visible = true;
                this.mLbUnlockGoldValue.changeText(curSelectLevelConfig.costGold + "");
                this.mLbUnlockCrystalValue.changeText(curSelectLevelConfig.costCrystl + "");
            }
            else {
                this.mImgCur.gray = false;
                this.mBtnDelivery.visible = true;
                this.mImgLockCur.visible = false;
                this.mNodeLockInfo.visible = false;
            }
            if (this.mCurSelectLevel == passLevel + 1) {
                UiUtils.click(this.mImgCur, this, this.onUnlockClick);
            }
            else {
                this.mImgCur.offAll();
            }
            this.mImgPre.gray = this.mCurSelectLevel - 1 > passLevel;
            this.mImgLockPre.visible = this.mCurSelectLevel - 1 > passLevel;
            this.mImgNext.gray = this.mCurSelectLevel + 1 > passLevel;
            this.mImgLockNext.visible = this.mCurSelectLevel + 1 > passLevel;
        }
        onPreClick() {
            if (this.mCurSelectLevel == 0 || !this.mIsCanClick) {
                return;
            }
            this.mCurSelectLevel--;
            this.refreshView();
        }
        onNextClick() {
            if (this.mCurSelectLevel == MyGameConfig.levelConfig.length - 1 || !this.mIsCanClick) {
                return;
            }
            this.mCurSelectLevel++;
            this.refreshView();
        }
        onDeliveryClick() {
            if (GameManager.instance.roleScript.getContainerNum() > 0) {
                UiUtils.showToast("please sell the ore first");
                return;
            }
            this.onCloseClick();
            DataManager.setLastSelectLevel(this.mCurSelectLevel);
            EventUtils.dispatchEvent(MyGameConfig.EVENT_GO_NEXT_ISLAND, "");
        }
        onUnlockClick() {
            let passLevel = DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_PASS);
            if ((this.mCurSelectLevel - 1) > passLevel) {
                return;
            }
            UiUtils.addChild(new CommonTipDialog("whether to unlock the island", () => {
                let goldValue = DataManager.getGoldValue();
                let crystalValue = DataManager.getCrystalValue();
                if (goldValue < MyGameConfig.levelConfig[this.mCurSelectLevel].costGold
                    || crystalValue < MyGameConfig.levelConfig[this.mCurSelectLevel].costCrystl) {
                    UiUtils.showToast("lack of resources");
                    return;
                }
                DataManager.addGoldValue(-MyGameConfig.levelConfig[this.mCurSelectLevel].costGold);
                DataManager.addGoldValue(-MyGameConfig.levelConfig[this.mCurSelectLevel].costCrystl);
                DataManager.addLevel(MyGameConfig.KEY_DATA_LEVEL_PASS);
                this.refreshView();
                UiUtils.showToast("unlocked successfully");
            }));
        }
        onCloseClick() {
            this.destroy(true);
            Laya.Resource.destroyUnusedResources();
        }
    }

    class CharacterMapState extends CharacterBaseState {
        constructor(owner) {
            super(owner);
            this.mPointPosition = this.getPoint(MyGameConfig.FUNCTION_ID_MAP).position;
        }
        onEnter() {
            UiUtils.addChild(new MapDialog());
        }
        getStateKey() {
            return MyGameConfig.STATE_MAP;
        }
    }

    class LaboratoryDialog extends ui.game.LaboratoryDialogUI {
        constructor() {
            super(...arguments);
            this.mDesignDiagram = [];
            this.mCurSelectIndex = 0;
            this.mUseCardIndex = 0;
        }
        onAwake() {
            this.width = Laya.stage.width;
            this.initData();
            this.initView();
            this.refreshInfoView(this.mDesignDiagram[this.mCurSelectIndex]);
            UiUtils.hideLoading();
            Laya.timer.loop(1, this, () => {
                let designInfo = this.mDesignDiagram[this.mCurSelectIndex];
                if (designInfo.productionTime) {
                    let progress = (GameManager.instance.curTime - designInfo.productionTime) / designInfo.time;
                    if (progress > 1) {
                        progress = 1;
                    }
                    this.mNodeProgress.visible = true;
                    this.mMaskProgress.graphics.clear();
                    this.mMaskProgress.graphics.drawRect(0, 0, this.mMaskProgress.width * progress, this.mMaskProgress.height, "#ff0000");
                }
            });
        }
        onDisable() {
            Laya.timer.clearAll(this);
        }
        onCloseClick() {
            UiUtils.removeSelf(this);
        }
        initData() {
            this.mDesignDiagram = MyGameConfig.designDiagramConfig;
        }
        initView() {
            this.mListDesignDiagram.renderHandler = new Laya.Handler(this, this.updateListCarItem);
            this.mListDesignDiagram.array = this.mDesignDiagram;
            this.mListDesignDiagram.hScrollBarSkin = "";
            UiUtils.click(this.mBtnResearch, this, () => {
                let designInfo = this.mDesignDiagram[this.mCurSelectIndex];
                DataManager.addProductDesignDiagram(designInfo.id, (time) => {
                    designInfo.productionTime = time;
                    this.refreshInfoView(designInfo);
                });
            });
            UiUtils.click(this.mBtnClose, this, this.onCloseClick);
        }
        refreshInfoView(designInfo) {
            this.mLbDesignDiagramName.changeText(designInfo.name);
            this.mImgDesignDiagram.skin = "laboratory/" + designInfo.imgName;
            if (designInfo.productionTime) {
                this.mBtnResearch.visible = false;
            }
            else {
                this.mBtnResearch.disabled = !designInfo.isUnlock;
                this.mNodeProgress.visible = false;
                this.mBtnResearch.visible = true;
            }
        }
        updateListCarItem(ceil, index) {
            let imgIc = ceil.getChildByName("imgIc");
            let imgUse = ceil.getChildByName("imgUse");
            let imgSelect = ceil.getChildByName("imgSelect");
            let data = this.mDesignDiagram[index];
            if (data.isUnlock) {
                imgIc.skin = "laboratory/" + data.imgName;
            }
            else {
                imgIc.skin = "laboratory/" + data.lockImgName;
            }
            imgUse.visible = false;
            imgSelect.visible = this.mCurSelectIndex == index;
            UiUtils.click(imgIc, this, (args) => {
                let info = args[0];
                this.mCurSelectIndex = args[1];
                this.refreshInfoView(info);
                this.mListDesignDiagram.refresh();
            }, [data, index]);
        }
    }

    class CharacterLaboratoryState extends CharacterBaseState {
        constructor(owner) {
            super(owner);
            this.mPointPosition = this.getPoint(MyGameConfig.FUNCTION_ID_LABORATORY).position;
            this.mFunctionInfo = MyGameConfig.functionUnlockConfig[MyGameConfig.FUNCTION_ID_LABORATORY];
        }
        onEnter() {
            if (this.mFunctionInfo.isUnlock) {
                UiUtils.addChild(new LaboratoryDialog());
            }
            else {
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

    class CharacterRepairFactoryState extends CharacterBaseState {
        constructor(owner) {
            super(owner);
            this.mPointPosition = this.getPoint(MyGameConfig.FUNCTION_ID_REPAIR_STATION).position;
            this.mNodeScene = this.getSceneNode(MyGameConfig.FUNCTION_ID_REPAIR_STATION);
            this.mCamera = this.mNodeScene.getChildByName("Main Camera");
            this.addHandler();
        }
        addHandler() {
            EventUtils.onEvent(this, MyGameConfig.EVENT_LEAVE_REPAIR_FACTORY, () => {
                let target = this.owner.getPosition().clone();
                target.x -= 2.5;
                this.owner.levelFunction();
                EventUtils.dispatchEvent(MyGameConfig.EVENT_HIDE_MAIN_VIEW_DIALOG, false);
                EventUtils.dispatchEvent(MyGameConfig.EVENT_HIDE_VIEW_DURABLE, false);
                this.owner.toTarget(target, () => {
                    GameManager.instance.isControl = true;
                    EventUtils.dispatchEvent(MyGameConfig.EVENT_HIDE_VIEW_DURABLE, true);
                });
            });
        }
        onEnter() {
            GameManager.instance.isControl = false;
            GameManager.instance.roleScript.enterFunction(this.mCamera);
            EventUtils.dispatchEvent(MyGameConfig.EVENT_HIDE_MAIN_VIEW_DIALOG, true);
            EventUtils.dispatchEvent(MyGameConfig.EVENT_HIDE_VIEW_DURABLE, false);
            let position = this.owner.getPosition().clone();
            let rotationEuler = this.owner.getNodeRole().transform.rotationEuler;
            let angle = -MathUtils.radian2Angle(Math.atan2((this.mPointPosition.z - position.z), (this.mPointPosition.x - position.x))) - 90;
            let time = (angle - rotationEuler.y) * 5;
            Laya.Tween.to(rotationEuler, {
                y: angle,
                update: new Laya.Handler(this, () => {
                    this.owner.getNodeRole().transform.rotationEuler = rotationEuler;
                })
            }, time, null, Laya.Handler.create(this, () => {
                GameManager.instance.roleScript.toTarget(this.mPointPosition, () => {
                    GameManager.instance.roleScript.stopMove();
                    let angle = Vector3Utils.getMinAngle(90, this.owner.getNodeRole().transform.rotationEuler.y);
                    Laya.Tween.to(rotationEuler, {
                        y: rotationEuler.y + angle,
                        update: new Laya.Handler(this, () => {
                            this.owner.getNodeRole().transform.rotationEuler = rotationEuler;
                        })
                    }, Math.abs(angle) * 5, null, Laya.Handler.create(this, () => {
                        GameManager.instance.roleScript.changeState(MyGameConfig.STATE_UPGRADE);
                    }));
                });
            }));
        }
        getStateKey() {
            return MyGameConfig.STATE_REPAIR_FACTORY;
        }
    }

    class CharacterRepairState extends CharacterBaseState {
        constructor(owner) {
            super(owner);
            this.mIsRepair = false;
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
        onUpdate() {
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

    class WalletUtils {
        static getInstance() {
            if (!this.mInstance) {
                this.mInstance = new WalletUtils();
                this.mInstance.init();
            }
            return this.mInstance;
        }
        init() {
        }
        connect(callback) {
        }
        send() {
        }
        getAddress() {
            return this.mAddress;
        }
    }

    class CharacterSellState extends CharacterBaseState {
        constructor(owner) {
            super(owner);
            this.mUpdateFrameIndex = 0;
            this.mPreGoldValue = 0;
            this.mConfig = this.getPoint(MyGameConfig.FUNCTION_ID_SELL);
            this.mStartRadius = this.mConfig.radius;
            this.mPointPosition = this.mConfig.position;
            this.mNodeScene = this.getSceneNode(MyGameConfig.FUNCTION_ID_SELL);
            this.mNodeSellTargetPosition = this.mNodeScene.getChildByName("node_sell_target").transform.position;
            let material = this.mNodeScene.meshRenderer.material;
        }
        onEnter() {
            this.mUpdateFrameIndex = 0;
            this.mPreGoldValue = DataManager.getGoldValue();
        }
        onUpdate() {
            this.mUpdateFrameIndex++;
            if (this.mUpdateFrameIndex % 2 == 0) {
                let arr = GameManager.instance.roleScript.popLayerStone();
                if (arr && arr.length > 0) {
                    if (!GameManager.instance.isSellStatus) {
                        AudioManager.playSell();
                        WalletUtils.getInstance().send();
                    }
                    GameManager.instance.isSellStatus = true;
                    let totalPrice = 0;
                    for (let i = 0; i < arr.length; i++) {
                        let stoneInfo = arr[i];
                        let worldPosition = stoneInfo.node.transform.position.clone();
                        let script = SceneResManager.createCatchStone(GameManager.instance.scene3d, stoneInfo.type, worldPosition, stoneInfo.node.transform.rotationEuler, 0.7);
                        totalPrice += MyGameConfig.stoneConfig[stoneInfo.type].sellPrice;
                        script.sell(worldPosition, this.mNodeSellTargetPosition, false, (script, args) => {
                        });
                        MapManager.instance.pushDestroyStatic(stoneInfo.node);
                    }
                    DataManager.addGoldValue(0);
                    GameManager.instance.roleScript.saveDurable();
                }
                else {
                    GameManager.instance.isSellStatus = false;
                    this.mConfig.radius = this.mStartRadius;
                    let curGoldValue = DataManager.getGoldValue();
                    if (curGoldValue - this.mPreGoldValue > 0) {
                        EventUtils.dispatchEvent(MyGameConfig.EVENT_SHOW_SELL, curGoldValue - this.mPreGoldValue);
                        this.mPreGoldValue = curGoldValue;
                    }
                }
            }
        }
        onLeave() {
            GameManager.instance.isSellStatus = false;
            let curGoldValue = DataManager.getGoldValue();
            if (curGoldValue - this.mPreGoldValue > 0) {
                EventUtils.dispatchEvent(MyGameConfig.EVENT_SHOW_SELL, curGoldValue - this.mPreGoldValue);
                this.mPreGoldValue = curGoldValue;
            }
        }
        getStateKey() {
            return MyGameConfig.STATE_SELL;
        }
    }

    class CarShopDialog extends ui.game.CarShopDialogUI {
        constructor() {
            super(...arguments);
            this.mCarData = [];
        }
        onAwake() {
            this.width = Laya.stage.width;
            this.initData();
            this.initView();
            this.refreshCarInfoView(this.mCarData[this.mCurSelectIndex]);
            UiUtils.click(this.mBtnClose, this, this.onCloseClick);
            UiUtils.hideLoading();
        }
        initData() {
            let useCardId = DataManager.getUseCarId();
            let carData = DataManager.getUnlockCarInfo();
            for (let key in carData) {
                let carInfo = carData[key];
                this.mCarData.push(carInfo);
                if (carInfo.id == useCardId) {
                    this.mUseCardIndex = this.mCarData.length - 1;
                    this.mCurSelectIndex = this.mCarData.length - 1;
                }
            }
        }
        initView() {
            this.mListCar.renderHandler = new Laya.Handler(this, this.updateListCarItem);
            this.mListCar.array = this.mCarData;
            this.mListCar.scrollBar.height = 11;
            UiUtils.click(this.mBtnEquip, this, () => {
                this.mUseCardIndex = this.mCurSelectIndex;
                DataManager.setUseCarId(this.mCarData[this.mUseCardIndex].id);
                this.mBtnEquip.visible = false;
                this.mListCar.refresh();
                GameManager.instance.roleScript.createRoleModel(this.mCarData[this.mUseCardIndex], null, true);
            });
        }
        refreshCarInfoView(carInfo) {
            this.mLbCarName.changeText(carInfo.name);
            this.mLbDes.changeText(carInfo.des);
            this.mImgCar.skin = "carshop/icon/" + carInfo.imgName;
            this.mBtnEquip.visible = carInfo.id != this.mCarData[this.mUseCardIndex].id;
        }
        updateListCarItem(ceil, index) {
            let imgIc = ceil.getChildByName("imgIc");
            let imgUse = ceil.getChildByName("imgUse");
            let imgSelect = ceil.getChildByName("imgSelect");
            let data = this.mCarData[index];
            imgIc.skin = "carshop/icon/" + data.imgName;
            if (index == this.mUseCardIndex) {
                imgUse.visible = true;
                imgSelect.visible = false;
            }
            else {
                imgSelect.visible = this.mCurSelectIndex == index;
                imgUse.visible = false;
            }
            UiUtils.click(imgIc, this, (args) => {
                let carInfo = args[0];
                this.mCurSelectIndex = args[1];
                this.refreshCarInfoView(carInfo);
                this.mListCar.refresh();
            }, [data, index]);
        }
        onCloseClick() {
            UiUtils.removeSelf(this);
        }
    }

    class CharacterShopState extends CharacterBaseState {
        constructor(owner) {
            super(owner);
            this.mPointPosition = this.getPoint(MyGameConfig.FUNCTION_ID_TANK_SHOP).position;
        }
        onEnter() {
            UiUtils.addChild(new CarShopDialog());
        }
        getStateKey() {
            return MyGameConfig.STATE_TANK_SHOP;
        }
    }

    class UpgradeDialog extends ui.game.UpgradeDialogUI {
        constructor() {
            super(...arguments);
            this.mRollerConfig = [
                { type: 1, icon: "icUpgradeSpikeCircleNum.png", title: "spikes", key: MyGameConfig.KEY_DATA_LEVEL_SPIKE_CIRCLE_NUM, cost: "spikeCircleCost" },
                { type: 2, icon: "icUpgradeSpikeNum.png", title: "spikes per turn", key: MyGameConfig.KEY_DATA_LEVEL_SPIKE_NUM, cost: "spikeCost" },
                { type: 3, icon: "icUpgradeSpikeSize.png", title: "spike size", key: MyGameConfig.KEY_DAY_LEVEL_SPIKE_SIZE, cost: "spikeSizeCost" },
                { type: 7, icon: "icUpgradeDurabilitySpeed.png", title: "durability recovery", key: MyGameConfig.KEY_DATA_LEVEL_DURABLE_SPEED, cost: "durableSpeedCost" },
                { type: 5, icon: "icTruckSpeed.png", title: "truck speed", key: MyGameConfig.KEY_DATA_LEVEL_TRUCK_SPEED, cost: "truckSpeedCost" },
                { type: 6, icon: "icTruckCapacity.png", title: "truck capacity", key: MyGameConfig.KEY_DATA_LEVEL_TRUCK_CAPACITY, cost: "truckCapacityCost" },
                { type: 4, icon: "icUpgradeSpikeCircleNum.png", title: "roller size", key: MyGameConfig.KEY_DATA_LEVEL_ROLLER_SIZE, cost: "truckCapacityCost" },
            ];
        }
        onAwake() {
            this.width = Laya.stage.width;
            this.initView();
            UiUtils.click(this.mBtnClose, this, this.onCloseClick);
            UiUtils.hideLoading();
        }
        initView() {
            this.mListUpgradeRoller.renderHandler = new Laya.Handler(this, this.updateListRollerItem);
            this.mListUpgradeRoller.array = this.mRollerConfig;
            this.mListUpgradeRoller.scrollBar.height = 254;
        }
        updateListRollerItem(ceil, index) {
            this.updateDetailontentItem(ceil, index);
            let btnUpgrade = ceil.getChildByName("btnUpgrade");
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
        onCloseClick() {
            UiUtils.removeSelf(this);
            EventUtils.dispatchEvent(MyGameConfig.EVENT_LEAVE_REPAIR_FACTORY, "");
        }
        updateDetailontentItem(ceil, index) {
            let data = ceil.dataSource;
            let imgIc = ceil.getChildByName("imgIc");
            let lbTitle = ceil.getChildByName("lbTitle");
            let btnUpgrade = ceil.getChildByName("btnUpgrade");
            let lbPrice = btnUpgrade.getChildByName("lbPrice");
            let bgPb = ceil.getChildByName("bgPb");
            let imgPbBar = bgPb.getChildByName("pbBar");
            let goldValue = DataManager.getGoldValue();
            imgIc.skin = "upgrade/" + data.icon;
            lbTitle.changeText(data.title);
            let curLevel = DataManager.getLevelByKey(data.key);
            let nextLevel = curLevel + 1;
            data.nextLevel = nextLevel;
            if (nextLevel == MyGameConfig.truckConfig.length) {
                lbPrice.changeText("MAX");
                btnUpgrade.disabled = true;
            }
            else {
                lbPrice.changeText("UPGRADE");
                btnUpgrade.disabled = false;
            }
            let progress = curLevel / (MyGameConfig.truckConfig.length - 1);
            imgPbBar.visible = progress != 0;
            imgPbBar.mask.graphics.clear();
            imgPbBar.mask.graphics.drawRect(0, 0, imgPbBar.width * progress, imgPbBar.height, "#ff0000");
        }
    }

    class CharacterUpgradeState extends CharacterBaseState {
        constructor(owner) {
            super(owner);
        }
        onEnter() {
            GameManager.instance.isControl = false;
            UiUtils.addChild(new UpgradeDialog());
        }
        onLeave() {
        }
        getStateKey() {
            return MyGameConfig.STATE_UPGRADE;
        }
    }

    class StateMachine {
        constructor() {
            this.mStateMap = new Map();
        }
        get mainStateScript() {
            return this.mCurMainStateScript;
        }
        registerState(key, state) {
            this.mStateMap.set(key, state);
        }
        getStateByKey(key) {
            return this.mStateMap.get(key);
        }
        changeState(state) {
            let stateScript = this.mStateMap.get(state);
            if (this.mCurMainStateScript) {
                this.mCurMainStateScript.onLeave();
            }
            this.mCurMainStateScript = stateScript;
            stateScript.onEnter();
        }
        update() {
            if (this.mCurMainStateScript) {
                this.mCurMainStateScript.onUpdate();
            }
        }
        level() {
            this.mCurMainStateScript = null;
        }
    }

    class BaseAni {
        onUpdate() {
        }
        getNode() {
            return this.mNode;
        }
        forceComplete() {
        }
    }

    class StoneFlyAni extends BaseAni {
        constructor() {
            super(...arguments);
            this.mIsScale = false;
            this.mPos = new Laya.Vector3();
            this.mFlyTime = 2;
            this.mTempScale = new Laya.Vector3();
            this.mTempRotate = new Laya.Vector3();
            this.mIsForce = false;
        }
        onUpdate() {
            if (!this.mIsUpdate || GameManager.instance.isPause) {
                return;
            }
            let timerDelta = GameManager.instance.timerDelta;
            this.mFlyingTime += Laya.timer.delta;
            var progress = this.mFlyingTime / this.mFlyTime;
            if (progress > 1) {
                progress = 1;
            }
            this.mLastStartPositionX += this.mTargetScript.getMoveDeltaX();
            this.mLastEndPositionX += this.mTargetScript.getMoveDeltaX();
            this.mLastStartPositionZ += this.mTargetScript.getMoveDeltaZ();
            this.mLastEndPositionZ += this.mTargetScript.getMoveDeltaZ();
            var x = (1 - progress) * (1 - progress) * this.mLastStartPositionX + 2 * progress * (1 - progress) * ((this.mLastStartPositionX + this.mLastEndPositionX) / 2) +
                progress * progress * this.mLastEndPositionX;
            var y = (1 - progress) * (1 - progress) * this.mStartPosition.y + 2 * progress * (1 - progress) * this.mMaxHeightPosition.y +
                progress * progress * this.mEndPosition.y;
            var z = (1 - progress) * (1 - progress) * this.mLastStartPositionZ + 2 * progress * (1 - progress) * ((this.mLastStartPositionZ + this.mLastEndPositionZ) / 2) +
                progress * progress * this.mLastEndPositionZ;
            this.mPos.setValue(x, y, z);
            if (this.mIsScale) {
                let scale = 1 - this.mDeltaScale * progress;
                this.mTempScale.setValue(scale, scale, scale);
                this.mNode.transform.setWorldLossyScale(this.mTempScale);
            }
            let rotateX = this.mTempRotate.x + (timerDelta / 2);
            this.mTempRotate.setValue(rotateX, this.mTempRotate.y, this.mTempRotate.z);
            this.mNode.transform.rotationEuler = this.mTempRotate;
            this.mNode.transform.position = this.mPos;
            if (this.mIsForce) {
                progress = 1;
            }
            if (progress >= 1) {
                this.mIsUpdate = false;
                this.mCallback(this, this.mArgs);
                PoolManager.recover(this.mNode.name, this.mNode);
            }
        }
        init(node, targetScript, startPosition, endPosition, iscale = true, callback, args) {
            this.mNode = node;
            this.mTargetScript = targetScript;
            this.mIsUpdate = true;
            this.mStartPosition = startPosition;
            this.mEndPosition = endPosition;
            this.mIsScale = iscale;
            this.mCallback = callback;
            this.mArgs = args;
            this.mFlyingTime = 0;
            this.mFlyTime = Laya.Vector3.distance(startPosition, endPosition) * (200 - GameManager.instance.roleScript.getSpeed() * 10000);
            this.mMaxHeightPosition = new Laya.Vector3((startPosition.x + endPosition.x) / 2, 3 + startPosition.y, (startPosition.z + endPosition.z) / 2);
            this.mDeltaScale = 1 - MyGameConfig.CONTAINER_STONE_SCALE;
            this.mIsForce = false;
            this.mTempRotate.setValue(node.transform.rotationEuler.x, node.transform.rotationEuler.y, node.transform.rotationEuler.z);
            this.mLastStartPositionX = startPosition.x;
            this.mLastStartPositionZ = startPosition.z;
            this.mLastEndPositionX = endPosition.x;
            this.mLastEndPositionZ = endPosition.z;
        }
        forceComplete() {
            this.mIsForce = true;
        }
    }

    class StoneJumpAni extends BaseAni {
        constructor() {
            super(...arguments);
            this.isDown = 1;
        }
        onUpdate() {
            if (!this.mIsUpdate || GameManager.instance.isPause) {
                return;
            }
            let timerDelta = GameManager.instance.timerDelta;
            let posY = this.mTempVec3.y + (timerDelta / 100) * this.isDown;
            this.mTempVec3.setValue(this.mTempVec3.x, posY, this.mTempVec3.z);
            this.mNode.transform.position = this.mTempVec3;
            let rotateX = this.mTempRotate.x + (timerDelta / 2);
            this.mTempRotate.setValue(rotateX, this.mTempRotate.y, this.mTempRotate.z);
            this.mNode.transform.rotationEuler = this.mTempRotate;
            if (this.mNode.transform.position.y > 3) {
                this.isDown = -1;
            }
            else if (this.mNode.transform.position.y < 0.1 && this.isDown == -1) {
                this.mNode.transform.position.y = 0.1;
                this.mNode.transform.position = this.mNode.transform.position;
                this.mIsUpdate = false;
                this.mCallback(this.mArgs);
            }
        }
        init(node, pos, args, callback) {
            this.mNode = node;
            this.mArgs = args;
            this.isDown = 1;
            this.mIsUpdate = true;
            this.mTempVec3 = pos.clone();
            this.mTempRotate = node.transform.rotationEuler.clone();
            this.mTempRotate.setValue(MathUtils.nextInt(-180, 180), this.mTempRotate.y, this.mTempRotate.z);
            this.mCallback = callback;
        }
        forceComplete() {
            if (this.mIsUpdate) {
                this.mNode.transform.position.y = 0.5;
                this.mNode.transform.position = this.mNode.transform.position;
                this.mIsUpdate = false;
                this.mCallback(this.mArgs);
            }
        }
    }

    class StoneSellAni extends BaseAni {
        constructor() {
            super(...arguments);
            this.mIsLocal = false;
            this.mPos = new Laya.Vector3();
            this.mFlyTime = 2;
            this.mTempScale = new Laya.Vector3();
        }
        onUpdate() {
            if (!this.mIsUpdate || GameManager.instance.isPause) {
                return;
            }
            let timerDelta = Laya.timer.delta;
            if (timerDelta > MyGameConfig.MAX_TIMER) {
                timerDelta = MyGameConfig.MAX_TIMER;
            }
            this.mFlyingTime += timerDelta;
            var progress = this.mFlyingTime / this.mFlyTime;
            var x = (1 - progress) * (1 - progress) * this.mStartPosition.x + 2 * progress * (1 - progress) * this.mMaxHeightPosition.x +
                progress * progress * this.mEndPosition.x;
            var y = (1 - progress) * (1 - progress) * this.mStartPosition.y + 2 * progress * (1 - progress) * this.mMaxHeightPosition.y +
                progress * progress * this.mEndPosition.y;
            var z = (1 - progress) * (1 - progress) * this.mStartPosition.z + 2 * progress * (1 - progress) * this.mMaxHeightPosition.z +
                progress * progress * this.mEndPosition.z;
            this.mPos.setValue(x, y, z);
            this.mNode.transform.position = this.mPos;
            if (progress >= 1) {
                this.mIsUpdate = false;
                PoolManager.recover(this.mNode.name, this.mNode);
            }
        }
        init(node, startPosition, endPosition, isLocal = false, callback) {
            this.mNode = node;
            this.mIsUpdate = true;
            this.mStartPosition = startPosition;
            this.mEndPosition = endPosition;
            this.mIsLocal = isLocal;
            this.mCallback = callback;
            this.mFlyingTime = 0;
            this.mFlyTime = Laya.Vector3.distance(startPosition, endPosition) * 150;
            this.mMaxHeightPosition = new Laya.Vector3((startPosition.x + endPosition.x) / 2, 5 + startPosition.y, (startPosition.z + endPosition.z) / 2);
        }
    }

    class StoneCoreScript extends Laya.Script3D {
        onAwake() {
        }
        onUpdate() {
            if (this.mCurAni) {
                this.mCurAni.onUpdate();
            }
        }
        fly(startPosition, endPosition, isLocal = false, callback, args) {
            this.mCurAni = new StoneFlyAni();
            this.mArgs = args;
            this.mCurAni.init(this.mNode, GameManager.instance.roleScript, startPosition, endPosition, isLocal, () => {
                this.mCurAni = null;
                callback(this, this.mArgs);
            }, args);
        }
        flyMineCar(startPosition, endPosition, isLocal = false, callback, args) {
        }
        jump(pos, args, callback) {
            this.mCurAni = new StoneJumpAni();
            this.mArgs = args;
            this.mCurAni.init(this.mNode, pos, args, () => {
                this.mCurAni = null;
                callback(this, this.mArgs);
            });
        }
        sell(startPosition, endPosition, isLocal = false, callback) {
            this.mCurAni = new StoneSellAni();
            this.mCurAni.init(this.mNode, startPosition, endPosition, isLocal, () => {
                this.mCurAni = null;
            });
        }
        forceComplete() {
            if (this.mCurAni) {
                this.mCurAni.forceComplete();
            }
        }
        setNode(node) {
            this.mNode = node;
            this.mUuid = MathUtils.generateUUID();
        }
        getNode() {
            return this.mNode;
        }
        getUuid() {
            return this.mUuid;
        }
    }

    class RadarScript extends Laya.Script3D {
        constructor() {
            super(...arguments);
            this.ROTATE_SPEED = 0.1;
            this.mRotateVec = new Laya.Vector3();
            this.mRotateY = 0;
        }
        onAwake() {
            this.mNode = this.owner;
            this.mNodeRadar = this.mNode.getChildAt(0);
            this.mNodePointer = this.mNodeRadar.getChildByName("node_pointer");
            let range = MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_CRYSTAL_DETECTOR].range;
            this.mNode.transform.setWorldLossyScale(new Laya.Vector3(range, 1, range));
        }
        onUpdate() {
            if (!this.mNode || GameManager.instance.isPause) {
                return;
            }
            this.mRotateY -= this.ROTATE_SPEED * GameManager.instance.timerDelta;
            this.mRotateVec.setValue(0, this.mRotateY, 0);
            this.mNodePointer.transform.rotationEuler = this.mRotateVec;
            ProspectingMapManager.instance.surveyCrystal();
            this.mEffectTime -= GameManager.instance.timerDelta;
            if (this.mEffectTime < 0) {
                GameManager.instance.roleScript.showRadar(false);
            }
        }
        show() {
            this.mRotateY = 0;
            this.mEffectTime = MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_CRYSTAL_DETECTOR].effectTime;
        }
    }

    class CharacterHaulPvpState extends CharacterBaseState {
        constructor(owner) {
            super(owner);
            this.STATUS_IDLE = 0;
            this.STATUS_TAKE_OFF = 1;
            this.STATUS_FLYING = 2;
            this.STATUS_LAND = 3;
            this.SPEED_LIFT = 0.007;
            this.MAX_FLY_HEIGHT = 5;
            this.SPEED = 0.3;
            this.mCurStatus = this.STATUS_IDLE;
            this.mIsHaul = false;
            this.mIsCarFollow = false;
            this.mStepIndex = 0;
            this.mTempVec3 = new Laya.Vector3();
            this.mIsUpdate = false;
            this.mPointPosition = this.getPoint(MyGameConfig.FUNCTION_ID_TRACTOR).position;
            this.mNodeTractor = this.getSceneNode(MyGameConfig.FUNCTION_ID_TRACTOR);
            this.mStartPosition = this.mNodeTractor.transform.position.clone();
            this.mStartRotationEuler = this.mNodeTractor.transform.rotationEuler.clone();
            this.mNodeScene = this.getSceneNode(MyGameConfig.FUNCTION_ID_REPAIR_STATION);
        }
        onEnter() {
            this.mIsUpdate = true;
            if (this.mStepIndex == 0) {
                this.mCurStatus = this.STATUS_TAKE_OFF;
                this.mIsHaul = true;
                GameManager.instance.roleScript.getDirectionScript().showNode(false);
                GameManager.instance.mainViewDialog.showAllView(false);
            }
            else {
                this.mCurStatus = this.STATUS_LAND;
            }
        }
        onUpdate() {
            if (!this.mIsUpdate) {
                return;
            }
            let self = this;
            switch (this.mCurStatus) {
                case this.STATUS_TAKE_OFF:
                    let maxHeight = 5;
                    switch (this.mStepIndex) {
                        case 0:
                            if (!this.mLiftCallback) {
                                this.takeOff(maxHeight);
                                this.mTargetPosition = new Laya.Vector3(this.mOwner.getPosition().x, this.MAX_FLY_HEIGHT, this.owner.getPosition().z);
                                this.mLiftCallback = function () {
                                    self.mCurStatus = self.STATUS_FLYING;
                                    self.tweenToTarget(this.mTargetPosition, () => {
                                        self.mCurStatus = self.STATUS_IDLE;
                                        self.tweenToRorate(this.mOwner.getRotationEuler().y - 90, () => {
                                            self.mStepIndex++;
                                            self.mLiftCallback = null;
                                            self.mCurStatus = self.STATUS_LAND;
                                        });
                                    });
                                };
                            }
                            break;
                        case 2:
                            this.mIsCarFollow = true;
                            maxHeight = 10;
                            if (!this.mLiftCallback) {
                                this.takeOff(maxHeight);
                                EventUtils.dispatchEvent(MyGameConfig.EVENT_PVP_PREPARE, 1);
                                self.mLiftCallback = function () {
                                    EventUtils.dispatchEvent(MyGameConfig.EVENT_PVP_PREPARE, 2);
                                    self.mLiftCallback = null;
                                    self.mIsUpdate = false;
                                    self.mStepIndex++;
                                    self.mCurStatus = self.STATUS_LAND;
                                };
                            }
                            break;
                        case 4:
                            maxHeight = 15;
                            if (!this.mLiftCallback) {
                                this.takeOff(maxHeight);
                                self.mLiftCallback = function () {
                                    self.mLiftCallback = null;
                                    self.mIsUpdate = false;
                                    self.mStepIndex++;
                                    self.mCurStatus = self.STATUS_LAND;
                                };
                            }
                            break;
                        case 6:
                            this.mIsCarFollow = true;
                            maxHeight = 10;
                            if (!this.mLiftCallback) {
                                this.takeOff(maxHeight);
                                EventUtils.dispatchEvent(MyGameConfig.EVENT_PVP_PREPARE, 3);
                                self.mLiftCallback = function () {
                                    self.mLiftCallback = null;
                                    self.mIsUpdate = false;
                                    self.mStepIndex++;
                                    self.mCurStatus = self.STATUS_LAND;
                                    EventUtils.dispatchEvent(MyGameConfig.EVENT_PVP_PREPARE, 4);
                                };
                            }
                            break;
                        case 8:
                            this.mIsCarFollow = false;
                            maxHeight = 15;
                            if (!this.mLiftCallback) {
                                this.takeOff(maxHeight);
                                self.mLiftCallback = function () {
                                    self.forceLand();
                                    GameManager.instance.roleScript.haulEnd();
                                    GameManager.instance.mainViewDialog.showAllView(true);
                                    GameManager.instance.roleScript.getDirectionScript().showNode(true);
                                };
                            }
                            break;
                    }
                    break;
                case this.STATUS_FLYING:
                    this.flying();
                    break;
                case this.STATUS_LAND:
                    switch (this.mStepIndex) {
                        case 1:
                            this.mIsCarFollow = false;
                            if (!this.mLiftCallback) {
                                self.land(0.8);
                                this.mLiftCallback = function () {
                                    self.mStepIndex++;
                                    self.mLiftCallback = null;
                                    self.mCurStatus = self.STATUS_TAKE_OFF;
                                };
                            }
                            break;
                        case 3:
                            this.mIsCarFollow = true;
                            if (!this.mLiftCallback) {
                                self.land(0.8);
                                this.mLiftCallback = function () {
                                    self.mIsCarFollow = false;
                                    self.mStepIndex++;
                                    self.mLiftCallback = null;
                                    self.mCurStatus = self.STATUS_TAKE_OFF;
                                };
                            }
                            break;
                        case 5:
                            this.mIsCarFollow = false;
                            if (!this.mLiftCallback) {
                                self.land(0.8);
                                this.mLiftCallback = function () {
                                    self.mStepIndex++;
                                    self.mLiftCallback = null;
                                    self.mCurStatus = self.STATUS_TAKE_OFF;
                                };
                            }
                            break;
                        case 7:
                            this.mIsCarFollow = true;
                            if (!this.mLiftCallback) {
                                self.land(0.8);
                                this.mLiftCallback = function () {
                                    self.mStepIndex++;
                                    self.mLiftCallback = null;
                                    self.mCurStatus = self.STATUS_TAKE_OFF;
                                };
                            }
                            break;
                    }
                    break;
            }
        }
        getStateKey() {
            return MyGameConfig.STATE_HAUL_PVP;
        }
        takeOff(maxHeight) {
            let pos = this.mNodeTractor.transform.position;
            this.mTempVec3.setValue(pos.x, pos.y, pos.z);
            let obj = {
                y: pos.y
            };
            Laya.Tween.to(obj, {
                y: maxHeight,
                update: new Laya.Handler(this, () => {
                    if (this.mIsCarFollow) {
                        this.owner.getNodeRole().transform.position.y += obj.y - this.mNodeTractor.transform.position.y;
                        this.owner.getNodeRole().transform.position = this.owner.getNodeRole().transform.position;
                    }
                    this.mNodeTractor.transform.position.y = obj.y;
                    this.mNodeTractor.transform.position = this.mNodeTractor.transform.position;
                })
            }, maxHeight / this.SPEED_LIFT, null, Laya.Handler.create(this, () => {
                if (this.mLiftCallback) {
                    this.mLiftCallback();
                }
            }));
        }
        flying() {
            let position = this.mNodeTractor.transform.position;
            var curRot = Vector3Utils.toTargetQuaternion(position, this.mTargetPosition);
            Laya.Quaternion.slerp(this.mNodeTractor.transform.rotation, curRot, 0.1, curRot);
            this.mNodeTractor.transform.rotation = curRot;
            if (this.mIsCarFollow) {
                this.owner.getNodeRole().transform.rotationEuler = new Laya.Vector3(0, this.mNodeTractor.transform.rotationEuler.y + 90, 0);
            }
        }
        land(height) {
            let pos = this.mNodeTractor.transform.position;
            this.mTempVec3.setValue(pos.x, pos.y, pos.z);
            let obj = {
                y: pos.y
            };
            Laya.Tween.to(obj, {
                y: height,
                update: new Laya.Handler(this, () => {
                    if (this.mIsCarFollow) {
                        this.owner.getNodeRole().transform.position.y += obj.y - this.mNodeTractor.transform.position.y;
                        this.owner.getNodeRole().transform.position = this.owner.getNodeRole().transform.position;
                    }
                    this.mNodeTractor.transform.position.y = obj.y;
                    this.mNodeTractor.transform.position = this.mNodeTractor.transform.position;
                })
            }, pos.y / this.SPEED_LIFT, null, Laya.Handler.create(this, () => {
                if (this.mIsCarFollow) {
                    this.owner.getNodeRole().transform.position = new Laya.Vector3(this.owner.getPosition().x, 0, this.owner.getPosition().z);
                }
                this.mCurStatus = this.STATUS_IDLE;
                if (this.mLiftCallback) {
                    this.mLiftCallback();
                }
            }));
        }
        tweenToTarget(targetPos, callback) {
            let distance = Laya.Vector3.distance(targetPos, this.mNodeTractor.transform.position);
            let time = distance / (GameManager.instance.timerDelta * this.SPEED) * 1000;
            Laya.Tween.to(this.mNodeTractor.transform.position, {
                x: targetPos.x,
                z: targetPos.z,
                update: new Laya.Handler(this, () => {
                    this.mNodeTractor.transform.position = this.mNodeTractor.transform.position;
                    if (this.mIsCarFollow) {
                        this.mTempVec3.setValue(this.mNodeTractor.transform.position.x, this.owner.getPosition().y, this.mNodeTractor.transform.position.z);
                        this.owner.getNodeRole().transform.position = this.mTempVec3;
                    }
                })
            }, time, null, Laya.Handler.create(this, () => {
                callback();
            }));
        }
        tweenToRorate(targetRotateY, callback) {
            let rorationEuler = this.mNodeTractor.transform.rotationEuler;
            let rotationY = Vector3Utils.getMinAngle(targetRotateY, rorationEuler.y);
            let time = Math.abs(rotationY) * 10;
            let startRotationEulerY = rorationEuler.y + rotationY;
            let tempRotation = {
                y: 0,
            };
            this.mTempVec3.setValue(rorationEuler.x, rorationEuler.y, rorationEuler.z);
            Laya.Tween.from(tempRotation, {
                y: rotationY,
                update: new Laya.Handler(this, () => {
                    this.mTempVec3.y = startRotationEulerY - tempRotation.y;
                    this.mNodeTractor.transform.rotationEuler = this.mTempVec3;
                    if (this.mIsCarFollow) {
                        this.mTempVec3.setValue(this.owner.getRotationEuler().x, this.mNodeTractor.transform.rotationEuler.y + 90, this.owner.getRotationEuler().z);
                        this.owner.getNodeRole().transform.rotationEuler = this.mTempVec3;
                    }
                })
            }, time, null, Laya.Handler.create(this, () => {
                callback();
            }));
        }
        forceLand() {
            this.mNodeTractor.transform.position = this.mStartPosition.clone();
            this.mNodeTractor.transform.rotationEuler = this.mStartRotationEuler.clone();
            this.mStepIndex = 0;
            this.mIsHaul = false;
            this.mLiftCallback = null;
            this.mCurStatus = this.STATUS_IDLE;
            this.mIsCarFollow = false;
        }
        setUpdate(b) {
            this.mIsUpdate = b;
        }
        getNodeTractor() {
            return this.mNodeTractor;
        }
    }

    class Utils {
        static shuffleArr(arr) {
            for (var i = arr.length - 1; i >= 0; i--) {
                var randomIndex = Math.floor(Math.random() * (i + 1));
                var itemAtIndex = arr[randomIndex];
                arr[randomIndex] = arr[i];
                arr[i] = itemAtIndex;
            }
            return arr;
        }
        static checkIsNull(value) {
            if (value === undefined || value === null || value === NaN) {
                return true;
            }
            return false;
        }
        static getQueryParams(url) {
            const queryParams = {};
            const queryString = url.split('?')[1];
            if (queryString) {
                const keyValuePairs = queryString.split('&');
                keyValuePairs.forEach(keyValuePair => {
                    const [key, value] = keyValuePair.split('=');
                    queryParams[key] = decodeURIComponent(value);
                });
            }
            return queryParams;
        }
        static formatAccountAddress(input, startIndex, endIndex, total) {
            if (input.length <= total) {
                return input;
            }
            else {
                const start = input.slice(0, startIndex);
                const end = input.slice(-endIndex);
                return `${start}...${end}`;
            }
        }
    }

    class AStarPathInfo {
        constructor() {
            this.pathArr = new Array();
        }
    }

    class AstarUtils {
        static init() {
            this.mAStarJs = Laya.Browser.window.astar;
            this.mCoverMap = [];
        }
        static addMap(x, y, sizeX) {
            if (!this.mCoverMap[y]) {
                this.mCoverMap[y] = new Array();
                for (let i = 0; i < sizeX; i++) {
                    this.mCoverMap[y][i] = 0;
                }
            }
            this.mCoverMap[y][x] = 1;
        }
        static create() {
            for (let i = 0; i < this.mCoverMap.length; i++) {
                if (!this.mCoverMap[i]) {
                    this.mCoverMap[i] = [];
                }
            }
            this.mGrap = new Laya.Browser.window.Graph(this.mCoverMap, { diagonal: true });
        }
        static search(startX, startZ, endX, endZ, offsetX, offsetZ) {
            if (this.mIsSearching || !this.mGrap) {
                return null;
            }
            this.mIsSearching = true;
            if (Utils.checkIsNull(startX) || Utils.checkIsNull(startZ) || Utils.checkIsNull(endX) || Utils.checkIsNull(endZ)) {
                this.mIsSearching = false;
                return null;
            }
            var astarPathInfo = new AStarPathInfo();
            var start = this.mGrap.grid[startZ][startX];
            var end = this.mGrap.grid[endZ][endX];
            if (!start || !end) {
                this.mIsSearching = false;
                return null;
            }
            var pathArr = this.mAStarJs.search(this.mGrap, start, end, {
                closest: true,
            });
            astarPathInfo.rolePos = new Laya.Vector2(endX, endZ);
            let randomIndex = MathUtils.nextInt(5, 10);
            for (var i = 0; i < pathArr.length - 1; i++) {
                if (i % randomIndex == 0 || i == pathArr.length - 1) {
                    astarPathInfo.pathArr.push(new Laya.Vector3(pathArr[i].y + 1 / 2 + MathUtils.nextFloat(-0.5, 0.5) + offsetX, 0, -(pathArr[i].x + 1 / 2 + MathUtils.nextFloat(-0.5, 0.5)) + offsetZ));
                    randomIndex = MathUtils.nextInt(3, 8);
                }
                else {
                    astarPathInfo.pathArr.push(new Laya.Vector3(pathArr[i].y + 1 / 2 + offsetX, 0, -(pathArr[i].x + 1 / 2) + offsetZ));
                }
            }
            this.mIsSearching = false;
            return astarPathInfo;
        }
        static clearAll() {
            this.mGrap = {};
            this.mCoverMap = [];
        }
    }
    AstarUtils.mIsSearching = false;

    class BaseStrategyScript {
        constructor(playerRateArr, robotRateArr) {
            this.mSelfScore = 0;
            this.mRobotScore = 0;
            this.mPlayerRateArr = playerRateArr;
            this.mRobotRateArr = robotRateArr;
        }
        clear() {
            this.mSelfScore = 0;
            this.mRobotScore = 0;
        }
        random(rate) {
            let random = MathUtils.nextInt(0, 1000);
            if (random < rate) {
                return true;
            }
            return false;
        }
        updataScore(pos) {
            SceneResManager.playEffectCatchCrystal(pos);
            EventUtils.dispatchEvent(MyGameConfig.EVENT_PVP_SCORE, { "self": this.mSelfScore, "opponent": this.mRobotScore });
        }
    }

    class StrategyFailScript1 extends BaseStrategyScript {
        constructor() {
            super(...arguments);
            this.mPlayerIndex = 0;
            this.mRobotIndex = 0;
        }
        check(isSelf, pos) {
            if (isSelf) {
                if (this.mSelfScore < this.mRobotScore - 1) {
                    let rate;
                    if (this.mPlayerIndex < this.mPlayerRateArr.length) {
                        rate = this.mPlayerRateArr[this.mPlayerIndex];
                    }
                    else {
                        rate = this.mPlayerRateArr[this.mPlayerRateArr.length - 1];
                    }
                    if (this.random(rate)) {
                        this.mSelfScore++;
                        this.mPlayerIndex++;
                        this.updataScore(pos);
                    }
                }
            }
            else {
                let rate;
                if (this.mRobotIndex < this.mRobotRateArr.length) {
                    rate = this.mRobotRateArr[this.mRobotIndex];
                }
                else {
                    rate = this.mRobotRateArr[this.mRobotRateArr.length - 1];
                }
                if (this.random(rate)) {
                    this.mRobotScore++;
                    this.mRobotIndex++;
                    this.updataScore(pos);
                }
            }
        }
        clear() {
            super.clear();
            this.mPlayerIndex = 0;
            this.mRobotIndex = 0;
        }
    }

    class StrategyWinScript1 extends BaseStrategyScript {
        constructor() {
            super(...arguments);
            this.mPlayerIndex = 0;
            this.mRobotIndex = 0;
        }
        check(isSelf, pos) {
            if (isSelf) {
                let rate;
                if (this.mPlayerIndex < this.mPlayerRateArr.length - 1) {
                    rate = this.mPlayerRateArr[this.mPlayerIndex];
                }
                else {
                    rate = this.mPlayerRateArr[this.mPlayerRateArr.length - 1];
                }
                if (this.random(rate)) {
                    this.mSelfScore++;
                    this.mPlayerIndex++;
                    this.updataScore(pos);
                }
            }
            else {
                let rate;
                if (this.mRobotIndex < this.mRobotRateArr.length) {
                    rate = this.mRobotRateArr[this.mRobotIndex];
                }
                else {
                    rate = this.mRobotRateArr[this.mRobotRateArr.length - 1];
                }
                if (this.random(rate)) {
                    this.mRobotScore++;
                    this.mRobotIndex++;
                    this.updataScore(pos);
                }
            }
        }
        clear() {
            super.clear();
            this.mPlayerIndex = 0;
            this.mRobotIndex = 0;
        }
    }

    class StrategyScriManager {
        constructor() {
            this.mIsWin = false;
            this.mWinStrategyArr = [
                {
                    "player": [7, 8, 9, 10],
                    "robot": [10, 9, 8, 7, 6, 5, 6, 7, 8, 9, 10]
                },
                {
                    "player": [7, 8, 9, 10, 7, 8, 9, 10],
                    "robot": [10, 9, 8, 7, 6, 5, 6, 7, 8, 9, 10]
                }, {
                    "player": [9],
                    "robot": [7]
                }
            ];
            this.mFailStrategyArr = [
                {
                    "player": [5, 6, 7, 8],
                    "robot": [10, 9, 8, 7, 8, 9, 10]
                }, {
                    "player": [6, 7, 8, 9, 6, 7, 8, 9, 10],
                    "robot": [10, 9, 8, 7, 8, 9, 10]
                }, {
                    "player": [7],
                    "robot": [10]
                }
            ];
        }
        static get instance() {
            if (!this.mInstance) {
                this.mInstance = new StrategyScriManager();
            }
            return this.mInstance;
        }
        randomResult() {
            let random = MathUtils.nextInt(0, 100);
            if (random < 50) {
                let strategy = this.mWinStrategyArr[MathUtils.nextInt(0, this.mWinStrategyArr.length - 1)];
                this.mCurStrategy = new StrategyWinScript1(strategy.player, strategy.robot);
            }
            else {
                let strategy = this.mFailStrategyArr[MathUtils.nextInt(0, this.mFailStrategyArr.length - 1)];
                this.mCurStrategy = new StrategyFailScript1(strategy.player, strategy.robot);
            }
        }
        check(isSelf, pos) {
            this.mCurStrategy.check(isSelf, pos);
        }
        clear() {
            this.mCurStrategy.clear();
            this.mCurStrategy = null;
        }
    }

    class PvpMapManager extends BaseMapManager {
        constructor() {
            super(...arguments);
            this.mBirthArr = [];
            this.mStoneCountArr = [];
        }
        static get instance() {
            if (!this.mInstance) {
                this.mInstance = new PvpMapManager();
            }
            return this.mInstance;
        }
        init() {
            super.init();
            this.mIsPvp = true;
        }
        createMap(callback) {
            this.mMap = {};
            this.curIslandTotalCatchStoneCore = 0;
            this.curIslandTotalCatchStone = 0;
            StrategyScriManager.instance.randomResult();
            let levelSpikeNum = DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_SPIKE_NUM);
            let levelSpikeCircleNum = DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_SPIKE_NUM);
            let levelSpikeSize = DataManager.getLevelByKey(MyGameConfig.KEY_DAY_LEVEL_SPIKE_SIZE);
            let totalLevel = levelSpikeNum + levelSpikeCircleNum + levelSpikeSize;
            let level = 0;
            if (totalLevel < 15) {
                level = 0;
            }
            else if (totalLevel < 30) {
                level = 1;
            }
            else {
                level = 2;
            }
            UiUtils.loadJson(MyGameConfig.URL_CONFIG + "pvp/" + MyGameConfig.pvpLevelConfig[level].configName, (json) => {
                let res3dArr = [];
                let stoneArr = json["stone"];
                let birthArr = json["birth"];
                let min = json["min"];
                let size = json["size"];
                this.mSizeOffsetX = -min.x;
                this.mSizeOffsetZ = -min.z;
                this.mIslandOffsetX = GameManager.instance.scene3d.getChildByName("node_pvp").transform.position.x;
                for (let i = 0; i < birthArr.length; i++) {
                    let pos = birthArr[i].pos;
                    this.mBirthArr.push(new Laya.Vector3(this.mIslandOffsetX + pos.x, 0, pos.z));
                }
                Utils.shuffleArr(this.mBirthArr);
                for (let key in json["useStone"]) {
                    let stoneConfig = MyGameConfig.stoneConfig[key];
                    res3dArr.push(MyGameConfig.URL_RES3D_STONE + stoneConfig.stoneModel);
                    res3dArr.push(MyGameConfig.URL_RES3D_STONE + stoneConfig.stoneCurveModel);
                    res3dArr.push(MyGameConfig.URL_RES3D_STONE + stoneConfig.stoneFloorModel);
                    res3dArr.push(MyGameConfig.URL_RES3D_STONE + stoneConfig.stoneCatchModel);
                }
                let childIslandConfigInfo = MyGameConfig.pvpLevelConfig[level];
                res3dArr.push(MyGameConfig.URL_RES3D_ISLAND + childIslandConfigInfo.modelName);
                Laya.loader.create(res3dArr, new Laya.Handler(this, () => {
                    this.mCurChildIsland = Laya.loader.getRes(MyGameConfig.URL_RES3D_ISLAND + childIslandConfigInfo.modelName).clone();
                    GameManager.instance.scene3d.addChild(this.mCurChildIsland);
                    this.mCurChildIsland.transform.position = new Laya.Vector3(this.mIslandOffsetX, 0, 0);
                    for (let key in json["useStone"]) {
                        let stoneConfig = MyGameConfig.stoneConfig[key];
                        let nodeStone = Laya.loader.getRes(MyGameConfig.URL_RES3D_STONE + stoneConfig.stoneModel);
                        let nodeCurveStone = Laya.loader.getRes(MyGameConfig.URL_RES3D_STONE + stoneConfig.stoneCurveModel);
                        this.generateCubeUvs(stoneConfig.type, nodeStone);
                        this.generateCurveUvs(stoneConfig.type, nodeCurveStone);
                    }
                    let stoneCoreWidth = 1 / MyGameConfig.gameConfig.stoneCoreComposeStone;
                    let tempInfoArr = [];
                    for (let i = 0; i < stoneArr.length; i++) {
                        let stoneConfigInfo = stoneArr[i];
                        let scale = stoneConfigInfo.scale;
                        let startPos = stoneConfigInfo.pos;
                        let type = stoneConfigInfo.name;
                        for (let j = 0; j < scale.x; j++) {
                            for (let k = 0; k < scale.z; k++) {
                                tempInfoArr.push({ scale: scale, startPos: startPos, type: type, pos: new Laya.Vector3(startPos.x + j, 0, startPos.z - k), height: 1 });
                                this.curIslandTotalCatchStoneCore += 16;
                                this.curIslandTotalCatchStone += (16 / MyGameConfig.gameConfig.stoneCoreComposeStone);
                            }
                        }
                    }
                    let index = 0;
                    let createNum = 40;
                    let self = this;
                    Laya.timer.frameLoop(1, this, function s() {
                        if (index >= tempInfoArr.length - 1) {
                            Laya.timer.clear(self, s);
                            let birthArr = json["birth"];
                            let crystalArr = json["crystal"];
                            for (let i = 0; i < birthArr.length; i++) {
                                AstarUtils.addMap(birthArr[i].pos.x + self.mSizeOffsetX, -(birthArr[i].pos.z + self.mSizeOffsetZ), size.x);
                            }
                            for (let i = 0; i < crystalArr.length; i++) {
                                let info = crystalArr[i];
                                let pos = info.pos;
                                for (let j = 0; j < info.scale.z; j++) {
                                    for (let k = 0; k < info.scale.x; k++) {
                                        AstarUtils.addMap(pos.x + k + self.mSizeOffsetX, -(pos.z + j + self.mSizeOffsetZ), size.x);
                                    }
                                }
                            }
                            AstarUtils.create();
                        }
                        let renderableSprite3Ds = [];
                        for (let i = index; i < tempInfoArr.length && i < index + createNum; i++) {
                            let info = tempInfoArr[i];
                            let pos = info.pos;
                            info.height = 0.7;
                            let height = info.height;
                            let type = info.type;
                            let gridInfo = self.createGride(pos.x, pos.z);
                            let obj = {};
                            obj.height = height;
                            obj.type = type;
                            obj.stonePointArr = [];
                            let cubeVerticeArr = JSON.parse(JSON.stringify(self.mCubeVerticeArr));
                            for (let q = 0; q < cubeVerticeArr.length / 3; q++) {
                                cubeVerticeArr[q * 3 + 0] += pos.x;
                                cubeVerticeArr[q * 3 + 1] = height;
                                cubeVerticeArr[q * 3 + 2] += pos.z;
                            }
                            let nodeStone = self.createMesh(type, cubeVerticeArr, self.mCubeIndicesArr, pos.x, pos.z);
                            obj.node = nodeStone;
                            obj.stonePointArr[0] = [];
                            let leftUpPoint = { X: GameManager.instance.toFixed(pos.x * MyGameConfig.POSITION_SCALE), Y: GameManager.instance.toFixed((pos.z - 1) * MyGameConfig.POSITION_SCALE) };
                            let rightUpPoint = { X: GameManager.instance.toFixed((pos.x + 1) * MyGameConfig.POSITION_SCALE), Y: GameManager.instance.toFixed((pos.z - 1) * MyGameConfig.POSITION_SCALE) };
                            let rightDownPoint = { X: GameManager.instance.toFixed((pos.x + 1) * MyGameConfig.POSITION_SCALE), Y: GameManager.instance.toFixed(pos.z * MyGameConfig.POSITION_SCALE) };
                            let leftDownPoint = { X: GameManager.instance.toFixed(pos.x * MyGameConfig.POSITION_SCALE), Y: GameManager.instance.toFixed(pos.z * MyGameConfig.POSITION_SCALE) };
                            obj.stonePointArr[0].push(leftUpPoint);
                            obj.stonePointArr[0].push(rightUpPoint);
                            obj.stonePointArr[0].push(rightDownPoint);
                            obj.stonePointArr[0].push(leftDownPoint);
                            let preLength = gridInfo.stoneCoreArr.length;
                            for (let q = preLength; q < preLength + 4; q++) {
                                for (let t = 0; t < 4; t++) {
                                    gridInfo.stoneCoreArr.push({ type: type, pos: new Laya.Vector3(pos.x + stoneCoreWidth / 2 + q * stoneCoreWidth + this.mIslandOffsetX, 0, pos.z - stoneCoreWidth / 2 - stoneCoreWidth * t) });
                                }
                            }
                            gridInfo.stoneInfoArr.push(obj);
                            self.mCurChildIsland.addChild(nodeStone);
                            renderableSprite3Ds.push(nodeStone);
                            let aStartX = pos.x + self.mSizeOffsetX;
                            let aStartZ = -(pos.z + self.mSizeOffsetZ);
                            AstarUtils.addMap(aStartX, aStartZ, size.x);
                            if (!self.mStoneCountArr[aStartZ]) {
                                self.mStoneCountArr[aStartZ] = new Array();
                            }
                            self.mStoneCountArr[aStartZ].push({ "x": aStartX, "z": aStartZ });
                        }
                        Laya.StaticBatchManager.combine(self.mCurChildIsland, renderableSprite3Ds);
                        index += createNum;
                    });
                    callback(this.mCurChildIsland);
                }));
            });
        }
        catchStoneCore(info, gridInfo, roleScript) {
            StrategyScriManager.instance.check(roleScript.isSelf(), roleScript.getRollerScript().getPosition());
        }
        clearedGrid(gridInfo) {
            let aStartX = gridInfo.x + this.mSizeOffsetX;
            let aStartZ = -(gridInfo.z + this.mSizeOffsetZ);
            for (let i = 0; i < this.mStoneCountArr.length; i++) {
                if (this.mStoneCountArr[i].length > 0) {
                    if (this.mStoneCountArr[i][0].z == aStartZ) {
                        if (this.mStoneCountArr[i].length == 1) {
                            this.mStoneCountArr[i] = [];
                            return;
                        }
                        else {
                            let newArr = [];
                            for (let j = 0; j < this.mStoneCountArr[i].length; j++) {
                                let info = this.mStoneCountArr[i][j];
                                if (info.x != aStartX) {
                                    newArr.push(info);
                                }
                            }
                            this.mStoneCountArr[i] = newArr;
                        }
                    }
                }
            }
        }
        aStarInfo2GridInfo(astarInfo) {
            let posX = astarInfo.x - this.mSizeOffsetX;
            let posZ = -astarInfo.z - this.mSizeOffsetZ;
            let gridInfo = this.createGride(Math.floor(posX), Math.floor(posZ));
            return gridInfo;
        }
        get birthArr() {
            return this.mBirthArr;
        }
        get stoneCountArr() {
            return this.mStoneCountArr;
        }
        get sizeOffsetX() {
            return this.mSizeOffsetX;
        }
        get sizeOffsetZ() {
            return this.mSizeOffsetZ;
        }
        get islandOffsetX() {
            return this.mIslandOffsetX;
        }
        clearAll() {
            super.clearAll();
            this.mBirthArr = [];
            this.mStoneCountArr = [];
            StrategyScriManager.instance.clear();
            AstarUtils.clearAll();
            if (this.mCurChildIsland) {
                this.mCurChildIsland.destroy(true);
            }
            this.mCurChildIsland = null;
        }
    }

    class RollerScript extends Laya.Script3D {
        constructor() {
            super(...arguments);
            this.mLevelSpikeNum = 0;
            this.mLevelSpikeCircleNum = 0;
            this.mLevelSpikeSize = 0;
        }
        onAwake() {
            this.mRollerSpeed = 0.3;
        }
        onUpdate() {
            if (GameManager.instance.isPause) {
                return;
            }
            this.mNode.transform.rotate(new Laya.Vector3(-this.mRollerSpeed * Laya.timer.delta, 0, 0), true, false);
        }
        init(node) {
            this.mNode = node;
            this.mNodeRoller = this.mNode.getChildByName("node_roller");
            this.mRoleScript = this.mNode.parent.parent.getComponent(BaseRoleScript);
            this.mNodeSize = this.mNode.parent.getChildByName("node_size");
            this.mNodeEffectPower = SceneResManager.createEffectPropPower(this.mNode, true);
            this.mStarColor = this.mNodeRoller.meshRenderer.material.albedoColor.clone();
            this.mNodeEffectPower.active = false;
        }
        initLevel(data) {
            this.mLevelRollerSize = data[MyGameConfig.PROPERTY_CAR_ROLLER_SIZE];
            this.mLevelSpikeSize = data[MyGameConfig.PROPERTY_CAR_SPIKE_SIZE];
            this.mLevelSpikeNum = data[MyGameConfig.PROPERTY_CAR_SPIKE_NUM];
            this.mLevelSpikeCircleNum = data[MyGameConfig.PROPERTY_CAR_SPIKE_CIRCLE_NUM];
            this.calculateForce();
            this.scaleRoller(MyGameConfig.truckConfig[this.mLevelRollerSize].rollerSize);
        }
        changeMap() {
            MapManager.instance.changeMap(this.mNodeSize, this.mRoleScript, 0);
        }
        changePvpMap() {
            PvpMapManager.instance.changeMap(this.mNodeSize, this.mRoleScript, PvpMapManager.instance.islandOffsetX);
        }
        craeteSpike(isDestroy = true, width = 0.6) {
            this.mNodeSpikeParent = this.mNode.getChildByName("node_spike");
            if (isDestroy) {
                this.mNodeSpikeParent.destroyChildren();
            }
            let spikeSpace;
            let startX;
            let rollerScale = this.mNodeRoller.transform.getWorldLossyScale();
            width = ((rollerScale.x / 2) + 0.1) * 2;
            if (this.mSpikeCircleNum == 0) {
                spikeSpace = 0;
                startX = 0;
            }
            else if (this.mSpikeCircleNum % 2 == 0) {
                spikeSpace = width / this.mSpikeCircleNum;
                startX = -(this.mSpikeCircleNum - 1) * spikeSpace / 2;
            }
            else {
                spikeSpace = width / (this.mSpikeCircleNum + 2);
                startX = -Math.floor(this.mSpikeCircleNum / 2) * spikeSpace;
            }
            let spikeAngleSpace = 2 * Math.PI / this.mSpikeNum;
            let radius = 0.25;
            for (let i = 0; i < this.mSpikeCircleNum; i++) {
                for (let j = 0; j < this.mSpikeNum; j++) {
                    let angle = spikeAngleSpace * j + i * Math.PI / 2;
                    let position = new Laya.Vector3(startX + i * spikeSpace, 0, 0);
                    let rotationEuler = new Laya.Vector3(MathUtils.radian2Angle(angle), 0, 0);
                    let size = new Laya.Vector3(this.mSpikeSize, this.mSpikeSize, this.mSpikeSize);
                    if (isDestroy) {
                        let nodeSpike = SceneResManager.createSpike(this.mNodeSpikeParent, position, rotationEuler, size);
                        this.mNodeSpikeParent.addChild(nodeSpike);
                    }
                    else {
                        let nodeSpike = this.mNodeSpikeParent.getChildAt(j + i * this.mSpikeNum);
                        nodeSpike.transform.localPosition = position;
                    }
                }
            }
        }
        setSpikeCircleNumLevel(level) {
            this.mLevelSpikeCircleNum = level;
            this.mSpikeCircleNum = MyGameConfig.truckConfig[level].spikeCircleNum;
            this.calculateForce();
        }
        setSpikeNumLevel(level) {
            this.mLevelSpikeNum = level;
            this.mSpikeNum = MyGameConfig.truckConfig[level].spikeNum;
            this.calculateForce();
        }
        setSpikeSizeLevel(level) {
            this.mLevelSpikeSize = level;
            this.mSpikeSize = MyGameConfig.truckConfig[level].spikeSize;
            this.calculateForce();
        }
        setRollerSpeedLevel(level) {
        }
        setRollerSizeLevel(level) {
            this.mLevelRollerSize = level;
            this.scaleRoller(MyGameConfig.truckConfig[this.mLevelRollerSize].rollerSize);
        }
        calculateForce() {
            this.mTotalForce = 0;
            this.mTotalForce += MyGameConfig.truckConfig[this.mLevelSpikeCircleNum].spikeCircleForce;
            this.mTotalForce += MyGameConfig.truckConfig[this.mLevelSpikeNum].spikeForce;
            this.mTotalForce += MyGameConfig.truckConfig[this.mLevelSpikeSize].spikeSizeForce;
            return this.mTotalForce;
        }
        isAddColor(b) {
        }
        getNodeRoller() {
            return this.mNodeRoller;
        }
        getNodeSpikeParent() {
            return this.mNodeSpikeParent;
        }
        setTotalForce(num) {
            this.mTotalForce = num;
        }
        getPosition() {
            return this.mNode.transform.position;
        }
        getTotalForce() {
            return this.mTotalForce;
        }
        scaleRoller(scale) {
            let range = (scale / 2);
            this.mNodeSize.getChildAt(0).transform.localPosition = new Laya.Vector3(range, 0, 1.06);
            this.mNodeSize.getChildAt(1).transform.localPosition = new Laya.Vector3(-range, 0, 1.06);
            this.mNodeSize.getChildAt(2).transform.localPosition = new Laya.Vector3(-range, 0, 0);
            this.mNodeSize.getChildAt(3).transform.localPosition = new Laya.Vector3(range, 0, 0);
            this.mNodeRoller.transform.setWorldLossyScale(new Laya.Vector3(scale, 1, 1));
            this.craeteSpike(false);
        }
        showPower() {
            let scale = this.mNodeRoller.transform.getWorldLossyScale();
            for (let i = 0; i < this.mNodeEffectPower.getChildAt(0).numChildren; i++) {
                let node = this.mNodeEffectPower.getChildAt(0).getChildAt(i);
                node.transform.localPosition.x = -scale.x / 2 + scale.x * i;
                node.transform.localPosition = node.transform.localPosition;
            }
            this.mNodeEffectPower.active = true;
        }
        hidePower() {
            this.mNodeEffectPower.active = false;
        }
    }

    class BaseRoleScript extends Laya.Script3D {
        constructor() {
            super(...arguments);
            this.STATUS_IDLE = 0;
            this.STATUS_MOVE = 1;
            this.STATUS_TOUCH_ROTATE = 2;
            this.STATUS_GO_TARGET = 3;
            this.CONTAINER_LAYER_ROW = 2;
            this.CONTAINER_LAYER_COL = 7;
            this.mIsSelf = true;
            this.mLastPosition = new Laya.Vector3();
            this.mDurable = 0;
            this.mMaxDurable = 0;
            this.mDurableProgress = 0;
            this.mSpeedRate = 1;
            this.mTargetRotateY = null;
        }
        onAwake() {
        }
        init() {
            this.mNode = this.owner;
            this.mNodeRole = this.mNode.getChildByName("node_role");
            this.mNodeRoleModel = this.mNodeRole.getChildByName("node_car_model");
            let nodeRoller = this.mNodeRole.getChildByName("node_roller");
            this.mNodeSize = this.mNodeRole.getChildByName("node_size");
            this.mNodeWheel = this.mNodeRole.getChildByName("wheel");
            this.mRollerScript = nodeRoller.addComponent(RollerScript);
            this.mRollerScript.init(nodeRoller);
            let characterController = this.mNodeRole.addComponent(Laya.CharacterController);
            let shape = new Laya.CapsuleColliderShape(0.5, 1);
            characterController.colliderShape = shape;
            characterController.gravity = new Laya.Vector3(0, 0, 0);
            shape.localOffset = new Laya.Vector3(0, 0, 0);
            this.mCharacterController = characterController;
        }
        createRoleModel(carConfig, callback, releaseResources) {
            SceneResManager.createRole(carConfig.modelName, (nodeBody) => {
                let saveDurable = DataManager.getDurable();
                if (saveDurable == -1) {
                    this.mDurable = carConfig.durable;
                }
                else {
                    if (this.mMaxDurable) {
                        let durableProgress = saveDurable / this.mMaxDurable;
                        this.mDurable = Math.floor(durableProgress * carConfig.durable);
                    }
                    else {
                        this.mDurable = saveDurable;
                    }
                }
                if (!this.mIsSelf) {
                    nodeBody.meshRenderer.material.albedoColor = new Laya.Vector4(64 / 255, 204 / 255, 64 / 255, 1);
                }
                this.mMaxDurable = carConfig.durable;
                this.mDurableProgress = this.mDurable / this.mMaxDurable;
                this.mNodeRoleModel.destroyChildren();
                nodeBody.transform.localPosition = new Laya.Vector3(0, 0, 0);
                this.mNodeRoleModel.addChild(nodeBody);
                if (releaseResources) {
                    Laya.Resource.destroyUnusedResources();
                }
                UiUtils.hideLoading();
                if (callback) {
                    callback(nodeBody);
                }
            });
        }
        checkPvpMap() {
            let position = this.mNodeRole.transform.position;
            let distance = Laya.Vector3.distance(position, this.mLastPosition);
            if (distance > 0.1) {
                this.mLastPosition.setValue(position.x, position.y, position.z);
                this.mRollerScript.changePvpMap();
            }
        }
        getNode() {
            return this.mNode;
        }
        setNode(node) {
            this.mNode = node;
        }
        getNodeRole() {
            return this.mNodeRole;
        }
        setSpeedLevel(level) {
            this.mSpeed = MyGameConfig.truckConfig[level].truckSpeed / 100000;
        }
        setSpeedRate(rate) {
            this.mSpeedRate = rate;
        }
        getSpeed() {
            return this.mSpeed;
        }
        getRollerScript() {
            return this.mRollerScript;
        }
        isSelf() {
            return this.mIsSelf;
        }
    }

    class RoleScript extends BaseRoleScript {
        constructor() {
            super(...arguments);
            this.CONTAINER_LAYER_MAX = this.CONTAINER_LAYER_ROW * this.CONTAINER_LAYER_COL;
            this.mPreControlAngle = 0;
            this.mMoveLastPosition = new Laya.Vector3();
            this.mMoveDeltaX = 0;
            this.mMoveDeltaZ = 0;
            this.mForward = new Laya.Vector3();
            this.mScaleWard = new Laya.Vector3();
            this.mStateMachine = new StateMachine();
            this.mContainerArr = [];
            this.mContainerLayer = 0;
            this.mCatchStoneProgress = 0;
            this.mContainerNum = 0;
            this.mContainerProgress = 0;
            this.mCatchStoneCoreNum = 0;
            this.mCatchStoneCoreProgress = 0;
            this.mTrcuckData = {
                "capacity": {},
                "catchStoneNum": 0,
            };
            this.mPropsEffectMap = {};
            this.mCurPlayModel = MyGameConfig.PLAY_MODEL_NORMAL;
            this.mStoneCoreScriptMap = new Map();
            this.mIsEnterChildIsland = false;
            this.mRepairRate = 1;
        }
        onAwake() {
            this.mContainerArr[this.mContainerLayer] = [];
            this.mStateMachine.registerState(MyGameConfig.STATE_INVALID, new CharacterBaseState(this));
            this.mStateMachine.registerState(MyGameConfig.STATE_SELL, new CharacterSellState(this));
            this.mStateMachine.registerState(MyGameConfig.STATE_UPGRADE, new CharacterUpgradeState(this));
            this.mStateMachine.registerState(MyGameConfig.STATE_TANK_SHOP, new CharacterShopState(this));
            this.mStateMachine.registerState(MyGameConfig.STATE_LABORATORY, new CharacterLaboratoryState(this));
            this.mStateMachine.registerState(MyGameConfig.STATE_FACTORY, new CharacterFactoryState(this));
            this.mStateMachine.registerState(MyGameConfig.STATE_MAP, new CharacterMapState(this));
            this.mStateMachine.registerState(MyGameConfig.STATE_REPAIR_FACTORY, new CharacterRepairFactoryState(this));
            this.mStateMachine.registerState(MyGameConfig.STATE_REPAIR, new CharacterRepairState(this));
            this.mStateMachine.registerState(MyGameConfig.STATE_HAUL, new CharacterHaulState(this));
            this.mStateMachine.registerState(MyGameConfig.STATE_HAUL_PVP, new CharacterHaulPvpState(this));
            this.mStateMachine.changeState(MyGameConfig.STATE_INVALID);
            this.mPropsEffectMap[MyGameConfig.PROPS_ROLLER] = new PropsRollerScript();
            this.mPropsEffectMap[MyGameConfig.PROPS_POWER] = new PropsPowerScript();
            this.mPropsEffectMap[MyGameConfig.PROPS_CAPACITY] = new PropsCapacityScript();
            this.mPropsEffectMap[MyGameConfig.PROPS_EXPLOSIVE] = new PropsExplosiveScript();
            this.addHandler();
        }
        onUpdate() {
            if (!this.mNode || GameManager.instance.isPause
                || this.mStateMachine.mainStateScript.getStateKey() == MyGameConfig.STATE_HAUL
                || this.mStateMachine.mainStateScript.getStateKey() == MyGameConfig.STATE_HAUL_PVP) {
                return;
            }
            let timerDelta = GameManager.instance.timerDelta;
            if (this.mCurStatus == this.STATUS_MOVE) {
                this.mNodeRole.transform.getForward(this.mForward);
                let speedScele = timerDelta * this.mSpeed * this.mSpeedRate;
                Laya.Vector3.scale(this.mForward, speedScele, this.mScaleWard);
                this.mCharacterController.move(this.mScaleWard);
            }
            else if (this.mCurStatus == this.STATUS_TOUCH_ROTATE && this.mTargetRotateY !== null) {
                let angle = Vector3Utils.getMinAngle(this.mTargetRotateY, this.mNodeRole.transform.rotationEuler.y);
                let absAngle = Math.abs(angle);
                if (absAngle < 10) {
                    this.mCurStatus = this.STATUS_MOVE;
                    this.mTargetRotateY = null;
                }
                else {
                    let newAngle = angle > 0 ? timerDelta / 3 * this.mSpeedRate : -timerDelta / 3 * this.mSpeedRate;
                    if (Math.abs(newAngle) > absAngle) {
                        newAngle = angle > 0 ? angle : -angle;
                    }
                    else {
                        newAngle = angle > 0 ? timerDelta / 3 * this.mSpeedRate : -timerDelta / 3 * this.mSpeedRate;
                    }
                    this.mNodeRole.transform.rotate(new Laya.Vector3(0, newAngle, 0), false, false);
                }
                this.mCharacterController.move(Vector3Utils.ZERO);
                if (this.mNodeRole.transform.position.z < 0) {
                    switch (this.mCurPlayModel) {
                        case MyGameConfig.PLAY_MODEL_NORMAL:
                            this.mRollerScript.changeMap();
                            break;
                        case MyGameConfig.PLAY_MODEL_PVP:
                            this.mRollerScript.changePvpMap();
                            break;
                    }
                }
            }
            else if (this.mCurStatus == this.STATUS_GO_TARGET) {
                this.mNodeRole.transform.getForward(this.mForward);
                let moveDistance = timerDelta * this.mSpeed;
                if (this.mTargetDistance < moveDistance) {
                    Laya.Vector3.scale(this.mForward, this.mTargetDistance, this.mScaleWard);
                    this.mCharacterController.move(this.mScaleWard);
                    this.mCurStatus = this.STATUS_IDLE;
                    this.mTargetCallback();
                    this.mCharacterController.move(Vector3Utils.ZERO);
                }
                else {
                    Laya.Vector3.scale(this.mForward, moveDistance, this.mScaleWard);
                    this.mCharacterController.move(this.mScaleWard);
                }
                this.mTargetDistance -= moveDistance;
            }
            for (let key in this.mPropsEffectMap) {
                this.mPropsEffectMap[key].update();
            }
        }
        onLateUpdate() {
            if (!this.mNode || GameManager.instance.isPause) {
                return;
            }
            let position = this.mNodeRole.transform.position;
            if (this.mStateMachine.mainStateScript.getStateKey() != MyGameConfig.STATE_HAUL_PVP) {
                this.mMoveDeltaX = position.x - this.mMoveLastPosition.x;
                let moveDeltaY = position.y - this.mMoveLastPosition.y;
                this.mMoveDeltaZ = position.z - this.mMoveLastPosition.z;
                this.mCameraPosition.x += this.mMoveDeltaX;
                this.mCameraPosition.y += moveDeltaY;
                this.mCameraPosition.z += this.mMoveDeltaZ;
                this.mNodeCamera.transform.position = this.mCameraPosition;
                this.mMoveLastPosition.setValue(position.x, position.y, position.z);
            }
            if (this.mStateMachine.mainStateScript.getStateKey() == MyGameConfig.STATE_HAUL
                || this.mStateMachine.mainStateScript.getStateKey() == MyGameConfig.STATE_HAUL_PVP) {
                this.mStateMachine.update();
                return;
            }
            this.mDirectionScript.check();
            if (position.z > 1) {
                this.mIsEnterChildIsland = false;
                let isLevel = true;
                for (let key in MyGameConfig.functionUnlockConfig) {
                    let functionUnlock = MyGameConfig.functionUnlockConfig[key];
                    let state;
                    let distance = Laya.Vector3.distance(functionUnlock.position, position);
                    if (distance < functionUnlock.radius) {
                        let curState = this.mStateMachine.mainStateScript.getStateKey();
                        switch (functionUnlock.id) {
                            case MyGameConfig.FUNCTION_ID_SELL:
                                state = MyGameConfig.STATE_SELL;
                                break;
                            case MyGameConfig.FUNCTION_ID_TANK_SHOP:
                                state = MyGameConfig.STATE_TANK_SHOP;
                                break;
                            case MyGameConfig.FUNCTION_ID_LABORATORY:
                                state = MyGameConfig.STATE_LABORATORY;
                                break;
                            case MyGameConfig.FUNCTION_ID_FACTORY:
                                state = MyGameConfig.STATE_FACTORY;
                                break;
                            case MyGameConfig.FUNCTION_ID_MAP:
                                state = MyGameConfig.STATE_MAP;
                                break;
                            case MyGameConfig.FUNCTION_ID_REPAIR_STATION:
                                if (curState != MyGameConfig.STATE_UPGRADE && curState != MyGameConfig.STATE_REPAIR) {
                                    state = MyGameConfig.STATE_REPAIR_FACTORY;
                                }
                                else {
                                    state = curState;
                                }
                                break;
                            default:
                                state = curState;
                                break;
                        }
                        isLevel = false;
                        if (distance < functionUnlock.radius && state != curState) {
                            this.mStateMachine.changeState(state);
                            break;
                        }
                        else if (distance > functionUnlock.radius && state == curState) {
                            this.mStateMachine.changeState(MyGameConfig.STATE_INVALID);
                            break;
                        }
                    }
                }
                if (isLevel && this.mStateMachine.mainStateScript.getStateKey() != MyGameConfig.STATE_INVALID) {
                    this.mStateMachine.changeState(MyGameConfig.STATE_INVALID);
                }
                this.mStateMachine.update();
                this.setSpeedRate(1);
            }
            else {
                this.checkMap();
            }
        }
        checkMap() {
            switch (this.mCurPlayModel) {
                case MyGameConfig.PLAY_MODEL_NORMAL:
                    this.checkNormalMap();
                    break;
                case MyGameConfig.PLAY_MODEL_PROSPECTING:
                    this.checkProspectingMap();
                    if (!this.mIsEnterChildIsland) {
                        EventUtils.dispatchEvent(MyGameConfig.EVENT_PROSPECTING_TIMER_PAUSE, false);
                    }
                    break;
                case MyGameConfig.PLAY_MODEL_PVP:
                    this.checkPvpMap();
                    break;
            }
            this.mIsEnterChildIsland = true;
        }
        checkNormalMap() {
            let position = this.mNodeRole.transform.position;
            let distance = Laya.Vector3.distance(position, this.mLastPosition);
            if (this.mDurable <= 0) {
                this.haul();
                return;
            }
            if (this.mStateMachine.mainStateScript.getStateKey() != MyGameConfig.STATE_INVALID) {
                this.mStateMachine.changeState(MyGameConfig.STATE_INVALID);
            }
            if (distance > 0.1) {
                this.mLastPosition.setValue(position.x, position.y, position.z);
                this.mRollerScript.changeMap();
            }
        }
        checkProspectingMap() {
            ProspectingMapManager.instance.checkMap();
        }
        haul() {
            GameManager.instance.isControl = false;
            this.stopMove();
            this.showWheel(false);
            this.mCharacterController.enabled = false;
            this.mStateMachine.changeState(MyGameConfig.STATE_HAUL);
        }
        haulEnd() {
            GameManager.instance.isControl = true;
            this.showWheel(true);
            this.mCharacterController.enabled = true;
            this.mStateMachine.changeState(MyGameConfig.STATE_INVALID);
        }
        init() {
            super.init();
            this.mNodeCamera = this.mNode.getChildByName("node_camera");
            this.mCamera = this.mNodeCamera.getChildByName("Main Camera");
            this.mCameraStartFieldOfView = this.mCamera.fieldOfView;
            this.mCameraStartLocalPosition = this.mCamera.transform.localPosition.clone();
            this.mCameraStartRotationEuler = this.mCamera.transform.rotationEuler.clone();
            this.mCameraPosition = this.mNodeCamera.transform.position.clone();
            this.mCamera.enableHDR = false;
            this.mCamera.addComponent(CameraMoveScript);
            this.mLastPosition.setValue(this.mNodeRole.transform.position.x, this.mNodeRole.transform.position.y, this.mNodeRole.transform.position.z);
            this.mMoveLastPosition.setValue(this.mNodeRole.transform.position.x, this.mNodeRole.transform.position.y, this.mNodeRole.transform.position.z);
            this.mNodeContainer = this.mNodeRole.getChildByName("node_container");
            this.mNodeEffectMining = this.mNodeRole.getChildByName("node_effect_mining");
            let noodeFullTip = this.mNodeRole.getChildByName("node_full_tip");
            this.mNodeRadar = this.mNodeRole.getChildByName("node_radar");
            this.mNodeRadar.addComponent(RadarScript);
            let nodeDirection = this.mNodeCamera.getChildByName("node_direction");
            this.mDirectionScript = nodeDirection.addComponent(DirectionScript);
            this.mDirectionScript.init(nodeDirection);
            this.mCurSmokeIndex = 0;
            this.mFullTipScript = noodeFullTip.addComponent(FullStoneTipScript);
            noodeFullTip.active = true;
            this.setSpeedLevel(DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_TRUCK_SPEED));
            this.setMaxCapacity(DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_TRUCK_CAPACITY));
            let levelData = {};
            levelData[MyGameConfig.PROPERTY_CAR_SPIKE_CIRCLE_NUM] = DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_SPIKE_CIRCLE_NUM);
            levelData[MyGameConfig.PROPERTY_CAR_SPIKE_NUM] = DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_SPIKE_NUM);
            levelData[MyGameConfig.PROPERTY_CAR_SPIKE_SIZE] = DataManager.getLevelByKey(MyGameConfig.KEY_DAY_LEVEL_SPIKE_SIZE);
            levelData[MyGameConfig.PROPERTY_CAR_ROLLER_SIZE] = DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_ROLLER_SIZE);
            this.getRollerScript().initLevel(levelData);
            this.mNodeRole.transform.position = new Laya.Vector3(this.mNodeRole.transform.position.x, 0, this.mNodeRole.transform.position.z);
            this.mStartPosition = this.mNodeRole.transform.position.clone();
            let totalPrice = 0;
            DataManager.addGoldValue(totalPrice);
            DataManager.setTruckData(this.mTrcuckData);
        }
        addHandler() {
            EventUtils.onEvent(this, MyGameConfig.EVENT_CATCH_PROPS, (args) => {
                this.mPropsEffectMap[args.type].refresh();
            });
            EventUtils.onEvent(this, MyGameConfig.EVENT_REPAIR, () => {
                this.clearWheel();
                this.showWheel(true);
                this.mCharacterController.enabled = true;
                this.mStateMachine.changeState(MyGameConfig.STATE_REPAIR);
            });
        }
        startMove() {
            this.mCurStatus = this.STATUS_TOUCH_ROTATE;
            this.mTargetRotateY = 0;
        }
        controlMove(radians, angle) {
            if (this.mCurStatus == this.STATUS_TOUCH_ROTATE) {
                this.mTargetRotateY = angle;
                this.mPreControlAngle = angle;
                return;
            }
            if (Math.abs(angle - this.mPreControlAngle) > 10) {
                this.mCurStatus = this.STATUS_TOUCH_ROTATE;
                this.mTargetRotateY = angle;
                return;
            }
            this.mNodeRole.transform.rotationEuler = new Laya.Vector3(0, angle, 0);
            this.mCurStatus = this.STATUS_MOVE;
            this.mPreControlAngle = angle;
            AudioManager.playTruck();
        }
        stopMove() {
            this.mCurStatus = this.STATUS_IDLE;
            this.mCharacterController.move(Vector3Utils.ZERO);
            AudioManager.stopTruck();
        }
        catchStone(info, isCatchFloorStone, nodeStone) {
            if (this.mContainerNum >= this.mMaxCapacity) {
                this.mFullTipScript.startAni(this.mContainerLayer);
                return false;
            }
            let num = isCatchFloorStone ? info.num : 1;
            for (let i = 0; i < num; i++) {
                if (i == 0) {
                    if (!nodeStone) {
                        nodeStone = SceneResManager.createCatchStone(GameManager.instance.curChildIsland, info.type, info.pos, this.mNodeRole.transform.rotationEuler).getNode();
                    }
                    else {
                        nodeStone = SceneResManager.createCrushedStone(GameManager.instance.curChildIsland, info.type, info.pos, info.node.transform.rotationEuler).getNode();
                        nodeStone.transform.position = info.pos;
                        MapManager.instance.pushDestroyStatic(info.node);
                        info.node = nodeStone;
                    }
                }
                else {
                    nodeStone = SceneResManager.createCatchStone(GameManager.instance.curChildIsland, info.type, info.pos, this.mNodeRole.transform.rotationEuler).getNode();
                }
                let script = nodeStone.getComponent(StoneCoreScript);
                if (!script) {
                    script = nodeStone.addComponent(StoneCoreScript);
                }
                if (!this.mStoneCoreScriptMap[script.getUuid()]) {
                    this.mStoneCoreScriptMap.set(script.getUuid(), script);
                }
                if (!this.mContainerArr[this.mContainerLayer]) {
                    this.mContainerArr[this.mContainerLayer] = [];
                }
                if (this.mContainerArr[this.mContainerLayer].length == this.CONTAINER_LAYER_MAX) {
                    this.mContainerLayer++;
                    this.mContainerArr[this.mContainerLayer] = [];
                }
                let row = Math.floor(this.mContainerArr[this.mContainerLayer].length / this.CONTAINER_LAYER_COL);
                let col = this.mContainerArr[this.mContainerLayer].length % this.CONTAINER_LAYER_COL;
                let startX = -0.23;
                let startZ = -0.12;
                let localPosition = new Laya.Vector3(startX + col * 0.072, this.mContainerLayer * 0.075 + 0.04, startZ + row * 0.24);
                let obj = { type: info.type, node: nodeStone, pos: localPosition };
                if (i == 0) {
                    let self = this;
                    let flyCallback = function (script, args) {
                        AudioManager.playCollectStone();
                        let newStone = SceneResManager.createStaticCatchStone(self.mNodeContainer, args.type, args.pos);
                        MapManager.instance.pushContainerStatic(newStone);
                        obj.node = newStone;
                    };
                    if (isCatchFloorStone) {
                        let outPos = new Laya.Vector3();
                        Laya.Vector3.transformV3ToV3(localPosition, this.mNodeContainer.transform.worldMatrix, outPos);
                        outPos.y += this.mContainerLayer * 0.07;
                        script.fly(script.getNode().transform.position, outPos, true, flyCallback, obj);
                    }
                    else {
                        script.jump(info.pos, obj, (script, args) => {
                            let outPos = new Laya.Vector3();
                            Laya.Vector3.transformV3ToV3(args.pos, this.mNodeContainer.transform.worldMatrix, outPos);
                            script.fly(script.getNode().transform.position, outPos, true, flyCallback, obj);
                        });
                    }
                }
                else {
                    script.getNode().transform.localPosition = localPosition;
                    script.getNode().transform.setWorldLossyScale(new Laya.Vector3(MyGameConfig.CONTAINER_STONE_SCALE, MyGameConfig.CONTAINER_STONE_SCALE, MyGameConfig.CONTAINER_STONE_SCALE));
                    script.getNode().transform.localRotationEuler = new Laya.Vector3(0, 0, 0);
                    this.mNodeContainer.addChild(script.getNode());
                }
                this.mContainerArr[this.mContainerLayer].push(obj);
                if (!this.mTrcuckData.capacity[info.type]) {
                    this.mTrcuckData.capacity[info.type] = 1;
                }
                else {
                    this.mTrcuckData.capacity[info.type]++;
                }
                this.mTrcuckData.catchStoneNum++;
                this.mContainerNum++;
                this.mCatchStoneProgress = this.mTrcuckData.catchStoneNum / MapManager.instance.curIslandTotalCatchStone;
                this.mContainerProgress = this.mContainerNum / this.mMaxCapacity;
                if (this.mCatchStoneProgress == 1) {
                    this.clearProps();
                    EventUtils.dispatchEvent(MyGameConfig.EVENT_CATCH_END, "");
                }
            }
            return true;
        }
        catchStoneCore(info, gridInfo) {
            this.mCatchStoneCoreNum++;
            this.mCatchStoneCoreProgress = this.mCatchStoneCoreNum / MapManager.instance.curIslandTotalCatchStoneCore;
            let stoneInfo = MyGameConfig.stoneConfig[info.type];
            this.addDurable(-stoneInfo.loss);
            if (this.mContainerNum >= this.mMaxCapacity) {
                this.mFullTipScript.startAni(this.mContainerLayer);
                if (this.mCatchStoneCoreNum % MyGameConfig.gameConfig.stoneCoreComposeStone == 0) {
                    MapManager.instance.createFloorStone(info, gridInfo);
                }
            }
            else {
                if (this.mCatchStoneCoreNum % MyGameConfig.gameConfig.stoneCoreComposeStone == 0) {
                    MapManager.instance.createDesignDiagram();
                    this.catchStone(info, false);
                }
            }
        }
        stoneCoreConsumeDurable(stoneInfo, reduce = 1) {
        }
        catchStoneCoreCreateStone(info, gridInfo) {
            this.mCatchStoneCoreNum++;
            this.mCatchStoneCoreProgress = this.mCatchStoneCoreNum / MapManager.instance.curIslandTotalCatchStoneCore;
            if (this.mCatchStoneCoreNum % MyGameConfig.gameConfig.stoneCoreComposeStone == 0) {
                MapManager.instance.createFloorStone(info, gridInfo);
            }
        }
        popOneStone() {
            if (this.mContainerArr[this.mContainerLayer]) {
                let info;
                if (this.mContainerArr[this.mContainerLayer].length > 0) {
                    this.mContainerNum--;
                    info = this.mContainerArr[this.mContainerLayer].pop();
                    this.mTrcuckData.capacity[info.type]--;
                }
                else if (this.mContainerLayer > 0) {
                    this.mContainerArr.pop();
                    this.mContainerNum--;
                    this.mContainerLayer--;
                    info = this.mContainerArr[this.mContainerLayer].pop();
                    this.mTrcuckData.capacity[info.type]--;
                }
                if (this.mContainerArr[0].length == 0) {
                    this.mContainerArr.pop();
                }
                if (this.mContainerNum < this.mMaxCapacity) {
                    this.mFullTipScript.stopAni();
                }
                this.mContainerProgress = this.mContainerNum / this.mMaxCapacity;
                return info;
            }
            return null;
        }
        popLayerStone() {
            let arr = this.mContainerArr.pop();
            this.mContainerLayer = this.mContainerArr.length;
            if (arr) {
                this.mContainerNum -= arr.length;
                this.mContainerProgress = this.mContainerNum / this.mMaxCapacity;
                for (let i = 0; i < arr.length; i++) {
                    this.mTrcuckData.capacity[arr[i].type]--;
                }
            }
            if (this.mContainerNum < this.mMaxCapacity) {
                this.mFullTipScript.stopAni();
            }
            return arr;
        }
        changeSmoke(data) {
        }
        toTarget(target, callback) {
            this.mTargetPos = target;
            this.mTargetCallback = callback;
            this.mTargetDistance = Laya.Vector3.distance(this.mNodeRole.transform.position, target);
            this.mNodeRole.transform.lookAt(target, Vector3Utils.UP, false);
            this.mCurStatus = this.STATUS_GO_TARGET;
        }
        backStart(callback) {
            this.toTarget(this.mStartPosition, callback);
            this.aniCameraShipStart(1000);
        }
        aniCameraShipStart(time) {
            this.cameraAni(null, null, this.mCamera.fieldOfView + 20, time, false);
        }
        prepare() {
            if (this.mCameraStartLocalPosition) {
                this.cameraAni(null, null, this.mCameraStartFieldOfView, 800, false);
            }
        }
        enterFunction(camera) {
            this.cameraAni(camera.transform.position, camera.transform.rotationEuler, camera.fieldOfView, 800, false);
        }
        levelFunction() {
            this.cameraAni(this.mCameraStartLocalPosition, this.mCameraStartRotationEuler, this.mCameraStartFieldOfView, 800, true);
        }
        catchCrystal() {
            ProspectingMapManager.instance.catchCrystal();
        }
        surveyCrystal() {
            this.showRadar(true);
        }
        cameraAni(position, rotationEuler, fieldOfView, time, isLocal) {
            Laya.Tween.to(this.mCamera, {
                fieldOfView: fieldOfView,
                update: new Laya.Handler(this, () => {
                    this.mCamera.fieldOfView = this.mCamera.fieldOfView;
                })
            }, time, null, Laya.Handler.create(this, () => {
            }));
            if (position) {
                if (isLocal) {
                    let tempPosition = this.mCamera.transform.localPosition;
                    Laya.Tween.to(tempPosition, {
                        x: position.x,
                        y: position.y,
                        z: position.z,
                        update: new Laya.Handler(this, () => {
                            this.mCamera.transform.localPosition = tempPosition;
                        })
                    }, time, null, Laya.Handler.create(this, () => {
                    }));
                }
                else {
                    let tempPosition = this.mCamera.transform.position;
                    Laya.Tween.to(tempPosition, {
                        x: position.x,
                        y: position.y,
                        z: position.z,
                        update: new Laya.Handler(this, () => {
                            this.mCamera.transform.position = tempPosition;
                        })
                    }, time, null, Laya.Handler.create(this, () => {
                    }));
                }
            }
            if (rotationEuler) {
                let tempRotationEuler = this.mCamera.transform.rotationEuler;
                Laya.Tween.to(tempRotationEuler, {
                    x: rotationEuler.x,
                    y: rotationEuler.y,
                    z: rotationEuler.z,
                    update: new Laya.Handler(this, () => {
                        this.mCamera.transform.rotationEuler = tempRotationEuler;
                    })
                }, time, null, Laya.Handler.create(this, () => {
                }));
            }
        }
        changeState(state) {
            this.mStateMachine.changeState(state);
        }
        getCurState() {
            return this.mStateMachine.mainStateScript.getStateKey();
        }
        getMainStateScript() {
            return this.mStateMachine.mainStateScript;
        }
        setMaxCapacity(level) {
            this.mMaxCapacity = MyGameConfig.truckConfig[level].truckCapacity;
            if (this.mTrcuckData.catchStoneNum < this.mMaxCapacity) {
                this.mFullTipScript.stopAni();
            }
            else {
                this.mFullTipScript.startAni(this.mContainerLayer);
            }
        }
        getCamera() {
            return this.mCamera;
        }
        getNodeContainer() {
            return this.mNodeContainer;
        }
        getNodeEffectMining() {
            return this.mNodeEffectMining;
        }
        getPosition() {
            return this.mNodeRole.transform.position;
        }
        getRotationEuler() {
            return this.mNodeRole.transform.rotationEuler;
        }
        addContainerLayer(num) {
            this.mContainerLayer += num;
        }
        setContainerLayer(num) {
            this.mContainerLayer = num;
        }
        getCatchStoneNum() {
            return this.mTrcuckData.catchStoneNum;
        }
        getCatchStoneProgress() {
            return this.mCatchStoneProgress;
        }
        getCatchStoneCoreProgress() {
            return this.mCatchStoneCoreProgress;
        }
        getContainerProgress() {
            return this.mContainerProgress;
        }
        getContainerNum() {
            return this.mContainerNum;
        }
        getMaxCapacity() {
            return this.mMaxCapacity;
        }
        getCatchStoneCoreNum() {
            return this.mCatchStoneCoreNum;
        }
        setCatchStoneCoreNum(num) {
            this.mCatchStoneCoreNum = num;
        }
        isMove() {
            return this.mCurStatus == this.STATUS_MOVE;
        }
        getMoveDeltaX() {
            return this.mMoveDeltaX;
        }
        getMoveDeltaZ() {
            return this.mMoveDeltaZ;
        }
        getNodeSize() {
            return this.mNodeSize;
        }
        getTruckData() {
            return this.mTrcuckData;
        }
        refresh() {
            this.mCatchStoneProgress = 0;
            this.mTrcuckData = DataManager.getTruckData();
        }
        setPlayModel(model) {
            this.mCurPlayModel = model;
        }
        getPlayModel() {
            return this.mCurPlayModel;
        }
        addDurable(value) {
            return false;
        }
        saveDurable() {
            DataManager.setDurable(this.mDurable);
        }
        getDurableProgress() {
            return this.mDurableProgress;
        }
        clearWheel() {
            for (let i = 0; i < this.mNodeWheel.numChildren; i++) {
                this.mNodeWheel.getChildAt(i).clear();
            }
        }
        showWheel(b) {
            for (let i = 0; i < this.mNodeWheel.numChildren; i++) {
                this.mNodeWheel.getChildAt(i).active = b;
            }
        }
        showRadar(b) {
            if (b) {
                this.mNodeRadar.getComponent(RadarScript).show();
            }
            this.mNodeRadar.active = b;
        }
        getDirectionScript() {
            return this.mDirectionScript;
        }
        getRepairRate() {
            return this.mRepairRate;
        }
        setRepairRate(rate) {
            this.mRepairRate = rate;
        }
        pvpPrepare(b) {
            GameManager.instance.isControl = false;
            this.stopMove();
            this.showWheel(false);
            this.mCharacterController.enabled = false;
            this.mStateMachine.changeState(MyGameConfig.STATE_HAUL_PVP);
            if (b) {
                EventUtils.dispatchEvent(MyGameConfig.EVENT_PVP_PREPARE, 0);
            }
        }
        clearProps() {
            for (let key in this.mPropsEffectMap) {
                this.mPropsEffectMap[key].clear();
            }
        }
    }

    class WormholeScript extends Laya.Script3D {
        constructor() {
            super(...arguments);
            this.mIsMove = false;
            this.mIsDispatchEvent = false;
            this.mTempVec3 = new Laya.Vector3();
            this.mTempVecRotate = new Laya.Vector3();
        }
        onAwake() {
            this.mNode = this.owner;
            this.mStartPosition = this.mNode.transform.position.clone();
        }
        onUpdate() {
            if (GameManager.instance.isPause) {
                return;
            }
            this.mTempVecRotate.setValue(0, 0, 0.001 * GameManager.instance.timerDelta);
            this.mNode.transform.rotate(this.mTempVecRotate);
            if (this.mIsMove) {
                this.mTempVec3.setValue(0, 0, MyGameConfig.SHIP_MOVE_SPEED * GameManager.instance.timerDelta * 2);
                this.mNode.transform.translate(this.mTempVec3);
                if (!this.mIsDispatchEvent && this.mNode.transform.position.z > 0) {
                    this.mIsDispatchEvent = true;
                    this.mChildIsland = null;
                    EventUtils.dispatchEvent(MyGameConfig.EVENT_TO_NEXT_ISLAND, "");
                }
                if (this.mChildIsland) {
                    this.mChildIsland.transform.translate(this.mTempVec3);
                }
            }
        }
        startMove(childIsland) {
            this.mIsMove = true;
            this.mNode.active = true;
            this.mChildIsland = childIsland;
            this.mNode.transform.position = this.mStartPosition;
        }
        reset() {
            this.mNode.active = false;
            this.mIsMove = false;
            this.mIsDispatchEvent = false;
            this.mChildIsland = null;
        }
    }

    class RockerView extends ui.game.RockerViewUI {
        constructor(nodeTouchView) {
            super();
            this.mCurrentTouchId = -1;
            this.isDown = false;
            this.angle = -1;
            this.radians = -1;
            this.mIsStartGamne = false;
            this.name = "RockerView";
            this.mNodeTouchView = nodeTouchView;
            this.mNodeTouchView.height = Laya.stage.height;
        }
        onAwake() {
            this.mNodeTouchView.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
            this.mNodeTouchView.on(Laya.Event.MOUSE_MOVE, this, this.onMove);
            this.mNodeTouchView.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
            this.mNodeTouchView.on(Laya.Event.MOUSE_OUT, this, this.onMouseOut);
            this.originPiont = new Laya.Point(this.width / 2, this.height / 2);
            this.visible = false;
            let curAngle = 0;
            if (Laya.Browser.onPC) {
                Laya.timer.frameLoop(1, this, () => {
                    if (this.mIsMouseDown || !this.parent.visible) {
                        return;
                    }
                    if (Laya.KeyBoardManager.hasKeyDown(87) && Laya.KeyBoardManager.hasKeyDown(68)
                        || Laya.KeyBoardManager.hasKeyDown(38) && Laya.KeyBoardManager.hasKeyDown(39)) {
                        this.mMouseMoveCallback(this.radians, -45);
                    }
                    else if (Laya.KeyBoardManager.hasKeyDown(83) && Laya.KeyBoardManager.hasKeyDown(68)
                        || Laya.KeyBoardManager.hasKeyDown(40) && Laya.KeyBoardManager.hasKeyDown(39)) {
                        this.mMouseMoveCallback(this.radians, -135);
                    }
                    else if (Laya.KeyBoardManager.hasKeyDown(65) && Laya.KeyBoardManager.hasKeyDown(83)
                        || Laya.KeyBoardManager.hasKeyDown(37) && Laya.KeyBoardManager.hasKeyDown(40)) {
                        this.mMouseMoveCallback(this.radians, 135);
                    }
                    else if (Laya.KeyBoardManager.hasKeyDown(65) && Laya.KeyBoardManager.hasKeyDown(87)
                        || Laya.KeyBoardManager.hasKeyDown(37) && Laya.KeyBoardManager.hasKeyDown(38)) {
                        this.mMouseMoveCallback(this.radians, 45);
                    }
                    else if (Laya.KeyBoardManager.hasKeyDown(87) || Laya.KeyBoardManager.hasKeyDown(38)) {
                        this.mMouseMoveCallback(this.radians, 0);
                    }
                    else if (Laya.KeyBoardManager.hasKeyDown(83) || Laya.KeyBoardManager.hasKeyDown(40)) {
                        this.mMouseMoveCallback(this.radians, 180);
                    }
                    else if (Laya.KeyBoardManager.hasKeyDown(65) || Laya.KeyBoardManager.hasKeyDown(37)) {
                        this.mMouseMoveCallback(this.radians, 90);
                    }
                    else if (Laya.KeyBoardManager.hasKeyDown(68) || Laya.KeyBoardManager.hasKeyDown(39)) {
                        this.mMouseMoveCallback(this.radians, -90);
                    }
                    else {
                        this.mMouseUpCallback();
                    }
                });
            }
        }
        onEnable() {
        }
        onDisable() {
            Laya.timer.clearAll(this);
        }
        onMouseDown(e) {
            this.mIsMouseDown = true;
            if (this.mMouseDownCallback) {
                this.mMouseDownCallback();
            }
            this.mCurrentTouchId = e.touchId;
            this.isDown = true;
            this.pos(e.stageX, e.stageY);
            this.mImgPoint.pos(this.width / 2, this.height / 2);
            this.visible = true;
        }
        onMouseUp(e) {
            if (e.touchId != this.mCurrentTouchId)
                return;
            this.mIsMouseDown = false;
            this.isDown = false;
            this.visible = false;
            this.radians = this.angle = -1;
            this.mCurrentTouchId = -1;
            if (this.mMouseUpCallback) {
                this.mMouseUpCallback();
            }
        }
        onMove(e) {
            if (e.touchId != this.mCurrentTouchId)
                return;
            var locationPos = this.globalToLocal(new Laya.Point(Laya.stage.mouseX, Laya.stage.mouseY), false);
            this.deltaX = locationPos.x - this.originPiont.x;
            this.deltaY = locationPos.y - this.originPiont.y;
            var dx = this.deltaX * this.deltaX;
            var dy = this.deltaY * this.deltaY;
            this.angle = Math.atan2(this.deltaX, this.deltaY) * 180 / Math.PI;
            if (this.angle < 0)
                this.angle += 360;
            this.angle = Math.round(this.angle);
            this.radians = Math.PI / 180 * this.angle;
            var r = this.width / 2;
            var x = Math.floor(Math.sin(this.radians) * r + this.originPiont.x);
            var y = Math.floor(Math.cos(this.radians) * r + this.originPiont.y);
            if (dx + dy >= r * r) {
                this.mImgPoint.pos(x, y);
            }
            else {
                this.mImgPoint.pos(locationPos.x, locationPos.y);
            }
            this.angle = (this.angle + 180) % 360;
            if (this.angle > 180) {
                this.angle -= 360;
            }
            this.mMouseMoveCallback(this.radians, this.angle);
        }
        onMouseOut(e) {
            if (e.touchId != this.mCurrentTouchId)
                return;
            this.isDown = false;
            this.visible = false;
            this.radians = this.angle = -1;
            this.mCurrentTouchId = -1;
            this.mIsMouseDown = false;
            if (this.mMouseUpCallback) {
                this.mMouseUpCallback();
            }
        }
        setMoveCallback(downCallback, moveCallback, mouseUpCallback) {
            this.mMouseDownCallback = downCallback;
            this.mMouseMoveCallback = moveCallback;
            this.mMouseUpCallback = mouseUpCallback;
        }
    }

    class PvpDialog extends ui.game.PvpDialogUI {
        onAwake() {
            this.width = Laya.stage.width;
            this.addHandler();
            this.setTouch();
        }
        addHandler() {
            EventUtils.onEvent(this, MyGameConfig.EVENT_PVP_SCORE, (data) => {
                this.mSelfScore = data.self;
                this.mOpponentScore = data.opponent;
                this.mLbScoreSelf.changeText(this.mSelfScore + "");
                this.mLbScoreOpponent.changeText(this.mOpponentScore + "");
            });
        }
        setTouch() {
            var rockerView = new RockerView(this.mNodeTouch);
            this.addChild(rockerView);
            rockerView.setMoveCallback((event) => {
                if (GameManager.instance.isControl) {
                    GameManager.instance.roleScript.startMove();
                }
            }, (radians, angle) => {
                if (radians && GameManager.instance.isControl) {
                    GameManager.instance.roleScript.controlMove(radians, angle);
                }
            }, () => {
                if (GameManager.instance.isControl) {
                    GameManager.instance.roleScript.stopMove();
                }
            });
        }
        coutDown(callback) {
            let count = 2;
            this.mLbCountTime.changeText(count + "");
            this.mLbCountTime.visible = true;
            let self = this;
            AudioManager.playCountDown();
            Laya.timer.loop(1000, this, function s() {
                count--;
                if (count == 0) {
                    self.mLbCountTime.changeText("START");
                    self.mNodeScore.visible = true;
                    self.start();
                    callback();
                }
                else if (count < 0) {
                    this.mLbCountTime.visible = false;
                    Laya.timer.clear(self, s);
                }
                else {
                    self.mLbCountTime.changeText(count + "");
                }
            });
        }
        start() {
            let time = MyGameConfig.gameConfig.pvpTime;
            this.mNodeTime.visible = true;
            this.mLbTime.changeText(time + "");
            Laya.timer.loop(1000, this, () => {
                time -= 1;
                this.mLbTime.changeText("" + time);
                if (time <= 0) {
                    Laya.timer.clearAll(this);
                    EventUtils.dispatchEvent(MyGameConfig.EVENT_PVP_END, this.mSelfScore > this.mOpponentScore);
                }
            });
        }
        onCloseClick() {
            this.removeSelf();
        }
    }

    class RobotScript extends BaseRoleScript {
        constructor() {
            super(...arguments);
            this.STATUS_SEARCH_PATH = 201;
            this.mForward = new Laya.Vector3();
            this.mScaleWard = new Laya.Vector3();
            this.mIsUpdate = false;
            this.mAstartPahtIndex = 0;
        }
        onAwake() {
            this.mNodeRole = this.owner;
            this.mOffsetX = GameManager.instance.scene3d.getChildByName("node_pvp").transform.position.x;
            this.mIsSelf = false;
        }
        onUpdate() {
            if (!this.mIsUpdate) {
                return;
            }
            if (this.mAstarPath) {
                let timerDelta = GameManager.instance.timerDelta;
                if (this.mCurStatus == this.STATUS_MOVE) {
                    let position = this.mNodeRole.transform.position;
                    let distance = Laya.Vector3.distance(position, this.mAstarPath[this.mAstartPahtIndex]);
                    if (distance < 0.1) {
                        this.mAstartPahtIndex++;
                        this.goTarget();
                        if (this.mAstartPahtIndex >= this.mAstarPath.length - 1) {
                            this.searchPath();
                        }
                        return;
                    }
                    this.mNodeRole.transform.lookAt(this.mAstarPath[this.mAstartPahtIndex], Vector3Utils.UP, false);
                    this.mNodeRole.transform.getForward(this.mForward);
                    let speedScele = timerDelta * this.mSpeed * this.mSpeedRate;
                    Laya.Vector3.scale(this.mForward, speedScele, this.mScaleWard);
                    this.mCharacterController.move(this.mScaleWard);
                }
                else if (this.mCurStatus == this.STATUS_TOUCH_ROTATE && this.mTargetRotateY !== null) {
                    let angle = Vector3Utils.getMinAngle(this.mTargetRotateY, this.mNodeRole.transform.rotationEuler.y);
                    let absAngle = Math.abs(angle);
                    if (absAngle < 5) {
                        this.mNodeRole.transform.lookAt(this.mAstarPath[this.mAstartPahtIndex], Vector3Utils.UP, false);
                        this.mCurStatus = this.STATUS_MOVE;
                        this.mTargetRotateY = null;
                    }
                    else {
                        let newAngle = angle > 0 ? timerDelta / 3 * this.mSpeedRate : -timerDelta / 3 * this.mSpeedRate;
                        if (Math.abs(newAngle) > absAngle) {
                            newAngle = angle > 0 ? angle : -angle;
                        }
                        else {
                            newAngle = angle > 0 ? timerDelta / 3 * this.mSpeedRate : -timerDelta / 3 * this.mSpeedRate;
                        }
                        this.mNodeRole.transform.rotate(new Laya.Vector3(0, newAngle, 0), false, false);
                    }
                    this.mCharacterController.move(Vector3Utils.ZERO);
                    this.mRollerScript.changePvpMap();
                }
                else if (this.mCurStatus == this.STATUS_SEARCH_PATH) {
                    this.mCurStatus = this.STATUS_IDLE;
                    this.searchPath();
                }
            }
        }
        onLateUpdate() {
            if (!this.mIsUpdate) {
                return;
            }
            if (this.mTargetGridInfo.stoneCoreArr.length == 0) {
                this.searchPath();
                return;
            }
            this.checkPvpMap();
        }
        init() {
            super.init();
        }
        createRoleModel(carConfig, callback, releaseResources) {
            super.createRoleModel(carConfig, () => {
                let levelData = {};
                levelData[MyGameConfig.PROPERTY_CAR_SPIKE_CIRCLE_NUM] = this.getRecentLevel(DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_SPIKE_CIRCLE_NUM));
                levelData[MyGameConfig.PROPERTY_CAR_SPIKE_NUM] = this.getRecentLevel(DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_SPIKE_NUM));
                levelData[MyGameConfig.PROPERTY_CAR_SPIKE_SIZE] = this.getRecentLevel(DataManager.getLevelByKey(MyGameConfig.KEY_DAY_LEVEL_SPIKE_SIZE));
                levelData[MyGameConfig.PROPERTY_CAR_ROLLER_SIZE] = this.getRecentLevel(DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_ROLLER_SIZE));
                this.setSpeedLevel(this.getRecentLevel(DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_TRUCK_SPEED)));
                this.getRollerScript().initLevel(levelData);
                callback();
            }, false);
        }
        getRecentLevel(level) {
            let newLevel = MathUtils.nextInt(level - 1, level + 3);
            if (newLevel < 0) {
                newLevel = 0;
            }
            if (newLevel >= MyGameConfig.levelConfig.length) {
                newLevel -= MyGameConfig.levelConfig.length - 1;
            }
            return newLevel;
        }
        setStart(b) {
            this.mIsUpdate = b;
            let pos = this.mNode.transform.position;
            this.mLastPosition.setValue(pos.x, pos.y, pos.z);
        }
        searchPath() {
            let randomZ = MathUtils.nextInt(0, PvpMapManager.instance.stoneCountArr.length - 1);
            if (PvpMapManager.instance.stoneCountArr[randomZ].length == 0) {
                let find = false;
                for (let i = 0; i < PvpMapManager.instance.stoneCountArr.length; i++) {
                    randomZ++;
                    randomZ = randomZ % PvpMapManager.instance.stoneCountArr.length;
                    if (PvpMapManager.instance.stoneCountArr[randomZ].length > 0) {
                        find = true;
                        break;
                    }
                }
                if (!find) {
                    return;
                }
            }
            let randomX = MathUtils.nextInt(0, PvpMapManager.instance.stoneCountArr[randomZ].length - 1);
            let aStarPos = PvpMapManager.instance.stoneCountArr[randomZ][randomX];
            let pos = this.mNodeRole.transform.position;
            this.mTargetGridInfo = PvpMapManager.instance.aStarInfo2GridInfo(aStarPos);
            let pathInfo = AstarUtils.search(Math.floor(pos.x + PvpMapManager.instance.sizeOffsetX - this.mOffsetX), Math.floor(-(pos.z + PvpMapManager.instance.sizeOffsetZ)), aStarPos.x, aStarPos.z, -PvpMapManager.instance.sizeOffsetX + this.mOffsetX, -PvpMapManager.instance.sizeOffsetZ);
            this.mAstartPahtIndex = 0;
            if (pathInfo && pathInfo.pathArr[this.mAstartPahtIndex]) {
                this.mAstarPath = pathInfo.pathArr;
                this.goTarget();
            }
            else {
                this.mCurStatus = this.STATUS_SEARCH_PATH;
            }
        }
        goTarget() {
            let pathInfo = this.mAstarPath[this.mAstartPahtIndex];
            if (pathInfo && pathInfo.x && pathInfo.z) {
                let preRotation = this.mNodeRole.transform.rotationEuler.clone();
                this.mNodeRole.transform.lookAt(pathInfo, Vector3Utils.UP, false);
                this.mTargetRotateY = this.mNodeRole.transform.rotationEuler.y;
                this.mNodeRole.transform.rotationEuler = preRotation;
                this.mCurStatus = this.STATUS_TOUCH_ROTATE;
                this.mCharacterController.move(Vector3Utils.ZERO);
                this.mRollerScript.changePvpMap();
            }
            else {
                this.mCurStatus = this.STATUS_SEARCH_PATH;
            }
        }
        stopMove() {
            this.mCurStatus = this.STATUS_IDLE;
            this.mCharacterController.move(Vector3Utils.ZERO);
            this.mIsUpdate = false;
        }
    }

    class PvpSceneScript extends Laya.Script3D {
        onAwake() {
            this.mNode = this.owner;
            this.mRobotScript = GameManager.instance.scene3d.getChildByName("node_robot").getComponent(RobotScript);
            this.addHandler();
        }
        addHandler() {
            EventUtils.onEvent(this, MyGameConfig.EVENT_PVP_PREPARE, (status) => {
                if (status == 0) {
                    this.mRolePrePos = GameManager.instance.roleScript.getNode().transform.position.clone();
                    this.mPrePlayModel = GameManager.instance.roleScript.getPlayModel();
                    this.mNode.destroyChildren();
                    this.mPrepareStart = 0;
                    PvpMapManager.instance.createMap(() => {
                        this.prepare();
                    });
                    let carIndex = MathUtils.nextInt(0, Object.keys(MyGameConfig.carConfig).length - 1);
                    let curIndex = 0;
                    let carId;
                    for (let id in MyGameConfig.carConfig) {
                        if (curIndex == carIndex) {
                            carId = id;
                            break;
                        }
                        curIndex++;
                    }
                    this.mRobotScript.createRoleModel(MyGameConfig.carConfig[carId], () => {
                    });
                    this.mPvpDialog = new PvpDialog();
                    UiUtils.addChild(this.mPvpDialog);
                    this.mPvpDialog.visible = false;
                }
                else if (status == 1) {
                    this.mNextLoadingDialog = new NextChildLoadingDialog(() => {
                        SceneResManager.createSky(GameManager.instance.scene3d.getChildByName("node_sky"), "node_sky1.lh", () => {
                            this.prepare();
                        });
                    }, 3000);
                    UiUtils.addChild(this.mNextLoadingDialog);
                }
                else if (status == 2) {
                    this.prepare();
                }
                else if (status == 3) {
                    this.mNextLoadingDialog = new NextChildLoadingDialog(() => {
                    });
                    UiUtils.addChild(this.mNextLoadingDialog);
                }
                else if (status == 4) {
                    let newPosition = GameManager.instance.roleScript.getNodeRole().transform.position;
                    let tractorPosition = this.mNodeTractor.transform.position;
                    newPosition.x = this.mRolePrePos.x;
                    newPosition.z = this.mRolePrePos.z;
                    GameManager.instance.roleScript.getNodeRole().transform.position = newPosition;
                    GameManager.instance.roleScript.getMainStateScript()
                        .getNodeTractor().transform.position = new Laya.Vector3(newPosition.x, tractorPosition.y, newPosition.z);
                    GameManager.instance.roleScript.getMainStateScript().setUpdate(true);
                    let posCamera = GameManager.instance.roleScript.getCamera().parent.transform.position;
                    posCamera.x = newPosition.x;
                    posCamera.z = newPosition.z;
                    GameManager.instance.roleScript.getCamera().parent.transform.position = posCamera;
                    this.mNextLoadingDialog.hide();
                    GameManager.instance.roleScript.setPlayModel(this.mPrePlayModel);
                    PvpMapManager.instance.clearAll();
                    this.mNode.destroyChildren();
                    Laya.Resource.destroyUnusedResources();
                    this.mRobotScript.getNodeRole().transform.position = new Laya.Vector3(200, 0, 0);
                }
            });
            EventUtils.onEvent(this, MyGameConfig.EVENT_PVP_END, (b) => {
                GameManager.instance.roleScript.stopMove();
                this.mRobotScript.stopMove();
                let content;
                if (b) {
                    content = "You Win";
                }
                else {
                    content = "You Fail";
                }
                UiUtils.addChild(new CommonTipDialog(content, () => {
                    this.mPvpDialog.removeSelf();
                    let newPosition = GameManager.instance.roleScript.getNodeRole().transform.position;
                    let tractorPosition = this.mNodeTractor.transform.position;
                    this.mNodeTractor.transform.position = new Laya.Vector3(newPosition.x, tractorPosition.y, newPosition.z);
                    GameManager.instance.roleScript.pvpPrepare(false);
                }));
            });
        }
        prepare() {
            this.mPrepareStart++;
            if (this.mPrepareStart == 3) {
                this.mNextLoadingDialog.hide();
                let newPosition = GameManager.instance.roleScript.getNodeRole().transform.position.clone();
                this.mNodeTractor = GameManager.instance.roleScript.getMainStateScript().getNodeTractor();
                let tractorPosition = this.mNodeTractor.transform.position.clone();
                let posSelf = PvpMapManager.instance.birthArr[0];
                newPosition.x = posSelf.x;
                newPosition.z = posSelf.z;
                GameManager.instance.roleScript.getNodeRole().transform.position = newPosition;
                this.mNodeTractor.transform.position = new Laya.Vector3(posSelf.x, tractorPosition.y, posSelf.z);
                GameManager.instance.roleScript.getMainStateScript().setUpdate(true);
                let posCamera = GameManager.instance.roleScript.getCamera().parent.transform.position.clone();
                posCamera.x = posSelf.x;
                posCamera.z = posSelf.z;
                GameManager.instance.roleScript.getCamera().parent.transform.position = posCamera;
                let posRobot = PvpMapManager.instance.birthArr[1];
                this.mRobotScript.getNodeRole().transform.position = new Laya.Vector3(posRobot.x, 0, posRobot.z);
                this.mPvpDialog.visible = true;
                Laya.timer.once(3000, this, () => {
                    GameManager.instance.roleScript.setPlayModel(MyGameConfig.PLAY_MODEL_PVP);
                    this.mRobotScript.searchPath();
                    GameManager.instance.roleScript.getPosition().y = 0;
                    GameManager.instance.roleScript.getNodeRole().transform.position = GameManager.instance.roleScript.getNodeRole().transform.position;
                    this.mPvpDialog.coutDown(() => {
                        GameManager.instance.roleScript.haulEnd();
                        this.mRobotScript.setStart(true);
                    });
                });
            }
        }
        countDown() {
        }
    }

    class MainSceneScript extends Laya.Script3D {
        constructor() {
            super(...arguments);
            this.mIsCreateMeteorite = true;
        }
        onAwake() {
            this.mScene = this.owner;
            GameManager.instance.scene3d = this.mScene;
            GameManager.instance.curLevel = DataManager.getLastSelectLevel();
            GameManager.instance.curLevel = GameManager.instance.curLevel % MyGameConfig.levelConfig.length;
            this.mNodeEffectLine = this.mScene.getChildByName("effect_line");
            let directionLight = this.mScene.getChildByName("node_light");
            directionLight.shadowMode = Laya.ShadowMode.SoftHigh;
            directionLight.shadowDistance = 30;
            directionLight.shadowResolution = 2048;
            directionLight.shadowCascadesMode = Laya.ShadowCascadesMode.NoCascades;
            directionLight.shadowNormalBias = 2;
            this.addHandler();
            this.checkFunction();
            this.createMainIsland();
            this.addPvpScene();
            GameManager.instance.roleScript.aniCameraShipStart(0);
            if (MyGameConfig.levelConfig[GameManager.instance.curLevel].model == MyGameConfig.PLAY_MODEL_NORMAL) {
                this.createChildIsLand();
            }
            else {
                this.createCrystalIsland();
            }
            this.createMeteorite(0);
        }
        onDisable() {
            EventUtils.offAllEventByNode(this);
        }
        addHandler() {
            EventUtils.onEvent(this, MyGameConfig.EVENT_GO_NEXT_ISLAND, () => {
                GameManager.instance.roleScript.getDirectionScript().hide();
                this.goNextIsland();
            });
            EventUtils.onEvent(this, MyGameConfig.EVENT_TO_NEXT_ISLAND, () => {
                let requestIndex = 0;
                let self = this;
                let requestComplete = function () {
                    requestIndex++;
                    if (requestIndex == 2) {
                        loadingDialog.hide();
                        self.mWormholeScript.reset();
                        self.mCurNodeChildIsland.destroy(true);
                        Laya.Resource.destroyUnusedResources();
                        self.mNodeEffectLine.particleSystem.simulate(0, true);
                        if (MyGameConfig.levelConfig[GameManager.instance.curLevel].model == MyGameConfig.PLAY_MODEL_NORMAL) {
                            self.createChildIsLand();
                        }
                        else {
                            self.createCrystalIsland();
                        }
                    }
                };
                let loadingDialog = new NextChildLoadingDialog(() => {
                    requestComplete();
                });
                UiUtils.addChild(loadingDialog);
                SceneResManager.createSky(GameManager.instance.scene3d.getChildByName("node_sky"), MyGameConfig.levelConfig[GameManager.instance.curLevel].skyName, () => {
                    requestComplete();
                });
            });
        }
        createMainIsland() {
            let nodeRole = this.mScene.getChildByName("node_role");
            let roleScript = nodeRole.addComponent(RoleScript);
            let nodeWormhole = this.mScene.getChildByName("node_wormhole");
            this.mWormholeScript = nodeWormhole.addComponent(WormholeScript);
            roleScript.setNode(nodeRole);
            roleScript.init();
            GameManager.instance.roleScript = roleScript;
            SceneResManager.createSky(GameManager.instance.scene3d.getChildByName("node_sky"), MyGameConfig.levelConfig[GameManager.instance.curLevel].skyName, () => {
                try {
                    roleScript.createRoleModel(MyGameConfig.carConfig[DataManager.getUseCarId()], () => {
                        if (this.mLoadedCallback) {
                            this.mLoadedCallback(this.mScene);
                        }
                        else {
                            Laya.timer.once(500, this, () => {
                                this.mLoadedCallback(this.mScene);
                            });
                        }
                    });
                }
                finally {
                }
            });
        }
        goNextIsland() {
            MapManager.instance.clearAll();
            GameManager.instance.curLevel = DataManager.getLastSelectLevel();
            GameManager.instance.curLevel = GameManager.instance.curLevel % MyGameConfig.levelConfig.length;
            GameManager.instance.clearAll();
            GameManager.instance.isControl = false;
            Laya.Tween.to(this.mNodeBridge.transform.position, {
                z: 4,
                update: new Laya.Handler(this, () => {
                    this.mNodeBridge.transform.position = this.mNodeBridge.transform.position;
                })
            }, 1000, null, new Laya.Handler(this, () => {
                GameManager.instance.roleScript.backStart(() => {
                    Laya.Tween.to(this.mCurNodeChildIsland.transform.position, {
                        y: -40,
                        update: new Laya.Handler(this, () => {
                            this.mCurNodeChildIsland.transform.position = this.mCurNodeChildIsland.transform.position;
                        })
                    }, 3000, null, new Laya.Handler(this, () => {
                        this.mNodeEffectLine.particleSystem.play();
                        this.mWormholeScript.startMove(this.mCurNodeChildIsland);
                    }));
                });
            }));
        }
        createChildIsLand() {
            this.mIsCreateMeteorite = true;
            MapManager.instance.createMap(GameManager.instance.curLevel, (childIsland) => {
                this.moveIsland(childIsland, () => {
                    GameManager.instance.roleScript.setPlayModel(MyGameConfig.PLAY_MODEL_NORMAL);
                    EventUtils.dispatchEvent(MyGameConfig.EVENT_START, MyGameConfig.PLAY_MODEL_NORMAL);
                    GameManager.instance.roleScript.getDirectionScript().start();
                });
            });
        }
        moveIsland(childIsland, callback) {
            this.mCurNodeChildIsland = childIsland;
            this.mIsCreateMeteorite = false;
            this.mNodeEffectLine.particleSystem.stop();
            Laya.Tween.to(childIsland.transform.position, {
                z: 0,
                update: new Laya.Handler(this, () => {
                    childIsland.transform.position = childIsland.transform.position;
                })
            }, 3000, null, new Laya.Handler(this, () => {
                GameManager.instance.roleScript.prepare();
                Laya.Tween.to(this.mNodeBridge.transform.position, {
                    z: 0,
                    update: new Laya.Handler(this, () => {
                        this.mNodeBridge.transform.position = this.mNodeBridge.transform.position;
                    })
                }, 1000, null, new Laya.Handler(this, () => {
                    GameManager.instance.isControl = true;
                    MapManager.instance.start();
                    callback();
                    if (!DataManager.isShowGuide(MyGameConfig.levelConfig[GameManager.instance.curLevel].model)) {
                        UiUtils.addChild(new GuideDialog(MyGameConfig.levelConfig[GameManager.instance.curLevel].model));
                    }
                }));
            }));
        }
        createCrystalIsland() {
            ProspectingMapManager.instance.createMap(GameManager.instance.curLevel, (childIsland) => {
                this.moveIsland(childIsland, () => {
                    GameManager.instance.roleScript.setPlayModel(MyGameConfig.PLAY_MODEL_PROSPECTING);
                    EventUtils.dispatchEvent(MyGameConfig.EVENT_START, MyGameConfig.PLAY_MODEL_PROSPECTING);
                });
            });
        }
        createMeteorite(time) {
            Laya.timer.once(time, this, () => {
                if (Laya.timer.delta > 4000) {
                    this.createMeteorite(MathUtils.nextInt(500, 4000));
                    return;
                }
                if (this.mIsCreateMeteorite) {
                    SceneResManager.createMeteorite(this.mScene);
                    this.createMeteorite(MathUtils.nextInt(500, 4000));
                }
            });
        }
        checkFunction() {
            let nodeMainIsland = this.mScene.getChildByName("node_main_island");
            let nodeFunctionPosition = this.mScene.getChildByName("node_function_position");
            this.mNodeBridge = nodeMainIsland.getChildByName("home_bridge");
            let unlockFunctionData = DataManager.getUnlockFunction();
            GameManager.instance.mainIsland = nodeMainIsland;
            for (let key in MyGameConfig.functionUnlockConfig) {
                let functionUnlock = MyGameConfig.functionUnlockConfig[key];
                if (functionUnlock.isNeedLock) {
                    if (unlockFunctionData[functionUnlock.id]) {
                        functionUnlock.isUnlock = true;
                    }
                    else {
                        functionUnlock.isUnlock = false;
                    }
                }
                else {
                    functionUnlock.isUnlock = true;
                }
                functionUnlock.position = nodeFunctionPosition.getChildByName(functionUnlock.pointName).transform.position;
                if (functionUnlock.id == MyGameConfig.FUNCTION_ID_FACTORY) {
                    GameManager.instance.createGoods();
                }
            }
        }
        addPvpScene() {
            let nodeRobot = this.mScene.getChildByName("node_robot");
            let script = nodeRobot.addComponent(RobotScript);
            script.init();
            let nodePvp = this.mScene.getChildByName("node_pvp");
            nodePvp.addComponent(PvpSceneScript);
        }
        setLoadedCallback(callback) {
            this.mLoadedCallback = callback;
        }
    }

    class MeteoriteScript extends Laya.Script3D {
        constructor() {
            super(...arguments);
            this.mTempVec3 = new Laya.Vector3();
        }
        onAwake() {
            this.mNode = this.owner;
        }
        onUpdate() {
            if (GameManager.instance.isPause) {
                return;
            }
            this.mTempVec3.setValue(0, 0, MyGameConfig.SHIP_MOVE_SPEED * GameManager.instance.timerDelta);
            this.mNode.transform.translate(this.mTempVec3);
            if (this.mNode.transform.position.z > 30) {
                PoolManager.recover(this.mNode.name, this.mNode);
            }
        }
    }

    class MineralScript extends Laya.Script3D {
        constructor() {
            super(...arguments);
            this.mIsCatch = false;
        }
        onAwake() {
            this.mNode = this.owner;
        }
        onUpdate() {
            if (!this.mNode || GameManager.instance.isPause) {
                return;
            }
        }
        init(node) {
            this.mNode = node;
            this.mIsCatch = false;
        }
        isCatch() {
            return this.mIsCatch;
        }
        show() {
            this.mNode.active = true;
        }
        hide() {
            this.mNode.active = false;
        }
        catch() {
            AudioManager.playGetStars();
            SceneResManager.playEffectCatchCrystal(this.mNode.transform.position);
            this.mNode.active = false;
            this.mIsCatch = true;
            DataManager.addCrystalValue(5);
        }
        getNode() {
            return this.mNode;
        }
        getPosition() {
            return this.mNode.transform.position;
        }
        isShow() {
            return this.mNode.active;
        }
    }

    class RotateAniScript extends Laya.Script3D {
        constructor() {
            super(...arguments);
            this.mRotateSpeed = new Laya.Vector3();
            this.mTempRotate = new Laya.Vector3();
        }
        onAwake() {
            this.mNode = this.owner;
        }
        init(rotateSpeed) {
            this.mRotateSpeed = rotateSpeed;
        }
        onUpdate() {
            if (!this.mNode || GameManager.instance.isPause) {
                return;
            }
            this.mTempRotate.setValue(this.mRotateSpeed.x * GameManager.instance.timerDelta, this.mRotateSpeed.y * GameManager.instance.timerDelta, this.mRotateSpeed.z * GameManager.instance.timerDelta);
            this.mNode.transform.rotate(this.mTempRotate);
        }
        getPosition() {
            return this.mNode.transform.position;
        }
    }

    class CrystalScript extends Laya.Script3D {
        constructor() {
            super(...arguments);
            this.mIsUpdate = false;
            this.mAddAlpha = -1;
            this.mAlpha = 0;
        }
        onAwake() {
        }
        onUpdate() {
            if (!this.mIsUpdate || GameManager.instance.isPause) {
                return;
            }
            this.mTime -= GameManager.instance.timerDelta;
            if (this.mTime < 5000) {
                this.mAlpha += this.mAddAlpha * GameManager.instance.timerDelta / 1000;
                if (this.mAlpha <= 0.2) {
                    this.mAlpha = 0.2;
                    this.mAddAlpha = 1;
                }
                if (this.mAlpha >= 1) {
                    this.mAlpha = 1;
                    this.mAddAlpha = -1;
                }
                this.mMaterial.albedoColorA = this.mAlpha;
            }
            if (this.mTime < 0) {
                this.clean();
            }
        }
        clean() {
            PoolManager.recover(this.mNode.name, this.mNode);
            this.mIsUpdate = false;
            this.mGridInfo.crystalArr = [];
        }
        init(node, gridInfo) {
            this.mNode = node;
            this.mGridInfo = gridInfo;
            this.mMaterial = this.mNode.meshRenderer.material;
            this.mMaterial.albedoColorA = 1;
            this.mTime = MyGameConfig.gameConfig.crystalTime;
            this.mIsUpdate = true;
            this.mAddAlpha = -1;
            this.mAlpha = 1;
        }
        catch() {
            AudioManager.playGetStars();
            SceneResManager.playEffectCatchCrystal(this.mNode.transform.position);
            this.clean();
            DataManager.addCrystalValue(1);
        }
        getPosition() {
            return this.mNode.transform.position;
        }
    }

    class SceneResManager {
        static loadStartRes(callback) {
            let res3d = [
                MyGameConfig.URL_RES3D_MAIN + "MainScene.lh",
                MyGameConfig.URL_RES3D_FIRST + "node_spike.lh",
                MyGameConfig.URL_RES3D_FIRST + "node_meteorite1.lh",
                MyGameConfig.URL_RES3D_FIRST + "node_meteorite2.lh",
                MyGameConfig.URL_RES3D_FIRST + "node_meteorite3.lh",
                MyGameConfig.URL_RES3D_FIRST + "node_meteorite4.lh",
                MyGameConfig.URL_RES3D_FIRST + "node_ore.lh",
                MyGameConfig.URL_RES3D_FIRST + "effect_mining.lh",
                MyGameConfig.URL_RES3D_FIRST + "effect_prop_power_small.lh",
                MyGameConfig.URL_RES3D_FIRST + "effect_prop_power_big.lh",
                MyGameConfig.URL_RES3D_FIRST + "effect_boom.lh",
                MyGameConfig.URL_RES3D_FIRST + "effect_catch_crystal.lh"
            ];
            let res2d = [
                ""
            ];
            LayaZip.Init();
            let zipArr = [
                { url: MyGameConfig.URL_RES3D + "LayaScene_MainScene.zip", type: LayaZip.ZIP },
                { url: MyGameConfig.URL_RES3D + "LayaScene_FirstScene.zip", type: LayaZip.ZIP },
                { url: MyGameConfig.URL_RES2D + "sounds.zip", type: LayaZip.ZIP },
            ];
            if (!DataManager.isShowGuide(MyGameConfig.PLAY_MODEL_NORMAL)) {
                zipArr.push({ url: MyGameConfig.URL_RES2D + "guide.zip", type: LayaZip.ZIP });
            }
            this.loadConfig(() => {
                Laya.loader.load(res2d, Laya.Handler.create(this, () => {
                    let bitmapFont = new Laya.BitmapFont();
                    bitmapFont.loadFont("bitmapfont/num1.fnt", new Laya.Handler(this, (bitmapFont) => {
                        Laya.Text.registerBitmapFont("num1", bitmapFont);
                    }, [bitmapFont]));
                    Laya.loader.create(res3d, Laya.Handler.create(this, () => {
                        callback();
                    }));
                }));
            });
        }
        static loadConfig(callback) {
            let jsonArr = [
                "CarConfig",
                "DesignDiagramConfig",
                "FactoryGoodsConfig",
                "FunctionUnlockConfig",
                "GameConfig",
                "LevelConfig",
                "PvpLevelConfig",
                "StoneConfig",
                "TruckConfig",
            ];
            let requestNum = jsonArr.length;
            let currentCompleteNum = 0;
            let requestComplete = function () {
                currentCompleteNum++;
                if (requestNum == currentCompleteNum) {
                    if (callback) {
                        callback();
                    }
                }
            };
            this.loadJosn("CarConfig", (json) => {
                for (let i = 0; i < json.length; i++) {
                    MyGameConfig.carConfig[json[i].id] = json[i];
                }
                requestComplete();
            });
            this.loadJosn("DesignDiagramConfig", (json) => {
                MyGameConfig.designDiagramConfig = json;
                requestComplete();
            });
            this.loadJosn("LevelConfig", (json) => {
                MyGameConfig.levelConfig = json;
                requestComplete();
            });
            this.loadJosn("PvpLevelConfig", (json) => {
                MyGameConfig.pvpLevelConfig = json;
                requestComplete();
            });
            this.loadJosn("FactoryGoodsConfig", (json) => {
                for (let i = 0; i < json.length; i++) {
                    MyGameConfig.factoryGoodsConfig[json[i].id] = json[i];
                }
                requestComplete();
            });
            this.loadJosn("FunctionUnlockConfig", (json) => {
                MyGameConfig.functionUnlockConfig = json;
                requestComplete();
            });
            this.loadJosn("GameConfig", (json) => {
                MyGameConfig.gameConfig = json;
                requestComplete();
            });
            this.loadJosn("StoneConfig", (json) => {
                for (let i = 0; i < json.length; i++) {
                    let info = json[i];
                    MyGameConfig.stoneConfig[info.type] = info;
                    info.particleColor = JSON.parse(info.particleColor);
                    info.particleColor.particleColor = new Laya.Vector4(info.particleColor[0] / 255, info.particleColor[1] / 255, info.particleColor[2] / 255, 1);
                }
                requestComplete();
            });
            this.loadJosn("TruckConfig", (json) => {
                MyGameConfig.truckConfig = json;
                requestComplete();
            });
            UiUtils.loadJson(MyGameConfig.URL_RES2D + "i18n/" + LanguageData.getInstance().getLanguage() + "/language", (json) => {
                LanguageData.getInstance().addLanguageData(LanguageData.getInstance().getLanguage(), json);
            });
        }
        static createScene(callback) {
            let scene3d = new Laya.Scene3D();
            let sceneContent = Laya.loader.getRes(MyGameConfig.URL_RES3D_MAIN + "MainScene.lh");
            scene3d.ambientMode = Laya.AmbientMode.SolidColor;
            scene3d.ambientColor = new Laya.Vector3(1, 1, 1);
            scene3d.addChild(sceneContent);
            while (sceneContent.numChildren > 0) {
                scene3d.addChild(sceneContent.getChildAt(0));
            }
            Laya.stage.addChild(scene3d);
            let sceneScript = scene3d.addComponent(MainSceneScript);
            sceneScript.setLoadedCallback(callback);
        }
        static loadJosn(name, callback) {
            UiUtils.loadJson(MyGameConfig.URL_CONFIG + name, callback);
        }
        static createSky(parent, name, callback) {
            let subName = name.substring(0, name.lastIndexOf("."));
            if (parent.numChildren > 0) {
                if (parent.getChildAt(0).name == subName) {
                    callback();
                    return;
                }
            }
            Laya.loader.create(MyGameConfig.URL_RES3D_SKY + name, Laya.Handler.create(this, () => {
                parent.destroyChildren();
                let sky = Laya.loader.getRes(MyGameConfig.URL_RES3D_SKY + name);
                let skyRotateAniScript = sky.addComponent(RotateAniScript);
                skyRotateAniScript.init(new Laya.Vector3(0, MyGameConfig.SKY_ROTATE_SPEED, 0));
                sky.transform.position = new Laya.Vector3(0, 0, 0);
                parent.addChild(sky);
                callback();
            }));
        }
        static createRole(name, callback) {
            Laya.Sprite3D.load(MyGameConfig.URL_RES3D_ROLE + name + ".lh", Laya.Handler.create(null, function (node) {
                callback(Laya.loader.getRes(MyGameConfig.URL_RES3D_ROLE + name + ".lh").clone());
            }));
        }
        static createSpike(parent, position, rotationEuler, size) {
            let nodeSpike = Laya.loader.getRes(MyGameConfig.URL_RES3D_FIRST + "node_spike.lh").clone();
            nodeSpike.transform.localPosition = position;
            nodeSpike.transform.rotationEuler = rotationEuler;
            nodeSpike.getChildAt(0).transform.setWorldLossyScale(size);
            parent.addChild(nodeSpike);
            return nodeSpike;
        }
        static createCrushedStone(parent, type, position, rotationEuler, scale) {
            let nodeStone = this.getPoolNode(parent, MyGameConfig.stoneConfig[type].stoneFloorModel, MyGameConfig.URL_RES3D_STONE + MyGameConfig.stoneConfig[type].stoneFloorModel, StoneCoreScript);
            nodeStone.transform.localPosition = position;
            nodeStone.transform.rotationEuler = rotationEuler;
            parent.addChild(nodeStone);
            let script = nodeStone.getComponent(StoneCoreScript);
            if (scale) {
                nodeStone.transform.setWorldLossyScale(new Laya.Vector3(scale, scale, scale));
            }
            else {
                nodeStone.transform.setWorldLossyScale(new Laya.Vector3(1, 1, 1));
            }
            script.setNode(nodeStone);
            return script;
        }
        static createStaticCrushedStone(parent, type, position, rotationEuler, scale) {
            let nodeStone = Laya.loader.getRes(MyGameConfig.URL_RES3D_STONE + MyGameConfig.stoneConfig[type].stoneFloorModel).clone();
            parent.addChild(nodeStone);
            nodeStone.transform.position = position;
            nodeStone.transform.rotationEuler = rotationEuler;
            return nodeStone;
        }
        static createCatchStone(parent, type, position, rotationEuler, scale) {
            let nodeStone = this.getPoolNode(parent, MyGameConfig.stoneConfig[type].stoneCatchModel, MyGameConfig.URL_RES3D_STONE + MyGameConfig.stoneConfig[type].stoneCatchModel, StoneCoreScript);
            nodeStone.transform.position = position;
            nodeStone.transform.rotationEuler = rotationEuler;
            if (!scale) {
                nodeStone.transform.setWorldLossyScale(new Laya.Vector3(1, 1, 1));
            }
            else {
                nodeStone.transform.setWorldLossyScale(new Laya.Vector3(scale, scale, scale));
            }
            let script = nodeStone.getComponent(StoneCoreScript);
            script.setNode(nodeStone);
            return script;
        }
        static createStaticCatchStone(parent, type, position, scale) {
            let nodeStone = Laya.loader.getRes(MyGameConfig.URL_RES3D_STONE + MyGameConfig.stoneConfig[type].stoneCatchModel).clone();
            parent.addChild(nodeStone);
            nodeStone.transform.localPosition = position;
            if (scale) {
                nodeStone.transform.setWorldLossyScale(new Laya.Vector3(scale, scale, scale));
            }
            else {
                nodeStone.transform.setWorldLossyScale(new Laya.Vector3(MyGameConfig.CONTAINER_STONE_SCALE, MyGameConfig.CONTAINER_STONE_SCALE, MyGameConfig.CONTAINER_STONE_SCALE));
            }
            return nodeStone;
        }
        static createMineral(parent, position) {
            let nodeMineral = this.getPoolNode(parent, "node_crystal2", MyGameConfig.URL_RES3D_FIRST + "node_crystal2.lh", MineralScript);
            let script = nodeMineral.getComponent(MineralScript);
            script.init(nodeMineral);
            nodeMineral.transform.localPosition = position;
            nodeMineral.active = false;
            return script;
        }
        static createMeteorite(parent) {
            let num = MathUtils.nextInt(1, 4);
            let nodeMineral = this.getPoolNode(parent, "node_meteorite" + num, MyGameConfig.URL_RES3D_FIRST + "node_meteorite" + num + ".lh", MeteoriteScript);
            let scale = MathUtils.toFixed(MathUtils.nextFloat(0.3, 0.5), 2);
            nodeMineral.transform.setWorldLossyScale(new Laya.Vector3(scale, scale, scale));
            nodeMineral.transform.position = new Laya.Vector3(MathUtils.nextFloat(-7, 7), MathUtils.nextFloat(3, 6), -10);
            return nodeMineral;
        }
        static createCrystal(parent, pos, gridInfo) {
            let nodeCrystal = this.getPoolNode(parent, "node_ore.lh", MyGameConfig.URL_RES3D_FIRST + "node_ore.lh", CrystalScript);
            let script = nodeCrystal.getComponent(CrystalScript);
            nodeCrystal.transform.position = pos;
            script.init(nodeCrystal, gridInfo);
            return script;
        }
        static createEffectPropPower(parent, isBig) {
            let nodeName = "effect_prop_power_small.lh";
            let nodeEffect = Laya.loader.getRes(MyGameConfig.URL_RES3D_FIRST + nodeName).clone();
            nodeEffect.transform.localPosition = new Laya.Vector3(0, 0, 0);
            parent.addChild(nodeEffect);
            return nodeEffect;
        }
        static playEffectMining(position, rotationEuler, type) {
            return null;
        }
        static playEffectCatchCrystal(position) {
            var nodeEffect = this.createEffectParticle("effect_catch_crystal", MyGameConfig.URL_RES3D_FIRST + "effect_catch_crystal.lh", GameManager.instance.scene3d);
            if (nodeEffect) {
                nodeEffect.transform.position = position;
            }
            return nodeEffect;
        }
        static playEffectBoom(position) {
            var nodeEffect = this.createEffectParticle("effect_boom", MyGameConfig.URL_RES3D_FIRST + "effect_boom.lh", GameManager.instance.scene3d);
            if (nodeEffect) {
                nodeEffect.transform.position = position;
                AudioManager.playBoom();
            }
            return nodeEffect;
        }
        static getPoolNode(parent, nodeName, url, componentType) {
            let node = PoolManager.getItem(nodeName);
            if (node) {
            }
            else {
                node = Laya.loader.getRes(url).clone();
                node.name = nodeName;
                parent.addChild(node);
                if (componentType) {
                    node.addComponent(componentType);
                }
            }
            return node;
        }
        static createEffectParticle(effectName, path, nodeParent, isPrepareCreate, playRate) {
            var nodeEffect;
            var script;
            if (!isPrepareCreate) {
                nodeEffect = PoolManager.getItemParticle(effectName);
            }
            if (!nodeEffect) {
                nodeEffect = Laya.loader.getRes(path).clone();
                nodeEffect.name = effectName;
                script = nodeEffect.addComponent(ParticleScript);
                nodeParent.addChild(nodeEffect);
            }
            else {
                script = nodeEffect.getComponent(ParticleScript);
                nodeEffect.active = true;
            }
            if (isPrepareCreate) {
                nodeEffect.active = false;
            }
            else {
                script.init(effectName, playRate);
            }
            return nodeEffect;
        }
    }

    class ProspectingMapManager {
        constructor() {
            this.mProspectedCrystalScriptArr = [];
            this.mCreatedCrystalNum = 0;
            this.mCatchCrystalNum = 0;
            this.mCrystalMap = {};
        }
        static get instance() {
            if (!this.mInstance) {
                this.mInstance = new ProspectingMapManager();
            }
            return this.mInstance;
        }
        createMap(level, callback) {
            UiUtils.loadJson(MyGameConfig.URL_CONFIG + "prospecting/" + MyGameConfig.levelConfig[level].configName, (json) => {
                let res3dArr = [
                    MyGameConfig.URL_RES3D_FIRST + "node_crystal2.lh",
                ];
                let childIslandConfigInfo = MyGameConfig.levelConfig[level];
                res3dArr.push(MyGameConfig.URL_RES3D_ISLAND + childIslandConfigInfo.modelName);
                res3dArr.push(MyGameConfig.URL_RES3D_SKY + childIslandConfigInfo.skyName);
                Laya.loader.create(res3dArr, new Laya.Handler(this, () => {
                    this.mCurChildIsland = Laya.loader.getRes(MyGameConfig.URL_RES3D_ISLAND + childIslandConfigInfo.modelName);
                    GameManager.instance.scene3d.addChild(this.mCurChildIsland);
                    GameManager.instance.curChildIsland = this.mCurChildIsland;
                    this.mCurChildIsland.transform.position = new Laya.Vector3(0, 0, -70);
                    this.mCrystalAreaArr = json["area"];
                    for (let i = 0; i < 5; i++) {
                        this.createCrystal();
                    }
                    callback(this.mCurChildIsland);
                }));
            });
        }
        createCrystal() {
            let areaRange = this.mCrystalAreaArr[MathUtils.nextInt(0, this.mCrystalAreaArr.length - 1)];
            let position = new Laya.Vector3(MathUtils.nextFloat(areaRange.x[0] + 0.4, areaRange.x[1] - 0.4), 0, MathUtils.nextFloat(areaRange.z[0] + 0.4, areaRange.z[1] - 0.4));
            let floorX = Math.floor(position.x);
            let floorZ = Math.floor(position.z);
            if (this.mCrystalMap[floorX + "" + floorZ]) {
                this.createCrystal();
                return;
            }
            this.mProspectedCrystalScriptArr.push(SceneResManager.createMineral(this.mCurChildIsland, position));
            this.mCreatedCrystalNum++;
        }
        catchCrystal() {
            for (let i = 0; i < this.mProspectedCrystalScriptArr.length; i++) {
                let script = this.mProspectedCrystalScriptArr[i];
                let distance = Laya.Vector3.distance(script.getPosition(), GameManager.instance.roleScript.getRollerScript().getPosition());
                if (!script.isCatch() && distance < MyGameConfig.gameConfig.surveyRadius) {
                    let floorX = script.getPosition().x;
                    let floorZ = script.getPosition().z;
                    this.mCrystalMap[floorX + "" + floorZ] = null;
                    script.catch();
                    this.mCatchCrystalNum++;
                    if (this.mCreatedCrystalNum < MyGameConfig.levelConfig[GameManager.instance.curLevel].crystalNum) {
                        this.createCrystal();
                    }
                    else if (this.mCatchCrystalNum == MyGameConfig.levelConfig[GameManager.instance.curLevel].crystalNum) {
                        EventUtils.dispatchEvent(MyGameConfig.EVENT_PROSPECTING_END, "");
                    }
                }
            }
        }
        surveyCrystal() {
            for (let i = 0; i < this.mProspectedCrystalScriptArr.length; i++) {
                let script = this.mProspectedCrystalScriptArr[i];
                let distance = Laya.Vector3.distance(script.getPosition(), GameManager.instance.roleScript.getPosition());
                if (!script.isCatch() && distance < MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_CRYSTAL_DETECTOR].range) {
                    script.show();
                }
                else {
                    script.hide();
                }
            }
        }
        checkMap() {
        }
        clear() {
            this.mProspectedCrystalScriptArr = [];
            this.mCrystalAreaArr = [];
            this.mCreatedCrystalNum = 0;
            this.mCatchCrystalNum = 0;
            this.mCrystalMap = {};
        }
    }

    class CurrencyValueView extends ui.game.CurrencyValueViewUI {
        onAwake() {
            this.zOrder = MyGameConfig.ZORDER_1;
            this.width = Laya.stage.width;
            this.addHandler();
            this.initGoldValueView();
        }
        addHandler() {
            EventUtils.onEvent(this, MyGameConfig.EVENT_REFRESH_GOLD_VIEW, () => {
                this.initGoldValueView();
            });
        }
        initGoldValueView() {
            this.mLbGoldValue.changeText(DataManager.getGoldValue() + "");
            this.mLbCrystalValue.changeText(DataManager.getCrystalValue() + "");
        }
    }

    class SettingDialog extends ui.game.SettingDialogUI {
        onAwake() {
            this.width = Laya.stage.width;
            if (Laya.Browser.onMobile) {
                this.mNodeVibrate.visible = SdkCenter.instance.isSupplyVibrate();
            }
            this.initView();
            UiUtils.click(this.mBtnMusic, this, this.onMusicClick);
            UiUtils.click(this.mBtnSound, this, this.onSoundClick);
            UiUtils.click(this.mBtnVibrate, this, this.onVibrateClick);
            UiUtils.click(this.mBtnClose, this, this.onCloseClick);
            UiUtils.hideLoading();
        }
        initView() {
            var isMusic = DataManager.isBgm();
            var isSound = DataManager.isSound();
            var isVibrate = DataManager.isVibrate();
            this.mBtnMusic.getChildAt(0).visible = !isMusic;
            this.mBtnMusic.getChildAt(1).visible = isMusic;
            this.mBtnSound.getChildAt(0).visible = !isSound;
            this.mBtnSound.getChildAt(1).visible = isSound;
            this.mBtnVibrate.getChildAt(0).visible = !isVibrate;
            this.mBtnVibrate.getChildAt(1).visible = isVibrate;
        }
        onMusicClick() {
            var isMusic = DataManager.isBgm();
            isMusic = !isMusic;
            isMusic ? AudioManager.openMusic() : AudioManager.closeMusic();
            DataManager.setBgm(isMusic);
            this.initView();
        }
        onSoundClick() {
            var isSound = DataManager.isSound();
            isSound = !isSound;
            isSound ? AudioManager.openSound() : AudioManager.closeSound();
            DataManager.setSound(isSound);
            this.initView();
        }
        onVibrateClick() {
            var isVibrate = DataManager.isVibrate();
            isVibrate = !isVibrate;
            SdkCenter.instance.setVibrate(isVibrate);
            DataManager.setVibrate(isVibrate);
            this.initView();
        }
        onCloseClick() {
            this.removeSelf();
        }
    }

    class MainViewDialog extends ui.game.MainViewDialogUI {
        constructor() {
            super(...arguments);
            this.mPropPowerTime = 0;
            this.mPropRollerTime = 0;
            this.mPropCapacityTime = 0;
            this.mPropExplosiveTime = 0;
            this.mCatchCrystalTime = 0;
            this.mPropSurveyCrystalTime = 0;
            this.mProspectingTimer = 60;
            this.mIsPauseProspectingTimer = true;
        }
        onAwake() {
            this.width = Laya.stage.width;
            this.mCurrencyValueView = new CurrencyValueView();
            UiUtils.addChild(this.mCurrencyValueView);
            this.addHandler();
        }
        onDisable() {
            EventUtils.offAllEventByNode(this);
        }
        addHandler() {
            EventUtils.onEvent(this, MyGameConfig.EVENT_REFRESH_MAIN_VIEW_DIALOG, () => {
                this.initView();
                this.initPropsValueView();
                this.setTouch();
            });
            EventUtils.onEvent(this, MyGameConfig.EVENT_REFRESH_PROPS_VIEW, () => {
                this.initPropsValueView();
            });
            EventUtils.onEvent(this, MyGameConfig.EVENT_SHOW_SELL, (num) => {
            });
            EventUtils.onEvent(this, MyGameConfig.EVENT_GO_NEXT_ISLAND, () => {
                this.mNodeModelNormal.visible = false;
                this.mNodeModelProspecting.visible = false;
                this.mBtnRule.visible = false;
                this.mBtnPvp.visible = false;
                Laya.timer.clearAll(this);
            });
            EventUtils.onEvent(this, MyGameConfig.EVENT_UPGRADE_TRUCK, () => {
                this.mLbContinerProgress.changeText(GameManager.instance.roleScript.getContainerNum() + "/" + GameManager.instance.roleScript.getMaxCapacity());
            });
            EventUtils.onEvent(this, MyGameConfig.EVENT_START, (playModel) => {
                this.mPlayModel = playModel;
                this.mNodeStartTip.visible = true;
                this.mBtnRule.visible = true;
                this.mBtnPvp.visible = true;
                if (playModel == MyGameConfig.PLAY_MODEL_NORMAL) {
                    this.initModelNormalView();
                }
                else if (playModel == MyGameConfig.PLAY_MODEL_PROSPECTING) {
                    this.initModelProspectingView();
                }
            });
            EventUtils.onEvent(this, MyGameConfig.EVENT_PROSPECTING_TIMER_PAUSE, (b) => {
                this.mIsPauseProspectingTimer = b;
            });
            EventUtils.onEvent(this, MyGameConfig.EVENT_PROSPECTING_END, () => {
                Laya.timer.clearAll(this);
                this.mNodeModelProspecting.visible = false;
                ProspectingMapManager.instance.clear();
                UiUtils.addChild(new CommonTipDialog("Exploration Ends"));
            });
            EventUtils.onEvent(this, MyGameConfig.EVENT_HIDE_MAIN_VIEW_DIALOG, (isHide) => {
                switch (this.mPlayModel) {
                    case MyGameConfig.PLAY_MODEL_NORMAL:
                        this.mNodeModelNormal.visible = !isHide;
                        break;
                    case MyGameConfig.PLAY_MODEL_PROSPECTING:
                        this.mNodeModelProspecting.visible = !isHide;
                        break;
                }
            });
            EventUtils.onEvent(this, MyGameConfig.EVENT_HIDE_VIEW_DURABLE, (isHide) => {
            });
            EventUtils.onEvent(this, MyGameConfig.EVENT_CATCH_END, () => {
                this.mNodeProps.visible = false;
                this.mNodePropsCrystal.visible = false;
            });
        }
        initModelNormalView() {
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
            let camera = GameManager.instance.roleScript.getCamera();
            let outPos = new Laya.Vector4();
            Laya.timer.frameLoop(1, this, () => {
                if (this.mPropPowerTime >= 0) {
                    this.mPropPowerTime = this.refreshPropMask(this.mPropPowerTime, this.mNodeMaskPropPower, this.mMaskPropPower, MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_POWER].effectTime);
                }
                if (this.mPropRollerTime >= 0) {
                    this.mPropRollerTime = this.refreshPropMask(this.mPropRollerTime, this.mNodeMaskPropRoller, this.mMaskPropRoller, MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_ROLLER].effectTime);
                }
                if (this.mPropCapacityTime >= 0) {
                    this.mPropCapacityTime = this.refreshPropMask(this.mPropCapacityTime, this.mNodeMaskPropCapacity, this.mMaskPropCapacity, MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_CAPACITY].effectTime);
                }
                if (this.mPropExplosiveTime >= 0) {
                    this.mPropExplosiveTime = this.refreshPropMask(this.mPropExplosiveTime, this.mNodeMaskPropExplosive, this.mMaskPropExplosive, MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_EXPLOSIVE].effectTime);
                }
                camera.viewport.project(GameManager.instance.roleScript.getPosition(), camera.projectionViewMatrix, outPos);
            });
        }
        initModelProspectingView() {
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
                    this.mCatchCrystalTime = this.refreshPropMask(this.mCatchCrystalTime, this.mNodeMaskCatchCrystal, this.mMaskCatchCrystal, MyGameConfig.gameConfig.catchCrystalCd);
                }
                if (this.mPropSurveyCrystalTime >= 0) {
                    this.mPropSurveyCrystalTime = this.refreshPropMask(this.mPropSurveyCrystalTime, this.mNodeMaskPropSurvey, this.mMaskPropSurvey, MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_CRYSTAL_DETECTOR].effectTime);
                }
            });
        }
        initView() {
            this.mLbContinerProgress.changeText(0 + "/" + GameManager.instance.roleScript.getMaxCapacity());
            this.mLbRepairPrice.changeText("$" + MyGameConfig.gameConfig.repairPrice);
            let progress = GameManager.instance.roleScript.getCatchStoneProgress();
            this.mMaskIslandProgress.graphics.clear();
            this.mMaskIslandProgress.graphics.drawRect(0, 0, this.mNodeIslandProgress.width * progress, this.mNodeIslandProgress.height, "#ff0000");
            this.mNodeIslandProgress.visible = !!progress;
            if (Laya.Browser.onPC) {
                this.mLbStartTip.text = LanguageData.getInstance().t("pc_control_tip");
            }
            else {
                this.mLbStartTip.text = LanguageData.getInstance().t("control_tip");
            }
            const address = WalletUtils.getInstance().getAddress();
            if (address) {
                this.mLbAccount.text = Utils.formatAccountAddress(address, 7, 7, 14);
            }
            else {
                (this.mLbAccount.parent).visible = false;
            }
            UiUtils.click(this.mBtnPropPower, this, this.onPropPowerClick);
            UiUtils.click(this.mBtnPropRoller, this, this.onPropRollerClick);
            UiUtils.click(this.mBtnPropCapacity, this, this.onPropCapacityClick);
            UiUtils.click(this.mBtnPropExplosive, this, this.onPropExplosiveClick);
            UiUtils.click(this.mBtnCatchCrystal, this, this.onCatchCrystalClick);
            UiUtils.click(this.mBtnSurveyCrystal, this, this.onSurveyCrystalClick);
            UiUtils.click(this.mBtnRepair, this, this.onRepairClick);
            UiUtils.click(this.mBtnSetting, this, this.onSettingClick);
            UiUtils.click(this.mBtnRule, this, this.onRuleClick);
            UiUtils.click(this.mBtnPvp, this, this.onPvpClick);
        }
        refreshDurableView(progress) {
            this.mMaskDurable.graphics.clear();
            this.mMaskDurable.graphics.drawRect(0, 0, this.mNodeMaskDurable.width * progress, this.mNodeMaskDurable.height, "#ffffff");
            this.mNodeMaskDurable.visible = progress != 0;
        }
        refreshGameProgressView(catchStoneNum) {
            if (catchStoneNum != GameManager.instance.roleScript.getCatchStoneNum()) {
                catchStoneNum = GameManager.instance.roleScript.getCatchStoneNum();
                let progress = GameManager.instance.roleScript.getCatchStoneProgress();
                this.mMaskIslandProgress.graphics.clear();
                this.mMaskIslandProgress.graphics.drawRect(0, 0, this.mNodeIslandProgress.width * progress, this.mNodeIslandProgress.height, "#ff0000");
                this.mNodeIslandProgress.visible = !!progress;
            }
            return catchStoneNum;
        }
        initPropsValueView() {
            this.mLbPropPower.changeText(DataManager.getPropsInfo()[MyGameConfig.PROPS_POWER] + "");
            this.mLbPropCapacity.changeText(DataManager.getPropsInfo()[MyGameConfig.PROPS_CAPACITY] + "");
            this.mLbPropRoller.changeText(DataManager.getPropsInfo()[MyGameConfig.PROPS_ROLLER] + "");
            this.mLbPropExplosive.changeText(DataManager.getPropsInfo()[MyGameConfig.PROPS_EXPLOSIVE] + "");
            this.mLbSurveyCrystal.changeText(DataManager.getPropsInfo()[MyGameConfig.PROPS_CRYSTAL_DETECTOR] + "");
        }
        refreshPropMask(propTime, nodeMakProp, maskProp, effectTime) {
            propTime -= GameManager.instance.timerDelta;
            let progress = 1 - propTime / effectTime;
            maskProp.graphics.clear();
            maskProp.graphics.drawPie(nodeMakProp.width / 2, nodeMakProp.height / 2, 80, -90 + 360 * progress, 270, "#ffffff");
            if (propTime <= 0) {
                nodeMakProp.visible = false;
            }
            return propTime;
        }
        setTouch() {
            var rockerView = new RockerView(this.mNodeTouch);
            this.addChild(rockerView);
            let isFirtMove = true;
            rockerView.setMoveCallback((event) => {
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
        showBtnRepair(b) {
            this.mBtnRepair.visible = b;
        }
        onPropPowerClick() {
            if (this.mPropPowerTime > 0 || DataManager.getPropsInfo()[MyGameConfig.PROPS_POWER] <= 0) {
                return;
            }
            EventUtils.dispatchEvent(MyGameConfig.EVENT_CATCH_PROPS, { type: MyGameConfig.PROPS_POWER });
            this.receivePropPower();
        }
        receivePropPower() {
            this.mPropPowerTime = MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_POWER].effectTime;
            this.mNodeMaskPropPower.visible = true;
            DataManager.addPropValue(MyGameConfig.PROPS_POWER, -1, () => {
            });
        }
        onPropRollerClick() {
            if (this.mPropRollerTime > 0 || DataManager.getPropsInfo()[MyGameConfig.PROPS_ROLLER] <= 0) {
                return;
            }
            EventUtils.dispatchEvent(MyGameConfig.EVENT_CATCH_PROPS, { type: MyGameConfig.PROPS_ROLLER });
            this.receivePropRoller();
        }
        receivePropRoller() {
            this.mPropRollerTime = MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_ROLLER].effectTime;
            this.mNodeMaskPropRoller.visible = true;
            DataManager.addPropValue(MyGameConfig.PROPS_ROLLER, -1, () => {
            });
        }
        onPropCapacityClick() {
            if (this.mPropCapacityTime > 0 || DataManager.getPropsInfo()[MyGameConfig.PROPS_CAPACITY] <= 0) {
                return;
            }
            EventUtils.dispatchEvent(MyGameConfig.EVENT_CATCH_PROPS, { type: MyGameConfig.PROPS_CAPACITY });
            this.receivePropCapacity();
        }
        receivePropCapacity() {
            this.mPropCapacityTime = MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_CAPACITY].effectTime;
            this.mNodeMaskPropCapacity.visible = true;
            DataManager.addPropValue(MyGameConfig.PROPS_CAPACITY, -1, () => {
            });
        }
        onPropExplosiveClick() {
            if (this.mPropExplosiveTime > 0 || DataManager.getPropsInfo()[MyGameConfig.PROPS_EXPLOSIVE] <= 0) {
                return;
            }
            EventUtils.dispatchEvent(MyGameConfig.EVENT_CATCH_PROPS, { type: MyGameConfig.PROPS_EXPLOSIVE });
            this.receivePropExplosive();
        }
        receivePropExplosive() {
            this.mPropExplosiveTime = MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_EXPLOSIVE].effectTime;
            this.mNodeMaskPropExplosive.visible = true;
            DataManager.addPropValue(MyGameConfig.PROPS_EXPLOSIVE, -1, () => {
            });
        }
        onCatchCrystalClick() {
            if (this.mCatchCrystalTime > 0) {
                return;
            }
            this.mCatchCrystalTime = MyGameConfig.gameConfig.catchCrystalCd;
            GameManager.instance.roleScript.catchCrystal();
            this.mNodeMaskCatchCrystal.visible = true;
        }
        onSurveyCrystalClick() {
            if (this.mPropSurveyCrystalTime > 0 || DataManager.getPropsInfo()[MyGameConfig.PROPS_CRYSTAL_DETECTOR] <= 0) {
                return;
            }
            this.mPropSurveyCrystalTime = MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_CRYSTAL_DETECTOR].effectTime;
            GameManager.instance.roleScript.surveyCrystal();
            this.mNodeMaskPropSurvey.visible = true;
            DataManager.addPropValue(MyGameConfig.PROPS_CRYSTAL_DETECTOR, -1, () => {
            });
        }
        onRepairClick() {
            let goldValue = DataManager.getGoldValue();
            if (goldValue < MyGameConfig.gameConfig.repairPrice) {
                UiUtils.showToast("gold shortage");
                return;
            }
            GameManager.instance.roleScript.addDurable(99999999999);
            DataManager.addGoldValue(MyGameConfig.gameConfig.repairPrice);
        }
        onSettingClick() {
            UiUtils.addChild(new SettingDialog());
        }
        onRuleClick() {
            UiUtils.addChild(new GuideDialog(MyGameConfig.levelConfig[GameManager.instance.curLevel].model));
        }
        onPvpClick() {
            if (GameManager.instance.roleScript.getContainerProgress() > 0) {
                UiUtils.showToast("please sell the ore first");
                return;
            }
            GameManager.instance.roleScript.clearProps();
            GameManager.instance.roleScript.pvpPrepare(true);
        }
        showAllView(b) {
            this.visible = b;
            this.mCurrencyValueView.visible = b;
        }
        showBtnPvp(b) {
            this.mBtnPvp.visible = b;
        }
    }

    class LoadingDialog extends ui.laoding.LoadingDIalogUI {
        constructor(callback) {
            super();
            this.mCallback = callback;
        }
        onAwake() {
            this.zOrder = 100;
            this.name = MyGameConfig.NAME_DIALOG_LOADING;
            this.width = Laya.stage.width;
            this.setPretendLoading();
            this.mProgress.graphics.clear();
            this.mProgress.graphics.drawRect(0, 0, 0, this.mProgress.height, "#ff0000");
            this.on(Laya.Event.MOUSE_DOWN, this, function () {
            });
            this.on(Laya.Event.MOUSE_MOVE, this, function () {
            });
            this.on(Laya.Event.MOUSE_UP, this, function () {
            });
            if (this.mCallback) {
                this.mCallback();
            }
        }
        onDisable() {
            Laya.timer.clearAll(this);
        }
        updataProgress(progress) {
            if (this.mProgress) {
                this.mProgress.graphics.drawRect(0, 0, this.mProgress.width * progress, this.mProgress.height, "#ff0000");
            }
        }
        setPretendLoading() {
            var progress = 0;
            Laya.timer.frameLoop(5, this, () => {
                progress += 0.002;
                if (this.mProgress && progress <= 0.9) {
                    this.mProgress.graphics.drawRect(0, 0, this.mProgress.width * progress, this.mProgress.height, "#ff0000");
                }
            });
        }
    }

    class MultiplePassOutlineMaterial extends Laya.Material {
        constructor() {
            super();
            this.ALBEDOTEXTURE = Laya.Shader3D.propertyNameToID("u_AlbedoTexture");
            this.OUTLINECOLOR = Laya.Shader3D.propertyNameToID("u_OutlineColor");
            this.OUTLINEWIDTH = Laya.Shader3D.propertyNameToID("u_OutlineWidth");
            this.OUTLINELIGHTNESS = Laya.Shader3D.propertyNameToID("u_OutlineLightness");
            this.setShaderName("MultiplePassOutlineShader");
            this._shaderValues.setNumber(this.OUTLINEWIDTH, 0.01581197);
            this._shaderValues.setNumber(this.OUTLINELIGHTNESS, 1);
            this._shaderValues.setVector(this.OUTLINECOLOR, new Laya.Vector4(1.0, 1.0, 1.0, 0.0));
        }
        static __init__() {
        }
        get albedoTexture() {
            return this._shaderValues.getTexture(this.ALBEDOTEXTURE);
        }
        set albedoTexture(value) {
            this._shaderValues.setTexture(this.ALBEDOTEXTURE, value);
        }
        get outlineColor() {
            return this._shaderValues.getVector(this.OUTLINECOLOR);
        }
        set outlineColor(value) {
            this._shaderValues.setVector(this.OUTLINECOLOR, value);
        }
        get outlineWidth() {
            return this._shaderValues.getNumber(this.OUTLINEWIDTH);
        }
        set outlineWidth(value) {
            value = Math.max(0.0, Math.min(0.05, value));
            this._shaderValues.setNumber(this.OUTLINEWIDTH, value);
        }
        get outlineLightness() {
            return this._shaderValues.getNumber(this.OUTLINELIGHTNESS);
        }
        set outlineLightness(value) {
            value = Math.max(0.0, Math.min(1.0, value));
            this._shaderValues.setNumber(this.OUTLINELIGHTNESS, value);
        }
        static initShader() {
            MultiplePassOutlineMaterial.__init__();
            var attributeMap = {
                'a_Position': Laya.VertexMesh.MESH_POSITION0,
                'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
                'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0
            };
            var uniformMap = {
                'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
                'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
                'u_OutlineWidth': Laya.Shader3D.PERIOD_MATERIAL,
                'u_OutlineColor': Laya.Shader3D.PERIOD_MATERIAL,
                'u_OutlineLightness': Laya.Shader3D.PERIOD_MATERIAL,
                'u_AlbedoTexture': Laya.Shader3D.PERIOD_MATERIAL
            };
            var customShader = Laya.Shader3D.add("MultiplePassOutlineShader");
            var subShader = new Laya.SubShader(attributeMap, uniformMap);
            customShader.addSubShader(subShader);
            let vs1 = `
        #if defined(GL_FRAGMENT_PRECISION_HIGH)// 原来的写法会被我们自己的解析流程处理，而我们的解析是不认内置宏的，导致被删掉，所以改成 if defined 了
            precision highp float;
            precision highp int;
        #else
            precision mediump float;
            precision mediump int;
        #endif
        #include \"Lighting.glsl\";
        #include \"LayaUtile.glsl\"
        #include \"Shadow.glsl\";
        
        
        attribute vec4 a_Position;
        
        #ifdef GPU_INSTANCE
            uniform mat4 u_ViewProjection;
        #else
            uniform mat4 u_MvpMatrix;
        #endif
        
        #if defined(DIFFUSEMAP)||defined(THICKNESSMAP)||((defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT))&&(defined(SPECULARMAP)||defined(NORMALMAP)))||(defined(LIGHTMAP)&&defined(UV))
            attribute vec2 a_Texcoord0;
            varying vec2 v_Texcoord0;
        #endif
        
        #if defined(LIGHTMAP)&&defined(UV1)
            attribute vec2 a_Texcoord1;
        #endif
        
        #ifdef LIGHTMAP
            uniform vec4 u_LightmapScaleOffset;
            varying vec2 v_LightMapUV;
        #endif
        
        #ifdef COLOR
            attribute vec4 a_Color;
            varying vec4 v_Color;
        #endif
        
        #ifdef BONE
            const int c_MaxBoneCount = 24;
            attribute vec4 a_BoneIndices;
            attribute vec4 a_BoneWeights;
            uniform mat4 u_Bones[c_MaxBoneCount];
        #endif
        
        attribute vec3 a_Normal;
        varying vec3 v_Normal; 
        
        #if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)
            uniform vec3 u_CameraPos;
            varying vec3 v_ViewDir; 
        #endif
        
        #if defined(NORMALMAP)
            attribute vec4 a_Tangent0;
            varying vec3 v_Tangent;
            varying vec3 v_Binormal;
        #endif
        
        #ifdef GPU_INSTANCE
            attribute mat4 a_WorldMat;
        #else
            uniform mat4 u_WorldMat;
        #endif
        
        #if defined(POINTLIGHT)||defined(SPOTLIGHT)||(defined(CALCULATE_SHADOWS)&&defined(SHADOW_CASCADE))||defined(CALCULATE_SPOTSHADOWS)
            varying vec3 v_PositionWorld;
        #endif
        
        #if defined(CALCULATE_SHADOWS)&&!defined(SHADOW_CASCADE)
            varying vec4 v_ShadowCoord;
        #endif
        
        #if defined(CALCULATE_SPOTSHADOWS)//shader中自定义的宏不可用ifdef 必须改成if defined
            varying vec4 v_SpotShadowCoord;
        #endif
        
        uniform vec4 u_TilingOffset;
        
        void main()
        {
            vec4 position;
            #ifdef BONE
                mat4 skinTransform;
                #ifdef SIMPLEBONE
                    float currentPixelPos;
                    #ifdef GPU_INSTANCE
                        currentPixelPos = a_SimpleTextureParams.x+a_SimpleTextureParams.y;
                    #else
                        currentPixelPos = u_SimpleAnimatorParams.x+u_SimpleAnimatorParams.y;
                    #endif
                    float offset = 1.0/u_SimpleAnimatorTextureSize;
                    skinTransform =  loadMatFromTexture(currentPixelPos,int(a_BoneIndices.x),offset) * a_BoneWeights.x;
                    skinTransform += loadMatFromTexture(currentPixelPos,int(a_BoneIndices.y),offset) * a_BoneWeights.y;
                    skinTransform += loadMatFromTexture(currentPixelPos,int(a_BoneIndices.z),offset) * a_BoneWeights.z;
                    skinTransform += loadMatFromTexture(currentPixelPos,int(a_BoneIndices.w),offset) * a_BoneWeights.w;
                #else
                    skinTransform =  u_Bones[int(a_BoneIndices.x)] * a_BoneWeights.x;
                    skinTransform += u_Bones[int(a_BoneIndices.y)] * a_BoneWeights.y;
                    skinTransform += u_Bones[int(a_BoneIndices.z)] * a_BoneWeights.z;
                    skinTransform += u_Bones[int(a_BoneIndices.w)] * a_BoneWeights.w;
                #endif
                    position=skinTransform*a_Position;
            #else
                position=a_Position;
            #endif
                
                
                
            mat4 worldMat;
            #ifdef GPU_INSTANCE
                worldMat = a_WorldMat;
            #else
                worldMat = u_WorldMat;
            #endif

            uniform float u_OutlineWidth;
                    
            #ifdef GPU_INSTANCE
                gl_Position = u_ViewProjection * worldMat * position;
            #else
                position = vec4(a_Position.xyz + a_Normal * u_OutlineWidth, 1.0);
                gl_Position = u_MvpMatrix * position;
            #endif
                    
            mat3 worldInvMat;
            #ifdef BONE
                worldInvMat=INVERSE_MAT(mat3(worldMat*skinTransform));
            #else
                worldInvMat=INVERSE_MAT(mat3(worldMat));
            #endif
                    
            v_Normal=normalize(a_Normal*worldInvMat);
            #if defined(NORMALMAP)
                v_Tangent=normalize(a_Tangent0.xyz*worldInvMat);
                v_Binormal=cross(v_Normal,v_Tangent)*a_Tangent0.w;
            #endif
            
            #if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)||(defined(CALCULATE_SHADOWS)&&defined(SHADOW_CASCADE))||defined(CALCULATE_SPOTSHADOWS)
                vec3 positionWS=(worldMat*position).xyz;
            #if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)
                v_ViewDir = u_CameraPos-positionWS;
            #endif
            
            #if defined(POINTLIGHT)||defined(SPOTLIGHT)||(defined(CALCULATE_SHADOWS)&&defined(SHADOW_CASCADE))||defined(CALCULATE_SPOTSHADOWS)
                v_PositionWorld = positionWS;
            #endif
            
            #endif
            
            
            #if defined(DIFFUSEMAP)||defined(THICKNESSMAP)||((defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT))&&(defined(SPECULARMAP)||defined(NORMALMAP)))
                v_Texcoord0=TransformUV(a_Texcoord0,u_TilingOffset);
            #endif
            
            #ifdef LIGHTMAP
            #ifdef UV1
                v_LightMapUV=vec2(a_Texcoord1.x,1.0-a_Texcoord1.y)*u_LightmapScaleOffset.xy+u_LightmapScaleOffset.zw;
            #else
                v_LightMapUV=vec2(a_Texcoord0.x,1.0-a_Texcoord0.y)*u_LightmapScaleOffset.xy+u_LightmapScaleOffset.zw;
            #endif
            
            v_LightMapUV.y=1.0-v_LightMapUV.y;
            #endif
            
            #if defined(COLOR)&&defined(ENABLEVERTEXCOLOR)
                v_Color=a_Color;
            #endif
            
            #if defined(CALCULATE_SHADOWS)&&!defined(SHADOW_CASCADE)
                v_ShadowCoord =getShadowCoord(vec4(positionWS,1.0));
            #endif
            
            
            #if defined(CALCULATE_SPOTSHADOWS)//shader中自定义的宏不可用ifdef 必须改成if defined
                v_SpotShadowCoord = u_SpotViewProjectMatrix*vec4(positionWS,1.0);
            #endif
            
            gl_Position=remapGLPositionZ(gl_Position);
        }
        `;
            let ps1 = `
        #ifdef FSHIGHPRECISION
            precision highp float;
        #else
           precision mediump float;
        #endif
        uniform vec4 u_OutlineColor; 
        uniform float u_OutlineLightness;
    
        void main()
        {
           vec3 finalColor = u_OutlineColor.rgb * u_OutlineLightness;
           gl_FragColor = vec4(finalColor,0.0); 
        }`;
            var pass1 = subShader.addShaderPass(vs1, ps1);
            pass1.renderState.cull = Laya.RenderState.CULL_FRONT;
            let vs2 = `
        #include "Lighting.glsl"

        attribute vec4 a_Position; 
        attribute vec2 a_Texcoord0;
        
        uniform mat4 u_MvpMatrix;
        uniform mat4 u_WorldMat;
        
        attribute vec3 a_Normal; 
        varying vec3 v_Normal; 
        varying vec2 v_Texcoord0; 
        
        void main() 
        {
           gl_Position = u_MvpMatrix * a_Position;
           mat3 worldMat=mat3(u_WorldMat); 
           v_Normal=worldMat*a_Normal; 
           v_Texcoord0 = a_Texcoord0;
           gl_Position=remapGLPositionZ(gl_Position); 
        }`;
            let ps2 = `
        #ifdef FSHIGHPRECISION
            precision highp float;
        #else
            precision mediump float;
        #endif
        varying vec2 v_Texcoord0;
        varying vec3 v_Normal;
        
        uniform sampler2D u_AlbedoTexture;
        
        
        void main()
        {
           vec4 albedoTextureColor = vec4(1.0);
           
           albedoTextureColor = texture2D(u_AlbedoTexture, v_Texcoord0);
           gl_FragColor=albedoTextureColor;
        }`;
            subShader.addShaderPass(vs2, ps2);
        }
    }

    class LaunchScript {
        constructor() {
            if (Laya.Browser.onMac || Laya.Browser.onPC) {
            }
            else {
                Laya.stage.frameRate = Laya.Stage.FRAME_SLOW;
            }
            this.prepare();
        }
        addHandler() {
        }
        prepare() {
            let loadingDialog = new LoadingDialog(() => {
                Laya.loader.load("fonts/berlin_sans_fb.ttf", Laya.Handler.create(this, (ttf) => {
                    Laya.Text.defaultFont = ttf.fontName;
                    let totalRequestCount = 2;
                    let requestCount = 0;
                    let requestCallback = function () {
                        requestCount++;
                        if (totalRequestCount == requestCount) {
                            Laya.Shader3D.compileShaderByDefineNames("PARTICLESHURIKEN", 0, 0, ["DIFFUSEMAP", "ADDTIVEFOG", "SPHERHBILLBOARD", "COLOROVERLIFETIME", "TEXTURESHEETANIMATIONCURVE",
                                "SHAPE", "TINTCOLOR"]);
                            EventUtils.dispatchEvent(MyGameConfig.EVENT_REFRESH_MAIN_VIEW_DIALOG, "");
                            loadingDialog.destroy();
                        }
                        ;
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
        loadRes(callback) {
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

    class Main {
        constructor() {
            Config.useWebGL2 = false;
            Config.isAntialias = true;
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            new LaunchScript();
        }
    }
    new Main();

}());

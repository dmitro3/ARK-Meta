export default class MathUtils {

    private static _lut = [];

    public static generateUUID() {
        if (this._lut.length == 0) {
            for (var i = 0; i < 256; i++) {
                this._lut[i] = (i < 16 ? "0" : "") + i.toString(16);
            }
        }

        var d0 = 4294967295 * Math.random() | 0, d1 = 4294967295 * Math.random() | 0, d2 = 4294967295 * Math.random() | 0, d3 = 4294967295 * Math.random() | 0;
        return (this._lut[255 & d0] + this._lut[d0 >> 8 & 255] + this._lut[d0 >> 16 & 255] + this._lut[d0 >> 24 & 255] + "-" + this._lut[255 & d1] + this._lut[d1 >> 8 & 255] + "-" + this._lut[d1 >> 16 & 15 | 64] + this._lut[d1 >> 24 & 255] + "-" + this._lut[63 & d2 | 128] + this._lut[d2 >> 8 & 255] + "-" + this._lut[d2 >> 16 & 255] + this._lut[d2 >> 24 & 255] + this._lut[255 & d3] + this._lut[d3 >> 8 & 255] + this._lut[d3 >> 16 & 255] + this._lut[d3 >> 24 & 255]).toUpperCase();
    }

    public static toFixed(num: number, fractionDigits: number): number {
        return parseFloat(num.toFixed(fractionDigits));
    }

    public static angle2Radian(angle): number {
        return Math.PI / 180 * angle;
    }

    public static radian2Angle(radian): number {
        return 180 / Math.PI * radian;
    }

    public static nextInt(n, m) {
        var random = Math.floor(Math.random() * (m - n + 1) + n);

        return random;
    }

    public static nextFloat(n, m): number {
        var random = Math.random() * (m - n) + n;

        return random;
    }

    public static pointIsRotateRect(rectX: number, rectY: number, width: number, height: number, angle: number, pointX: number, pointY: number): boolean {
        let hw = width / 2;
        let hh = height / 2
        let O = angle;
        let X = pointX;
        let Y = pointY;
        let r = -O * (Math.PI / 180)
        let nTempX = rectX + (X - rectX) * Math.cos(r) - (Y - rectY) * Math.sin(r);
        let nTempY = rectY + (X - rectX) * Math.sin(r) + (Y - rectY) * Math.cos(r);
        if (nTempX > rectX - hw && nTempX < rectX + hw && nTempY > rectY - hh && nTempY < rectY + hh) {
            return true;
        }
        return false
    }


    public static pointInPolygon(pt, path) {
        var result = 0,
            cnt = path.length;
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

    public static randomRate(rateArr): number {
        var leng = 0;
        for (var i = 0; i < rateArr.length; i++) {
            leng += rateArr[i];
        }
        for (var i = 0; i < rateArr.length; i++) {
            var random = Math.random() * leng;
            if (random < rateArr[i]) {
                return i;
            } else {
                leng -= rateArr[i];
            }
        }

        return 0;
    }
}
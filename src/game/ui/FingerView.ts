import MathUtils from "../../utils/MathUtils";

export default class FingerView extends Laya.Image {

    onAwake() {
        let angle = 0;
        let startX: number = this.x;
        let startY: number = this.y;
        let radius = 62;

        let deltaCurveX = 170 / 180;

        // // console.log("------fffffffff");
        let circleX: number;
        let circleY: number;
        let x;
        let y;

        let index = 0;

        Laya.timer.frameLoop(1, this, () => {
            if ((this.parent.parent as Laya.Box).visible) {
                if (index == 0) {
                    angle += Laya.timer.delta / 5;

                    if (angle > 180) {
                        x = 256;
                        y = 147;

                        angle = -90;
                        circleX = x;
                        circleY = y - radius;
                        index++;
                    } else {
                        x = deltaCurveX * angle + startX;
                        y = (1 - Math.cos(MathUtils.angle2Radian(angle))) * 62 + startY;
                    }
                } else if (index == 1) {
                    angle += Laya.timer.delta / 5;

                    if (angle > 90) {
                        angle = -90;

                        x = 256;
                        y = 23;

                        index++;
                        angle = 0;
                        startX = x;
                        startY = y;
                    } else {
                        x = Math.cos(MathUtils.angle2Radian(angle)) * radius + circleX;
                        y = -Math.sin(MathUtils.angle2Radian(angle)) * radius + circleY;
                    }
                } else if (index == 2) {
                    angle -= Laya.timer.delta / 5;

                    if (angle < -180) {
                        angle = -90;

                        x = 85;
                        y = 147;

                        circleX = x;
                        circleY = y - radius;
                        index++;
                    } else {
                        x = deltaCurveX * angle + startX;
                        y = (1 - Math.cos(MathUtils.angle2Radian(angle))) * 62 + startY;
                    }
                } else if (index == 3) {
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
                    } else {
                        x = Math.cos(MathUtils.angle2Radian(angle)) * radius + circleX;
                        y = -Math.sin(MathUtils.angle2Radian(angle)) * radius + circleY;
                    }
                }

                this.pos(x, y);
            }
        });
    }
}
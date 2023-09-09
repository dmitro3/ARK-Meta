import { ui } from "../../ui/layaMaxUI";

export default class RockerView extends ui.game.RockerViewUI {

    private mNodeTouchView: Laya.Box;

    private originPiont: Laya.Point;

    private deltaX: number;

    private deltaY: number;

    private mCurrentTouchId: number = -1;

    private isDown: Boolean = false;

    public angle: number = -1;

    public radians: number = -1;

    public mMouseDownCallback: Function;

    private mMouseMoveCallback: Function;

    private mMouseUpCallback: Function;

    private mIsMouseDown: boolean;

    private mIsStartGamne: boolean = false;
    constructor(nodeTouchView: Laya.Box) {
        super();
        this.name = "RockerView";
        this.mNodeTouchView = nodeTouchView;
        this.mNodeTouchView.height = Laya.stage.height;
    }

    onAwake(): void {
        this.mNodeTouchView.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        this.mNodeTouchView.on(Laya.Event.MOUSE_MOVE, this, this.onMove);
        this.mNodeTouchView.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        this.mNodeTouchView.on(Laya.Event.MOUSE_OUT, this, this.onMouseOut);
        this.originPiont = new Laya.Point(this.width / 2, this.height / 2);
        this.visible = false;
        let curAngle = 0;

        if (Laya.Browser.onPC) {
            Laya.timer.frameLoop(1, this, () => {
                if (this.mIsMouseDown || !(this.parent as Laya.View).visible) {
                    return;
                }

                if (Laya.KeyBoardManager.hasKeyDown(87) && Laya.KeyBoardManager.hasKeyDown(68)
                    || Laya.KeyBoardManager.hasKeyDown(38) && Laya.KeyBoardManager.hasKeyDown(39)) {    // W & D
                    this.mMouseMoveCallback(this.radians, -45);
                } else if (Laya.KeyBoardManager.hasKeyDown(83) && Laya.KeyBoardManager.hasKeyDown(68)
                    || Laya.KeyBoardManager.hasKeyDown(40) && Laya.KeyBoardManager.hasKeyDown(39)) {    // S & D
                    this.mMouseMoveCallback(this.radians, -135);
                } else if (Laya.KeyBoardManager.hasKeyDown(65) && Laya.KeyBoardManager.hasKeyDown(83)
                    || Laya.KeyBoardManager.hasKeyDown(37) && Laya.KeyBoardManager.hasKeyDown(40)) {   // A & S
                    this.mMouseMoveCallback(this.radians, 135);
                } else if (Laya.KeyBoardManager.hasKeyDown(65) && Laya.KeyBoardManager.hasKeyDown(87)
                    || Laya.KeyBoardManager.hasKeyDown(37) && Laya.KeyBoardManager.hasKeyDown(38)) {    // A & W
                    this.mMouseMoveCallback(this.radians, 45);
                } else if (Laya.KeyBoardManager.hasKeyDown(87) || Laya.KeyBoardManager.hasKeyDown(38)) {   // W
                    this.mMouseMoveCallback(this.radians, 0);
                } else if (Laya.KeyBoardManager.hasKeyDown(83) || Laya.KeyBoardManager.hasKeyDown(40)) {   // S
                    this.mMouseMoveCallback(this.radians, 180);
                } else if (Laya.KeyBoardManager.hasKeyDown(65) || Laya.KeyBoardManager.hasKeyDown(37)) {   //A
                    this.mMouseMoveCallback(this.radians, 90);
                } else if (Laya.KeyBoardManager.hasKeyDown(68) || Laya.KeyBoardManager.hasKeyDown(39)) {   //D
                    this.mMouseMoveCallback(this.radians, -90);
                } else {
                    this.mMouseUpCallback();
                }
            });
        }
    }

    onEnable(): void {
    }

    onDisable(): void {
        Laya.timer.clearAll(this);
    }

    private onMouseDown(e: Laya.Event): void {
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

    private onMouseUp(e: Laya.Event): void {
        if (e.touchId != this.mCurrentTouchId) return;
        this.mIsMouseDown = false;
        this.isDown = false;
        this.visible = false;
        this.radians = this.angle = -1;
        this.mCurrentTouchId = -1;

        if (this.mMouseUpCallback) {
            this.mMouseUpCallback();
        }
    }

    private onMove(e: Laya.Event): void {
        if (e.touchId != this.mCurrentTouchId) return;
        var locationPos: Laya.Point = this.globalToLocal(new Laya.Point(Laya.stage.mouseX, Laya.stage.mouseY), false);

        this.deltaX = locationPos.x - this.originPiont.x;
        this.deltaY = locationPos.y - this.originPiont.y;

        var dx: number = this.deltaX * this.deltaX;
        var dy: number = this.deltaY * this.deltaY;
        this.angle = Math.atan2(this.deltaX, this.deltaY) * 180 / Math.PI;
        if (this.angle < 0) this.angle += 360;

        this.angle = Math.round(this.angle);

        this.radians = Math.PI / 180 * this.angle;

        var r = this.width / 2;

        var x: number = Math.floor(Math.sin(this.radians) * r + this.originPiont.x);
        var y: number = Math.floor(Math.cos(this.radians) * r + this.originPiont.y);

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

    private onMouseOut(e: Laya.Event): void {
        if (e.touchId != this.mCurrentTouchId) return;
        this.isDown = false;
        this.visible = false;
        this.radians = this.angle = -1;
        this.mCurrentTouchId = -1;
        this.mIsMouseDown = false;

        if (this.mMouseUpCallback) {
            this.mMouseUpCallback();
        }
    }

    public setMoveCallback(downCallback: Function, moveCallback: Function, mouseUpCallback: Function): void {
        this.mMouseDownCallback = downCallback;
        this.mMouseMoveCallback = moveCallback;
        this.mMouseUpCallback = mouseUpCallback;
    }
}
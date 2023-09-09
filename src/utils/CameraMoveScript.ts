export default class CameraMoveScript extends Laya.Script3D {

    protected _tempVector3: Laya.Vector3 = new Laya.Vector3();
    protected lastMouseX: number;
    protected lastMouseY: number;
    protected yawPitchRoll: Laya.Vector3 = new Laya.Vector3();
    protected resultRotation: Laya.Quaternion = new Laya.Quaternion();
    protected tempRotationZ: Laya.Quaternion = new Laya.Quaternion();
    protected tempRotationX: Laya.Quaternion = new Laya.Quaternion();
    protected tempRotationY: Laya.Quaternion = new Laya.Quaternion();
    protected isMouseDown: Boolean;
    protected rotaionSpeed: number = 0.00006;
    protected camera: Laya.BaseCamera;
    protected scene: Laya.Scene3D;

    constructor() {
        super();
    }

    protected _updateRotation(): void {
        if (Math.abs(this.yawPitchRoll.y) < 1.50) {
            Laya.Quaternion.createFromYawPitchRoll(this.yawPitchRoll.x, this.yawPitchRoll.y, this.yawPitchRoll.z, this.tempRotationZ);
            this.tempRotationZ.cloneTo(this.camera.transform.localRotation);
            this.camera.transform.localRotation = this.camera.transform.localRotation;
        }
    }

    public onAwake(): void {
        Laya.stage.on(Laya.Event.RIGHT_MOUSE_DOWN, this, this.mouseDown);
        Laya.stage.on(Laya.Event.RIGHT_MOUSE_UP, this, this.mouseUp);
        //Laya.stage.on(Event.RIGHT_MOUSE_OUT, this, mouseOut);
        this.camera = this.owner as Laya.Camera;
    }

    public onUpdate(): void {
        var elapsedTime: number = Laya.timer.delta;
        if (!isNaN(this.lastMouseX) && !isNaN(this.lastMouseY) && this.isMouseDown) {
            var scene: Laya.Scene3D = this.owner.scene;
            Laya.KeyBoardManager.hasKeyDown(87) && this.moveForward(-0.01 * elapsedTime);//W
            Laya.KeyBoardManager.hasKeyDown(83) && this.moveForward(0.01 * elapsedTime);//S
            Laya.KeyBoardManager.hasKeyDown(65) && this.moveRight(-0.01 * elapsedTime);//A
            Laya.KeyBoardManager.hasKeyDown(68) && this.moveRight(0.01 * elapsedTime);//D
            Laya.KeyBoardManager.hasKeyDown(81) && this.moveVertical(0.01 * elapsedTime);//Q
            Laya.KeyBoardManager.hasKeyDown(69) && this.moveVertical(-0.01 * elapsedTime);//E

            var offsetX: number = Laya.stage.mouseX - this.lastMouseX;
            var offsetY: number = Laya.stage.mouseY - this.lastMouseY;

            var yprElem: Laya.Vector3 = this.yawPitchRoll;
            yprElem.x -= offsetX * this.rotaionSpeed * elapsedTime;
            yprElem.y -= offsetY * this.rotaionSpeed * elapsedTime;
            this._updateRotation();
        }
        this.lastMouseX = Laya.stage.mouseX;
        this.lastMouseY = Laya.stage.mouseY;
    }

    public onDestroy(): void {
        Laya.stage.off(Laya.Event.RIGHT_MOUSE_DOWN, this, this.mouseDown);
        Laya.stage.off(Laya.Event.RIGHT_MOUSE_UP, this, this.mouseUp);
    }

    protected mouseDown(e: Event): void {
        this.camera.transform.localRotation.getYawPitchRoll(this.yawPitchRoll);

        this.lastMouseX = Laya.stage.mouseX;
        this.lastMouseY = Laya.stage.mouseY;
        this.isMouseDown = true;
    }

    protected mouseUp(e: Event): void {
        this.isMouseDown = false;
    }

    protected mouseOut(e: Event): void {
        this.isMouseDown = false;
    }

    public moveForward(distance: number): void {
        this._tempVector3.x = this._tempVector3.y = 0;
        this._tempVector3.z = distance;
        this.camera.transform.translate(this._tempVector3);
    }

    public moveRight(distance: number): void {
        this._tempVector3.y = this._tempVector3.z = 0;
        this._tempVector3.x = distance;
        this.camera.transform.translate(this._tempVector3);
    }

    public moveVertical(distance: number): void {
        this._tempVector3.x = this._tempVector3.z = 0;
        this._tempVector3.y = distance;
        this.camera.transform.translate(this._tempVector3, false);
    }

}
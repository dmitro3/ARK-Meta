export default class BaseAni {

    protected mNode: Laya.Sprite3D;
    protected mIsUpdate: boolean;
    protected mCallback: Function;

    public onUpdate(): void {
    }

    public getNode(): Laya.Sprite3D {
        return this.mNode;
    }

    public forceComplete(): void {
    }
}
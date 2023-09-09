import MyGameConfig from "../../main/MyGameConfig";

export default class BaseState {

    protected mOwner: any;

    constructor(owner: any) {
        this.mOwner = owner;
    }

    get owner(): any {
        return this.owner;
    }

    public onEnter() {
    }

    public onUpdate() {
    }

    public onLeave() {
    }

    public getStateKey(): number {
        return MyGameConfig.STATE_INVALID;
    }
}
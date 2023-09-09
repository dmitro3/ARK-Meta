import BaseState from "./BaseState";

export default class StateMachine {

    private mCurMainStateScript: BaseState;

    private mStateMap: Map<number, BaseState> = new Map();

    get mainStateScript(): BaseState {
        return this.mCurMainStateScript;
    }

    public registerState(key: number, state: BaseState): void {
        this.mStateMap.set(key, state);
    }

    public getStateByKey(key: number): BaseState {
        return this.mStateMap.get(key);
    }

    public changeState(state: number): void {
        let stateScript: BaseState = this.mStateMap.get(state);

        if (this.mCurMainStateScript) {
            this.mCurMainStateScript.onLeave();
        }

        this.mCurMainStateScript = stateScript;

        stateScript.onEnter();
    }

    public update(): void {
        if (this.mCurMainStateScript) {
            this.mCurMainStateScript.onUpdate();
        }
    }

    public level(): void {
        this.mCurMainStateScript = null;
    }
}
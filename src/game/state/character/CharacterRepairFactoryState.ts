import DataManager from "../../../main/DataManager";
import MyGameConfig from "../../../main/MyGameConfig";
import EventUtils from "../../../utils/EventUtils";
import MathUtils from "../../../utils/MathUtils";
import UiUtils from "../../../utils/UiUtils";
import Vector3Utils from "../../../utils/Vector3Utils";
import CommonTipDialog from "../../dialog/CommonTipDialog";
import GameManager from "../../../main/GameManager";
import CharacterBaseState from "../CharacterBaseState";

export default class CharacterRepairFactoryState extends CharacterBaseState {

    private mCamera: Laya.Camera;

    constructor(owner: any) {
        super(owner);

        this.mPointPosition = this.getPoint(MyGameConfig.FUNCTION_ID_REPAIR_STATION).position;
        this.mNodeScene = this.getSceneNode(MyGameConfig.FUNCTION_ID_REPAIR_STATION);
        this.mCamera = this.mNodeScene.getChildByName("Main Camera") as Laya.Camera;
        this.addHandler();
    }

    private addHandler(): void {
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
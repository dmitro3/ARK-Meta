import DataManager from "../../../main/DataManager";
import MyGameConfig from "../../../main/MyGameConfig";
import PoolManager from "../../../main/PoolManager";
import EventUtils from "../../../utils/EventUtils";
import AudioManager from "../../../main/AudioManager";
import FunctionUnlockConfigInfo from "../../bean/config/FunctionUnlockConfigInfo";
import StoneConfigInfo from "../../bean/config/StoneConfigInfo";
import GameManager from "../../../main/GameManager";
import MapManager from "../../map/MapManager";
import SceneResManager from "../../SceneResManager";
import StoneCoreScript from "../../StoneCoreScript";
import CharacterBaseState from "../CharacterBaseState";
import MultiplePassOutlineMaterial from "../../../materials/MultiplePassOutlineMaterial";
import WalletUtils from "../../../utils/WalletUtils";

export default class CharacterSellState extends CharacterBaseState {

    private mNodeSellTargetPosition: Laya.Vector3;
    private mUpdateFrameIndex: number = 0;
    private mStartRadius: number;
    private mConfig: FunctionUnlockConfigInfo;

    private mPreGoldValue: number = 0;

    constructor(owner: any) {
        super(owner);

        this.mConfig = this.getPoint(MyGameConfig.FUNCTION_ID_SELL);
        this.mStartRadius = this.mConfig.radius;
        this.mPointPosition = this.mConfig.position;
        this.mNodeScene = this.getSceneNode(MyGameConfig.FUNCTION_ID_SELL);
        this.mNodeSellTargetPosition = (this.mNodeScene.getChildByName("node_sell_target") as Laya.Sprite3D).transform.position;
        let material = (this.mNodeScene as Laya.MeshSprite3D).meshRenderer.material as Laya.BlinnPhongMaterial;
    }

    public onEnter() {
        this.mUpdateFrameIndex = 0;
        this.mPreGoldValue = DataManager.getGoldValue();
    }

    public onUpdate() {
        this.mUpdateFrameIndex++;

        if (this.mUpdateFrameIndex % 2 == 0) {
            let arr = GameManager.instance.roleScript.popLayerStone();

            if (arr && arr.length > 0) {
                if (!GameManager.instance.isSellStatus) {
                    AudioManager.playSell();
                    WalletUtils.getInstance().send();
                }
                GameManager.instance.isSellStatus = true;
                let totalPrice: number = 0;

                for (let i = 0; i < arr.length; i++) {
                    let stoneInfo = arr[i];
                    let worldPosition = stoneInfo.node.transform.position.clone();

                    let script = SceneResManager.createCatchStone(GameManager.instance.scene3d, stoneInfo.type, worldPosition, stoneInfo.node.transform.rotationEuler, 0.7);
                    totalPrice += (MyGameConfig.stoneConfig[stoneInfo.type] as StoneConfigInfo).sellPrice;
                    script.sell(worldPosition, this.mNodeSellTargetPosition, false, (script: StoneCoreScript, args) => {
                    });

                    MapManager.instance.pushDestroyStatic(stoneInfo.node);
                }
                DataManager.addGoldValue(0);
                GameManager.instance.roleScript.saveDurable();
            } else {
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

    public onLeave() {
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
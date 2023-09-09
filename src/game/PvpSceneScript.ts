import { b2_commit } from "../../libs/box2d";
import GameManager from "../main/GameManager";
import MyGameConfig from "../main/MyGameConfig";
import PoolManager from "../main/PoolManager";
import AstarUtils from "../utils/AstarUtils";
import EventUtils from "../utils/EventUtils";
import MathUtils from "../utils/MathUtils";
import UiUtils from "../utils/UiUtils";
import Utils from "../utils/Utils";
import CommonTipDialog from "./dialog/CommonTipDialog";
import NextChildLoadingDialog from "./dialog/NextChildLoadingDialog";
import PvpDialog from "./dialog/PvpDIalog";
import PvpMapManager from "./map/PvpMapManager";
import RobotScript from "./role/RobotScript";
import SceneResManager from "./SceneResManager";
import { CharacterHaulPvpState } from "./state/character/CharacterHaulPvpState";

export default class PvpSceneScript extends Laya.Script3D {

    private mNode: Laya.Sprite3D;
    private mNextLoadingDialog: NextChildLoadingDialog;
    private mNodeTractor: Laya.Sprite3D;
    private mPrepareStart: number;
    private mRobotScript: RobotScript;
    private mPvpDialog: PvpDialog;
    private mRolePrePos: Laya.Vector3;
    private mPrePlayModel: number;

    onAwake(): void {
        this.mNode = this.owner as Laya.Sprite3D;
        this.mRobotScript = GameManager.instance.scene3d.getChildByName("node_robot").getComponent(RobotScript);
        this.addHandler();
    }

    private addHandler(): void {
        EventUtils.onEvent(this, MyGameConfig.EVENT_PVP_PREPARE, (status: number) => {
            if (status == 0) {
                this.mRolePrePos = GameManager.instance.roleScript.getNode().transform.position.clone();
                this.mPrePlayModel = GameManager.instance.roleScript.getPlayModel();
                this.mNode.destroyChildren();
                this.mPrepareStart = 0;
                PvpMapManager.instance.createMap(() => {
                    this.prepare();
                });
                let carIndex: number = MathUtils.nextInt(0, Object.keys(MyGameConfig.carConfig).length - 1);
                let curIndex: number = 0;
                let carId: string;

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
            } else if (status == 1) {
                this.mNextLoadingDialog = new NextChildLoadingDialog(() => {
                    SceneResManager.createSky(GameManager.instance.scene3d.getChildByName("node_sky") as Laya.Sprite3D,
                        "node_sky1.lh", () => {
                            this.prepare();
                        });
                }, 3000);
                UiUtils.addChild(this.mNextLoadingDialog);
            } else if (status == 2) {
                this.prepare();
            } else if (status == 3) {
                this.mNextLoadingDialog = new NextChildLoadingDialog(() => {
                });
                UiUtils.addChild(this.mNextLoadingDialog);
            } else if (status == 4) {
                let newPosition = GameManager.instance.roleScript.getNodeRole().transform.position;
                let tractorPosition = this.mNodeTractor.transform.position;
                newPosition.x = this.mRolePrePos.x;
                newPosition.z = this.mRolePrePos.z;
                GameManager.instance.roleScript.getNodeRole().transform.position = newPosition;

                (GameManager.instance.roleScript.getMainStateScript() as CharacterHaulPvpState)
                    .getNodeTractor().transform.position = new Laya.Vector3(newPosition.x, tractorPosition.y, newPosition.z);
                (GameManager.instance.roleScript.getMainStateScript() as CharacterHaulPvpState).setUpdate(true);

                let posCamera = (GameManager.instance.roleScript.getCamera().parent as Laya.Camera).transform.position as Laya.Vector3;
                posCamera.x = newPosition.x;
                posCamera.z = newPosition.z;
                (GameManager.instance.roleScript.getCamera().parent as Laya.Camera).transform.position = posCamera;
                this.mNextLoadingDialog.hide();

                GameManager.instance.roleScript.setPlayModel(this.mPrePlayModel);
                PvpMapManager.instance.clearAll();
                this.mNode.destroyChildren();
                Laya.Resource.destroyUnusedResources();
                this.mRobotScript.getNodeRole().transform.position = new Laya.Vector3(200, 0, 0);
            }
        });

        EventUtils.onEvent(this, MyGameConfig.EVENT_PVP_END, (b: boolean) => {
            GameManager.instance.roleScript.stopMove();
            this.mRobotScript.stopMove();

            let content;

            if (b) {
                content = "You Win";
            } else {
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

    private prepare(): void {
        this.mPrepareStart++;

        if (this.mPrepareStart == 3) {
            this.mNextLoadingDialog.hide();
            let newPosition = GameManager.instance.roleScript.getNodeRole().transform.position.clone() as Laya.Vector3;
            this.mNodeTractor = (GameManager.instance.roleScript.getMainStateScript() as CharacterHaulPvpState).getNodeTractor();
            let tractorPosition = this.mNodeTractor.transform.position.clone();
            let posSelf = PvpMapManager.instance.birthArr[0];
            newPosition.x = posSelf.x;
            newPosition.z = posSelf.z;
            GameManager.instance.roleScript.getNodeRole().transform.position = newPosition;
            this.mNodeTractor.transform.position = new Laya.Vector3(posSelf.x, tractorPosition.y, posSelf.z);
            (GameManager.instance.roleScript.getMainStateScript() as CharacterHaulPvpState).setUpdate(true);
            let posCamera = (GameManager.instance.roleScript.getCamera().parent as Laya.Camera).transform.position.clone() as Laya.Vector3;
            posCamera.x = posSelf.x;
            posCamera.z = posSelf.z;
            (GameManager.instance.roleScript.getCamera().parent as Laya.Camera).transform.position = posCamera;

            // 创建机器人
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

    private countDown(): void {

    }
}
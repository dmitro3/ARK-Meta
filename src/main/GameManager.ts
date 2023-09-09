import LoadingResDialog from "../loading/LoadingResDialog";
import DataManager from "./DataManager";
import MyGameConfig from "./MyGameConfig";
import PoolManager from "./PoolManager";
import EventUtils from "../utils/EventUtils";
import MathUtils from "../utils/MathUtils";
import RoleScript from "../game/RoleScript";
import MainViewDialog from "../game/dialog/MainViewDialog";

export default class GameManager {

    private static mInstance: GameManager;

    public scene3d: Laya.Scene3D;

    public mainIsland: Laya.Sprite3D;

    public curChildIsland: Laya.Sprite3D;

    public isPause: boolean = false;

    public isControl: boolean = false;

    public roleScript: RoleScript;

    public functionPointArr: Laya.Sprite3D[] = [];

    public curLevel: number;

    public isSellStatus: boolean;

    private mCurTime: number;

    public mainViewDialog: MainViewDialog;

    private mTimerDelta:number = 0;

    public static get instance(): GameManager {
        if (!this.mInstance) {
            this.mInstance = new GameManager();
        }

        return this.mInstance;
    }

    public init(): void {
        this.mCurTime = new Date().getTime();

        Laya.timer.frameLoop(1, this, () => {
            this.mCurTime += Laya.timer.delta;

            this.mTimerDelta = Laya.timer.delta;

            if (this.mTimerDelta > 45) {
                this.mTimerDelta = 45;
            }
        });
    }

    public get timerDelta(): number {
        if (this.isPause) {
            return 0;
        }

        return this.mTimerDelta;
    }

    public get curTime(): number {
        return this.mCurTime;
    }

    public receivePrize(rewardArr: any[]): void {
        for (let i = 0; i < rewardArr.length; i++) {
            let rewaedInfo = rewardArr[i];
            let num = rewaedInfo.num;

            switch (rewaedInfo.type) {
                case MyGameConfig.REWARD_TYPE_GOLD:
                    DataManager.addGoldValue(num)
                    break;
                case MyGameConfig.REWARD_TYPE_CRYSTAL:
                    DataManager.addCrystalValue(num);
                    break;
            }
        }
    }

    public showTipMapAni(): void {
        let b = DataManager.isTipMap();

        if (!b) {
            GameManager.instance.isControl = false;
            GameManager.instance.roleScript.stopMove();
            let camera = GameManager.instance.roleScript.getCamera();
            let cameraPosition = camera.transform.position.clone();
            let targetPos = new Laya.Vector3(0, cameraPosition.y, 30);
            let distance = Laya.Vector3.distance(cameraPosition, targetPos);

            let tempPosition = camera.transform.position;

            Laya.Tween.to(tempPosition, {
                x: targetPos.x,
                y: targetPos.y,
                z: targetPos.z,
                update: new Laya.Handler(this, () => {
                    camera.transform.position = tempPosition;
                })
            }, distance * 100, null, Laya.Handler.create(this, () => {
                Laya.timer.once(1000, this, () => {
                    Laya.Tween.to(tempPosition, {
                        x: cameraPosition.x,
                        y: cameraPosition.y,
                        z: cameraPosition.z,
                        update: new Laya.Handler(this, () => {
                            camera.transform.position = tempPosition;
                        })
                    }, distance * 100, null, Laya.Handler.create(this, () => {
                        GameManager.instance.isControl = true;
                        DataManager.setTipMap(true);
                    }));
                });
            }));
        }
    }

    public createGoods(): void {
        Laya.timer.clear(this, this.createGoodsCallback);

        let maxCapacity = MyGameConfig.gameConfig.rewardMax;
        let time = MyGameConfig.gameConfig.rewardTime;

        Laya.timer.loop(time, this, this.createGoodsCallback, [maxCapacity]);
    }

    private createGoodsCallback(maxCapacity: number): void {
        let factoryGoodsNum = DataManager.getRewardGoods();

        if (factoryGoodsNum < maxCapacity) {
            EventUtils.dispatchEvent(MyGameConfig.EVENT_REFRESH_PRODUCT, DataManager.addRewardGoods());
        }
    }

    public toFixed(num: number): number {
        return MathUtils.toFixed(num, 0);
    }

    public pauseAll(): void {
        this.isControl = false;
        this.isPause = true;
        Laya.timer.pause();
    }

    public resumeAll(): void {
        this.isControl = true;
        this.isPause = false;
        Laya.timer.resume();
    }

    public clearAll(): void {
        this.curChildIsland = null;
        PoolManager.clearAll();
    }
}
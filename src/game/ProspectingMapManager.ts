import MyGameConfig from "../main/MyGameConfig";
import EventUtils from "../utils/EventUtils";
import MathUtils from "../utils/MathUtils";
import UiUtils from "../utils/UiUtils";
import RotateAniScript from "./ani/RotateAniScript";
import LevelConfigInfo from "./bean/config/LevelConfigInfo";
import GameManager from "../main/GameManager";
import MineralScript from "./MineralScript";
import SceneResManager from "./SceneResManager";

export default class ProspectingMapManager {

    private static mInstance: ProspectingMapManager;

    private mCurChildIsland: Laya.Sprite3D;

    private mProspectedCrystalScriptArr: MineralScript[] = [];

    private mCrystalAreaArr: any[];

    private mCreatedCrystalNum: number = 0;

    private mCatchCrystalNum: number = 0;

    private mCrystalMap: any = {};

    public static get instance(): ProspectingMapManager {
        if (!this.mInstance) {
            this.mInstance = new ProspectingMapManager();
        }

        return this.mInstance;
    }

    public createMap(level: number, callback: Function): void {

        UiUtils.loadJson(MyGameConfig.URL_CONFIG + "prospecting/" + MyGameConfig.levelConfig[level].configName, (json) => {
            let res3dArr = [
                MyGameConfig.URL_RES3D_FIRST + "node_crystal2.lh",
            ];

            let childIslandConfigInfo = MyGameConfig.levelConfig[level] as LevelConfigInfo;

            res3dArr.push(MyGameConfig.URL_RES3D_ISLAND + childIslandConfigInfo.modelName);
            res3dArr.push(MyGameConfig.URL_RES3D_SKY + childIslandConfigInfo.skyName);

            Laya.loader.create(res3dArr, new Laya.Handler(this, () => {
                this.mCurChildIsland = Laya.loader.getRes(MyGameConfig.URL_RES3D_ISLAND + childIslandConfigInfo.modelName) as Laya.Sprite3D;
                GameManager.instance.scene3d.addChild(this.mCurChildIsland);

                GameManager.instance.curChildIsland = this.mCurChildIsland;
                this.mCurChildIsland.transform.position = new Laya.Vector3(0, 0, -70);

                this.mCrystalAreaArr = json["area"];

                for (let i = 0; i < 5; i++) {
                    this.createCrystal();
                }

                callback(this.mCurChildIsland);
            }));
        });
    }

    private createCrystal(): void {
        let areaRange = this.mCrystalAreaArr[MathUtils.nextInt(0, this.mCrystalAreaArr.length - 1)];
        let position = new Laya.Vector3(
            MathUtils.nextFloat(areaRange.x[0] + 0.4, areaRange.x[1] - 0.4),
            0,
            MathUtils.nextFloat(areaRange.z[0] + 0.4, areaRange.z[1] - 0.4));

        let floorX = Math.floor(position.x);
        let floorZ = Math.floor(position.z);

        if (this.mCrystalMap[floorX + "" + floorZ]) {
            this.createCrystal();
            return;
        }

        this.mProspectedCrystalScriptArr.push(SceneResManager.createMineral(this.mCurChildIsland, position));
        this.mCreatedCrystalNum++;
    }

    public catchCrystal(): void {
        for (let i = 0; i < this.mProspectedCrystalScriptArr.length; i++) {
            let script = this.mProspectedCrystalScriptArr[i];
            let distance = Laya.Vector3.distance(script.getPosition(), GameManager.instance.roleScript.getRollerScript().getPosition());

            if (!script.isCatch() && distance < MyGameConfig.gameConfig.surveyRadius) {
                let floorX = script.getPosition().x;
                let floorZ = script.getPosition().z;

                this.mCrystalMap[floorX + "" + floorZ] = null;

                script.catch();

                this.mCatchCrystalNum++;

                if (this.mCreatedCrystalNum < MyGameConfig.levelConfig[GameManager.instance.curLevel].crystalNum) {
                    this.createCrystal();
                } else if (this.mCatchCrystalNum == MyGameConfig.levelConfig[GameManager.instance.curLevel].crystalNum) {
                    EventUtils.dispatchEvent(MyGameConfig.EVENT_PROSPECTING_END, "");
                }
            }
        }
    }

    public surveyCrystal(): void {
        for (let i = 0; i < this.mProspectedCrystalScriptArr.length; i++) {
            let script = this.mProspectedCrystalScriptArr[i];
            let distance = Laya.Vector3.distance(script.getPosition(), GameManager.instance.roleScript.getPosition());

            if (!script.isCatch() && distance < MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_CRYSTAL_DETECTOR].range) {
                script.show();
            } else {
                script.hide();
            }
        }
    }

    public checkMap(): void {
    }

    public clear(): void {
        this.mProspectedCrystalScriptArr = [];
        this.mCrystalAreaArr = [];
        this.mCreatedCrystalNum = 0;
        this.mCatchCrystalNum = 0;
        this.mCrystalMap = {};
    }
}
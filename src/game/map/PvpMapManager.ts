import GameManager from "../../main/GameManager";
import MyGameConfig from "../../main/MyGameConfig";
import UiUtils from "../../utils/UiUtils";
import Utils from "../../utils/Utils";
import LevelConfigInfo from "../bean/config/LevelConfigInfo";
import StoneConfigInfo from "../bean/config/StoneConfigInfo";
import GridInfo from "../bean/game/GridInfo";
import BaseMapManager from "./BaseMapManager";
import AstarUtils from "../../utils/AstarUtils";
import BaseRoleScript from "../role/BaseRoleScript";
import BaseStrategyScript from "../pvp/BaseStrategyScript";
import StrategyWinScript1 from "../pvp/win/StrategyWinScript1";
import StrategyFailScript1 from "../pvp/fail/StrategyFailScript1";
import MathUtils from "../../utils/MathUtils";
import StrategyScriManager from "../pvp/StrategyScriManager";
import DataManager from "../../main/DataManager";

export default class PvpMapManager extends BaseMapManager {

    private static mInstance: PvpMapManager;

    private mBirthArr: Laya.Vector3[] = [];

    private mStoneCountArr: any[] = [];

    private mSizeOffsetX: any;

    private mSizeOffsetZ: any;

    private mIslandOffsetX: number;

    public static get instance(): PvpMapManager {
        if (!this.mInstance) {
            this.mInstance = new PvpMapManager();
        }

        return this.mInstance;
    }

    public init(): void {
        super.init();
        this.mIsPvp = true;
    }

    public createMap(callback: Function) {
        this.mMap = {};
        this.curIslandTotalCatchStoneCore = 0;
        this.curIslandTotalCatchStone = 0;

        StrategyScriManager.instance.randomResult();

        let levelSpikeNum = DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_SPIKE_NUM);
        let levelSpikeCircleNum = DataManager.getLevelByKey(MyGameConfig.KEY_DATA_LEVEL_SPIKE_NUM);
        let levelSpikeSize = DataManager.getLevelByKey(MyGameConfig.KEY_DAY_LEVEL_SPIKE_SIZE);
        let totalLevel = levelSpikeNum + levelSpikeCircleNum + levelSpikeSize;
        let level = 0;

        if (totalLevel < 15) {
            level = 0;
        } else if (totalLevel < 30) {
            level = 1;
        } else {
            level = 2;
        }

        UiUtils.loadJson(MyGameConfig.URL_CONFIG + "pvp/" + MyGameConfig.pvpLevelConfig[level].configName, (json) => {
            let res3dArr = [];
            let stoneArr = json["stone"];
            let birthArr = json["birth"];
            let min = json["min"];
            let size = json["size"];
            this.mSizeOffsetX = -min.x;
            this.mSizeOffsetZ = -min.z;
            this.mIslandOffsetX = (GameManager.instance.scene3d.getChildByName("node_pvp") as Laya.Sprite3D).transform.position.x;

            for (let i = 0; i < birthArr.length; i++) {
                let pos = birthArr[i].pos;
                this.mBirthArr.push(new Laya.Vector3(this.mIslandOffsetX + pos.x, 0, pos.z));
            }

            Utils.shuffleArr(this.mBirthArr);

            for (let key in json["useStone"]) {
                let stoneConfig = MyGameConfig.stoneConfig[key] as StoneConfigInfo;

                res3dArr.push(MyGameConfig.URL_RES3D_STONE + stoneConfig.stoneModel);
                res3dArr.push(MyGameConfig.URL_RES3D_STONE + stoneConfig.stoneCurveModel);
                res3dArr.push(MyGameConfig.URL_RES3D_STONE + stoneConfig.stoneFloorModel);
                res3dArr.push(MyGameConfig.URL_RES3D_STONE + stoneConfig.stoneCatchModel);
            }

            let childIslandConfigInfo = MyGameConfig.pvpLevelConfig[level] as LevelConfigInfo;

            res3dArr.push(MyGameConfig.URL_RES3D_ISLAND + childIslandConfigInfo.modelName);

            Laya.loader.create(res3dArr, new Laya.Handler(this, () => {
                this.mCurChildIsland = Laya.loader.getRes(MyGameConfig.URL_RES3D_ISLAND + childIslandConfigInfo.modelName).clone() as Laya.Sprite3D;
                GameManager.instance.scene3d.addChild(this.mCurChildIsland);

                this.mCurChildIsland.transform.position = new Laya.Vector3(this.mIslandOffsetX, 0, 0);

                for (let key in json["useStone"]) {
                    let stoneConfig = MyGameConfig.stoneConfig[key] as StoneConfigInfo;
                    let nodeStone = Laya.loader.getRes(MyGameConfig.URL_RES3D_STONE + stoneConfig.stoneModel);
                    let nodeCurveStone = Laya.loader.getRes(MyGameConfig.URL_RES3D_STONE + stoneConfig.stoneCurveModel);

                    this.generateCubeUvs(stoneConfig.type, nodeStone);
                    this.generateCurveUvs(stoneConfig.type, nodeCurveStone);
                }

                let stoneCoreWidth = 1 / MyGameConfig.gameConfig.stoneCoreComposeStone;
                let tempInfoArr: any[] = [];

                for (let i = 0; i < stoneArr.length; i++) {
                    let stoneConfigInfo = stoneArr[i];
                    let scale = stoneConfigInfo.scale;
                    let startPos = stoneConfigInfo.pos;
                    let type = stoneConfigInfo.name;

                    for (let j = 0; j < scale.x; j++) {
                        for (let k = 0; k < scale.z; k++) {
                            // let height = stoneConfigInfo.heightArr[j][k];

                            tempInfoArr.push({ scale: scale, startPos: startPos, type: type, pos: new Laya.Vector3(startPos.x + j, 0, startPos.z - k), height: 1 });

                            this.curIslandTotalCatchStoneCore += 16;
                            this.curIslandTotalCatchStone += (16 / MyGameConfig.gameConfig.stoneCoreComposeStone);
                        }
                    }
                }

                let index: number = 0;
                let createNum = 40;
                let self = this;

                Laya.timer.frameLoop(1, this, function s() {
                    if (index >= tempInfoArr.length - 1) {
                        Laya.timer.clear(self, s);
                        let birthArr = json["birth"];
                        let crystalArr = json["crystal"];

                        for (let i = 0; i < birthArr.length; i++) {
                            AstarUtils.addMap(birthArr[i].pos.x + self.mSizeOffsetX, -(birthArr[i].pos.z + self.mSizeOffsetZ), size.x);
                        }

                        for (let i = 0; i < crystalArr.length; i++) {
                            let info = crystalArr[i];
                            let pos = info.pos;

                            for (let j = 0; j < info.scale.z; j++) {
                                for (let k = 0; k < info.scale.x; k++) {
                                    AstarUtils.addMap(pos.x + k + self.mSizeOffsetX, -(pos.z + j + self.mSizeOffsetZ), size.x);
                                }
                            }
                        }
                        AstarUtils.create();
                    }

                    let renderableSprite3Ds: any[] = [];

                    for (let i = index; i < tempInfoArr.length && i < index + createNum; i++) {
                        let info = tempInfoArr[i];

                        let pos = info.pos;
                        info.height = 0.7;
                        let height = info.height;
                        let type = info.type;
                        let gridInfo: GridInfo = self.createGride(pos.x, pos.z);
                        let obj: any = {};
                        obj.height = height;
                        obj.type = type;
                        obj.stonePointArr = [];

                        let cubeVerticeArr = JSON.parse(JSON.stringify(self.mCubeVerticeArr));

                        for (let q = 0; q < cubeVerticeArr.length / 3; q++) {
                            cubeVerticeArr[q * 3 + 0] += pos.x;
                            cubeVerticeArr[q * 3 + 1] = height;
                            cubeVerticeArr[q * 3 + 2] += pos.z;
                        }

                        let nodeStone = self.createMesh(type, cubeVerticeArr, self.mCubeIndicesArr, pos.x, pos.z);

                        obj.node = nodeStone;
                        obj.stonePointArr[0] = [];

                        let leftUpPoint = { X: GameManager.instance.toFixed(pos.x * MyGameConfig.POSITION_SCALE), Y: GameManager.instance.toFixed((pos.z - 1) * MyGameConfig.POSITION_SCALE) };
                        let rightUpPoint = { X: GameManager.instance.toFixed((pos.x + 1) * MyGameConfig.POSITION_SCALE), Y: GameManager.instance.toFixed((pos.z - 1) * MyGameConfig.POSITION_SCALE) };
                        let rightDownPoint = { X: GameManager.instance.toFixed((pos.x + 1) * MyGameConfig.POSITION_SCALE), Y: GameManager.instance.toFixed(pos.z * MyGameConfig.POSITION_SCALE) };
                        let leftDownPoint = { X: GameManager.instance.toFixed(pos.x * MyGameConfig.POSITION_SCALE), Y: GameManager.instance.toFixed(pos.z * MyGameConfig.POSITION_SCALE) };

                        obj.stonePointArr[0].push(leftUpPoint);
                        obj.stonePointArr[0].push(rightUpPoint);
                        obj.stonePointArr[0].push(rightDownPoint);
                        obj.stonePointArr[0].push(leftDownPoint);

                        let preLength = gridInfo.stoneCoreArr.length;

                        for (let q = preLength; q < preLength + 4; q++) {
                            for (let t = 0; t < 4; t++) {
                                gridInfo.stoneCoreArr.push({ type: type, pos: new Laya.Vector3(pos.x + stoneCoreWidth / 2 + q * stoneCoreWidth + this.mIslandOffsetX, 0, pos.z - stoneCoreWidth / 2 - stoneCoreWidth * t) });
                            }
                        }

                        gridInfo.stoneInfoArr.push(obj);

                        self.mCurChildIsland.addChild(nodeStone);

                        renderableSprite3Ds.push(nodeStone);

                        let aStartX = pos.x + self.mSizeOffsetX;
                        let aStartZ = -(pos.z + self.mSizeOffsetZ);
                        AstarUtils.addMap(aStartX, aStartZ, size.x);

                        if (!self.mStoneCountArr[aStartZ]) {
                            self.mStoneCountArr[aStartZ] = new Array();
                        }
                        self.mStoneCountArr[aStartZ].push({ "x": aStartX, "z": aStartZ });
                    }

                    Laya.StaticBatchManager.combine(self.mCurChildIsland, renderableSprite3Ds);

                    index += createNum;
                });

                callback(this.mCurChildIsland);
            }));
        });
    }

    protected catchStoneCore(info: any, gridInfo: GridInfo, roleScript: BaseRoleScript): void {
        StrategyScriManager.instance.check(roleScript.isSelf(), roleScript.getRollerScript().getPosition());
    }

    protected clearedGrid(gridInfo: GridInfo): void {
        let aStartX = gridInfo.x + this.mSizeOffsetX;
        let aStartZ = -(gridInfo.z + this.mSizeOffsetZ);

        for (let i = 0; i < this.mStoneCountArr.length; i++) {
            if (this.mStoneCountArr[i].length > 0) {
                if (this.mStoneCountArr[i][0].z == aStartZ) {
                    if (this.mStoneCountArr[i].length == 1) {
                        this.mStoneCountArr[i] = [];

                        return;
                    } else {
                        let newArr = [];

                        for (let j = 0; j < this.mStoneCountArr[i].length; j++) {
                            let info = this.mStoneCountArr[i][j];

                            if (info.x != aStartX) {
                                newArr.push(info);
                            }
                        }

                        this.mStoneCountArr[i] = newArr;
                    }
                }
            }
        }
    }

    public aStarInfo2GridInfo(astarInfo: any): GridInfo {
        let posX = astarInfo.x - this.mSizeOffsetX;
        let posZ = -astarInfo.z - this.mSizeOffsetZ;

        let gridInfo = this.createGride(Math.floor(posX), Math.floor(posZ));

        return gridInfo;
    }

    public get birthArr(): Laya.Vector3[] {
        return this.mBirthArr;
    }

    public get stoneCountArr(): any[] {
        return this.mStoneCountArr;
    }

    public get sizeOffsetX(): number {
        return this.mSizeOffsetX;
    }

    public get sizeOffsetZ(): number {
        return this.mSizeOffsetZ;
    }

    public get islandOffsetX(): number {
        return this.mIslandOffsetX;
    }

    public clearAll(): void {
        super.clearAll();
        this.mBirthArr = [];
        this.mStoneCountArr = [];
        StrategyScriManager.instance.clear();
        AstarUtils.clearAll();
        if (this.mCurChildIsland) {
            this.mCurChildIsland.destroy(true);
        }
        this.mCurChildIsland = null;
    }
}
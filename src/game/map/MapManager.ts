import DataManager from "../../main/DataManager";
import MyGameConfig from "../../main/MyGameConfig";
import PoolManager from "../../main/PoolManager";
import SdkCenter from "../../sdk/SdkCenter";
import MathUtils from "../../utils/MathUtils";
import UiUtils from "../../utils/UiUtils";
import RotateAniScript from "../ani/RotateAniScript";
import LevelConfigInfo from "../bean/config/LevelConfigInfo";
import StoneConfigInfo from "../bean/config/StoneConfigInfo";
import CubeUvs from "../bean/game/CubeUvs";
import CurveUvs from "../bean/game/CurveUvs";
import GridInfo from "../bean/game/GridInfo";
import SaveGridInfo from "../bean/game/SaveGridInfo";
import CrystalScript from "../CrystalScript";
import GetDesigndiagram from "../dialog/GetDesigndiagramDialog";
import GameManager from "../../main/GameManager";
import SceneResManager from "../SceneResManager";
import StoneCoreScript from "../StoneCoreScript";
import BaseMapManager from "./BaseMapManager";
import BaseRoleScript from "../role/BaseRoleScript";

export default class MapManager extends BaseMapManager {

    private static mInstance: MapManager;

    public mCreatedOreNum: number = 0;

    public mCurCrystalArr: any[] = [];

    private mRenderContainerContainer: Laya.RenderableSprite3D[] = [];

    private mRenderContainerDestroyArr: Laya.Sprite3D[] = [];

    public static get instance(): MapManager {
        if (!this.mInstance) {
            this.mInstance = new MapManager();
        }

        return this.mInstance;
    }

    public init(): void {
        super.init();
        this.mIsPvp = false;
    }

    public start(): void {
        Laya.timer.frameLoop(200, this, () => {
            this.destroyNode();

            let render = [];

            for (let kej in this.mRenderableSprite3Ds) {
                let stoneInfoArr = this.mRenderableSprite3Ds[kej];

                for (let i = 0; i < stoneInfoArr.length; i++) {
                    if (!stoneInfoArr[i].node.destroyed) {
                        render.push(stoneInfoArr[i].node);
                    }
                }
            }

            this.mRenderableSprite3Ds = {};

            if (render.length > 0) {
                Laya.StaticBatchManager.combine(this.mCurChildIsland, render);
            }

            this.mRenderContainerContainer = [];
        });
    }

    public createMap(level: number, callback: Function) {
        this.mMap = {};
        this.curIslandTotalCatchStoneCore = 0;
        this.curIslandTotalCatchStone = 0;

        UiUtils.loadJson(MyGameConfig.URL_CONFIG + "level/" + MyGameConfig.levelConfig[level].configName, (json) => {
            let res3dArr = [];
            let stoneArr = json["stone"];

            for (let key in json["useStone"]) {
                let stoneConfig = MyGameConfig.stoneConfig[key] as StoneConfigInfo;

                res3dArr.push(MyGameConfig.URL_RES3D_STONE + stoneConfig.stoneModel);
                res3dArr.push(MyGameConfig.URL_RES3D_STONE + stoneConfig.stoneCurveModel);
                res3dArr.push(MyGameConfig.URL_RES3D_STONE + stoneConfig.stoneFloorModel);
                res3dArr.push(MyGameConfig.URL_RES3D_STONE + stoneConfig.stoneCatchModel);
            }

            let childIslandConfigInfo = MyGameConfig.levelConfig[level] as LevelConfigInfo;

            res3dArr.push(MyGameConfig.URL_RES3D_ISLAND + childIslandConfigInfo.modelName);

            Laya.loader.create(res3dArr, new Laya.Handler(this, () => {
                this.mCurChildIsland = Laya.loader.getRes(MyGameConfig.URL_RES3D_ISLAND + childIslandConfigInfo.modelName).clone() as Laya.Sprite3D;
                GameManager.instance.scene3d.addChild(this.mCurChildIsland);

                GameManager.instance.curChildIsland = this.mCurChildIsland;
                this.mCurChildIsland.transform.position = new Laya.Vector3(0, 0, -70);

                let totalStoneCount: number = 0;

                for (let key in json["useStone"]) {
                    totalStoneCount += json["useStone"][key];
                }

                for (let key in json["useStone"]) {
                    let stoneConfig = MyGameConfig.stoneConfig[key] as StoneConfigInfo;
                    let nodeStone = Laya.loader.getRes(MyGameConfig.URL_RES3D_STONE + stoneConfig.stoneModel);
                    let nodeCurveStone = Laya.loader.getRes(MyGameConfig.URL_RES3D_STONE + stoneConfig.stoneCurveModel);

                    this.generateCubeUvs(stoneConfig.type, nodeStone);
                    this.generateCurveUvs(stoneConfig.type, nodeCurveStone);
                    stoneConfig.loss = childIslandConfigInfo.costDurable / totalStoneCount / 16;
                }

                let stoneCoreWidth = 1 / MyGameConfig.gameConfig.stoneCoreComposeStone;
                let savaData = DataManager.getMapData();

                let tempInfoArr: any[] = [];

                for (let i = 0; i < stoneArr.length; i++) {
                    let stoneConfigInfo = stoneArr[i];
                    let scale = stoneConfigInfo.scale;
                    let startPos = stoneConfigInfo.pos;
                    let type = stoneConfigInfo.name;

                    for (let j = 0; j < scale.x; j++) {
                        for (let k = 0; k < scale.z; k++) {
                            tempInfoArr.push({ scale: scale, startPos: startPos, type: type, pos: new Laya.Vector3(startPos.x + j, 0, startPos.z - k), height: 1 });

                            this.curIslandTotalCatchStoneCore += 16;
                            this.curIslandTotalCatchStone += (16 / MyGameConfig.gameConfig.stoneCoreComposeStone);
                        }
                    }
                }

                this.mCurCrystalArr = json["crystal"];

                let index: number = 0;
                let createNum = 40;

                Laya.timer.frameLoop(1, this, function s() {
                    if (index >= tempInfoArr.length - 1) {
                        Laya.timer.clear(this, s);
                    }

                    let renderableSprite3Ds: any[] = [];

                    for (let i = index; i < tempInfoArr.length && i < index + createNum; i++) {
                        let info = tempInfoArr[i];

                        let pos = info.pos;
                        info.height = 0.7;
                        let height = info.height;
                        let type = info.type;
                        let gridInfo: GridInfo = this.createGride(pos.x, pos.z);
                        let obj: any = {};
                        obj.height = height;
                        obj.type = type;
                        obj.stonePointArr = [];

                        if (savaData[pos.x + "" + pos.z]) {
                        } else {
                            let cubeVerticeArr = JSON.parse(JSON.stringify(this.mCubeVerticeArr));

                            for (let q = 0; q < cubeVerticeArr.length / 3; q++) {
                                cubeVerticeArr[q * 3 + 0] += pos.x;
                                cubeVerticeArr[q * 3 + 1] = height;
                                cubeVerticeArr[q * 3 + 2] += pos.z;
                            }

                            let nodeStone = this.createMesh(type, cubeVerticeArr, this.mCubeIndicesArr, pos.x, pos.z);

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

                            // 创建石头核心
                            for (let q = preLength; q < preLength + 4; q++) {
                                for (let t = 0; t < 4; t++) {
                                    gridInfo.stoneCoreArr.push({ type: type, pos: new Laya.Vector3(pos.x + stoneCoreWidth / 2 + q * stoneCoreWidth, 0, pos.z - stoneCoreWidth / 2 - stoneCoreWidth * t) });
                                }
                            }

                            gridInfo.stoneInfoArr.push(obj);

                            this.mCurChildIsland.addChild(nodeStone);

                            renderableSprite3Ds.push(nodeStone);
                        }
                    }

                    Laya.StaticBatchManager.combine(this.mCurChildIsland, renderableSprite3Ds);

                    index += createNum;
                });

                callback(this.mCurChildIsland);
            }));
        });
    }

    public circleBoom(position: Laya.Vector3): void {
        let radius = MyGameConfig.factoryGoodsConfig[MyGameConfig.PROPS_EXPLOSIVE].range;

        let startX = Math.floor(position.x - radius);
        let endX = Math.ceil(position.x + radius);
        let startZ = Math.floor(position.z - radius);
        let endZ = Math.ceil(position.z + radius);

        let clipPaths = [];
        let percentRadian = 2 * Math.PI / 16;

        clipPaths[0] = new Array();

        for (let i = 0; i < 16; i++) {
            let x = Math.cos(i * percentRadian) * radius + position.x;
            let y = Math.sin(i * percentRadian) * radius + position.z;

            clipPaths[0].push({ X: GameManager.instance.toFixed(x * MyGameConfig.POSITION_SCALE), Y: GameManager.instance.toFixed(y * MyGameConfig.POSITION_SCALE) });
        }

        SceneResManager.playEffectBoom(position);

        for (let i = startX; i <= endX; i++) {
            for (let j = startZ; j <= endZ; j++) {
                let gridInfo = this.mMap[i + "" + j] as GridInfo;

                if (gridInfo) {
                    this.cutMesh(gridInfo, null, clipPaths, MyGameConfig.POSITION_SCALE);

                    let tempStoneCoreArr = [];
                    let saveTempStoneCoreArr = [];

                    for (let q = 0; q < gridInfo.stoneCoreArr.length; q++) {
                        let info = gridInfo.stoneCoreArr[q];
                        let distance = Laya.Vector3.distance(info.pos, position);

                        if (distance < radius) {
                            GameManager.instance.roleScript.catchStoneCoreCreateStone(info, gridInfo);
                        } else {
                            tempStoneCoreArr.push(info);
                            saveTempStoneCoreArr.push({ x: info.pos.x, z: info.pos.z });
                        }
                    }

                    gridInfo.stoneCoreArr = tempStoneCoreArr;
                }
            }
        }
    }

    public createFloorStone(info: any, gridInfo?: GridInfo): void {
        if (!gridInfo) {
            let floorX = Math.floor(info.pos.x);
            let floorZ = Math.floor(info.pos.z);

            gridInfo = this.createGride(floorX, floorZ);
        }

        if (gridInfo.crushedStoneArr.length == 0) {
            let script: StoneCoreScript = SceneResManager.createCrushedStone(this.mCurChildIsland, info.type, new Laya.Vector3(info.pos.x, 0, info.pos.z), GameManager.instance.roleScript.getNodeRole().transform.rotationEuler);
            let obj = { type: info.type, node: script.getNode(), pos: info.pos, num: 1 };

            script.jump(info.pos, obj, (script: StoneCoreScript, data) => {
                PoolManager.recover(script.getNode().name, script.getNode());

                let newNode = SceneResManager.createStaticCrushedStone(this.mCurChildIsland, data.type, data.node.transform.position, data.node.transform.rotationEuler);
                data.node = newNode;

                let floorX = Math.floor(info.pos.x);
                let floorZ = Math.floor(info.pos.z);

                if (!this.mRenderableSprite3Ds[floorX + "" + floorZ]) {
                    this.mRenderableSprite3Ds[floorX + "" + floorZ] = {};
                }
                this.mRenderableSprite3Ds[floorX + "" + floorZ] = data;
            });
            gridInfo.crushedStoneArr.push(obj);
        } else {
            gridInfo.crushedStoneArr[0].num++;
            let scale = 1 + gridInfo.crushedStoneArr[0].num / 5;
        }
    }

    public createCrystal(): void {
        if (this.mCreatedOreNum < MyGameConfig.levelConfig[GameManager.instance.curLevel].crystalNum) {
            let rate = MathUtils.nextInt(0, 100);

            if (rate < MyGameConfig.gameConfig.createCrystalRate) {
                let index = MathUtils.nextInt(0, this.mCurCrystalArr.length - 1);
                let startPos = this.mCurCrystalArr[index].pos;
                let scale = this.mCurCrystalArr[index].scale;

                let pos = new Laya.Vector3(MathUtils.nextFloat(startPos.x + 0.3, startPos.x + scale.x - 0.3), 0,
                    MathUtils.nextFloat(startPos.z - 0.3, startPos.z - scale.z + 0.3));

                let gridInfo = this.createGride(Math.floor(pos.x), Math.floor(pos.z));

                if (gridInfo.crystalArr.length > 0) {
                    return;
                }
                let script = SceneResManager.createCrystal(this.mCurChildIsland, pos, gridInfo);

                gridInfo.crystalArr.push(script);

                this.mCreatedOreNum++;
            }
        }
    }

    public createDesignDiagram(): void {
        let lockDesignDiagram = DataManager.getLockDesignDiagram();

        if (lockDesignDiagram.length > 0) {
            let index = MathUtils.nextInt(0, lockDesignDiagram.length - 1);
            let rate = MathUtils.nextInt(0, 100);

            if (rate < lockDesignDiagram[index].rate) {
                UiUtils.addChild(new GetDesigndiagram(lockDesignDiagram[index]));
            }
        }
    }

    public saveMapData(): void {
    }

    public saveTruckData(): void {
        DataManager.setTruckData(GameManager.instance.roleScript.getTruckData());
    }

    public destroyNode(): void {
        for (let i = 0; i < this.mRenderContainerDestroyArr.length; i++) {
            let node = this.mRenderContainerDestroyArr[i];

            if (!node.destroyed) {
                node.destroy(true);
            }
        }

        this.mRenderContainerDestroyArr = [];
    }

    public pushContainerStatic(node: Laya.RenderableSprite3D): void {
        this.mRenderContainerContainer.push(node);
    }

    public pushMinCarStatic(node: Laya.RenderableSprite3D): void {
    }

    public pushDestroyStatic(node): void {
        node.active = false;
        this.mRenderContainerDestroyArr.push(node);
    }

    protected catchStoneCore(info, gridInfo: GridInfo, roleScript: BaseRoleScript): void {
        GameManager.instance.roleScript.catchStoneCore(info, gridInfo);
    }

    public clearAll(): void {
        super.clearAll();

        this.mCurCrystalArr = [];
        this.curIslandTotalCatchStoneCore = 0;
        this.mCreatedOreNum = 0;

        DataManager.setMapData(null);
        DataManager.setTruckData(null);

        GameManager.instance.roleScript.refresh();
        Laya.timer.clearAll(this);
    }
}


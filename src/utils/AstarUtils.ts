import AStarPathInfo from "../game/bean/astar/AStarPathInfo";
import Utils from "../utils/Utils";
import MathUtils from "./MathUtils";

export default class AstarUtils {

    public static mAStarJs: any;
    public static mGrapthJs: any;
    public static mAStar: any;
    public static mGrap: any;
    public static mIsSearching: boolean = false;
    private static mCoverMap: any;

    public static init(): void {

        this.mAStarJs = Laya.Browser.window.astar;
        this.mCoverMap = [];
    }

    public static addMap(x: number, y: number, sizeX: number): void {
        if (!this.mCoverMap[y]) {
            this.mCoverMap[y] = new Array();

            for (let i = 0; i < sizeX; i++) {
                this.mCoverMap[y][i] = 0;
            }
        }
        this.mCoverMap[y][x] = 1;
    }

    public static create(): void {
        for (let i = 0; i < this.mCoverMap.length; i++) {
            if (!this.mCoverMap[i]) {
                this.mCoverMap[i] = [];
            }
        }
        this.mGrap = new Laya.Browser.window.Graph(this.mCoverMap, { diagonal: true });
    }

    public static search(startX: number, startZ: number, endX: number, endZ: number, offsetX: number, offsetZ: number): AStarPathInfo {
        if (this.mIsSearching || !this.mGrap) {
            return null;
        }

        this.mIsSearching = true;

        if (Utils.checkIsNull(startX) || Utils.checkIsNull(startZ) || Utils.checkIsNull(endX) || Utils.checkIsNull(endZ)) {
            this.mIsSearching = false;
            return null;
        }

        var astarPathInfo = new AStarPathInfo();
        var start = this.mGrap.grid[startZ][startX];
        var end = this.mGrap.grid[endZ][endX];

        if (!start || !end) {
            this.mIsSearching = false;
            return null;
        }

        var pathArr = this.mAStarJs.search(this.mGrap, start, end, {
            closest: true,
        });

        astarPathInfo.rolePos = new Laya.Vector2(endX, endZ);

        let randomIndex = MathUtils.nextInt(5, 10);

        for (var i = 0; i < pathArr.length - 1; i++) {
            if (i % randomIndex == 0 || i == pathArr.length - 1) {
                astarPathInfo.pathArr.push(new Laya.Vector3(pathArr[i].y + 1 / 2 + MathUtils.nextFloat(-0.5, 0.5) + offsetX, 0,
                    -(pathArr[i].x + 1 / 2 + MathUtils.nextFloat(-0.5, 0.5)) + offsetZ));
                randomIndex = MathUtils.nextInt(3, 8);
            } else {
                astarPathInfo.pathArr.push(new Laya.Vector3(pathArr[i].y + 1 / 2 + offsetX, 0,
                    -(pathArr[i].x + 1 / 2) + offsetZ));
            }
        }

        this.mIsSearching = false;

        return astarPathInfo;
    }

    public static clearAll(): void {
        this.mGrap = {};
        this.mCoverMap = [];
    }
}
import { CubeUvsDetail } from "./CubeUvsDetail";

export default class CubeUvs {

    public top: any[] = [];

    public bottom: any[] = [];

    public north: any[] = [];

    public east: any[] = [];

    public south: any[] = [];

    public west: any[] = [];

    public stoneMaterial: Laya.Material;

    public curveMaterial: Laya.Material;

    public topUvsDetail: CubeUvsDetail = new CubeUvsDetail();
    public bottomUvsDetail: CubeUvsDetail = new CubeUvsDetail();
    public northUvsDetail: CubeUvsDetail = new CubeUvsDetail();
    public eastUvsDetail: CubeUvsDetail = new CubeUvsDetail();
    public southUvsDetail: CubeUvsDetail = new CubeUvsDetail();
    public westUvsDetail: CubeUvsDetail = new CubeUvsDetail();

    public addUvs(positions: Laya.Vector3[], uvs: any[], arr: any[], index: number): void {
        for (let i = index; i < 4 + index; i++) {
            arr.push({ index: i, pos: positions[i], uv: uvs[i] });
        }
    }

    public generate(): void {
        this.generateTop();
        this.generateNorth();
        this.generateEast();
        this.generateSouth();
        this.generateWest();
    }


    private generateTop(): void {
        this.topUvsDetail.mUvEndX = this.top[2].uv.x;
        this.topUvsDetail.mUvStartX = this.top[0].uv.x;
        this.topUvsDetail.mUvEndY = this.top[2].uv.y;
        this.topUvsDetail.mUvStartY = this.top[0].uv.y;

        this.topUvsDetail.percentUvX = this.topUvsDetail.mUvEndX - this.topUvsDetail.mUvStartX;
        this.topUvsDetail.percentUvY = this.topUvsDetail.mUvEndY - this.topUvsDetail.mUvStartY;
    }

    private generateNorth(): void {
        this.northUvsDetail.mUvEndX = this.north[2].uv.x;
        this.northUvsDetail.mUvStartX = this.north[0].uv.x;
        this.northUvsDetail.mUvEndY = this.north[2].uv.y;
        this.northUvsDetail.mUvStartY = this.north[0].uv.y;

        this.northUvsDetail.percentUvX = this.northUvsDetail.mUvEndX - this.northUvsDetail.mUvStartX;
        this.northUvsDetail.percentUvY = this.northUvsDetail.mUvEndY - this.northUvsDetail.mUvStartY;
    }

    private generateEast(): void {
        this.eastUvsDetail.mUvEndX = this.east[2].uv.x;
        this.eastUvsDetail.mUvStartX = this.east[0].uv.x;
        this.eastUvsDetail.mUvEndY = this.east[2].uv.y;
        this.eastUvsDetail.mUvStartY = this.east[0].uv.y;

        this.eastUvsDetail.percentUvX = this.eastUvsDetail.mUvEndX - this.eastUvsDetail.mUvStartX;
        this.eastUvsDetail.percentUvY = this.eastUvsDetail.mUvEndY - this.eastUvsDetail.mUvStartY;
    }

    private generateSouth(): void {
        this.southUvsDetail.mUvEndX = this.south[2].uv.x;
        this.southUvsDetail.mUvStartX = this.south[0].uv.x;
        this.southUvsDetail.mUvEndY = this.south[2].uv.y;
        this.southUvsDetail.mUvStartY = this.south[0].uv.y;

        this.southUvsDetail.percentUvX = this.southUvsDetail.mUvEndX - this.southUvsDetail.mUvStartX;
        this.southUvsDetail.percentUvY = this.southUvsDetail.mUvEndY - this.southUvsDetail.mUvStartY;
    }

    private generateWest(): void {
        this.westUvsDetail.mUvEndX = this.west[2].uv.x;
        this.westUvsDetail.mUvStartX = this.west[0].uv.x;
        this.westUvsDetail.mUvEndY = this.west[2].uv.y;
        this.westUvsDetail.mUvStartY = this.west[0].uv.y;

        this.westUvsDetail.percentUvX = this.westUvsDetail.mUvEndX - this.westUvsDetail.mUvStartX;
        this.westUvsDetail.percentUvY = this.westUvsDetail.mUvEndY - this.westUvsDetail.mUvStartY;
    }

}
export default class CurveUvs {

    public mUvStartX: number;
    public mUvEndX: number;
    public percentUvX: number;
    public mUvStartY: number;
    public mUvEndY: number;
    public percentUvY: number;

    public stoneMaterial: Laya.Material;

    public init(positions: Laya.Vector3[], uvs: any[], index: number): void {
        let arr = [];

        for (let i = index; i < 4 + index; i++) {
            arr.push({ index: i, pos: positions[i], uv: uvs[i] });
        }

        this.mUvEndX = arr[2].uv.x;
        this.mUvStartX = arr[0].uv.x;
        this.mUvEndY = arr[2].uv.y;
        this.mUvStartY = arr[0].uv.y;

        this.percentUvX = this.mUvEndX - this.mUvStartX;
        this.percentUvY = this.mUvEndY - this.mUvStartY;
    }
}
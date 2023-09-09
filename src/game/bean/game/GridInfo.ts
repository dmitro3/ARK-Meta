import CrystalScript from "../../CrystalScript";

export default class GridInfo {

    public x;
    public z;
    public key: string;

    public stoneInfoArr: any[] = [];

    public crushedStoneArr: any[] = [];

    public stoneCoreArr: any[] = [];

    public crystalArr: CrystalScript[] = [];

    constructor(x: number, z: number) {
        this.x = x;
        this.z = z;
        this.key = x + "" + z;
    }
}
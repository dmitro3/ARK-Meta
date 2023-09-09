import MathUtils from "../../utils/MathUtils";
import BaseStrategyScript from "./BaseStrategyScript";
import StrategyFailScript1 from "./fail/StrategyFailScript1";
import StrategyWinScript1 from "./win/StrategyWinScript1";

export default class StrategyScriManager {

    private static mInstance: StrategyScriManager;
    private mIsWin: boolean = false;
    private mCurStrategy: BaseStrategyScript;

    private mWinStrategyArr = [
        {
            "player": [7, 8, 9, 10],
            "robot": [10, 9, 8, 7, 6, 5, 6, 7, 8, 9, 10]
        },
        {
            "player": [7, 8, 9, 10, 7, 8, 9, 10],
            "robot": [10, 9, 8, 7, 6, 5, 6, 7, 8, 9, 10]
        }, {
            "player": [9],
            "robot": [7]
        }
    ];

    private mFailStrategyArr = [
        {
            "player": [5, 6, 7, 8],
            "robot": [10, 9, 8, 7, 8, 9, 10]
        }, {
            "player": [6, 7, 8, 9, 6, 7, 8, 9, 10],
            "robot": [10, 9, 8, 7, 8, 9, 10]
        }, {
            "player": [7],
            "robot": [10]
        }
    ]

    public static get instance(): StrategyScriManager {
        if (!this.mInstance) {
            this.mInstance = new StrategyScriManager();
        }

        return this.mInstance;
    }

    public randomResult(): void {
        let random = MathUtils.nextInt(0, 100);

        if (random < 50) {  // 赢
            let strategy = this.mWinStrategyArr[MathUtils.nextInt(0, this.mWinStrategyArr.length - 1)];
            this.mCurStrategy = new StrategyWinScript1(strategy.player, strategy.robot);
        } else {
            let strategy = this.mFailStrategyArr[MathUtils.nextInt(0, this.mFailStrategyArr.length - 1)];
            this.mCurStrategy = new StrategyFailScript1(strategy.player, strategy.robot);
        }
    }

    public check(isSelf: boolean, pos: Laya.Vector3): void {
        this.mCurStrategy.check(isSelf, pos);
    }

    public clear(): void {
        this.mCurStrategy.clear();
        this.mCurStrategy = null;
    }
}
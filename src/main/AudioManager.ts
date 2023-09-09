import MyGameConfig from "./MyGameConfig";
import AudioUtils from "../utils/AudioUtils";

export default class AudioManager {

    public static NAME_BUY = "buy";

    private static mIsPlayTruck: boolean = false;

    private static mTruckSoundChannel: Laya.SoundChannel;

    private static mMineCarSoundChannle: Laya.SoundChannel;

    private static mCollectStoneHandler: Laya.Handler;

    private static mIsPlaySoundCollectStone: boolean = false;

    public static init(): void {
        this.mCollectStoneHandler = Laya.Handler.create(this, () => {
            this.mIsPlaySoundCollectStone = false;
        }, [], false);
    }

    public static closeSound(): void {
        AudioUtils.setSoundVolume(0);
    }

    public static openSound(): void {
        AudioUtils.setSoundVolume(1);
    }

    public static closeMusic(): void {
        AudioUtils.setBgmVolume(0);
    }

    public static openMusic(): void {
        AudioUtils.setBgmVolume(1);
    }

    public static playBgm(): void {
        AudioUtils.playBgm("res2d/sounds/bgm.mp3")
    }

    public static playClick(): void {
        this.playSound("click");
    }

    public static playTruck(): void {
        if (!this.mIsPlayTruck) {
            this.mIsPlayTruck = true;

            if (this.mTruckSoundChannel) {
                this.mTruckSoundChannel.play();
            } else {
                this.mTruckSoundChannel = this.playSound("truck", 0);
            }
        }
    }

    public static stopTruck(): void {
        if (this.mTruckSoundChannel) {
            this.mTruckSoundChannel.pause();
            this.mIsPlayTruck = false;
        }
    }

    public static playCollectStone(): void {
        if (!this.mIsPlaySoundCollectStone) {
            this.mIsPlaySoundCollectStone = true;
            this.playSound("collectStone", 1, this.mCollectStoneHandler);
        }
    }

    public static playGetStars(): void {
        this.playSound("getStars");
    }

    public static playSell(): void {
        this.playSound("sell");
    }

    public static playKnockDown(): void {
        this.playSound("knockDown");
    }

    public static playBoom(): void {
        this.playSound("boom");
    }

    public static playCountDown(): void {
        this.playSound("countDown");
    }

    public static playSound(name: string, loops?: number, complete?: Laya.Handler): Laya.SoundChannel {
        return AudioUtils.playSound(MyGameConfig.URL_SOUNDS + name + ".mp3", loops, complete);
    }
}
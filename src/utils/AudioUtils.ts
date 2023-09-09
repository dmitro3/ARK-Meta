export default class AudioUtils {

    private static mBgmPath: string;

    private static mBgmVolume: number = 1;

    private static mSoundVolume: number = 1;

    private static mBgmChannel: Laya.SoundChannel;

    private static mSoundChannel: Laya.SoundChannel;

    public static DEFAULT_VOLUME = 1;

    private static mBgmIsOver: boolean = false;

    public static init() {
        AudioUtils.resetAudio();
        Laya.SoundManager.autoReleaseSound = false;
        Laya.SoundManager.autoStopMusic = false;
    }

    public static resetAudio() {
        AudioUtils.mBgmVolume = AudioUtils.getBgmVolume();
        this.setBgmVolume(AudioUtils.mBgmVolume);
        AudioUtils.mSoundVolume = AudioUtils.getSoundVolume();
        this.setSoundVolume(AudioUtils.mSoundVolume);
    }

    public static setSoundVolume(v: number) {
        AudioUtils.mSoundVolume = v;
        Laya.SoundManager.setSoundVolume(AudioUtils.mSoundVolume);
        Laya.LocalStorage.setItem("ark_sound_volume", AudioUtils.mSoundVolume + "");
    }

    public static getSoundVolume(): number {
        var soundVolumeStr = Laya.LocalStorage.getItem("ark_sound_volume");

        if (soundVolumeStr) {
            AudioUtils.mSoundVolume = parseInt(soundVolumeStr);
        } else {
            AudioUtils.mSoundVolume = AudioUtils.DEFAULT_VOLUME;
        }

        return AudioUtils.mSoundVolume;
    }

    public static setBgmVolume(v) {
        AudioUtils.mBgmVolume = v;
        Laya.SoundManager.setMusicVolume(AudioUtils.mBgmVolume);
        Laya.LocalStorage.setItem("ark_bgm_volume", AudioUtils.mBgmVolume + "");
    }

    public static getBgmVolume(): number {
        var bgmVolumeStr = Laya.LocalStorage.getItem("ark_bgm_volume");

        if (bgmVolumeStr) {
            AudioUtils.mBgmVolume = parseInt(bgmVolumeStr);
        } else {
            AudioUtils.mBgmVolume = AudioUtils.DEFAULT_VOLUME;
        }

        return AudioUtils.mBgmVolume;
    }

    public static setTempBgmVolume(v: number): void {
        if (this.mBgmChannel) {
            this.mBgmChannel.volume = v;
        }
    }

    public static playBgm(path: string, startTime?: number): void {
        startTime = startTime ? startTime : 0;

        this.mBgmIsOver = false;

        this.mBgmPath = path;

        this.mBgmChannel = Laya.SoundManager.playMusic(path, 0);
    }

    public static playSound(path: string, loops?: number, complete?: Laya.Handler): Laya.SoundChannel {
        if (AudioUtils.mSoundVolume > 0) {
            if (loops !== null || loops !== undefined) {
                return Laya.SoundManager.playSound(path, loops, complete);
            } else {
                return Laya.SoundManager.playSound(path, 1, complete);
            }
        }
    }

    public static openAll() {
        AudioUtils.setBgmVolume(AudioUtils.DEFAULT_VOLUME);
        AudioUtils.setSoundVolume(AudioUtils.DEFAULT_VOLUME);

        this.setSound(true);
    }

    public static stopBgm() {
        if (this.mBgmChannel) {
            this.mBgmChannel.stop();
        }
    }

    public static destroyBgm() {
        Laya.SoundManager.destroySound(this.mBgmPath);
    }

    public static muted() {
        AudioUtils.setBgmVolume(0);
        AudioUtils.setSoundVolume(0);

        this.setSound(false);
    }

    public static resumeBgm() {
        if (this.mBgmChannel) {
            this.mBgmChannel.resume();
        }
    }

    public static pauseBgm() {
        if (this.mBgmChannel) {
            this.mBgmChannel.pause();
        }
    }

    public static resumeAll() {
        if (AudioUtils.mBgmChannel) {
            AudioUtils.mBgmChannel.resume();
        }
        Laya.SoundManager.setMusicVolume(AudioUtils.mBgmVolume);
        Laya.SoundManager.setSoundVolume(AudioUtils.mSoundVolume);
    }

    public static pauseAll() {
        if (AudioUtils.mBgmChannel) {
            AudioUtils.mBgmChannel.pause();
        }
        Laya.SoundManager.setMusicVolume(0);
        Laya.SoundManager.setSoundVolume(0);
    }

    public static isSound(): boolean {
        return this.getBoolean("setting_sound", true);
    }

    public static setSound(b): void {
        this.setBoolean("setting_sound", b);
    }

    private static getBoolean(key: string, defaultValue: boolean): boolean {
        var str = Laya.LocalStorage.getItem(key);

        if (str == "true") {
            return true;
        } else if (str == "false") {
            return false;
        } else {
            return defaultValue;
        }
    }

    private static setBoolean(key: string, value: any) {
        if (value) {
            Laya.LocalStorage.setItem(key, "true");
        } else {
            Laya.LocalStorage.setItem(key, "false");
        }
    }
}
import AudioManager from "../../main/AudioManager";
import DataManager from "../../main/DataManager";
import SdkCenter from "../../sdk/SdkCenter";
import { ui } from "../../ui/layaMaxUI";
import UiUtils from "../../utils/UiUtils";

export default class SettingDialog extends ui.game.SettingDialogUI {

    onAwake(): void {
        this.width = Laya.stage.width;

        if (Laya.Browser.onMobile) {
            this.mNodeVibrate.visible = SdkCenter.instance.isSupplyVibrate();
        }

        this.initView();

        UiUtils.click(this.mBtnMusic, this, this.onMusicClick);
        UiUtils.click(this.mBtnSound, this, this.onSoundClick);
        UiUtils.click(this.mBtnVibrate, this, this.onVibrateClick);
        UiUtils.click(this.mBtnClose, this, this.onCloseClick);

        UiUtils.hideLoading();
    }

    private initView(): void {
        var isMusic = DataManager.isBgm();
        var isSound = DataManager.isSound();
        var isVibrate = DataManager.isVibrate();

        (this.mBtnMusic.getChildAt(0) as Laya.Image).visible = !isMusic;
        (this.mBtnMusic.getChildAt(1) as Laya.Image).visible = isMusic;

        (this.mBtnSound.getChildAt(0) as Laya.Image).visible = !isSound;
        (this.mBtnSound.getChildAt(1) as Laya.Image).visible = isSound;

        (this.mBtnVibrate.getChildAt(0) as Laya.Image).visible = !isVibrate;
        (this.mBtnVibrate.getChildAt(1) as Laya.Image).visible = isVibrate;
    }

    private onMusicClick(): void {
        var isMusic = DataManager.isBgm();

        isMusic = !isMusic;

        isMusic ? AudioManager.openMusic() : AudioManager.closeMusic();

        DataManager.setBgm(isMusic);
        this.initView();
    }

    private onSoundClick(): void {
        var isSound = DataManager.isSound();

        isSound = !isSound;

        isSound ? AudioManager.openSound() : AudioManager.closeSound();

        DataManager.setSound(isSound);
        this.initView();
    }

    private onVibrateClick(): void {
        var isVibrate = DataManager.isVibrate();

        isVibrate = !isVibrate;

        SdkCenter.instance.setVibrate(isVibrate);

        DataManager.setVibrate(isVibrate);
        this.initView();
    }

    private onCloseClick(): void {
        this.removeSelf();
    }
}
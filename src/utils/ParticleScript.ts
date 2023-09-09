import PoolManager from "../main/PoolManager";

export default class ParticleScript extends Laya.Script3D {

    private mNode: Laya.Sprite3D;
    private mParticleSystem: Laya.ShurikenParticleSystem;
    private mName: string;
    private mPlayRate: number = 1;
    private mIsPlayEnd: boolean;

    private mIsDestroy: boolean = false;

    constructor() { super(); }

    onAwake(): void {
        this.mNode = this.owner as Laya.Sprite3D;
        this.mParticleSystem = (this.owner.getChildAt(0) as Laya.ShuriKenParticle3D).particleSystem;
        this.mPlayRate = 1;
        if (this.mParticleSystem) {
            this.mParticleSystem.simulationSpeed = this.mPlayRate;
        }
    }

    onEnable(): void {
    }

    onDisable(): void {
    }

    onUpdate(): void {
        if (this.mParticleSystem && !this.mParticleSystem.isPlaying && !this.mIsPlayEnd) {
            this.mIsPlayEnd = true;
            if (this.mIsDestroy) {
                this.mNode.destroy(true);
            } else {
                this.mNode.active = false;
                PoolManager.recoverParticle(this.mName, this.owner);
            }
        }
    }

    init(name: string, rate?: number): void {
        this.mName = name;
        this.mPlayRate = rate ? rate : 1;
        this.mIsPlayEnd = false;

        if (this.mParticleSystem) {
            this.mParticleSystem.play();
        }
    }

    public setParticleSystem(particleSystem: Laya.ShurikenParticleSystem): void {
        this.mParticleSystem = particleSystem;
        this.init(this.mName, this.mPlayRate);
    }

    setDestroy(): void {
        this.mIsDestroy = true;
    }
}
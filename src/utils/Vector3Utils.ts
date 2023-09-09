export default class Vector3Utils {

    public static ZERO = new Laya.Vector3(0, 0, 0);

    public static UP = new Laya.Vector3(0, 1, 0);


    public static getMinAngle(targetRotation, currentOrientation): number {
        var rotationY = (targetRotation % 360) - (currentOrientation % 360);

        if (rotationY > 180) {
            rotationY = rotationY - 360;
        } else if (rotationY < -180) {
            rotationY = 360 + rotationY;
        }

        return rotationY;
    }

    public static toTargetQuaternion(selfPos: Laya.Vector3, targetPos: Laya.Vector3): Laya.Quaternion {
        var currentDirction = new Laya.Vector3(0, 0, 0);
        Laya.Vector3.subtract(selfPos, targetPos, currentDirction);
        Laya.Vector3.normalize(currentDirction, currentDirction);
        currentDirction = new Laya.Vector3(-currentDirction.x, 0, -currentDirction.z);
        var targetRot = new Laya.Quaternion();
        Laya.Quaternion.rotationLookAt(currentDirction, Vector3Utils.UP, targetRot);
        targetRot.invert(targetRot);

        return targetRot;
    }
}
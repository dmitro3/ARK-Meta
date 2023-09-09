export default class UserManager {

    private static mInstance: UserManager;

    private mUserName: string;

    public static get instance(): UserManager {
        if (!this.mInstance) {
            this.mInstance = new UserManager();
        }

        return this.mInstance;
    }

    public setUserData(data: any): void {
        
    }
}
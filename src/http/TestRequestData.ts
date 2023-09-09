import UserManager from "../main/UserManager";
import BaseHttpRequestData from "./BaseHttpRequestData";

export default class TestRequestData extends BaseHttpRequestData {

    public login(callback: Function): void {
        UserManager.instance.setUserData({});
        callback();
    }
}
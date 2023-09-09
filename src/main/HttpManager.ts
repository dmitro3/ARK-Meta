import BaseHttpRequestData from "../http/BaseHttpRequestData";
import HttpRequestData from "../http/HttpRequestData";
import TestRequestData from "../http/TestRequestData";

export default class HttpManager {

    private static mInstance: HttpManager;
    private mIsTest: boolean = true;
    private mRequest: BaseHttpRequestData;

    public static get instance(): HttpManager {
        if (!this.mInstance) {
            this.mInstance = new HttpManager();
        }

        return this.mInstance;
    }

    public get request(): BaseHttpRequestData {
        return this.mRequest;
    }

    public init(): void {
        if (this.mIsTest) {
            this.mRequest = new TestRequestData();
        } else {
            this.mRequest = new HttpRequestData();
        }
    }

    public get isTest(): boolean {
        return this.mIsTest;
    }
}
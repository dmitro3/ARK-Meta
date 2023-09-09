export default abstract class BaseHttpRequestData {

    public abstract login(callback: Function): void;

    protected get(url: string, data: any, completeHandler: Function, errorHandler: Function): void {
        var xhr: Laya.HttpRequest = new Laya.HttpRequest();
        xhr.http.timeout = 30000;
        xhr.once(Laya.Event.COMPLETE, this, (data) => {
        });
        xhr.once(Laya.Event.ERROR, this, errorHandler);
        xhr.send(url, data, "get", "json");
    }

    protected post(url: string, data: any, completeHandler: Function, errorHandler: Function): void {
        var xhr: Laya.HttpRequest = new Laya.HttpRequest();
        xhr.http.timeout = 30000;
        xhr.once(Laya.Event.COMPLETE, this, (data) => {
        });
        xhr.once(Laya.Event.ERROR, this, errorHandler);
        xhr.send(url, data, "post", "json");
    }
}
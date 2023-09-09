export default class ZipUtils {

    private static mInstance: ZipUtils;
    private JSZip: any;
    private loadImgCount: number;
    private loadLhCount: number;
    private loadLmCount: number;
    private loadLmatCount: number;
    private loadLaniCount: number;

    public static get instance(): ZipUtils {
        if (!this.mInstance) {
            this.mInstance = new ZipUtils();
            this.mInstance.init();
        }

        return this.mInstance;
    }

    public init(): void {
        this.JSZip = Laya.Browser.window.JSZip;
    }

    public loadSound(zipUrl: string, cacheBaseUrl: string, callback: Function): void {
    }

    public loadRes3d(zipUrl: string, cacheBaseUrl: string, callback: Function): void {
        Laya.loader.load([{
            type: Laya.Loader.BUFFER,
            url: zipUrl
        }], Laya.Handler.create(this, () => {
            const jsZip = new this.JSZip();

            let zip = Laya.Loader.getRes(zipUrl);

            this.loadImgCount = 0;
            this.loadLaniCount = 0;
            this.loadLhCount = 0;
            this.loadLmCount = 0;
            this.loadLmatCount = 0;

            jsZip.loadAsync(zip).then((data => {
                let lsFile: any;
                let lhFileMap: any[] = [];
                let lmFileMap: any[] = [];
                let lmatFileArr: any[] = [];
                let imgFileArr: any[] = [];
                let laniFileArr: any[] = [];

                for (let key in data.files) {
                    let file = data.files[key];

                    if (!file.dir) {
                        let fileName = file.name as string;
                        let suffix = fileName.substring(fileName.lastIndexOf(".") + 1);
                        let name = fileName.substring(fileName.lastIndexOf("/") + 1);

                        let assetsIndex = fileName.lastIndexOf("Assets/");
                        let resUrl;
                        let unityLibraryIndex = fileName.indexOf("Library/");

                        if (assetsIndex != -1) {
                            resUrl = fileName.substring(assetsIndex);
                        } else if (unityLibraryIndex != -1) {
                            resUrl = fileName.substring(unityLibraryIndex);
                        } else {
                            resUrl = fileName;
                        }

                        let obj: any = {};

                        obj.name = name;
                        obj.suffix = suffix;
                        obj.resUrl = resUrl;
                        obj.key = key;

                        switch (suffix) {
                            case "ls":
                                obj.resUrl = cacheBaseUrl + key;
                                lsFile = obj;
                                break;
                            case "lh":
                                obj.resUrl = cacheBaseUrl + key;
                                lhFileMap.push(obj);
                                break;
                            case "lm":
                                lmFileMap.push(obj);
                                break;
                            case "lmat":
                                lmatFileArr.push(obj);
                                break;
                            case "lani":
                                laniFileArr.push(obj);
                                break;
                            case "jpg":
                            case "jpeg":
                            case "bmp":
                            case "gif":
                            case "png":
                                obj.resUrl = name;
                                imgFileArr.push(obj);
                                break;
                        }
                    }
                }

                this.loadTexture(jsZip, imgFileArr, 0, () => {
                    this.loadLani(jsZip, laniFileArr, 0, () => {
                        this.loadLm(jsZip, lmFileMap, 0, () => {
                            this.loadLmat(jsZip, lmatFileArr, 0, () => {
                                this.loadLh(jsZip, lhFileMap, 0, () => {
                                    this.loadLs(jsZip, lsFile, () => {
                                        Laya.loader.clearRes(zipUrl);
                                        callback();
                                    });
                                });
                            });
                        });
                    });
                });
            }));
        }));
    }

    private loadTexture(jsZip: any, fileArr: any[], index: number, callback: Function): any {
        if (fileArr.length == 0) {
            callback();
            return;
        }

        if (index == fileArr.length) {
            return;
        }

        let info = fileArr[index];

        if (Laya.loader.getRes(info.resUrl)) {
            this.loadTexture(jsZip, fileArr, ++index, callback);
            this.loadImgCount++;

            if (fileArr.length == this.loadImgCount) {
                callback();
            }
            return;
        }

        jsZip.file(info.key).async("base64").then((content: any) => {
            let self = this;
            let image = new Laya.Browser.window.Image();
            image.crossOrigin = "";
            image.src = "data:image/" + info.suffix + ";base64," + content;
            image.onload = function () {
                var tex = (Laya.Texture2D as any)._parse(image);

                Laya.loader.cacheRes(info.resUrl, tex);

                self.loadImgCount++;

                if (fileArr.length == self.loadImgCount) {
                    callback();
                }
            };
            image.onerror = function () {
            };
        });

        this.loadTexture(jsZip, fileArr, ++index, callback);
    }

    private loadLani(jsZip: any, fileArr: any[], index: number, callback: Function): void {
        if (fileArr.length == 0) {
            callback();
            return;
        }

        if (index == fileArr.length) {
            return;
        }

        let info = fileArr[index];

        if (Laya.loader.getRes(info.resUrl)) {
            this.loadLani(jsZip, fileArr, ++index, callback);
            this.loadLaniCount++;
            if (this.loadLaniCount == fileArr.length) {
                callback();
            }
            return;
        }
        jsZip.file(info.key).async("arraybuffer").then((content: any) => {
            let clip = Laya.Browser.window.Laya.AnimationClip._parse(content);
            Laya.loader.cacheRes(info.resUrl, clip);
            this.loadLaniCount++;

            if (this.loadLaniCount == fileArr.length) {
                callback();
            }
        });
        this.loadLani(jsZip, fileArr, ++index, callback);
    }

    private loadLm(jsZip: any, fileArr: any[], index: number, callback: Function): void {
        if (fileArr.length == 0) {
            callback();
            return;
        }

        if (index == fileArr.length) {
            return;
        }

        let info = fileArr[index];

        if (Laya.loader.getRes(info.resUrl)) {
            this.loadLm(jsZip, fileArr, ++index, callback);
            this.loadLmCount++;
            if (this.loadLmCount == fileArr.length) {
                callback();
            }
            return;
        }

        jsZip.file(info.key).async("arraybuffer").then((content: any) => {
            Laya.loader.cacheRes(info.resUrl, Laya.Browser.window.Laya.MeshReader._parse(content));
            this.loadLmCount++;

            if (this.loadLmCount == fileArr.length) {
                callback();
            }
        });
        this.loadLm(jsZip, fileArr, ++index, callback);
    }

    private loadLmat(jsZip: any, fileArr: any[], index: number, callback: Function): void {
        if (fileArr.length == 0) {
            callback();
            return;
        }

        if (index == fileArr.length) {
            return;
        }

        let info = fileArr[index];

        if (Laya.loader.getRes(info.resUrl)) {
            this.loadLmat(jsZip, fileArr, ++index, callback);
            this.loadLmatCount++;

            if (this.loadLmatCount == fileArr.length) {
                callback();
            }
            return;
        }

        jsZip.file(info.key).async("text").then((content: any) => {
            let json = JSON.parse(content);

            for (let i = 0; i < json["props"]["textures"].length; i++) {
                let path = json["props"]["textures"][i]["path"] as string;

                json["props"]["textures"][i]["path"] = path.substring(path.lastIndexOf("/") + 1);
            }

            let material = Laya.Browser.window.Laya.Material._parse(json);


            Laya.loader.cacheRes(info.resUrl, material);

            this.loadLmatCount++;

            if (this.loadLmatCount == fileArr.length) {
                callback();
            }
        });
        this.loadLmat(jsZip, fileArr, ++index, callback);
    }

    private loadLh(jsZip: any, fileArr: any[], index: number, callback: Function): void {
        if (fileArr.length == 0) {
            callback();
            return;
        }

        if (index == fileArr.length) {
            return;
        }

        let info = fileArr[index];

        if (Laya.loader.getRes(info.resUrl)) {
            this.loadLh(jsZip, fileArr, ++index, callback);
            this.loadLhCount++;
            if (this.loadLhCount == fileArr.length) {
                callback();
            }
            return;
        }

        jsZip.file(info.key).async("text").then((content: any) => {
            Laya.loader.cacheRes(info.resUrl, Laya.Browser.window.Laya.Scene3DUtils._parse(JSON.parse(content)));
            this.loadLhCount++;
            if (this.loadLhCount == fileArr.length) {
                callback();
            }
        });
        this.loadLh(jsZip, fileArr, ++index, callback);
    }

    private loadLs(jsZip: any, info: any, callback: Function): void {
        if (!info) {
            callback();
            return;
        }

        jsZip.file(info.key).async("text").then((content: any) => {
            Laya.loader.cacheRes(info.resUrl, Laya.Browser.window.Laya.Scene3DUtils._parse(JSON.parse(content)));

            callback();
        });
    }
}
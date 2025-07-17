import { error, JsonAsset, Prefab, resources, SpriteFrame, TextAsset } from "cc";

export class ResUtil {
    static loadRes(url: string, callback: Function) {
        resources.load(url, (err: Error, res: any) => {
            if (err) {
                error(err.message);
                callback && callback(res, err);
                return;
            }
            callback && callback(res, null);

        });
    }

    static loadPrefab(url: string): Promise<any> {
        return new Promise((reslove, reject) => {

            this.loadRes(url, (res: any, err: Error) => {
                if (err) {
                    reject();
                } else {
                    reslove(res as Prefab);
                }
            });
        });
    }

    static loadJosn(url: string): Promise<any> {
        return new Promise((reslove, reject) => {

            this.loadRes(url, (res: any, err: Error) => {
                if (err) {
                    reject();
                } else {
                    reslove(res as JsonAsset);
                }
            });
        });
    }

    static loadText(url: string): Promise<any> {
        return new Promise((reslove, reject) => {

            this.loadRes(url, (res: any, err: Error) => {
                if (err) {
                    reject();
                } else {
                    reslove(res as TextAsset);
                }
            });
        });
    }

    static loadSpritFrame(url: string): Promise<any> {
        return new Promise((reslove, reject) => {

            this.loadRes(url, (res: any, err: Error) => {
                if (err) {
                    reject();
                } else {
                    reslove(res as SpriteFrame);
                }
            });
        });
    }
}
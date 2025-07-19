import { _decorator, Component, director, Node, Prefab, SpriteFrame, warn } from 'cc';
import { Constant } from './Constant';
import { ResUtil } from './ResUtil';
import { PoolManager } from './PoolManager';
const { ccclass, property } = _decorator;

@ccclass('Globats')
export class Globats extends Component {

    static prefabs: Record<string, Prefab> = {};
    static skillSpriteFrames: Record<string, SpriteFrame> = {};
    protected onLoad(): void {
        director.addPersistRootNode(this.node);
    }

    static init() {
        const keys = Object.keys(Constant.PrefabUrl);
        const promises: Promise<any>[] = [];
        keys.forEach(key => {
            const url = Constant.PrefabUrl[key];
            const p = ResUtil.loadPrefab(url).then((pr: Prefab) => {
                Globats.prefabs[url] = pr;
            });
            promises.push(p);
        });

        promises[promises.length] = ResUtil.loadSpriteFrameDir('skills/').then((frames: SpriteFrame[]) => {
            for (let i = 0; i < frames.length; i++) {
                const sf = frames[i];
                this.skillSpriteFrames[sf.name] = sf;
            }
        })
        return Promise.all(promises);


    }

    static getNode(name: string, parent: Node) {
        const node = PoolManager.instance.get(this.prefabs[name]);
        node.parent = parent;
        return node;
    }

    static putNode(node: Node) {
        PoolManager.instance.put(node);
    }

    static getSkillSpriteFrame(skillID: number) {
        const frame = this.skillSpriteFrames[`${skillID}`];
        if (!frame) {
            warn(`${skillID} is not key of sprites`);
        }
        return frame;
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


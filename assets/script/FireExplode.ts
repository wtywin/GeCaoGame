import { _decorator, Component, dragonBones, Node } from 'cc';
import { Globats } from './Globats';
const { ccclass, property } = _decorator;

@ccclass('FireExplode')
export class FireExplode extends Component {
    attack: number = 10;

    protected onEnable(): void {
        const dis = this.node.getComponent(dragonBones.ArmatureDisplay);
        dis.on(dragonBones.EventObject.COMPLETE, this.onComplete, this);
    }

    protected onDisable(): void {
        const dis = this.node.getComponent(dragonBones.ArmatureDisplay);
        dis.off(dragonBones.EventObject.COMPLETE, this.onComplete, this);
    }
    start() {

    }

    update(deltaTime: number) {

    }

    onComplete() {
        Globats.putNode(this.node);
    }

    playAniamtion() {
        const dis = this.node.getComponent(dragonBones.ArmatureDisplay);
        dis.playAnimation('FireExplode', 1)
       
    }
}



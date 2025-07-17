import { _decorator, Component, Node } from 'cc';
import { Util } from './Util';
import { PoolManager } from './PoolManager';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
    attack: number = 10;
    speed: number = 12;
    moveDirection: number = 0;
    isMoving: boolean = false;

    resist: number = 0.1;

    protected onEnable(): void {

    }

    protected onDisable(): void {

    }
    start() {

    }

    update(deltaTime: number) {
        if (this.isMoving) {
            Util.moveNode(this.node, this.moveDirection, this.speed);
        }
        this.speed -= this.resist;
        if (this.speed <= 0) {
            // this.node.destroy();
            PoolManager.instance.put(this.node);
        }
    }
}



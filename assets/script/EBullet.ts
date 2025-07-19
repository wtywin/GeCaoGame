import { _decorator, Component, Node } from 'cc';
import { Globats } from './Globats';
import { Util } from './Util';
const { ccclass, property } = _decorator;

@ccclass('EBullet')
export class EBullet extends Component {
    attack: number = 10;
    speed: number = 10;
    moveDirection: number = 0;
    isMoving: boolean = false;

    private _distance: number = 0;

    resist: number = 0.1;

    protected onEnable(): void {
        this._distance = 0;

    }

    protected onDisable(): void {

    }
    start() {

    }

    update(deltaTime: number) {
        if (this.isMoving) {
            Util.moveNode(this.node, this.moveDirection, this.speed);
        }
        this._distance += this.speed;
        if (this._distance > 2000) {
            // this.node.destroy();
            Globats.putNode(this.node);
        }
    }
}



import { _decorator, Component, Node } from 'cc';
import { BattleContext } from './BattleContext';
const { ccclass, property } = _decorator;

@ccclass('Surround')
export class Surround extends Component {
    angleSpeed: number = 3;
    ismoving: boolean = true;

    protected onEnable(): void {
        for (let i = 0; i < this.node.children.length; i++) {
            this.node.children[i].angle = 0 + i * 120;
        }
    }
    start() {

    }

    update(deltaTime: number) {
        if (!this.ismoving) {
            return;
        }
        if (BattleContext.ndPlayer) {
            this.node.setWorldPosition(BattleContext.ndPlayer.worldPosition);
        }

        for (let i = 0; i < this.node.children.length; i++) {
            this.node.children[i].angle += this.angleSpeed;
        }

    }
}



import { _decorator, Component, dragonBones, Node } from 'cc';
import { Globats } from './Globats';
const { ccclass, property } = _decorator;

@ccclass('Thunder')
export class Thunder extends Component {

    @property(Node) ndAni: Node;

    isMoving: boolean = false;
    attack: number = 10;

    private _display: dragonBones.ArmatureDisplay;

    protected onLoad(): void {
        this._display = this.ndAni.getComponent(dragonBones.ArmatureDisplay);
    }

    protected onEnable(): void {
        this._display.on(dragonBones.EventObject.COMPLETE, this.onThunderComplete, this);
    }

    protected onDisable(): void {
        this._display.off(dragonBones.EventObject.COMPLETE, this.onThunderComplete, this);
    }
    start() {

    }

    update(deltaTime: number) {

    }

    onThunderComplete() {
        Globats.putNode(this.node);
    }

    startThunder() {
        this._display.playAnimation('thunder', 1);
    }
}



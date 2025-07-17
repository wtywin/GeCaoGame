import { _decorator, Component, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TalenButton')
export class TalenButton extends Component {
    private _cb: Function;
    private _target: any;

    private _isActivated: boolean = true;
    public get isActivated(): boolean {
        return this._isActivated;
    }
    public set isActivated(value: boolean) {
        this._isActivated = value;
        this.node.getComponentsInChildren(Sprite).forEach(s => {
            s.grayscale = !value;
        })
    }

    protected onEnable(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this, true);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this, true);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this, true);
    }

    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this, true);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this, true);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this, true);
    }

    onTouchStart() {
        if (!this.isActivated) {
            return;
        }
        this.node.setScale(0.95, 0.95);
    }

    onTouchEnd() {
        if (!this.isActivated) {
            return;
        }
        this.node.setScale(1, 1);

        this._cb && this._cb.apply(this._target);
    }

    onTouchCancel() {
        if (!this.isActivated) {
            return;
        }
        this.node.setScale(1, 1);
    }
    onClick(cb: Function, target?: any) {
        this._cb = cb;
        this._target = target;
    }

    start() {

    }

    update(deltaTime: number) {

    }
}



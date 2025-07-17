import { _decorator, Component, EventTouch, Label, Node, Sprite, tween, UIOpacity, v2, v3, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SkillButton')
export class SkillButton extends Component {
    @property(Node) ndText: Node;
    @property(Node) ndIcon: Node;
    @property(Node) ndPanel: Node;

    private _isAvaliable: boolean = true;
    private _coldDownTime: number = 3;

    private _isColding: boolean = false;
    private _currColdTime: number = 0;
    private _v2: Vec2 = v2();
    private _v3: Vec3 = v3();
    private _Listener: Function;
    private _target: any;

    private _radian: number = 0;
    private _eventArg: [number, number] = [-1, -1];

    private _isPanelVisible: boolean = false;

    static readonly Event = {
        START: 0,
        MOVE: 1,
        END: 2,
        CANCEL: 3
    }

    public get coldDownTime(): number {
        return this._coldDownTime;
    }

    public set coldDownTime(value: number) {
        value = value >= 0 ? value : 0;
        this._coldDownTime = value;
    }

    public get isAvaliable(): boolean {
        return this._isAvaliable;
    }

    public set isAvaliable(value: boolean) {
        this._isAvaliable = value;
        this.node.getComponentsInChildren(Sprite).forEach(sprite => {
            sprite.grayscale = !value;
        })
    }


    protected onEnable(): void {
        this.ndPanel.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.ndPanel.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.ndPanel.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.ndPanel.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this.ndText.active = false;
        this._hidePanel();
    }
    protected onDisable(): void {
        this.ndPanel.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.ndPanel.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.ndPanel.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.ndPanel.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }


    private _showPanel() {
        if (!this._isPanelVisible) {
            const uiOpacity = this.ndPanel.getComponent(UIOpacity);
            uiOpacity.opacity = 0;
            tween(uiOpacity)
                .to(0.2, { opacity: 255 }, { easing: 'expoOut' })
                .start();
            this._isPanelVisible = false;
        }

    }
    private _hidePanel() {
        this._isPanelVisible = false;
        this.ndPanel.getComponent(UIOpacity).opacity = 0;
    }
    onTouchStart() {
        // this.node.setScale(0.95, 0.95);

        this._eventArg[0] = SkillButton.Event.START;
        this._eventArg[1] = this._radian;
        this._Listener && this._Listener.apply(this._target, this._eventArg);
    }

    onEvent(listener: Function, target?: any) {
        this._Listener = listener;
        this._target = target;
    }
    onTouchMove(event: EventTouch) {
        event.getUILocation(this._v2);
        this._v3.set(this._v2.x, this._v2.y);

        const startWorldPos = this.node.worldPosition;
        const currWorldPos = this._v3;
        const radian = Math.atan2(currWorldPos.y - startWorldPos.y, currWorldPos.x - startWorldPos.x);

        // this._Listener && this._Listener.apply(this._target, [radian]);
        const distance = Vec2.distance(startWorldPos, currWorldPos);
        if (distance > 50) {
            this._showPanel();
            this._eventArg[0] = SkillButton.Event.MOVE;
            this._eventArg[1] = radian;
            this._radian = radian;
            this._Listener && this._Listener.apply(this._target, this._eventArg);
        } else {
            this._hidePanel();
        }

    }
    onTouchEnd() {
        // this.node.setScale(1, 1);
        this._hidePanel();

        this._isColding = true;
        this._currColdTime = this._coldDownTime;
        this.isAvaliable = false;
        this.ndText.active = true;
        this.ndText.getComponent(Label).string = `${this._currColdTime.toFixed(1)}`;

        this._eventArg[0] = SkillButton.Event.END;
        this._eventArg[1] = this._radian;
        this._Listener && this._Listener.apply(this._target, this._eventArg);

    }
    onTouchCancel() {
        // this.node.setScale(1, 1);
        this._hidePanel();

        this._eventArg[0] = SkillButton.Event.CANCEL;
        this._eventArg[1] = this._radian;
        this._Listener && this._Listener.apply(this._target, this._eventArg);
    }
    start() {

    }

    update(deltaTime: number) {
        if (this._isColding) {
            this._currColdTime -= deltaTime;
            this.ndText.getComponent(Label).string = `${this._currColdTime.toFixed(1)}`;
            if (this._currColdTime <= 0) {
                this._isColding = false;
                this.isAvaliable = true;
                this.ndText.active = false;
            }
        }
    }
}



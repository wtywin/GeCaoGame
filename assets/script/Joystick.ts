import { _decorator, Component, EventTouch, Node, UIOpacity, UITransform, v3, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Joystick')
export class Joystick extends Component {
    @property(Node) ndHand: Node;
    @property(Node) ndPanel: Node;
    

    private _radius: number = 0;

    private _v2: Vec2 = new Vec2();
    private _v3: Vec3 = new Vec3();
    private _currPos: Vec3 = v3();

    private _startPos: Vec3 = v3(0, 0);
    private _listener: Function;
    private _target: any;

    private _arrArg: number[] = [-1, -1];//[event,radian|null]

    static readonly Event = {
        START: 0,
        MOVE: 1,
        END: 2,
        CANCEL: 3
    }
    protected onEnable(): void {
        this._radius = this.ndPanel.getComponent(UITransform).contentSize.width / 2;


        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        this._makeVisible(false);

    }
    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    start() {

    }

    update(deltaTime: number) {

    }

    onTouchStart(event: EventTouch) {
        this._notify(Joystick.Event.START);
        this._makeVisible(true);
        event.getUIStartLocation(this._v2);
        this.node.getComponent(UITransform).convertToNodeSpaceAR(this._v3.set(this._v2.x, this._v2.y), this._startPos);

        this.ndPanel.setPosition(this._startPos);
        this.ndHand.setPosition(this._startPos);
    }

    onTouchMove(event: EventTouch) {
        event.getUILocation(this._v2);//触摸点的世界坐标 world position



        this.node.getComponent(UITransform).convertToNodeSpaceAR(this._v3.set(this._v2.x, this._v2.y), this._currPos);



        const distance = Vec2.distance(this._startPos, this._currPos);
        const radian = Math.atan2(this._currPos.y - this._startPos.y, this._currPos.x - this._startPos.x);

        if (distance < this._radius) {
            this.ndHand.setPosition(this._currPos);

        } else {
            const x = this._startPos.x + Math.cos(radian) * this._radius;
            const y = this._startPos.y + Math.sin(radian) * this._radius;
            this.ndHand.setPosition(x, y);
        }
        this._notify(Joystick.Event.MOVE, radian);


    }

    onTouchEnd() {
        this.ndHand.setPosition(this._startPos);
        this._notify(Joystick.Event.END);
        this._makeVisible(false);
    }

    onTouchCancel() {
        this.ndHand.setPosition(this._startPos);
        this._notify(Joystick.Event.CANCEL);
        this._makeVisible(false);
    }

    onJoystickEvent(listener: Function, target?: any) {
        this._listener = listener;
        this._target = target;
    }

    private _notify(event: number, radian?: number) {
        this._arrArg[0] = event;
        this._arrArg[1] = radian;
        this._listener && this._listener.apply(this._target, this._arrArg)//这个需要查一下文档，搞清楚apply是什么
    }

    private _makeVisible(visible: boolean) {
        this.ndHand.getComponent(UIOpacity).opacity = visible ? 255 : 0;
        this.ndPanel.getComponent(UIOpacity).opacity = visible ? 255 : 0;

    }

}



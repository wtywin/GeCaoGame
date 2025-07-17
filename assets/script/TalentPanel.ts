import { _decorator, Component, EventTouch, Node, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TalentPanel')
export class TalentPanel extends Component {
    @property(Node) ndTalents: Node;


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



    onTouchStart(event: EventTouch) {
        const v2 = event.getUIStartLocation();
        const pos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(v2.x, v2.y));

        if (pos.x < -350 || pos.x > 350) {
            this.node.active = false;
        }
    }

    onTouchEnd() {

    }

    onTouchCancel() {

    }


    start() {

    }

    update(deltaTime: number) {

    }
}



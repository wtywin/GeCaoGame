import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { Skill } from './Skill';
import { Globats } from './Globats';
const { ccclass, property } = _decorator;

@ccclass('SkillCard')
export class SkillCard extends Component {
    @property(Node) ndIcon: Node;
    @property(Node) ndName: Node;
    @property(Node) ndDesc: Node;
    private _skill: Skill;
    private _onClick: Function;
    private _target: any;

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

        this.node.setScale(0.95, 0.95);
    }

    onTouchEnd() {

        this.node.setScale(1, 1);

        this._onClick && this._onClick.apply(this._target);
    }

    onTouchCancel() {

        this.node.setScale(1, 1);
    }

    start() {

    }

    update(deltaTime: number) {

    }

    setSkill(skill: Skill) {
        this._skill = skill;
        if (!skill) {
            return;
        }

        this.ndName.getComponent(Label).string = skill.getName();
        this.ndDesc.getComponent(Label).string = skill.getDescription();

        this.ndIcon.getComponent(Sprite).spriteFrame = Globats.getSkillSpriteFrame(skill.id);
    }

    onClick(onClick: Function, target?: any) {
        this._onClick = onClick;
        this._target = target;
    }
}



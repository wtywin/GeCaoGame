import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { Skill } from './Skill';
import { Globats } from './Globats';
const { ccclass, property } = _decorator;

@ccclass('SkillSlot')
export class SkillSlot extends Component {
    @property(Node) ndIcon: Node;
    @property(Node) ndText: Node;
    private _skill: Skill;

    protected onEnable(): void {

    }

    protected onDisable(): void {

    }
    start() {

    }

    update(deltaTime: number) {

    }

    setSkill(sk: Skill) {
        this._skill = sk;
        if (!sk) {
            this.ndIcon.getComponent(Sprite).spriteFrame = null;
            this.ndText.active = false;
            return;
        }

        this.ndIcon.getComponent(Sprite).spriteFrame = Globats.getSkillSpriteFrame(sk.id);
        this.ndText.active = true;
        this.ndText.getComponent(Label).string = `${sk.level + 1}`;
    }
}



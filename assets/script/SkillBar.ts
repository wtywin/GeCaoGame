import { _decorator, Component, Node } from 'cc';
import { BattleContext } from './BattleContext';
import { SkillSlot } from './SkillSlot';
const { ccclass, property } = _decorator;

@ccclass('SkillBar')
export class SkillBar extends Component {

    private _slots: SkillSlot[] = [];

    protected onLoad(): void {
        this._slots.length = 0;
        for (let i = 0; i < this.node.children.length; i++) {
            this._slots.push(this.node.children[i].getComponent(SkillSlot));
        }
    }

    protected onEnable(): void {
        this.bindNormalSKills();
    }

    protected onDisable(): void {

    }
    start() {

    }

    update(deltaTime: number) {

    }

    bindNormalSKills() {
        const skills = BattleContext.player.normalSkills;
        if (!skills) {
            return;
        }

        for (let i = 0; i < this._slots.length; i++) {
            this._slots[i].setSkill(i < skills.length ? skills[i] : null);
        }
    }
}



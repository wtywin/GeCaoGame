import { _decorator, clamp, Component, Node } from 'cc';
import { Skill, SkillFireball, SkillInvinvible, SkillRoll } from './Skill';
import { Globats } from './Globats';
import { Constant } from './Constant';
import { SkillCard } from './SkillCard';
import { BattleContext } from './BattleContext';
const { ccclass, property } = _decorator;

@ccclass('SkillSelectingView')
export class SkillSelectingView extends Component {
    @property(Node) ndSkills: Node;

    protected onEnable(): void {
        this._showCards();
    }

    protected onDisable(): void {

    }

    start() {


    }

    private _showCards() {
        let sks: Skill[] = [];

        sks.push(new SkillRoll());
        sks.push(new SkillInvinvible());
        sks.push(new SkillFireball());

        this._createSkillCards(sks);
    }
    update(deltaTime: number) {

    }

    private _createSkillCards(skills: Skill[]) {
        if (!skills || skills.length === 0) {
            return;
        }

        const len = skills.length;
        for (let i = 0; i < len; i++) {
            const sk = skills[i];
            const ndCard = Globats.getNode(Constant.PrefabUrl.SKILLCARD, this.ndSkills);
            const card = ndCard.getComponent(SkillCard);
            card.setSkill(sk);
            card.onClick(() => {
                //player 学习技能
                BattleContext.player.learnSkill(sk);
                this.node.active = false;
            })
        }

        const cardWidth = 450;
        const w = 50;
        const y = 0;

        const totalWidth = cardWidth * len + w * (len - 1);
        const half = totalWidth / 2;

        const startX = -half + cardWidth / 2;

        for (let i = 0; i < len; i++) {
            const x = startX + i * (cardWidth + w);
            this.ndSkills.children[i].setPosition(x, y);
        }


    }
}



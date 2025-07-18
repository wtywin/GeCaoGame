import { _decorator, clamp, Component, Node } from 'cc';
import { Skill, SkillFireball } from './Skill';
import { Globats } from './Globats';
import { Constant } from './Constant';
import { SkillCard } from './SkillCard';
const { ccclass, property } = _decorator;

@ccclass('SkillSelectingView')
export class SkillSelectingView extends Component {
    @property(Node) ndSkills: Node;

    start() {
        let skills: Skill[] = [];
        skills.push(new SkillFireball());
        skills.push(new SkillFireball());
        skills.push(new SkillFireball());


        this._createSkillCards(skills);

    }

    update(deltaTime: number) {

    }

    private _createSkillCards(skills: Skill[]) {
        if (!skills || skills.length === 0) {
            return;
        }

        const len = skills.length;
        for (let i = 0; i < len; i++) {
            const ndCard = Globats.getNode(Constant.PrefabUrl.SKILLCARD, this.ndSkills);
            ndCard.getComponent(SkillCard).setSkill(skills[i]);
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



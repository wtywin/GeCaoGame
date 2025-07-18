import { _decorator, Component, Node } from 'cc';
import { Skill } from './Skill';
const { ccclass, property } = _decorator;

@ccclass('SkillCard')
export class SkillCard extends Component {
    @property(Node) ndIcon: Node;
    @property(Node) ndName: Node;
    @property(Node) ndDesc: Node;
    private _skill: Skill;

    protected onEnable(): void {

    }
    protected onDisable(): void {

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

        //TODO 加载数据
    }
}



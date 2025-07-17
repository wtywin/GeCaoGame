import { _decorator, Component, director, Node } from 'cc';
import { NormalButton } from './NormalButton';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    @property(Node) ndButtonTalent: Node;
    @property(Node) ndPanelTalent: Node;
    @property(Node) ndButtonStartGame: Node;

    protected onEnable(): void {
        this.ndButtonTalent.getComponent(NormalButton).onClick(() => {
            this.ndPanelTalent.active = true;
        });

        this.ndButtonStartGame.getComponent(NormalButton).onClick(() => {
            director.loadScene('Battle');
        })

        this.ndPanelTalent.active = false;
    }
    start() {

    }

    update(deltaTime: number) {

    }
}



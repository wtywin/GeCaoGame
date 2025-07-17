import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DamageText')
export class DamageText extends Component {
    @property(Label) pr_Label: Label;



    setLabelText(text: string) {
        this.pr_Label.string = text;
    }
    start() {

    }

    update(deltaTime: number) {

    }
}



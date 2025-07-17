import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Charitem')
export class Charitem extends Component {
    @property(Node) ndAnimation: Node;
    @property(Node) ndName: Node;
    @property(Node) ndDetail: Node;
    start() {

    }

    update(deltaTime: number) {

    }
}



import { _decorator, Component, director, Node } from 'cc';
import { Globats } from './Globats';
const { ccclass, property } = _decorator;

@ccclass('Start')
export class Start extends Component {
    start() {
        Globats.init().then(() => {
            this.scheduleOnce(() => {
                director.loadScene('Main');
            }, 3);

        });


    }

    update(deltaTime: number) {

    }
}



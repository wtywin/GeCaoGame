import { _decorator, Component, director, Node, tween } from 'cc';
import { Globats } from './Globats';
import { ProgressBar } from './ProgressBar';
const { ccclass, property } = _decorator;

@ccclass('Start')
export class Start extends Component {
    start() {
        Globats.init().then(() => {
            this.scheduleOnce(() => {
                director.loadScene('Main');
            }, 2);
            const ndBar = this.node.getChildByName('LoadingBar');

            //TEST
            let prgs = 0;
            let ac = tween(ndBar)
                .delay(0.2)
                .call(() => {
                    prgs += 0.1;
                    ndBar.getComponent(ProgressBar).setProgress(prgs);
                });

            tween(ndBar)
                .repeat(10, ac)
                .start();



        });


    }

    update(deltaTime: number) {

    }
}



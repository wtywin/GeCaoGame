import { _decorator, Component, Node, randomRangeInt } from 'cc';
import { BattleContext } from './BattleContext';
const { ccclass, property } = _decorator;

@ccclass('PlayerCamera')
export class PlayerCamera extends Component {
    private _isShaking: boolean = false;
    private _duration: number = 0.2;
    private _shakeLevel: number = 15;
    private _timer: number = 0;
    start() {

    }

    update(deltaTime: number) {
        if (!BattleContext.ndPlayer || !BattleContext.ndPlayer.isValid) {
            return;
        }

        if (this._isShaking) {
            this._timer += deltaTime;
            if (this._timer > this._duration) {
                this._isShaking = false;
                this._timer = 0;
            } else {
                let shakeX = randomRangeInt(-this._shakeLevel, this._shakeLevel);
                let shakeY = randomRangeInt(-this._shakeLevel, this._shakeLevel);
                this.node.setWorldPosition(
                    BattleContext.ndPlayer.worldPosition.x + shakeX,
                    BattleContext.ndPlayer.worldPosition.y + shakeY,
                    this.node.worldPosition.z)
            }
        }else{
            this.node.worldPosition = BattleContext.ndPlayer.worldPosition;
        }
        



        // if (!(this.node.parent === BattleContext.ndPlayer)) {
        //     this.node.setParent(BattleContext.ndPlayer);
        // }

    }
    shake() {
        this._isShaking = true;
        this._timer = 0;
    }
}



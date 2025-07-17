import { _decorator, clamp, Component, easing, Node, tween, UIOpacity, Vec3 } from 'cc';
import { NormalButton } from './NormalButton';
const { ccclass, property } = _decorator;

@ccclass('CharPanel')
export class CharPanel extends Component {
    @property(Node) ndBtnLeft: Node;
    @property(Node) ndBtnRight: Node;
    @property(Node) ndChars: Node;

    private _currIndex: number = 0;

    protected onEnable(): void {
        this.ndBtnLeft.getComponent(NormalButton).isActivated = true;
        this.ndBtnLeft.getComponent(NormalButton).onClick(() => {
            this.moveLeft();
            this.updateCharItemState();
        });

        this.ndBtnRight.getComponent(NormalButton).isActivated = true;
        this.ndBtnRight.getComponent(NormalButton).onClick(() => {
            this.moveRight();
            this.updateCharItemState();
        });

        this.gotoIndex(0);
    }



    start() {

    }

    update(deltaTime: number) {

    }

    gotoIndex(index: number) {
        index = clamp(index, 0, this.ndChars.children.length - 1);
        this._currIndex = index;

        const pos = new Vec3();
        for (let i = 0; i < this.ndChars.children.length; i++) {
            const child = this.ndChars.children[i];
            child.getPosition(pos);
            if (i < index) {
                pos.x = -200 * (index - i);
            } else if (i > index) {
                pos.x = 200 * (i - index);
            } else {
                pos.x = 0;
            }
            this.ndChars.children[i].setPosition(pos);
        }
        this.updateCharItemState();
    }
    updateCharItemState() {
        for (let i = 0; i < this.ndChars.children.length; i++) {
            this.ndChars.children[i].getComponent(UIOpacity).opacity = i === this._currIndex ? 255 : 80;
        }

        this.ndBtnLeft.active = this._currIndex > 0;
        this.ndBtnRight.active = this._currIndex < this.ndChars.children.length - 1;
    }

    private _moveNext(isNext: boolean) {
        const len = this.ndChars.children.length;
        isNext ? this._currIndex++ : this._currIndex--;
        if (this._currIndex >= len) {
            this._currIndex = len - 1;
            return;
        } else if (this._currIndex < 0) {
            this._currIndex = 0;
            return;
        }

        this.ndBtnLeft.getComponent(NormalButton).isActivated = false;
        this.ndBtnRight.getComponent(NormalButton).isActivated = false;

        const actions: Promise<any>[] = [];

        for (let i = 0; i < len; i++) {
            const child = this.ndChars.children[i];
            const pos = child.getPosition();
            actions.push(new Promise((resovle) => {
                tween(child)
                    .to(0.4, { position: pos.add3f(isNext ? -200 : 200, 0, 0) }, { easing: 'expoOut' })
                    .call(() => {
                        resovle(0);
                    })
                    .start();
            }));

        }

        Promise.all(actions).then(() => {
            this.ndBtnLeft.getComponent(NormalButton).isActivated = true;
            this.ndBtnRight.getComponent(NormalButton).isActivated = true;
        })
    }

    moveRight() {

        this._moveNext(true);
    }

    moveLeft() {
        this._moveNext(false);
    }
}


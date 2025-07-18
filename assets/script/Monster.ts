import { _decorator, bits, Camera, Collider2D, Color, Component, Contact2DType, Node, toDegree, toRadian, tween, Tween, Vec2, Vec3 } from 'cc';
import { BattleContext } from './BattleContext';
import { Constant } from './Constant';
import { Util } from './Util';
import { Weapon } from './Weapon';
import { Sword } from './Sword';
import { Globats } from './Globats';
import { FireExplode } from './FireExplode';
import { Thunder } from './Thunder';
import { Bullet } from './Bullet';
import { PlayerCamera } from './PlayerCamera';
import { BuffHolder } from './Buff';
const { ccclass, property } = _decorator;

@ccclass('Monster')
export class Monster extends Component {
    @property(Node) private ndAni: Node;

    speed: number = 2;
    moveDirection: number = 0;
    ismoving: boolean = false;
    hp: number = 100;
    ap: number = 10;
    dp: number = 5;

    private _buffHolder = new BuffHolder();

    static readonly Event = {
        DEAD: 0,
    }
    private _cb: Function;
    private _target: any;


    protected onEnable(): void {
        let collider = this.node.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this)
        }
        this.hp = 100;
        this._buffHolder.onCallback((uid: number, value: number, color: string) => {
            this.hurt(value, color);
        })

    }
    protected onDisable(): void {
        let collider = this.node.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.off(Contact2DType.END_CONTACT, this.onEndContact, this)
        }
    }



    hurt(val: number, color: string = '#FFFFFF') {
        this.hp -= val;
        Util.showText(
            `${val}`, color, this.node.worldPosition, BattleContext.ndTextParent);
        if (this.hp <= 0) {
            this._cb && this._cb.apply(this._target, [Monster.Event.DEAD]);
            this.node.destroy();
        }
    }

    onMonsterEvent(cb: Function, target?: any) {
        this._cb = cb;
        this._target = target;
    }

    private _hitBack() {
        const tag = 1;
        Tween.stopAllByTag(tag, this.node);
        const inverseRadian = toRadian(toDegree(this.moveDirection) - 180);
        const dest = Util.getPosition(this.node.worldPosition, inverseRadian, 50);

        tween(this.node)
            .tag(tag)
            .to(0.2, { worldPosition: dest }, { easing: 'expoOut' })
            .start();

    }

    onBeginContact(self: Collider2D, other: Collider2D) {
        if (other.group === Constant.ColliderGroup.PLAYER_WEAPON) {

            switch (other.tag) {
                case Constant.WeaponTag.DARGGER:


                    this.hurt(other.node.getComponent(Weapon).attack);
                    break;
                case Constant.WeaponTag.SWORD:

                    this.hurt(other.node.getComponent(Sword).attack);
                case Constant.WeaponTag.FIREBALL:

                    const ndExplode = Globats.getNode(Constant.PrefabUrl.FIRE_EXPLODE, BattleContext.ndWeapon);

                    ndExplode.worldPosition = self.node.worldPosition;
                    ndExplode.getComponent(FireExplode).playAniamtion();
                    Globats.putNode(other.node);
                    break;
                case Constant.WeaponTag.FIREEXPLODE:

                    this.hurt(other.node.getComponent(FireExplode).attack);

                    this._buffHolder.Add(0, '#FF7000', 20, 5, 1);
                    break;
                case Constant.WeaponTag.THUNDER:

                    this.hurt(other.node.getComponent(Thunder).attack);
                    break;
                case Constant.WeaponTag.BULLET:

                    this.hurt(other.node.getComponent(Bullet).attack);
                    this._hitBack();

                    break;
                default:
                    break;
            }
        }
    }
    onEndContact(self: Collider2D, other: Collider2D) {

    }

    start() {
        this.ismoving = true;
        this.schedule(() => {
            if (!BattleContext.ndPlayer || !BattleContext.ndPlayer.isValid) {
                return;
            }
            const deltaX = BattleContext.ndPlayer.worldPosition.x - this.node.worldPosition.x;
            const deltaY = BattleContext.ndPlayer.worldPosition.y - this.node.worldPosition.y;
            this.moveDirection = Math.atan2(deltaY, deltaX);
        }, 0.1)


    }

    update(deltaTime: number) {
        this._buffHolder.update(deltaTime);
        if (this.ismoving) {
            const x = this.node.position.x + Math.cos(this.moveDirection) * this.speed;
            const y = this.node.position.y + Math.sin(this.moveDirection) * this.speed;
            this.node.setPosition(x, y);

            const degree = toDegree(this.moveDirection);
            if (degree >= -90 && degree <= 90) {
                this.ndAni.setScale(1, 1);
            } else {
                this.ndAni.setScale(-1, 1);
            }
        }
    }


}



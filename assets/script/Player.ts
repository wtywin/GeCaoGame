import { _decorator, Animation, bits, Camera, Collider2D, Color, Component, Contact2DType, dragonBones, instantiate, Label, Node, toDegree, toRadian, Tween, tween, Vec2, Vec3 } from 'cc';
import { Constant } from './Constant';
import { Util } from './Util';
import { BattleContext } from './BattleContext';
import { Weapon } from './Weapon';
import { PoolManager } from './PoolManager';
import { Surround } from './Surround';
import { Globats } from './Globats';
import { Thunder } from './Thunder';
import { FireBall } from './FireBall';
import { Bullet } from './Bullet';
import { PlayerCamera } from './PlayerCamera';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    @property(Node) private ndAni: Node;
    @property(Node) ndweapon0: Node;
    @property(Node) ndShootStart: Node;

    speed: number = 4;
    moveDirection: number = 0;
    // ismoving: boolean = false;

    private _isMoving: boolean = false;
    private _shootPos: Vec3 = new Vec3();

    public get isMoving(): boolean {
        return this._isMoving;
    }
    public set isMoving(value: boolean) {
        this._isMoving = value;
        this._isMoving ? this.playWalk() : this.playIdle();

    }

    playWalk() {
        const display = this.ndAni.getComponent(dragonBones.ArmatureDisplay);
        display.armatureName = 'Walk';
        display.playAnimation('Walk', 0);

    }
    playIdle() {
        const display = this.ndAni.getComponent(dragonBones.ArmatureDisplay);
        display.armatureName = 'Idle';
        display.playAnimation('Idle', 0);

    }

    setWeaponAngle(angle: number) {
        this.ndweapon0.angle = angle;
    }

    getShootPosition() {
        // const radius = 34;
        // const radian = toRadian(this.ndweapon0.angle);
        // const startPos = this.ndweapon0.worldPosition;


        // this._shootPos.x = startPos.x + Math.cos(radian) * radius;
        // this._shootPos.y = startPos.y + Math.sin(radian) * radius;
        // return this._shootPos;
        return this.ndShootStart.worldPosition;
    }

    attickDirection: number = 0;
    autoDirection: boolean = true;
    // Playercollider: Collider2D = null;

    hp: number = 100;
    ap: number = 0;
    dp: number = 0;

    protected onEnable(): void {
        let collider = this.node.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }

    }
    protected onDisable(): void {
        let collider = this.node.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
        this.unscheduleAllCallbacks();
    }

    onBeginContact(self: Collider2D, other: Collider2D) {
        if (other.group === Constant.ColliderGroup.MONSTER) {
            Util.showText(
                '12', Color.RED.toString(),
                this.node.worldPosition,
                BattleContext.ndTextParent);
        }
    }

    onEndContact() {

    }

    start() {
        this._isMoving = false;

        this.schedule(() => {
            const nearsetNode = this.getNearestMonster();
            if (nearsetNode) {
                //todo
                this.attickDirection = Util.getRadian(this.node.worldPosition, nearsetNode.worldPosition);

                this.autoDirection && this.setWeaponAngle(toDegree(this.attickDirection));
            }
        }, 0.1)
    }

    update(deltaTime: number) {
        if (this.isMoving) {
            //TODO
            // Util.moveNode(this.node, this.moveDirection, this.speed);
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

    startShootBllet() {
        const tw = tween(this.node)

            .call(() => {

                const ndBullet = Globats.getNode(Constant.PrefabUrl.BULLET, BattleContext.ndWeapon);
                ndBullet.worldPosition = this.getShootPosition();

                const wp = ndBullet.getComponent(Bullet);
                wp.isMoving = true;
                wp.moveDirection = toRadian(this.ndweapon0.angle);
                wp.speed = 40;

                BattleContext.ndCamera.getComponent(PlayerCamera).shake();
            })
            .delay(0.2)

        tween(this.node)
            .tag(1)
            .repeatForever(tw)
            .start();
    }

    stopShootBullet() {
        Tween.stopAllByTag(1);
    }
    startEndlessDagger() {

        const tw = tween(this.node)
            .delay(0.1)
            .call(() => {

                const ndDagger = Globats.getNode(Constant.PrefabUrl.DAGGER, BattleContext.ndWeapon);
                ndDagger.worldPosition = this.node.worldPosition;
                ndDagger.angle = toDegree(this.attickDirection);
                const wp = ndDagger.getComponent(Weapon);
                wp.isMoving = true;
                wp.moveDirection = this.attickDirection;
                wp.speed = 12;
            })

        tween(this.node)
            .repeatForever(tw)
            .start();

    }

    startSurroundingSwords() {
        const ndSurround = Globats.getNode(Constant.PrefabUrl.SURROUND, BattleContext.ndPlayer);
        ndSurround.getComponent(Surround).ismoving = true;
    }

    getNearestMonster() {
        const monsters = BattleContext.ndMosterParent.children;
        let min = bits.INT_MAX;
        let target: Node = null;
        for (let i = 0; i < monsters.length; i++) {
            const distance = Vec2.distance(monsters[i].worldPosition, this.node.worldPosition);
            if (distance < min) {
                target = monsters[i];
            }
        }
        return target;
    }

    startFireball() {

        const tw = tween(this.node)
            .delay(1.5)
            .call(() => {
                const deltaAngle = 30;
                const startDegree = toDegree(this.attickDirection) - deltaAngle;
                for (let i = 0; i < 3; i++) {
                    const ndFireball = Globats.getNode(Constant.PrefabUrl.FIREBALL, BattleContext.ndWeapon);
                    ndFireball.worldPosition = this.node.worldPosition;
                    ndFireball.angle = startDegree + deltaAngle * i;
                    const wp = ndFireball.getComponent(Weapon);
                    wp.isMoving = true;
                    wp.moveDirection = toRadian(startDegree + deltaAngle * i);
                    wp.attack = 30;
                    wp.speed = 12;
                }

            })

        tween(this.node)
            .repeatForever(tw)
            .start();

    }
    startThunder() {

        const tw = tween(this.node)
            .delay(2)
            .call(() => {
                for (let i = 0; i < 3; i++) {
                    this.scheduleOnce(() => {
                        const nearestMonster = this.getNearestMonster();
                        if (nearestMonster) {
                            const ndThunder = Globats.getNode(Constant.PrefabUrl.THUNDER, BattleContext.ndWeapon);
                            ndThunder.worldPosition = nearestMonster.worldPosition;

                            ndThunder.getComponent(Thunder).startThunder();

                        }
                    }, 0.15 * i)

                }

            })

        tween(this.node)
            .repeatForever(tw)
            .start();

    }

    castFireball(radian: number) {
        const ndFireball = Globats.getNode(Constant.PrefabUrl.FIREBALL, BattleContext.ndWeapon);

        ndFireball.worldPosition = this.node.worldPosition;
        ndFireball.angle = toDegree(radian);
        const wp = ndFireball.getComponent(FireBall);
        wp.isMoving = true;
        wp.attack = 20;
        wp.speed = 30;
        wp.moveDirection = radian;


        return ndFireball;
    }
}



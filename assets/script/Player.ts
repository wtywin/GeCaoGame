import { _decorator, bits, Collider2D, Color, Component, Contact2DType, dragonBones, Node, randomRangeInt, toDegree, toRadian, Tween, tween, UIOpacity, Vec2, Vec3 } from 'cc';
import { Constant } from './Constant';
import { Util } from './Util';
import { BattleContext } from './BattleContext';
import { Weapon } from './Weapon';
import { Surround } from './Surround';
import { Globats } from './Globats';
import { Thunder } from './Thunder';
import { FireBall } from './FireBall';
import { Bullet } from './Bullet';
import { PlayerCamera } from './PlayerCamera';
import { ProgressBar } from './ProgressBar';
import { EBullet } from './EBullet';
import { Skill } from './Skill';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    @property(Node) private ndAni: Node;
    @property(Node) ndweapon0: Node;
    @property(Node) ndShootStart: Node;
    @property(Node) ndReloadProgress: Node;

    speed: number = 4;
    moveDirection: number = 0;
    // ismoving: boolean = false;

    private _isMoving: boolean = false;
    private _isUnattackable: boolean = false;
    private _shootPos: Vec3 = new Vec3();
    private _onEvent: Function;
    private _target: any;

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

    playRoll() {
        const display = this.ndAni.getComponent(dragonBones.ArmatureDisplay);
        display.armatureName = 'Walk';
        display.playAnimation('Walk', 1);
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

    maxHp: number = 100;
    maxExp: number = 100;

    level: number = 1;
    hp: number = 0;
    ap: number = 0;
    dp: number = 0;
    exp: number = 0;

    bulletCount: number = 5;

    activeSkills: Skill[] = [];
    normalSkills: Skill[] = [];// TODO  最高8个技能

    static readonly Event = {
        HURT: 0,
        DEAD: 1,
        ADD_EXP: 2,
        LEVEL_UP: 3
    }

    protected onEnable(): void {
        let collider = this.node.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }

        this.level = 1;
        this.hp = this.maxHp = 100;
        this.maxExp = this._getNextLevelExp(this.level);
        this.exp = 0;

        this.ndReloadProgress.active = false;

        this.activeSkills.length = 0;
        this.normalSkills.length = 0;
    }
    protected onDisable(): void {
        let collider = this.node.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
        this.unscheduleAllCallbacks();
    }

    hurt(damage: number) {

        if (this._isUnattackable) {
            return;
        }
        this.hp -= damage;
        Util.showText(`${damage}`, Color.RED.toHEX(), this.node.worldPosition, BattleContext.ndTextParent);
        if (this.hp <= 0) {
            this.hp = 0;
            //TODO notify die
            this._onEvent && this._onEvent.apply(this._target, [Player.Event.DEAD, 0]);
        } else {
            //TODO notify hurt
            this._onEvent && this._onEvent.apply(this._target, [Player.Event.HURT, damage]);
        }
    }

    private _getNextLevelExp(level: number) {
        return (level + 1) * 50;
    }

    learnSkill(sk: Skill) {
        const skill = this.activeSkills.find(target => target.id === sk.id);
        if (skill) {
            skill.levelUp();
        } else {
            this.activeSkills.push(sk);
        }

        this.updateSkill();
    }

    updateSkill() {
        //TODO
    }

    addExp(exp: number) {
        this.exp += exp;
        this._onEvent && this._onEvent.apply(this._target, [Player.Event.ADD_EXP, exp]);

        if (this.exp >= this.maxExp) {
            this.exp -= this.maxExp;
            this.level++;
            this.maxExp = this._getNextLevelExp(this.level);
            this._onEvent && this._onEvent.apply(this._target, [Player.Event.LEVEL_UP, -1]);
        }
    }

    onPlayerEvent(onEvent: Function, target?: any) {
        this._onEvent = onEvent;
        this._target = target;
    }

    onBeginContact(self: Collider2D, other: Collider2D) {
        switch (other.group) {
            case Constant.ColliderGroup.MONSTER:
                this.hurt(randomRangeInt(5, 10));
                break;

            case Constant.ColliderGroup.MONSTER_WEAPON:
                if (other.tag === Constant.WeaponTag.EBULLET) {
                    const bullet = other.node.getComponent(EBullet);
                    this.hurt(bullet.attack);
                }
            default:
                break;
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

    shootBullet() {
        if (this.bulletCount <= 0) {

            return;
        }

        this.bulletCount--;

        const ndBullet = Globats.getNode(Constant.PrefabUrl.BULLET, BattleContext.ndWeapon);
        ndBullet.worldPosition = this.getShootPosition();

        const wp = ndBullet.getComponent(Bullet);
        wp.isMoving = true;
        wp.moveDirection = toRadian(this.ndweapon0.angle);
        wp.speed = 40;

        BattleContext.ndCamera.getComponent(PlayerCamera).shake();

        if (this.bulletCount <= 0) {
            this.reloadBullet();

        }
    }

    reloadBullet() {
        this.ndweapon0.active = false;
        const bar = this.ndReloadProgress.getComponent(ProgressBar);
        bar.setProgress(0);
        this.ndReloadProgress.active = true;

        const temp = new Vec3;
        tween(temp)
            .to(3, { x: 1 }, {
                onUpdate: (target: Vec3, ratio: number) => {
                    bar.setProgress(ratio);
                }
            })
            .call(() => {
                this.ndReloadProgress.active = false;
                this.ndweapon0.active = true;
                this.bulletCount = 5;
            })
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

    castFireball(radian?: number) {
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

    castRoll() {
        const distance = 500;

        const endPos = Util.getPosition(this.node.position, this.moveDirection, distance);
        this.ndweapon0.active = false;
        this.playRoll();
        tween(this.node)
            .to(0.4, { position: endPos }, { easing: 'expoOut' })
            .call(() => {
                this.ndweapon0.active = true;
                this.playIdle();
            })
            .start();


    }

    castUnattackable() {
        const op = this.node.getComponent(UIOpacity);
        op.opacity = 180;
        this._isUnattackable = true;

        const restoreOpacity = () => {
            op.opacity = 255;
            this._isUnattackable = false;
        };

        this.unschedule(restoreOpacity);
        this.scheduleOnce(restoreOpacity, 2);
    }
}



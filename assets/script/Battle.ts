import { _decorator, Component, director, Layers, Node, randomRangeInt, resources, Sprite, SpriteFrame, toDegree, UITransform } from 'cc';
import { Joystick } from './Joystick';
import { Player } from './Player';
import { BattleContext } from './BattleContext';
import { Monster } from './Monster';
import { Constant } from './Constant';
import { Globats } from './Globats';
import { SkillButton } from './SkillButton';
import { NormalButton } from './NormalButton';
import { ProgressBar } from './ProgressBar';
import { Skill } from './Skill';
import { GlobalEvent } from './GlobalEvent';
const { ccclass, property } = _decorator;

@ccclass('Battle')
export class Battle extends Component {
    @property(Node) ndPlayer: Node;
    @property(Node) ndJoystick: Node;
    @property(Node) ndIndicator: Node;
    @property(Node) ndButtonEndGame: Node;
    @property(Node) ndGround: Node;
    @property(Node) ndLifeBar: Node;
    @property(Node) ndExpBar: Node;
    @property(Node) ndSkillSelectingView: Node;


    private _sk0Button: SkillButton;
    private _sk1Button: SkillButton;
    private _sk2Button: SkillButton;

    protected onLoad(): void {
        BattleContext.ndCamera = this.node.getChildByName('Camera');
        BattleContext.ndPlayer = this.ndPlayer;
        BattleContext.player = this.ndPlayer.getComponent(Player);

        const ndSkills = this.node.getChildByName('Skills');

        this._sk0Button = ndSkills.getChildByName("BtnSk0").getComponent(SkillButton);
        this._sk1Button = ndSkills.getChildByName("BtnSk1").getComponent(SkillButton);
        this._sk2Button = ndSkills.getChildByName("BtnSk2").getComponent(SkillButton);


        const createSubNode = (name: string) => {
            const subNode = new Node(name);
            this.node.addChild(subNode);
            subNode.layer = Layers.Enum.UI_2D;
            return subNode;
        }

        BattleContext.ndMosterParent = createSubNode('MosterParent');
        BattleContext.ndTextParent = createSubNode('TextParent');
        BattleContext.ndWeapon = createSubNode('Weapon');



    }

    protected onEnable(): void {
        this._rebindSkillBtuuons();
        this.ndJoystick.getComponent(Joystick).onJoystickEvent((event: number, radian: number | null | undefined) => {
            switch (event) {
                case Joystick.Event.START:
                    BattleContext.player.isMoving = true;


                    break;
                case Joystick.Event.MOVE:
                    if (radian !== null && radian !== undefined) {
                        BattleContext.player.moveDirection = radian;

                    }
                    break;
                case Joystick.Event.END:
                case Joystick.Event.CANCEL:
                    BattleContext.player.isMoving = false;

                    break;
                default:
                    break;
            }
        });
        // this.ndBtnSkill.getComponent(SkillButton).onEvent((event: number, radian: number) => {

        //     switch (event) {
        //         case SkillButton.Event.START:
        //             this.ndIndicator.active = true;
        //             break;
        //         case SkillButton.Event.MOVE:

        //             this.ndIndicator.angle = toDegree(radian);
        //             break;
        //         case SkillButton.Event.END:
        //             this.ndIndicator.active = false;
        //             BattleContext.player.castFireball(radian);
        //             break;
        //         case SkillButton.Event.CANCEL:
        //             break;
        //         default:
        //             break;
        //     }

        // });
        // this.ndBtnAttack.getComponent(SkillButton).coldDownTime = 0.1;
        // this.ndBtnAttack.getComponent(SkillButton).onEvent((event: number, radian: number) => {

        //     switch (event) {
        //         case SkillButton.Event.START:
        //             // BattleContext.player.startShootBllet();

        //             break;
        //         case SkillButton.Event.MOVE:
        //             // BattleContext.player.autoDirection = false;
        //             // BattleContext.player.setWeaponAngle(toDegree(radian));


        //             break;
        //         case SkillButton.Event.END:
        //             // BattleContext.player.autoDirection = false;
        //             // BattleContext.player.stopShootBullet();
        //             BattleContext.player.shootBullet();
        //             break;
        //         case SkillButton.Event.CANCEL:
        //             // BattleContext.player.autoDirection = false;
        //             // BattleContext.player.stopShootBullet();
        //             break;
        //         default:
        //             break;
        //     }
        // });

        // this.ndBtnRoll.getComponent(SkillButton).onEvent((event: number, radian: number) => {
        //     switch (event) {
        //         case SkillButton.Event.END:
        //             // BattleContext.player.castRoll();
        //             BattleContext.player.castUnattackable();
        //             break;
        //         default:
        //             break;
        //     }
        // })
        this.ndButtonEndGame.getComponent(NormalButton).onClick(() => {
            director.loadScene('Main');
        })

        const lifeBar = this.ndLifeBar.getComponent(ProgressBar);
        lifeBar.setProgress(1);
        const expBar = this.ndExpBar.getComponent(ProgressBar);
        expBar.setProgress(0);
        BattleContext.player.onPlayerEvent((event: number, value: number) => {
            switch (event) {
                case Player.Event.HURT:
                    lifeBar.setProgress(BattleContext.player.hp / BattleContext.player.maxHp);
                    break;
                case Player.Event.DEAD:
                    GlobalEvent.broadcast(Constant.Event.GAME_OVER);
                    break;
                case Player.Event.ADD_EXP:
                    expBar.setProgress(BattleContext.player.exp / BattleContext.player.maxExp);
                    break;
                case Player.Event.LEVEL_UP:
                    this.ndSkillSelectingView.active = true;
                    break;
                default:
                    break;
            }
        })
        this.ndSkillSelectingView.active = false;
        this.ndPlayer.getComponent(Player).isMoving = true;
        this.ndIndicator.active = false;
    }


    private _rebindSkillBtuuons() {
        this._sk0Button.coldDownTime = 0;
        this._sk0Button.onEvent((event: number, radian: number) => {
            if (event === SkillButton.Event.END) {
                BattleContext.player.shootBullet();
            }
        });

        this._sk1Button.getComponent(SkillButton).onEvent((event: number, radian: number) => {
            switch (event) {
                case SkillButton.Event.START:
                    this.ndIndicator.active = true;
                    break;
                case SkillButton.Event.MOVE:
                    this.ndIndicator.angle = toDegree(radian);
                    break;
                case SkillButton.Event.END:
                    this.ndIndicator.active = false;
                    BattleContext.player.castFireball();
                    break;
                case SkillButton.Event.CANCEL:
                    this.ndIndicator.active = false;
                    break;
                default:
                    break;

            }
        });

        this._sk1Button.getComponent(SkillButton).onEvent((event: number, radian: number) => {
            switch (event) {
                case SkillButton.Event.START:
                    this.ndIndicator.active = true;
                    break;
                case SkillButton.Event.MOVE:
                    this.ndIndicator.angle = toDegree(radian);
                    break;
                case SkillButton.Event.END:
                    this.ndIndicator.active = false;
                    BattleContext.player.castFireball();
                    break;
                case SkillButton.Event.CANCEL:
                    this.ndIndicator.active = false;
                    break;
                default:
                    break;

            }
        });

        this._sk2Button.getComponent(SkillButton).onEvent((event: number, radian: number) => {
            switch (event) {
                case SkillButton.Event.START:

                    break;
                case SkillButton.Event.MOVE:

                    break;
                case SkillButton.Event.END:

                    BattleContext.player.castRoll();
                    break;
                case SkillButton.Event.CANCEL:

                    break;
                default:
                    break;

            }
        });
    }
    start() {
        this._generateGround();
        this._startGame();

        // this.schedule(this._onGameSpawned, 2);
    }

    update(deltaTime: number) {
        // this._updateMonsterLayers();
    }

    private _onGameSpawned() {
        const min = -1920;
        const max = 1920;

        const createOne = () => {
            const x = randomRangeInt(min, max);
            const y = randomRangeInt(min, max);
            const node = Globats.getNode(Constant.PrefabUrl.PINK_MONSTER, BattleContext.ndMosterParent);
            node.setPosition(x, y);

            const monster = node.getComponent(Monster);
            monster.speed = 2;
            monster.hp = 50;
        };
        if (BattleContext.ndMosterParent.children.length < 50) {
            for (let i = 0; i < 5; i++) {
                createOne();
            }
        }

    }
    private _updateMonsterLayers() {
        const monsters = BattleContext.ndMosterParent.children;
        for (let i = 0; i < monsters.length; i++) {
            for (let j = i + 1; j < monsters.length; j++) {
                if (monsters[j].position.y > monsters[i].position.y) {
                    const index = monsters[i].getSiblingIndex();
                    monsters[j].setSiblingIndex(index);
                }
            }
        }
    }
    private _startGame() {

        for (let i = 0; i < 20; i++) {

            const node = Globats.getNode(Constant.PrefabUrl.PINK_MONSTER, BattleContext.ndMosterParent);
            node.setPosition(randomRangeInt(-1000, 1000), randomRangeInt(-1000, 1000));
            const monster = node.getComponent(Monster);
            monster.speed = 1.3 + i * 0.1;
            monster.getComponent(Monster).hp = 100;
            monster.onMonsterEvent((event: number) => {
                switch (event) {
                    case Monster.Event.DEAD:
                        BattleContext.player.addExp(10);
                        break;
                    default:
                        break;
                }
            });
            monster.startAction();
        }

        // BattleContext.ndPlayer.getComponent(Player).startEndlessDagger();
        // BattleContext.ndPlayer.getComponent(Player).startSurroundingSwords();
        // BattleContext.ndPlayer.getComponent(Player).startFireball();
        BattleContext.ndPlayer.getComponent(Player).startThunder();
    }
    private _generateGround() {
        resources.loadDir('grounds/', SpriteFrame, (err: Error, date: SpriteFrame[]) => {
            if (err) {
                return;
            }
            for (let i = 0; i < 5; i++) {
                const frame = date[randomRangeInt(0, date.length)];
                const node = new Node();
                node.layer = Layers.Enum.UI_2D;
                node.addComponent(UITransform);
                node.addComponent(Sprite).spriteFrame = frame;
                node.parent = this.ndGround;
            }
            this.ndGround.children.forEach(child => {
                child.setPosition(
                    randomRangeInt(-2000, 2000),
                    randomRangeInt(-2000, 2000)
                )
            })
        })
    }

}



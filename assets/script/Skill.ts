
export enum SkillID {
    NONE = 0,
    FIRE_BALL = 1,
    LIGNTNING = 2,
}

export abstract class Skill {
    private _id: number = SkillID.NONE;
    private _composedId: number = SkillID.NONE;
    private _level: number = 0;
    private _maxlevel: number = 0;

    get id() { return this._id; };
    get composedId() { return this._composedId; };
    get level() { return this._level; };
    get maxlevel() { return this._maxlevel; };
    get isMaxLevel() { return this._level >= this._maxlevel; };

    protected constructor(id: number, composedId: number, level: number = 0, maxLevel: number = 4) {
        this._id = id;
        this._composedId = composedId;
        this._level = level;
        this._maxlevel = maxLevel;
    }

    public levelUp(): void {
        !this.isMaxLevel && this._level++;
    }
    public abstract getName(): string;
    public abstract getDescription(): string;
}

export class SkillFireball extends Skill {
    public constructor() {
        super(SkillID.FIRE_BALL, SkillID.NONE)
    }

    public getName(): string {
        return "火球术";
    }
    public getDescription(): string {
        return '发射火球点燃敌人';
    }

}

export class SkillLightning extends Skill {

    public constructor() {
        super(SkillID.LIGNTNING, SkillID.NONE);
    }
    public getName(): string {
        return '闪电';
    }
    public getDescription(): string {
        return '发射闪电击中敌人';
    }

}


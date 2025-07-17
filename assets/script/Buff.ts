
export interface IBuff {
    Uid: number;
    Color: string;
    Value: number;

    Elapsed: number;
    TotalElapsed: number;
    Duration: number;
    Interval: number;
}

export class BuffHolder {
    private _buffs: IBuff[] = [];
    private _cb: Function;
    private _target: any;

    public Add(uid: number, color: string, value: number, duration: number, interval: number) {
        let buff = this._buffs.find(b => b.Uid == uid);
        if (buff) {
            buff.Value = value;
            buff.Duration = duration;
            buff.Interval = interval;
            buff.Elapsed = 0;
            buff.TotalElapsed = 0;
        } else {
            this._buffs.push({
                Uid: uid,
                Color: color,
                Value: value,
                Elapsed: 0,
                TotalElapsed: 0,
                Duration: duration,
                Interval: interval
            })
        }
    }

    public remove(uid: number) {
        let index = this._buffs.findIndex(b => b.Uid == uid);
        if (index > -1) {
            this._buffs.splice(index, 1);
        }
    }

    public onCallback(cb: Function, target?: any) {
        this._cb = cb;
        this._target = target;
    }
    public update(dt: number) {
        for (let i = 0; i < this._buffs.length; i++) {
            let buff = this._buffs[i];
            buff.Elapsed += dt;
            buff.TotalElapsed += dt;

            if (buff.Elapsed >= buff.Interval) {
                buff.Elapsed = 0;
                this._cb && this._cb.apply(this._target, [buff.Uid, buff.Value, buff.Color]);

            }

            if (buff.TotalElapsed >= buff.Duration) {
                this.remove(buff.Uid);
                i--;
            }
        }
    }
}
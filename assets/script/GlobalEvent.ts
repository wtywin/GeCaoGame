
type EventStruct = { Event: number, Callback: Function, Target: any };

export class GlobalEvent {
    private static _events: EventStruct[] = [];

    static on(event: number, callback: Function, target: any) {
        const it = this._events.find(ev =>
            ev.Event === event &&
            ev.Callback === callback &&
            ev.Target === target);
        if (!it) {
            this._events.push({ Event: event, Callback: callback, Target: target });
        }
    }

    static off(event: number, callback: Function, target: any) {
        const idx = this._events.findIndex(ev =>
            ev.Event === event &&
            ev.Callback === callback &&
            ev.Target === target)
        if (idx > -1) {
            this._events.splice(idx, 1);
        }

    }

    static broadcast(event: number, ..._args: any) {
        const argArray: any[] = [];
        for (let i = 0; i < arguments.length; i++) {
            argArray.push(arguments[i]);
        }

        for (let i = 0; i < this._events.length; i++) {
            if (this._events[i].Event === event) {
                this._events[i].Callback.apply(this._events[i].Target, argArray);
            }
        }
    }
}
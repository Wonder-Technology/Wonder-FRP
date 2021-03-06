import { Observer } from "../core/Observer";
import { IObserver } from "./IObserver";

export class TakeUntilObserver extends Observer {
    public static create(prevObserver: IObserver) {
        return new this(prevObserver);
    }

    private _prevObserver: IObserver = null;

    constructor(prevObserver: IObserver) {
        super(null, null, null);

        this._prevObserver = prevObserver;
    }

    protected onNext(value) {
        this._prevObserver.completed();
    }

    protected onError(error) {
        this._prevObserver.error(error);
    }

    protected onCompleted() {
    }
}
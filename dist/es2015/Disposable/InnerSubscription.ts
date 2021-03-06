import { IDisposable } from "./IDisposable";
import { Subject } from "../subject/Subject";
import { GeneratorSubject } from "../subject/GeneratorSubject";
import { Observer } from "../core/Observer";

export class InnerSubscription implements IDisposable {
    public static create(subject: Subject | GeneratorSubject, observer: Observer) {
        var obj = new this(subject, observer);

        return obj;
    }

    private _subject: Subject | GeneratorSubject = null;
    private _observer: Observer = null;

    constructor(subject: Subject | GeneratorSubject, observer: Observer) {
        this._subject = subject;
        this._observer = observer;
    }

    public dispose() {
        this._subject.remove(this._observer);

        this._observer.dispose();
    }
}
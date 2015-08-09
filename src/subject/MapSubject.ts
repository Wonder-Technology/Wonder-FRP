/// <reference path="../definitions.d.ts"/>
module dyRt{
    export class MapSubject extends GeneratorSubject{
        public static create(source:GeneratorSubject, selector:Function) {
            var obj = new this(source, selector);

            return obj;
        }

        private _source:GeneratorSubject = null;
        private _selector:Function = null;

        constructor(source:GeneratorSubject, selector:Function){
            super();

            this._source = source;
            this._selector = selector;
        }

        public next(value:any){
            try{
                this._source.next(this._selector(value));
            }
            catch(e){
                this._source.error(e);
            }
        }

        public error(err:any){
            this._source.error(err);
        }

        public completed(){
            this._source.completed();
        }

        public start(){
            this._source.start();
        }

        public subscribe(arg1?:Function|Observer, onError?:Function, onCompleted?:Function):IDisposable{
            return this._source.subscribe(arg1, onError, onCompleted);
        }

        public remove(observer:Observer){
            this._source.remove(observer);
        }

        public dispose(){
            this._source.dispose();
        }
    }
}


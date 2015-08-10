/// <reference path="../definitions.d.ts"/>
module dyRt{
    var only_handle_generatorsubject_info_func = function(operatorName){
        return "GeneratorSubject->" + operatorName + " can only handle GeneratorSubject";
    };

    export class GeneratorSubject extends Disposer implements IObserver {
        private _isStart:boolean = false;
        get isStart(){
            return this._isStart;
        }
        set isStart(isStart:boolean){
            this._isStart = isStart;
        }

        constructor(){
            super("GeneratorSubject");
        }

        public observer:any = new SubjectObserver();
        public parent:any = null;

        /*!
        outer hook method
         */
        public onBeforeNext(value:any){
        }

        public onAfterNext(value:any) {
        }

        public onIsCompleted(value:any) {
            return false;
        }

        public onBeforeError(error:any) {
        }

        public onAfterError(error:any) {
        }

        public onBeforeCompleted() {
        }

        public onAfterCompleted() {
        }


        public subscribe(arg1?:Function|Observer, onError?:Function, onCompleted?:Function):IDisposable{
            var observer = arg1 instanceof Observer
                ? <AutoDetachObserver>arg1
                    : AutoDetachObserver.create(<Function>arg1, onError, onCompleted);

            this.observer.addChild(observer);

            this.setDisposeHandler(observer);

            return InnerSubscription.create(this, observer);
        }

        public next(value:any){
            if(!this._isStart){
                return;
            }

            try{
                this.onBeforeNext(value);

                this.observer.next(value);

                this.onAfterNext(value);

                if(this.onIsCompleted(value)){
                    this.completed();
                }
            }
            catch(e){
                this.error(e);
            }
        }

        public error(error:any){
            if(!this._isStart){
                return;
            }

            this.onBeforeError(error);

            this.observer.error(error);

            this.onAfterError(error);
        }

        public completed(){
            if(!this._isStart){
                return;
            }

            this.onBeforeCompleted();

            this.observer.completed();

            this.onAfterCompleted();
        }

        public start(){
            this._isStart = true;
        }

        public stop(){
            this._isStart = false;
        }

        public isAllStop(){
            return !this._isStart;
        }

        public getNext(source:GeneratorSubject){
            return null;
        }

        public remove(observer:Observer){
            this.observer.removeChild(observer);
        }

        public dispose(){
            this.observer.dispose();
        }

        public concat(subjectArr:Array<GeneratorSubject>);
        public concat(...otherSubject);

        public concat(){
            var args = null;

            if(JudgeUtils.isArray(arguments[0])){
                args = arguments[0];
            }
            else{
                args = Array.prototype.slice.call(arguments, 0);
            }

            dyCb.Log.error(!this._areAllParamsGenerorSubject(args), only_handle_generatorsubject_info_func("concat"));

            return ConcatSubject.create(this, args);
        }

        //public merge(subjectArr:Array<GeneratorSubject>);
        //public merge(...otherSubject);

        //public merge(){
        //    var args = null;
        //
        //    if(JudgeUtils.isArray(arguments[0])){
        //        args = arguments[0];
        //    }
        //    else{
        //        args = Array.prototype.slice.call(arguments, 0);
        //    }
        //
        //    dyCb.Log.error(!this._areAllParamsGenerorSubject(args), only_handle_generatorsubject_info_func("merge"));
        //
        //    return MergeSubject.create(this, args);
        //}

        public map(selector:Function):MapSubject{
            return MapSubject.create(this, selector);
        }

        public do(onNext?:Function, onError?:Function, onCompleted?:Function) {
            return DoSubject.create(this, onNext, onError, onCompleted);
        }

        public takeUntil(otherSubject:GeneratorSubject){
            dyCb.Log.error(!this._areAllParamsGenerorSubject([otherSubject]), only_handle_generatorsubject_info_func("takeUntil"));

            return TakeUntilSubject.create(this, otherSubject);
        }

        protected setDisposeHandler(observer:Observer){
            var self = this;

            this.addDisposeHandler(() => {
                self.dispose();
            });

            observer.setDisposeHandler(this.disposeHandler);
        }

        private _areAllParamsGenerorSubject(subjectArr:Array<GeneratorSubject>){
            var i = null,
                len = subjectArr.length;

            for(i = 0; i < len; i++){
                if((subjectArr[i] instanceof GeneratorSubject) === false){
                    return false;
                }
            }

            return true;
        }
    }
}

/// <reference path="../filePath.d.ts"/>
module dyRt{
    export class AutoDetachObserver extends Observer{
        public static create(observer:IObserver);
        public static create(onNext:Function, onError:Function, onCompleted:Function);

        public static create(...args) {
            if(args.length === 1){
                return new this(args[0]);
            }
            else{
                return new this(args[0], args[1], args[2]);
            }
        }

        public dispose(){
            if(this.isDisposed){
                dyCb.Log.log("only can dispose once");
                return;
            }

            super.dispose();
        }

        protected onNext(value) {
            try {
                this.onUserNext(value);
            }
            catch (e) {
                this.onError(e);
            }
        }

        protected onError(err) {
            try {
                this.onUserError(err);
            }
            catch (e) {
                throw e;
            }
            finally{
                this.dispose();
            }
        }

        protected onCompleted() {
            try {
                this.onUserCompleted();
                this.dispose();
            }
            catch (e) {
                throw e;
            }
        }
    }
}

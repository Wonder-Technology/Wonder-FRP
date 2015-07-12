/// <reference path="../definitions.d.ts"/>
module dyRt {
    const SUBSCRIBE_TIME = 200;
    const DISPOSE_TIME = 1000;

    export class TestScheduler extends Scheduler {
        public static next(tick, value) {
            return Record.create(tick, value, ActionType.NEXT);
        }

        public static error(tick, error) {
            return Record.create(tick, error, ActionType.ERROR);
        }

        public static completed(tick) {
            return Record.create(tick, null, ActionType.COMPLETED);
        }

        public static create() {
            var obj = new this();

            return obj;
        }

        private _clock:number = null;
        get clock() {
            return this._clock;
        }

        set clock(clock:number) {
            this._clock = clock;
        }

        private _isDisposed:boolean = false;
        private _timerMap:Hash = Hash.create();
        private _streamMap:Hash = Hash.create();
        private _subscribedTime:number = null;
        private _disposedTime:number = null;

        public setStreamMap(messages:[Record]){
            var self = this;

            messages.forEach(function(record:Record){
                var func = null;

                switch (record.actionType){
                    case ActionType.NEXT:
                        func = function(){
                            self.next(record.value);
                        };
                        break;
                    case ActionType.ERROR:
                        func = function(){
                            self.error(record.value);
                        };
                        break;
                    case ActionType.COMPLETED:
                        func = function(){
                            self.completed();
                        };
                        break;
                    default:
                        Log.error(true, Log.info.FUNC_UNKNOW("actionType"));
                        break;
                }

                self._streamMap.addChild(String(record.time), func);
            });
        }

        public remove(observer:Observer) {
            this._isDisposed = true;
        }

        public publishRecursive(initial:any, recursiveFunc:Function) {
            var self = this;
            var messages = [];

            recursiveFunc(initial, function (value) {
                messages.push(TestScheduler.next(self._clock, value));
                self._tick(1);
            }, function () {
                messages.push(TestScheduler.completed(self._clock));
                self.setStreamMap(<[Record]>messages);
            });
        }

        public publishInterval(initial:any, interval:number, action:Function):number{
            //produce 10 val for test
            var COUNT = 10;
            var messages = [];

            while (COUNT > 0 && !this._isDisposed) {
                this._tick(interval);
                messages.push(TestScheduler.next(this._clock, initial));

                //no need to invoke action
                //action(initial);

                initial++;
                COUNT--;
            }

            this.setStreamMap(<[Record]>messages);

            return NaN;
        }

        public startWithTime(create:Function, subscribedTime:number, disposedTime:number) {
            var observer = this.createObserver(),
                source, subscription;

            this._subscribedTime = subscribedTime;
            this._disposedTime = disposedTime;

            this._clock = subscribedTime;

            this._runAt(subscribedTime, function () {
                source = create();
                subscription = source.subscribe(observer);
            });

            this._runAt(disposedTime, function () {
                subscription.dispose();
            });

            this.start();

            return observer;
        }

        public startWithSubscribe(create, subscribedTime = SUBSCRIBE_TIME) {
            return this.startWithTime(create, subscribedTime, DISPOSE_TIME);
        }

        public startWithDispose(create, disposedTime = DISPOSE_TIME) {
            return this.startWithTime(create, SUBSCRIBE_TIME, disposedTime);
        }

        public publicAbsolute(time, handler) {
            this._runAt(time, function () {
                handler();
            });
        }

        public start() {
            var extremeNumArr = this._getMinAndMaxTime(),
                min = extremeNumArr[0],
                max = extremeNumArr[1],
                time = min;

            while (time <= max) {
                //because "_exec,_runStream" may change "_clock",
                //so it should reset the _clock

                this._clock = time;

                this._exec(time, this._timerMap);

                this._clock = time;

                this._runStream(time);

                time++;

                //todo get max time only from streamMap?
                //need refresh max time.
                //because if timerMap has callback that create infinite stream(as interval),
                //it will set streamMap so that the max time will change
                max = this._getMinAndMaxTime()[1];
            }
        }

        public createStream(args){
            return TestStream.create(Array.prototype.slice.call(arguments, 0), this);
        }

        public createObserver() {
            return MockObserver.create(this);
        }

        private _getMinAndMaxTime(){
            var timeArr = this._timerMap.getKeys().concat(this._streamMap.getKeys())
                .map(function(key){
                    return Number(key);
                });

            return [Math.min.apply(Math, timeArr), Math.max.apply(Math, timeArr)];
        }

        private _exec(time, map){
            var handler = map.getChild(String(time));

            if(handler){
                handler();
            }
        }

        private _runStream(time){
            var handler = this._streamMap.getChild(String(time));

            if(handler && this._hasObservers()){
                handler();
            }
        }

        private _hasObservers(){
            if(this.target instanceof Subject){
                let subject = <Subject>this.target;

                 return subject.getObservers() > 0
            }

            return !!this.target;
        }

        private _runAt(time:number, callback:Function) {
            this._timerMap.addChild(String(time), callback);
        }

        private _tick(time:number) {
            this._clock += time;
        }
    }
}



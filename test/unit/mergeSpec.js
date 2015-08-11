describe("merge", function () {
    var rt = dyRt,
        TestScheduler = rt.TestScheduler,
        next = TestScheduler.next,
        error = TestScheduler.error,
        completed = TestScheduler.completed;
    var scheduler = null;
    var sandbox = null;
    var result = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        scheduler = TestScheduler.create();
        result = [];
    });
    afterEach(function () {
        sandbox.restore();
    });

    it("if merge generator subject and stream, it will throw error", function(){
        expect(function(){
            rt.fromArray([1, 2])
                .merge(rt.fromArray([1, 2]), rt.AsyncSubject.create());
        }).toThrow();
    });


    it("merge array", function(){
        var stream = rt.fromArray([1, 2])
            .merge(rt.fromArray([3, 4]))
            .map(function(value){
                return value * 2;
            });

        stream.subscribe(function(data){
            result.push(data);
        });

        expect(result).toEqual([ 2,4,6,8 ]);
    });
    it("merge promise", function(done){
        var promiseSuc1 = new RSVP.Promise(function (resolve, reject) {
            resolve(1);
        });
        var promiseSuc2 = new RSVP.Promise(function (resolve, reject) {
            resolve(2);
        });
        var promiseSuc3 = new RSVP.Promise(function (resolve, reject) {
            resolve(3);
        });
        var error = new Error("woops");
        var promiseErr = new RSVP.Promise(function (resolve, reject) {
            reject(error);
        });
        var errResult = [];

        var stream = rt.fromPromise(promiseSuc1)
            .merge([promiseSuc2, promiseErr, promiseSuc3])
            .do(function(value){
                result.push(value*2);
            }, function(err){
                errResult.push(err);
            });

        stream.subscribe(function(data){
            result.push(data);
        }, function(err){
            errResult.push(err);

            expect(result).toEqual([2, 1, 4, 2]);
            expect(errResult).toEqual([error, error]);

            done();
        });
    });
    it("merge interval", function(){
        var scheduler = TestScheduler.create(true);

        var results = scheduler.startWithSubscribe(function () {
            return rt.interval(100, scheduler)
                .merge(rt.interval(60, scheduler))
        });

        expect(results.messages).toStreamContain(
            next(260, 0), next(300, 0), next(320, 1), next(380, 2), next(400, 1)
        );
    });
    it("multi operator", function(){
        var promiseSuc1 = scheduler.createResolvedPromise(210, 1);

        var results = scheduler.startWithSubscribe(function () {
            return rt.fromPromise(promiseSuc1, scheduler)
                .map(function(value){
                    return value*2;
                })
                .merge(rt.fromArray([10, 20]), rt.interval(100, scheduler))
                .do(function(value){
                    result.push(value*2);
                }, function(err){
                });
        });

        expect(results.messages).toStreamContain(
            next(200, 10), next(200, 20), next(210, 2),  next(300, 0), next(400, 1)
        );
    });

    describe("multi merge", function(){
        it("test1", function(){
            var stream = rt.fromArray([1, 2])
                .merge(rt.fromArray([3, 4]))
                .merge(rt.fromArray([5]))
                .map(function(value){
                    return value * 2;
                });

            stream.subscribe(function(data){
                result.push(data);
            });

            expect(result).toEqual([2, 4, 6, 8, 10]);
        });
        it("test2", function(){
            var stream = rt.fromArray([1, 2])
                .merge(rt.fromArray([3]).merge(rt.fromArray([4])))
                .merge(rt.fromArray([5]))
                .map(function(value){
                    return value * 2;
                });

            stream.subscribe(function(data){
                result.push(data);
            });

            expect(result).toEqual([2, 4, 6, 8, 10]);
        });
    });

    describe("merge and concat", function(){
        it("test1", function(){
            var promiseSuc1 = scheduler.createResolvedPromise(210, 1);
            var promiseSuc2 = scheduler.createResolvedPromise(201, 2);

            var results = scheduler.startWithSubscribe(function () {
                return rt.fromPromise(promiseSuc1)
                    .merge(promiseSuc2)
                    .concat(rt.interval(100, scheduler))
            });

            expect(results.messages).toStreamContain(
                next(201, 2), next(210, 1), next(311, 0), next(411, 1)
            );
        });
        it("test2", function(){
            var promiseSuc1 = scheduler.createResolvedPromise(210, 1);
            var promiseSuc2 = scheduler.createResolvedPromise(201, 2);

            var results = scheduler.startWithSubscribe(function () {
                return rt.fromArray([1])
                    .concat(rt.fromPromise(promiseSuc2).concat(promiseSuc1))
                    .concat(rt.fromArray([2]))
                    .merge(rt.fromArray([30]))
                    .concat(rt.fromArray([40]))
                    .merge(rt.fromArray([50]))
                    .merge(rt.interval(30, scheduler))
            });

            expect(results.messages).toStreamContain(
                next(200, 1), next(200, 30), next(200, 50), next(201, 2), next(210, 1), next(211, 2), next(211, 40), next(230, 0), next(260, 1)
            );
        });
    });
});

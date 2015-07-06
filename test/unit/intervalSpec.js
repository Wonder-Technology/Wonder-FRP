describe("interval", function () {
    var rt = dyRt,
        TestScheduler = rt.TestScheduler,
        next = TestScheduler.next,
        completed = TestScheduler.completed;
    var scheduler = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        scheduler = new TestScheduler();
    });
    afterEach(function () {
        sandbox.restore();
    });

    it("interval stream which value starts from 0", function () {
        var results;

        results = scheduler.startWithSubscribe(function () {
            return rt.interval(100, scheduler);
        });

        expect(results.messages).toStreamContain(
            next(300, 0), next(400, 1), next(500, 2), next(600, 3), next(700, 4), next(800, 5), next(900, 6)
        );
    });
    it("test interval is zero", function () {
        var results;

        results = scheduler.startWithSubscribe(function () {
            return rt.interval(0, scheduler);
        }, 300);

        expect(results.messages).toStreamContain(
            next(301, 0), next(302, 1), next(303, 2)
        );
    });
    it("test interval is negative", function () {
        var results;

        results = scheduler.startWithSubscribe(function () {
            return rt.interval(-1, scheduler);
        }, 300);

        expect(results.messages).toStreamContain(
            next(301, 0), next(302, 1), next(303, 2)
        );
    });
    it("set dispose time", function () {
        var results;

        results = scheduler.startWithDispose(function () {
            return rt.interval(0, scheduler);
        }, 204);

        expect(results.messages).toStreamEqual(
            next(201, 0), next(202, 1), next(203, 2)
        );
    });
    it("test observer error", function(){
        //todo how to test?

        //var results;

        //results = scheduler.startWithSubscribe(function () {
        //    return rt.interval(-1, scheduler).subscribe(function(x){
        //        throw new Error();
        //    });
        //}, 300);

        //expect(results.messages).toStreamContain(
        //);

        //test("Interval_TimeSpan_ObserverThrows", function () {
        //    var scheduler, xs;
        //    scheduler = new TestScheduler();
        //    xs = Rx.Observable.interval(1, scheduler);
        //    xs.subscribe(function (x) {
        //        throw ex;
        //    });
        //    raises(function () {
        //        return scheduler.start();
        //    });
        //});
    });
});

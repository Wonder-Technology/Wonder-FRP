"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Log_1 = require("wonder-commonlib/dist/commonjs/Log");
var Observer_1 = require("../core/Observer");
var Stream_1 = require("../core/Stream");
var JudgeUtils_1 = require("../JudgeUtils");
var Operator_1 = require("../global/Operator");
var contract_1 = require("../definition/typescript/decorator/contract");
var SingleDisposable_1 = require("../Disposable/SingleDisposable");
var MergeObserver = (function (_super) {
    __extends(MergeObserver, _super);
    function MergeObserver(currentObserver, maxConcurrent, groupDisposable) {
        var _this = _super.call(this, null, null, null) || this;
        _this.done = false;
        _this.currentObserver = null;
        _this.activeCount = 0;
        _this.q = [];
        _this._maxConcurrent = null;
        _this._groupDisposable = null;
        _this.currentObserver = currentObserver;
        _this._maxConcurrent = maxConcurrent;
        _this._groupDisposable = groupDisposable;
        return _this;
    }
    MergeObserver.create = function (currentObserver, maxConcurrent, groupDisposable) {
        return new this(currentObserver, maxConcurrent, groupDisposable);
    };
    MergeObserver.prototype.handleSubscribe = function (innerSource) {
        if (JudgeUtils_1.JudgeUtils.isPromise(innerSource)) {
            innerSource = Operator_1.fromPromise(innerSource);
        }
        var disposable = SingleDisposable_1.SingleDisposable.create(), innerObserver = InnerObserver.create(this, innerSource, this._groupDisposable);
        this._groupDisposable.add(disposable);
        innerObserver.disposable = disposable;
        disposable.setDispose(innerSource.buildStream(innerObserver));
    };
    MergeObserver.prototype.onNext = function (innerSource) {
        if (this._isNotReachMaxConcurrent()) {
            this.activeCount++;
            this.handleSubscribe(innerSource);
            return;
        }
        this.q.push(innerSource);
    };
    MergeObserver.prototype.onError = function (error) {
        this.currentObserver.error(error);
    };
    MergeObserver.prototype.onCompleted = function () {
        this.done = true;
        if (this.activeCount === 0) {
            this.currentObserver.completed();
        }
    };
    MergeObserver.prototype._isNotReachMaxConcurrent = function () {
        return this.activeCount < this._maxConcurrent;
    };
    __decorate([
        contract_1.requireCheck(function (innerSource) {
            contract_1.assert(innerSource instanceof Stream_1.Stream || JudgeUtils_1.JudgeUtils.isPromise(innerSource), Log_1.Log.info.FUNC_MUST_BE("innerSource", "Stream or Promise"));
        })
    ], MergeObserver.prototype, "onNext", null);
    return MergeObserver;
}(Observer_1.Observer));
exports.MergeObserver = MergeObserver;
var InnerObserver = (function (_super) {
    __extends(InnerObserver, _super);
    function InnerObserver(parent, currentStream, groupDisposable) {
        var _this = _super.call(this, null, null, null) || this;
        _this.disposable = null;
        _this._parent = null;
        _this._currentStream = null;
        _this._groupDisposable = null;
        _this._parent = parent;
        _this._currentStream = currentStream;
        _this._groupDisposable = groupDisposable;
        return _this;
    }
    InnerObserver.create = function (parent, currentStream, groupDisposable) {
        var obj = new this(parent, currentStream, groupDisposable);
        return obj;
    };
    InnerObserver.prototype.onNext = function (value) {
        this._parent.currentObserver.next(value);
    };
    InnerObserver.prototype.onError = function (error) {
        this._parent.currentObserver.error(error);
    };
    InnerObserver.prototype.onCompleted = function () {
        var parent = this._parent;
        if (!!this.disposable) {
            this.disposable.dispose();
            this._groupDisposable.remove(this.disposable);
        }
        if (parent.q.length > 0) {
            parent.handleSubscribe(parent.q.shift());
        }
        else {
            parent.activeCount -= 1;
            if (this._isAsync() && parent.activeCount === 0) {
                parent.currentObserver.completed();
            }
        }
    };
    InnerObserver.prototype._isAsync = function () {
        return this._parent.done;
    };
    return InnerObserver;
}(Observer_1.Observer));
//# sourceMappingURL=MergeObserver.js.map
/// <reference path="../../bower_components/polymer-ts/polymer-ts.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var XResult = (function (_super) {
    __extends(XResult, _super);
    function XResult() {
        _super.apply(this, arguments);
    }
    XResult.prototype.checkListChanged = function (checklist) {
        this.finished = checklist.every(function (i) { return i; });
    };
    XResult.prototype.buttonText = function (finished, submitted) {
        if (submitted) {
            return "submitting";
        }
        else if (finished) {
            return "submit";
        }
        return "continue finish task";
    };
    XResult.prototype.checkIcon = function (item) {
        return item ? "icons:check" : "icons:check-box-outline-blank";
    };
    XResult.prototype.direct = function (evt) {
        this.fire('redirect', { tab: 'annotation', page: evt.currentTarget['targetId'] });
    };
    XResult.prototype.submit = function () {
        if (this.finished && !this.submitted) {
            this.fire('submit');
            this.submitted = true;
        }
        else if (!this.finished) {
            this.fire('redirect', { tab: 'annotation', page: this.checkList.indexOf(false) });
        }
    };
    XResult.prototype.done = function () {
        this.submitted = false;
    };
    __decorate([
        property({ type: Boolean, value: false })
    ], XResult.prototype, "finished");
    __decorate([
        property({ type: Array, value: [], notify: true })
    ], XResult.prototype, "checkList");
    Object.defineProperty(XResult.prototype, "checkListChanged",
        __decorate([
            observe("checkList")
        ], XResult.prototype, "checkListChanged", Object.getOwnPropertyDescriptor(XResult.prototype, "checkListChanged")));
    __decorate([
        property({ type: Boolean, value: false })
    ], XResult.prototype, "submitted");
    Object.defineProperty(XResult.prototype, "buttonText",
        __decorate([
            computed()
        ], XResult.prototype, "buttonText", Object.getOwnPropertyDescriptor(XResult.prototype, "buttonText")));
    XResult = __decorate([
        component('x-result-tab')
    ], XResult);
    return XResult;
})(polymer.Base);
XResult.register();

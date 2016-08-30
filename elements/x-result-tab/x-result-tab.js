/// <reference path="../../bower_components/polymer-ts/polymer-ts.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
        if (finished) {
            return "submit";
        }
        return "continue finish task";
    };
    XResult.prototype.checkIcon = function (item) {
        console.log(item);
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
    __decorate([
        property({ type: Boolean, value: false })
    ], XResult.prototype, "finished", void 0);
    __decorate([
        property({ type: Array, value: [], notify: true })
    ], XResult.prototype, "checkList", void 0);
    __decorate([
        observe("checkList")
    ], XResult.prototype, "checkListChanged", null);
    __decorate([
        property({ type: Boolean, value: false })
    ], XResult.prototype, "submitted", void 0);
    __decorate([
        computed()
    ], XResult.prototype, "buttonText", null);
    XResult = __decorate([
        /// <reference path="../../bower_components/polymer-ts/polymer-ts.d.ts"/>
        component('x-result-tab')
    ], XResult);
    return XResult;
}(polymer.Base));
XResult.register();

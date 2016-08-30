/// <reference path="../../bower_components/polymer-ts/polymer-ts.d.ts"/>
/// <reference path="../x-canvas/x-canvas.ts"/>
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
var XAnnotationTab = (function (_super) {
    __extends(XAnnotationTab, _super);
    function XAnnotationTab() {
        _super.apply(this, arguments);
    }
    XAnnotationTab.prototype.automaticChanged = function (isAutomatic) {
        if (isAutomatic) {
            this.computeInference();
        }
    };
    XAnnotationTab.prototype.automaticText = function (isAutomatic) {
        return (isAutomatic ? "Automatic" : "Manual");
    };
    XAnnotationTab.prototype.foregroundText = function (isForeground) {
        return (isForeground ? "Foreground" : "Background");
    };
    XAnnotationTab.prototype.frameNumbersChanged = function (frameNumbers) {
        var ids = [];
        var checks = [];
        for (var i = 0; i < frameNumbers; i++) {
            ids.push(i * 3 + 1);
            checks.push(true); //TODO
        }
        this.frameIds = ids;
        this.checkList = checks;
    };
    XAnnotationTab.prototype.strokeColor = function (isForeground) {
        return isForeground ? "rgb(0,255,0)" : "rgb(255,0,0)";
    };
    XAnnotationTab.prototype.nextFrame = function () {
        this.currentFrame = Math.min(this.currentFrame + 1, this.frameNumbers - 1);
    };
    XAnnotationTab.prototype.previousFrame = function () {
        this.currentFrame = Math.max(0, this.currentFrame - 1);
    };
    XAnnotationTab.prototype.tryInference = function (e) {
        if (this.isAutomatic) {
            this.computeInference(e);
        }
    };
    XAnnotationTab.prototype._currentCanvas = function () {
        return this.$$("x-canvas:nth-child(" + (this.currentFrame + 1) + ")");
    };
    XAnnotationTab.prototype.computeInference = function (e) {
        var _this = this;
        this._currentCanvas().updateResult();
        // mark the frame has been modified
        this.checkList = this.checkList.map(function (d, i) { return d || i == _this.currentFrame; });
    };
    XAnnotationTab.prototype.resetInference = function (e) {
        var _this = this;
        this._currentCanvas().reset();
        this.checkList = this.checkList.map(function (d, i) { return d && i != _this.currentFrame; });
    };
    __decorate([
        property({ type: Number })
    ], XAnnotationTab.prototype, "hitId", void 0);
    __decorate([
        property({ type: Boolean, value: false })
    ], XAnnotationTab.prototype, "isAutomatic", void 0);
    __decorate([
        observe('isAutomatic')
    ], XAnnotationTab.prototype, "automaticChanged", null);
    __decorate([
        property({ type: Number, value: 0 })
    ], XAnnotationTab.prototype, "canvasHeight", void 0);
    __decorate([
        property({ type: Number, value: 0 })
    ], XAnnotationTab.prototype, "canvasWidth", void 0);
    __decorate([
        property({ type: Array, value: [], notify: true })
    ], XAnnotationTab.prototype, "checkList", void 0);
    __decorate([
        computed({ type: Boolean })
    ], XAnnotationTab.prototype, "automaticText", null);
    __decorate([
        property({ type: Boolean, value: false })
    ], XAnnotationTab.prototype, "isForeground", void 0);
    __decorate([
        computed({ type: String })
    ], XAnnotationTab.prototype, "foregroundText", null);
    __decorate([
        property({ type: Number, value: 0 })
    ], XAnnotationTab.prototype, "currentFrame", void 0);
    __decorate([
        property({ type: Array })
    ], XAnnotationTab.prototype, "frameIds", void 0);
    __decorate([
        property({ type: Number })
    ], XAnnotationTab.prototype, "frameNumbers", void 0);
    __decorate([
        observe("frameNumbers")
    ], XAnnotationTab.prototype, "frameNumbersChanged", null);
    __decorate([
        property({ type: Number, value: 5 })
    ], XAnnotationTab.prototype, "strokeSize", void 0);
    __decorate([
        computed({ type: String })
    ], XAnnotationTab.prototype, "strokeColor", null);
    XAnnotationTab = __decorate([
        /// <reference path="../../bower_components/polymer-ts/polymer-ts.d.ts"/>
        component('x-annotation-tab')
    ], XAnnotationTab);
    return XAnnotationTab;
}(polymer.Base));
XAnnotationTab.register();

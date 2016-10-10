/// <reference path="../../bower_components/polymer-ts/polymer-ts.d.ts"/>
/// <reference path="../x-canvas/x-canvas.ts"/>
/// <reference path="../../typings/globals/q/index.d.ts"/>
/// <reference path="../../typings/globals/lodash/index.d.ts"/>
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
    XAnnotationTab.prototype.previewHeight = function (previewRatio, canvasHeight) {
        return previewRatio * canvasHeight;
    };
    XAnnotationTab.prototype.previewWidth = function (previewRatio, canvasWidth) {
        return previewRatio * canvasWidth;
    };
    XAnnotationTab.prototype.automaticText = function (isAutomatic) {
        return (isAutomatic ? "Automatic" : "Manual");
    };
    XAnnotationTab.prototype.foregroundText = function (isForeground) {
        return (isForeground ? "Foreground" : "Background");
    };
    XAnnotationTab.prototype.currentFrameChanged = function (currentFrame) {
        var _this = this;
        var canvas = this._currentCanvas();
        if (canvas && canvas.model == null)
            this._generatePreview().then(function () { return _this.$.choicepreview.open(); });
    };
    XAnnotationTab.prototype.plus1 = function (x) { return x + 1; };
    XAnnotationTab.prototype.attached = function () {
        var _this = this;
        this.async(function () {
            _this.currentFrameChanged(0);
        });
    };
    XAnnotationTab.prototype.frameNumbersChanged = function (frameNumbers) {
        var ids = _.range(1, frameNumbers * 10 + 1, 10);
        var checks = _.fill(new Array(ids.length), false);
        this.frameIds = ids;
        this.checkList = checks;
    };
    XAnnotationTab.prototype.strokeColor = function (isForeground) {
        return isForeground ? "rgb(0,255,0)" : "rgb(255,0,0)";
    };
    XAnnotationTab.prototype.nextFrame = function () {
        this.currentFrame = this.currentFrame + 1;
        if (this.currentFrame == this.frameNumbers) {
            this.fire("redirect", { tab: "preview" });
            this.currentFrame--;
        }
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
        this._currentCanvas().reset();
    };
    XAnnotationTab.prototype._generatePreview = function () {
        var _this = this;
        var ctx_coco = this.$.cocopreview.getContext('2d');
        var ctx_pascal = this.$.pascalpreview.getContext('2d');
        var canvas = this._currentCanvas();
        var canvas_width = this.canvasWidth * this.previewRatio;
        var canvas_height = this.canvasHeight * this.previewRatio;
        return canvas._ready
            .then(function () { return canvas.reset("coco"); })
            .then(function () { return canvas.drawPreview(ctx_coco, _this.previewWidth, _this.previewHeight); })
            .then(function () { return canvas.reset("pascal"); })
            .then(function () { return canvas.drawPreview(ctx_pascal, _this.previewWidth, _this.previewHeight); });
    };
    XAnnotationTab.prototype.resetcanvas = function (e) {
        var canvas = this._currentCanvas();
        var el = e.target, as = HTMLElement;
        if (el.id == "cocopreview") {
            canvas.reset("coco");
            canvas.model = "coco";
        }
        if (el.id == "pascalpreview") {
            canvas.reset("pascal");
            canvas.model = "pascal";
        }
        canvas.updateResult();
        this.computeInference();
        this.$.choicepreview.close();
    };
    __decorate([
        property({ type: Number })
    ], XAnnotationTab.prototype, "hitId");
    __decorate([
        property({ type: Boolean, value: false })
    ], XAnnotationTab.prototype, "isAutomatic");
    Object.defineProperty(XAnnotationTab.prototype, "automaticChanged",
        __decorate([
            observe('isAutomatic')
        ], XAnnotationTab.prototype, "automaticChanged", Object.getOwnPropertyDescriptor(XAnnotationTab.prototype, "automaticChanged")));
    __decorate([
        property({ type: Number, value: 0 })
    ], XAnnotationTab.prototype, "canvasHeight");
    __decorate([
        property({ type: Number, value: 0 })
    ], XAnnotationTab.prototype, "canvasWidth");
    __decorate([
        property({ type: Array, value: [], notify: true })
    ], XAnnotationTab.prototype, "checkList");
    __decorate([
        property({ type: Number, value: 0.5 })
    ], XAnnotationTab.prototype, "previewRatio");
    Object.defineProperty(XAnnotationTab.prototype, "previewHeight",
        __decorate([
            computed({ type: Number })
        ], XAnnotationTab.prototype, "previewHeight", Object.getOwnPropertyDescriptor(XAnnotationTab.prototype, "previewHeight")));
    Object.defineProperty(XAnnotationTab.prototype, "previewWidth",
        __decorate([
            computed({ type: Number })
        ], XAnnotationTab.prototype, "previewWidth", Object.getOwnPropertyDescriptor(XAnnotationTab.prototype, "previewWidth")));
    Object.defineProperty(XAnnotationTab.prototype, "automaticText",
        __decorate([
            computed({ type: Boolean })
        ], XAnnotationTab.prototype, "automaticText", Object.getOwnPropertyDescriptor(XAnnotationTab.prototype, "automaticText")));
    __decorate([
        property({ type: Boolean, value: false })
    ], XAnnotationTab.prototype, "isForeground");
    Object.defineProperty(XAnnotationTab.prototype, "foregroundText",
        __decorate([
            computed({ type: String })
        ], XAnnotationTab.prototype, "foregroundText", Object.getOwnPropertyDescriptor(XAnnotationTab.prototype, "foregroundText")));
    __decorate([
        property({ type: Number, value: 0 })
    ], XAnnotationTab.prototype, "currentFrame");
    Object.defineProperty(XAnnotationTab.prototype, "currentFrameChanged",
        __decorate([
            observe("currentFrame")
        ], XAnnotationTab.prototype, "currentFrameChanged", Object.getOwnPropertyDescriptor(XAnnotationTab.prototype, "currentFrameChanged")));
    __decorate([
        property({ type: Array })
    ], XAnnotationTab.prototype, "frameIds");
    __decorate([
        property({ type: Number })
    ], XAnnotationTab.prototype, "frameNumbers");
    Object.defineProperty(XAnnotationTab.prototype, "frameNumbersChanged",
        __decorate([
            observe("frameNumbers")
        ], XAnnotationTab.prototype, "frameNumbersChanged", Object.getOwnPropertyDescriptor(XAnnotationTab.prototype, "frameNumbersChanged")));
    __decorate([
        property({ type: Number, value: 5 })
    ], XAnnotationTab.prototype, "strokeSize");
    Object.defineProperty(XAnnotationTab.prototype, "strokeColor",
        __decorate([
            computed({ type: String })
        ], XAnnotationTab.prototype, "strokeColor", Object.getOwnPropertyDescriptor(XAnnotationTab.prototype, "strokeColor")));
    XAnnotationTab = __decorate([
        component('x-annotation-tab')
    ], XAnnotationTab);
    return XAnnotationTab;
})(polymer.Base);
XAnnotationTab.register();

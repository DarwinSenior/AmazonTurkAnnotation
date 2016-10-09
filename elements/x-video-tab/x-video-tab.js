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
var XVideoTab = (function (_super) {
    __extends(XVideoTab, _super);
    function XVideoTab() {
        _super.apply(this, arguments);
    }
    XVideoTab.prototype.videourlCoco = function (vid) {
        var path = window.location.pathname.replace('index.html', '');
        return path + "resources-2/segmentation/" + vid + "/visuals/segmentations/segmentation-coco-deconvet-obj0.mp4";
    };
    XVideoTab.prototype.videourlPascal = function (vid) {
        var path = window.location.pathname.replace('index.html', '');
        return path + "resources-2/segmentation/" + vid + "/visuals/segmentations/segmentation-pascal-deconvet-obj0.mp4";
    };
    XVideoTab.prototype.redirect = function (e) {
        this.fire('redirect', { tab: 'annotation' });
    };
    __decorate([
        property({ type: String })
    ], XVideoTab.prototype, "vid");
    __decorate([
        property({ type: Number })
    ], XVideoTab.prototype, "frameHeight");
    __decorate([
        property({ type: Number })
    ], XVideoTab.prototype, "frameWidth");
    Object.defineProperty(XVideoTab.prototype, "videourlCoco",
        __decorate([
            computed({ type: String })
        ], XVideoTab.prototype, "videourlCoco", Object.getOwnPropertyDescriptor(XVideoTab.prototype, "videourlCoco")));
    Object.defineProperty(XVideoTab.prototype, "videourlPascal",
        __decorate([
            computed({ type: String })
        ], XVideoTab.prototype, "videourlPascal", Object.getOwnPropertyDescriptor(XVideoTab.prototype, "videourlPascal")));
    XVideoTab = __decorate([
        component('x-video-tab')
    ], XVideoTab);
    return XVideoTab;
})(polymer.Base);
XVideoTab.register();

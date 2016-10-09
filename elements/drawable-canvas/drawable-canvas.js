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
var DrawableCanvas = (function (_super) {
    __extends(DrawableCanvas, _super);
    function DrawableCanvas() {
        _super.apply(this, arguments);
    }
    DrawableCanvas.prototype.attached = function () {
        this.c_canvas = this.$.canvas;
        this.c_ctx = this.c_canvas.getContext('2d');
        this.c_pts = [];
        this.dragging = false;
        this.c_ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    };
    DrawableCanvas.prototype.dragStart = function (e) {
        this.dragging = true;
        var ctx = this.c_ctx;
        var pts = this.c_pts;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.strokeSize;
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineCap = ctx.lineJoin = 'round';
        pts.length = 0;
        e.stopPropagation();
    };
    DrawableCanvas.prototype.dragMove = function (e) {
        var ctx = this.c_ctx;
        var pts = this.c_pts;
        if (this.dragging) {
            var rect = this.c_canvas.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            if (pts.length == 2) {
                ctx.beginPath();
                ctx.bezierCurveTo(pts[0][0], pts[0][1], pts[1][0], pts[1][1], x, y);
                ctx.stroke();
                ctx.moveTo(x, y);
                pts.length = 0;
            }
            pts.push([x, y]);
        }
    };
    DrawableCanvas.prototype.dragEnd = function (e) {
        this.dragging = false;
        this.c_pts.length = 0;
        this.fire('change', {});
    };
    DrawableCanvas.prototype.getImage = function () {
        return this.c_ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
    };
    DrawableCanvas.prototype.setImage = function (imagedata) {
        this.c_ctx.putImageData(imagedata, 0, 0);
    };
    __decorate([
        property({ type: Number })
    ], DrawableCanvas.prototype, "strokeSize");
    __decorate([
        property({ type: String })
    ], DrawableCanvas.prototype, "strokeColor");
    __decorate([
        property({ type: Number })
    ], DrawableCanvas.prototype, "canvasHeight");
    __decorate([
        property({ type: Number })
    ], DrawableCanvas.prototype, "canvasWidth");
    DrawableCanvas = __decorate([
        component('drawable-canvas')
    ], DrawableCanvas);
    return DrawableCanvas;
})(polymer.Base);
DrawableCanvas.register();

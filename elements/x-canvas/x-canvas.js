/// <reference path="../../bower_components/polymer-ts/polymer-ts.d.ts"/>
/// <reference path="../../js/grabcut.d.ts"/>
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
var Frame = (function () {
    function Frame() {
    }
    return Frame;
}());
var XCanvas = (function (_super) {
    __extends(XCanvas, _super);
    function XCanvas() {
        _super.apply(this, arguments);
    }
    XCanvas.prototype._padding = function (num, zeros) {
        var num_str = num.toString();
        var padding_zeros = new Array(1 + Math.max(0, zeros - num_str.length)).join('0');
        return padding_zeros + num_str;
    };
    XCanvas.prototype.attached = function () {
        var _this = this;
        if (this.frameId) {
            var path = window.location.pathname.replace('index.html', '');
            var image_src = path + "resources/seg" + this.vid + "/frames/" + this._padding(this.frameId, 8) + ".jpg";
            this._loadCanvasImage(this.$.imageCanvas, image_src, function () {
                _this.reset();
                _this._loadBounary(_this.$.imageCanvas.getContext('2d'));
            });
        }
    };
    XCanvas.prototype.reset = function () {
        var _this = this;
        var path = window.location.pathname.replace('index.html', '');
        var scribble_src = path + "resources/seg" + this.vid + "/segmentations/" + this._padding(this.frameId, 8) + ".png";
        this._loadCanvasImage(this.$.inferenceCanvas, scribble_src, function (image) {
            var colorImage = gray2color(image);
            _this.$.scribbleCanvas.setImage(colorImage);
            _this.$.inferenceCanvas.getContext('2d').clearRect(0, 0, _this.canvasWidth, _this.canvasHeight);
            _this.$.inferenceCanvas.getContext('2d').putImageData(colorImage, 0, 0);
            _this.updateResult();
        });
    };
    XCanvas.prototype._loadBounary = function (ctx) {
        var _this = this;
        var xhr = new XMLHttpRequest();
        var path = window.location.pathname.replace('index.html', '');
        xhr.open('GET', path + "resources/seg" + this.vid + "/squareframe/" + this._padding(this.frameId, 6) + ".xml", true);
        xhr.send();
        xhr.addEventListener("load", function () {
            var datanodes = xhr.responseXML;
            var boundary = datanodes.querySelector('bndbox');
            var size = datanodes.querySelector('size');
            var width = parseInt(datanodes.querySelector('width').textContent);
            var height = parseInt(datanodes.querySelector('height').textContent);
            var scalex = _this.canvasWidth / width;
            var scaley = _this.canvasHeight / height;
            var xmax = parseInt(boundary.querySelector('xmax').textContent) * scalex;
            var ymax = parseInt(boundary.querySelector('ymax').textContent) * scaley;
            var xmin = parseInt(boundary.querySelector('xmin').textContent) * scalex;
            var ymin = parseInt(boundary.querySelector('ymin').textContent) * scaley;
            var name = datanodes.querySelector('name').textContent;
            var frame = { h: ymax - ymin, w: xmax - xmin, x: xmin, y: ymin, name: name };
            console.log(frame);
            _this._drawBoundary(frame, ctx);
        });
    };
    XCanvas.prototype._drawBoundary = function (frame, ctx) {
        // cb({h: 30, y: 30, x: 30, w: 30, name: "bicycle"})
        ctx.strokeStyle = "#fff";
        ctx.strokeRect(frame.x, frame.y, frame.w, frame.h);
        ctx.font = "36pt sans";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(frame.name, (frame.x + frame.w / 2), (frame.y + frame.h));
    };
    XCanvas.prototype._loadCanvasImage = function (element, src, cb) {
        var height = element.height;
        var width = element.width;
        var newImage = new Image();
        newImage.src = src;
        newImage.onload = function (evt) {
            newImage.style.height = height + "px";
            newImage.style.width = width + "px";
            var ctx = element.getContext('2d');
            ctx.drawImage(newImage, 0, 0, width, height);
            if (cb) {
                cb(ctx.getImageData(0, 0, width, height));
            }
        };
    };
    XCanvas.prototype._imageData = function (element) {
        var ctx = element.getContext('2d');
        return ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
    };
    XCanvas.prototype.updateResult = function () {
        var imagedata = calculate(this._imageData(this.$.imageCanvas), this.$.scribbleCanvas.getImage());
        this.$.inferenceCanvas.getContext('2d').clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.$.inferenceCanvas.getContext('2d').putImageData(imagedata, 0, 0);
        var fctx = this.$.foregroundCanvas.getContext('2d');
        fctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        fctx.globalCompositeOperation = 'source-over';
        fctx.putImageData(imagedata, 0, 0);
        fctx.globalCompositeOperation = 'source-in';
        fctx.drawImage(this.$.imageCanvas, 0, 0);
    };
    XCanvas.prototype.getData = function () {
        var imgdata = this._imageData(this.$.inferenceCanvas);
        return imgdata.data;
    };
    __decorate([
        property({ type: Number })
    ], XCanvas.prototype, "frameId", void 0);
    __decorate([
        property({ type: Number, value: 400 })
    ], XCanvas.prototype, "canvasHeight", void 0);
    __decorate([
        property({ type: Number, value: 600 })
    ], XCanvas.prototype, "canvasWidth", void 0);
    __decorate([
        property({ type: Number })
    ], XCanvas.prototype, "strokeSize", void 0);
    __decorate([
        property({ type: String })
    ], XCanvas.prototype, "strokeColor", void 0);
    __decorate([
        property({ type: String, value: "" })
    ], XCanvas.prototype, "vid", void 0);
    XCanvas = __decorate([
        component('x-canvas')
    ], XCanvas);
    return XCanvas;
}(polymer.Base));
XCanvas.register();

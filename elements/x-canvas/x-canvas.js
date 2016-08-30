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
        if (this.frameId) {
            var image_src = "../../resources/seg" + this.hitId + "/frames/" + this._padding(this.frameId, 8) + ".jpg";
            this._loadCanvasImage(this.$.imageCanvas, image_src);
            this._loadCanvasImage(this.$.backgroundCanvas, image_src);
            this.reset();
        }
    };
    XCanvas.prototype.reset = function () {
        var _this = this;
        var scribble_src = "../../resources/seg" + this.hitId + "/segmentations/" + this._padding(this.frameId, 8) + ".png";
        this._loadCanvasImage(this.$.inferenceCanvas, scribble_src, function (image) {
            var colorImage = gray2color(image);
            _this.$.scribbleCanvas.setImage(colorImage);
            _this.$.inferenceCanvas.getContext('2d').clearRect(0, 0, _this.canvasWidth, _this.canvasHeight);
            _this.$.inferenceCanvas.getContext('2d').putImageData(colorImage, 0, 0);
            _this.$.foregroundCanvas.getContext('2d').clearRect(0, 0, _this.canvasWidth, _this.canvasHeight);
            _this.$.foregroundCanvas.getContext('2d').drawImage(_this.$.inferenceCanvas, 0, 0);
        });
    };
    XCanvas.prototype._loadCanvasImage = function (element, src, cb) {
        var height = element.height;
        var width = element.width;
        var newImage = new Image();
        newImage.src = src;
        newImage.onload = function (evt) {
            newImage.style.height = height + "px";
            newImage.style.width = width + "px";
            element.getContext('2d').drawImage(newImage, 0, 0, width, height);
            if (cb) {
                cb(element.getContext('2d').getImageData(0, 0, width, height));
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
        this.$.foregroundCanvas.getContext('2d').clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.$.foregroundCanvas.getContext('2d').drawImage(this.$.inferenceCanvas, 0, 0);
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
    ], XCanvas.prototype, "hitId", void 0);
    XCanvas = __decorate([
        /// <reference path="../../bower_components/polymer-ts/polymer-ts.d.ts"/>
        component('x-canvas')
    ], XCanvas);
    return XCanvas;
}(polymer.Base));
XCanvas.register();

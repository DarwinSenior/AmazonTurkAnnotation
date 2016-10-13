/// <reference path="../../bower_components/polymer-ts/polymer-ts.d.ts"/>
/// <reference path="../../js/grabcut.d.ts"/>
/// <reference path="../../typings/globals/q/index.d.ts"/>
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
var Frame = (function () {
    function Frame() {
    }
    return Frame;
})();
var map_vid = {
    n02691156: "airplane",
    n02419796: "antelope",
    n02131653: "bear",
    n02834778: "bicycle",
    n01503061: "bird",
    n02924116: "bus",
    n02958343: "car",
    n02402425: "cattle",
    n02084071: "dog",
    n02121808: "domestic_cat",
    n02503517: "elephant",
    n02118333: "fox",
    n02510455: "giant_panda",
    n02342885: "hamster",
    n02374451: "horse",
    n02129165: "lion",
    n01674464: "lizard",
    n02484322: "monkey",
    n03790512: "motorcycle",
    n02324045: "rabbit",
    n02509815: "red_panda",
    n02411705: "sheep",
    n01726692: "snake",
    n02355227: "squirrel",
    n02129604: "tiger",
    n04468005: "train",
    n01662784: "turtle",
    n04530566: "watercraft",
    n02062744: "whale",
    n02391049: "zebra"
};
var XCanvas = (function (_super) {
    __extends(XCanvas, _super);
    function XCanvas() {
        _super.apply(this, arguments);
        this.model = null;
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
            var image_src = path + "resources-2/frame/" + this.vid + "/" + this._padding(this.frameId + 1, 8) + ".jpg";
            this._ready = this._loadCanvasImage(this.$.imageCanvas, image_src)
                .then(this._loadBoundary.bind(this))
                .then(function (boundary) { return _this._drawBoundary(boundary, _this.$.boundaryCanvas.getContext('2d')); });
            this._ready.catch(function (error) { return console.log(error); });
        }
    };
    XCanvas.prototype.drawPreview = function (ctx, width, height) {
        ctx.drawImage(this.$.imageCanvas, 0, 0, this.canvasWidth, this.canvasHeight, 0, 0, width, height);
        ctx.drawImage(this.$.boundaryCanvas, 0, 0, this.canvasWidth, this.canvasHeight, 0, 0, width, height);
        ctx.globalAlpha = 0.5;
        ctx.drawImage(this.$.inferenceCanvas, 0, 0, this.canvasWidth, this.canvasHeight, 0, 0, width, height);
        ctx.drawImage(this.$.scribbleCanvas.$.canvas, 0, 0, this.canvasWidth, this.canvasHeight, 0, 0, width, height);
        ctx.globalAlpha = 1;
    };
    XCanvas.prototype.reset = function (model) {
        var _this = this;
        var path = window.location.pathname.replace('index.html', '');
        model = model || this.model || 'coco';
        var scribble_src = path + "resources-2/segmentation/" + this.vid + "/probmaps/seg_" + model + "_" + this.frameId + ".png";
        return this._loadCanvasImage(this.$.inferenceCanvas, scribble_src).then(function (image) {
            var colorImage = gray2color(image);
            _this.$.scribbleCanvas.setImage(colorImage);
            _this.$.inferenceCanvas.getContext('2d').clearRect(0, 0, _this.canvasWidth, _this.canvasHeight);
            _this.$.inferenceCanvas.getContext('2d').putImageData(gray2green(image), 0, 0);
            _this.$.scribbleCanvas.setImage(colorImage);
            _this.updateResult();
        });
    };
    XCanvas.prototype._loadBoundary = function () {
        var _this = this;
        var path = window.location.pathname.replace('index.html', '');
        return Q.xhr.get(path + "resources-2/bbox/" + this.vid + "/" + this._padding(this.frameId, 6) + ".xml")
            .then(function (resp) {
            var parser = new DOMParser();
            var datanodes = parser.parseFromString(resp.data, 'application/xml');
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
            var name = map_vid[datanodes.querySelector('name').textContent] || "undefined";
            return { h: ymax - ymin, w: xmax - xmin, x: xmin, y: ymin, name: name };
        }).catch(function (error) { return { h: 0, w: 0, x: 0, y: 0, name: "" }; });
    };
    XCanvas.prototype._drawBoundary = function (frame, ctx) {
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 4;
        ctx.strokeRect(frame.x, frame.y, frame.w, frame.h);
        ctx.font = "36pt sans";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = 'blue';
        ctx.fillText(frame.name, (frame.x + frame.w / 2), (frame.y + frame.h));
    };
    XCanvas.prototype._loadCanvasImage = function (element, src) {
        var height = element.height;
        var width = element.width;
        var newImage = new Image();
        newImage.src = src;
        var q = Q.defer();
        newImage.onload = function (evt) {
            newImage.style.height = height + "px";
            newImage.style.width = width + "px";
            var ctx = element.getContext('2d');
            ctx.drawImage(newImage, 0, 0, width, height);
            q.resolve(ctx.getImageData(0, 0, width, height));
        };
        return q.promise;
    };
    XCanvas.prototype._imageData = function (element) {
        var ctx = element.getContext('2d');
        return ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
    };
    XCanvas.prototype.inference = function () {
        var imagedata = calculate(this._imageData(this.$.imageCanvas), this.$.scribbleCanvas.getImage());
        this.$.inferenceCanvas.getContext('2d').clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.$.inferenceCanvas.getContext('2d').putImageData(imagedata, 0, 0);
        this.updateResult();
    };
    XCanvas.prototype.updateResult = function () {
        var fctx = this.$.foregroundCanvas.getContext('2d');
        fctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        fctx.globalCompositeOperation = 'source-over';
        var img_data = this.$.inferenceCanvas.getContext('2d').getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        img_data = concretize(img_data);
        fctx.putImageData(img_data, 0, 0);
        fctx.globalCompositeOperation = 'source-in';
        fctx.drawImage(this.$.imageCanvas, 0, 0);
    };
    XCanvas.prototype.getData = function () {
        var imgdata = this._imageData(this.$.inferenceCanvas);
        return imgdata.data;
    };
    __decorate([
        property({ type: Number })
    ], XCanvas.prototype, "frameId");
    __decorate([
        property({ type: Number, value: 400 })
    ], XCanvas.prototype, "canvasHeight");
    __decorate([
        property({ type: Number, value: 600 })
    ], XCanvas.prototype, "canvasWidth");
    __decorate([
        property({ type: Number })
    ], XCanvas.prototype, "strokeSize");
    __decorate([
        property({ type: String })
    ], XCanvas.prototype, "strokeColor");
    __decorate([
        property({ type: String, value: "" })
    ], XCanvas.prototype, "vid");
    __decorate([
        property({ type: String })
    ], XCanvas.prototype, "model");
    XCanvas = __decorate([
        component('x-canvas')
    ], XCanvas);
    return XCanvas;
})(polymer.Base);
XCanvas.register();

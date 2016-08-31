/// <reference path="../../bower_components/polymer-ts/polymer-ts.d.ts"/>
/// <reference path="../../js/grabcut.d.ts"/>

@component('x-canvas')
class XCanvas extends polymer.Base {
    @property({ type: Number })
    frameId: number;

    @property({ type: Number, value: 400 })
    canvasHeight: number;

    @property({ type: Number, value: 600 })
    canvasWidth: number;

    @property({ type: Number })
    strokeSize: number;

    @property({ type: String })
    strokeColor: string;

    @property({ type: String, value: "" })
    vid: string;

    _padding(num: number, zeros: number) {
	let num_str = num.toString();
	let padding_zeros = new Array(1 + Math.max(0, zeros - num_str.length)).join('0');
	return padding_zeros + num_str;
    }

    attached() {
	if (this.frameId) {
	    let path = window.location.pathname.replace('index.html', '');
	    let image_src = `${path}resources/seg${this.vid}/frames/${this._padding(this.frameId, 8)}.jpg`;
	    this._loadCanvasImage(this.$.imageCanvas, image_src);
	    this._loadCanvasImage(this.$.backgroundCanvas, image_src);
	    this.reset();
	}
    }

    reset(){
	    let path = window.location.pathname.replace('index.html', '');
	    let scribble_src = `${path}resources/seg${this.vid}/segmentations/${this._padding(this.frameId, 8)}.png`;
	    this._loadCanvasImage(this.$.inferenceCanvas, scribble_src,
		(image) => {
		    let colorImage = gray2color(image);
		    this.$.scribbleCanvas.setImage(colorImage);
		    this.$.inferenceCanvas.getContext('2d').clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		    this.$.inferenceCanvas.getContext('2d').putImageData(colorImage, 0, 0);
		    this.$.foregroundCanvas.getContext('2d').clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		    this.$.foregroundCanvas.getContext('2d').drawImage(this.$.inferenceCanvas, 0, 0);
		});
    }

    _loadCanvasImage(element: HTMLCanvasElement, src: string, cb?: (image: ImageData) => void) {
	let height = element.height;
	let width = element.width;
	let newImage = new Image();
	newImage.src = src;
	newImage.onload = (evt) => {
	    newImage.style.height = `${height}px`;
	    newImage.style.width = `${width}px`;
	    element.getContext('2d').drawImage(newImage, 0, 0, width, height);
	    if (cb) {
		cb(element.getContext('2d').getImageData(0, 0, width, height));
	    }
	}
    }

    _imageData(element: HTMLCanvasElement): ImageData {
	const ctx = element.getContext('2d');
	return ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
    }

    updateResult() {
	let imagedata = calculate(
	    this._imageData(this.$.imageCanvas),
	    this.$.scribbleCanvas.getImage());
	this.$.inferenceCanvas.getContext('2d').clearRect(0, 0, this.canvasWidth, this.canvasHeight);
	this.$.inferenceCanvas.getContext('2d').putImageData(imagedata, 0, 0);
	this.$.foregroundCanvas.getContext('2d').clearRect(0, 0, this.canvasWidth, this.canvasHeight);
	this.$.foregroundCanvas.getContext('2d').drawImage(this.$.inferenceCanvas, 0, 0);
    }
    getData(): Uint8ClampedArray{
	let imgdata = this._imageData(this.$.inferenceCanvas);
	return imgdata.data
    }
}
XCanvas.register();

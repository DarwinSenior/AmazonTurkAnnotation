/// <reference path="../../bower_components/polymer-ts/polymer-ts.d.ts"/>
/// <reference path="../../js/grabcut.d.ts"/>
/// <reference path="../../typings/globals/q/index.d.ts"/>

class Frame {
    h: number;
    w: number;
    x: number;
    y: number;
    name: string;
}

let map_vid = {
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
    n02391049: "zebra",
}

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

    @property({ type: String })
    model: string = null;

    _ready: Q.Promise<void>

    _padding(num: number, zeros: number) {
        let num_str = num.toString();
        let padding_zeros = new Array(1 + Math.max(0, zeros - num_str.length)).join('0');
        return padding_zeros + num_str;
    }

    attached() {
        if (this.frameId) {
            let path = window.location.pathname.replace('index.html', '');
            let image_src = `${path}resources-2/frame/${this.vid}/${this._padding(this.frameId + 1, 8)}.jpg`;
            this._ready = this._loadCanvasImage(this.$.imageCanvas, image_src)
                .then(this._loadBoundary.bind(this))
                .then((boundary) => this._drawBoundary(boundary,
                    this.$.boundaryCanvas.getContext('2d')));
            this._ready.catch((error) => console.log(error));
        }
    }


    drawPreview(ctx: CanvasRenderingContext2D, width: number, height: number) {
        ctx.drawImage(<HTMLCanvasElement>this.$.imageCanvas, 0, 0,
            this.canvasWidth, this.canvasHeight, 0, 0, width, height);
        ctx.drawImage(<HTMLCanvasElement>this.$.boundaryCanvas, 0, 0,
            this.canvasWidth, this.canvasHeight, 0, 0, width, height);
        ctx.globalAlpha = 0.5;
        ctx.drawImage(<HTMLCanvasElement>this.$.inferenceCanvas, 0, 0,
            this.canvasWidth, this.canvasHeight, 0, 0, width, height);
        ctx.drawImage(<HTMLCanvasElement>this.$.scribbleCanvas.$.canvas, 0, 0,
            this.canvasWidth, this.canvasHeight, 0, 0, width, height);
        ctx.globalAlpha = 1;
    }

    reset(model?: string): Q.Promise<void> {
        let path = window.location.pathname.replace('index.html', '');
        model = model || this.model;
        let scribble_src = `${path}resources-2/segmentation/${this.vid}/probmaps/seg_${model}_${this.frameId}.png`;
        return this._loadCanvasImage(this.$.inferenceCanvas, scribble_src).then((image) => {
            let colorImage = gray2color(image);
            this.$.scribbleCanvas.setImage(colorImage);
            this.$.inferenceCanvas.getContext('2d').clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.$.inferenceCanvas.getContext('2d').putImageData(colorImage, 0, 0);
            this.updateResult();
        });
    }

    _loadBoundary(): Q.Promise<Frame> {
        let path = window.location.pathname.replace('index.html', '');
        return Q.xhr.get(`${path}resources-2/bbox/${this.vid}/${this._padding(this.frameId, 6)}.xml`)
            .then((resp) => {
                let parser = new DOMParser();
                let datanodes = parser.parseFromString(resp.data, 'application/xml');
                console.log(datanodes);
                let boundary = <HTMLElement>datanodes.querySelector('bndbox');
                let size = <HTMLElement>datanodes.querySelector('size');
                let width = parseInt(datanodes.querySelector('width').textContent);
                let height = parseInt(datanodes.querySelector('height').textContent);
                let scalex = this.canvasWidth / width;
                let scaley = this.canvasHeight / height;
                console.log(this.frameId);
                let xmax = parseInt(boundary.querySelector('xmax').textContent) * scalex;
                let ymax = parseInt(boundary.querySelector('ymax').textContent) * scaley;
                let xmin = parseInt(boundary.querySelector('xmin').textContent) * scalex;
                let ymin = parseInt(boundary.querySelector('ymin').textContent) * scaley;
                let name = map_vid[datanodes.querySelector('name').textContent] || "undefined";
                return <Frame>{ h: ymax - ymin, w: xmax - xmin, x: xmin, y: ymin, name: name }
            }).catch((error) => <Frame>{h: 0, w: 0, x: 0, y: 0, name: ""});
    }

    _drawBoundary(frame: Frame, ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 4;
        ctx.strokeRect(frame.x, frame.y, frame.w, frame.h);
        ctx.font = "36pt sans";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = 'blue';
        ctx.fillText(frame.name, (frame.x + frame.w / 2), (frame.y + frame.h));
    }

    _loadCanvasImage(element: HTMLCanvasElement, src: string): Q.Promise<ImageData> {
        let height = element.height;
        let width = element.width;
        let newImage = new Image();
        newImage.src = src;
        let q = Q.defer<ImageData>();
        newImage.onload = (evt) => {
            newImage.style.height = `${height}px`;
            newImage.style.width = `${width}px`;
            let ctx: CanvasRenderingContext2D = element.getContext('2d');
            ctx.drawImage(newImage, 0, 0, width, height);
            q.resolve(ctx.getImageData(0, 0, width, height));
        }
        return q.promise;
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
        let fctx = this.$.foregroundCanvas.getContext('2d');
        fctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        fctx.globalCompositeOperation = 'source-over';
        fctx.putImageData(imagedata, 0, 0);
        fctx.globalCompositeOperation = 'source-in';
        fctx.drawImage(this.$.imageCanvas, 0, 0);
    }
    getData(): Uint8ClampedArray {
        let imgdata = this._imageData(this.$.inferenceCanvas);
        return imgdata.data
    }
}
XCanvas.register();

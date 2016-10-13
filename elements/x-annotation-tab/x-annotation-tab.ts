/// <reference path="../../bower_components/polymer-ts/polymer-ts.d.ts"/>
/// <reference path="../x-canvas/x-canvas.ts"/>
/// <reference path="../../typings/globals/q/index.d.ts"/>
/// <reference path="../../typings/globals/lodash/index.d.ts"/>

@component('x-annotation-tab')
class XAnnotationTab extends polymer.Base {
    @property({ type: Number })
    hitId: string;

    @property({type: String})
    vid: string;

    @property({ type: Boolean, value: false })
    isAutomatic: boolean;

    @observe('isAutomatic')
    automaticChanged(isAutomatic) {
        if (isAutomatic) {
            this.computeInference();
        }
    }

    @property({ type: Number, value: 0 })
    canvasHeight: number;

    @property({ type: Number, value: 0 })
    canvasWidth: number;


    @property({ type: Array, value: [], notify: true })
    checkList: Array<boolean>;

    @property({ type: Number, value: 0.5})
    previewRatio: number;

    @computed({ type: Number })
    previewHeight( previewRatio, canvasHeight ){
        return previewRatio*canvasHeight;
    }

    @computed({ type: Number })
    previewWidth( previewRatio, canvasWidth ){
        return previewRatio*canvasWidth;
    }

    @computed({ type: Boolean })
    automaticText(isAutomatic) {
        return (isAutomatic ? "Automatic" : "Manual");
    }

    @property({ type: Boolean, value: false })
    isForeground: boolean;

    @computed({ type: String })
    foregroundText(isForeground) {
        return (isForeground ? "Foreground" : "Background");
    }

    @property({ type: Number, value: 0 })
    currentFrame: number;

    @observe("currentFrame")
    currentFrameChanged(currentFrame) {
        let canvas = this._currentCanvas();
        if (canvas && canvas.model == null)
            this._generatePreview().then(() => this.$.choicepreview.open())
    }

    plus1(x) { return x + 1; }

    attached() {
        this.async(() => {
            let path = window.location.pathname.replace('index.html', '');
            Q.xhr.get(`${path}resources-2/segmentation/${this.vid}/count`).then((c) => {
                this.frameNumbers = parseInt(c.data/10);
            });
        });
    }
    @property({ type: Array })
    frameIds: Array<number>;

    @property({ type: Number, value: 0})
    frameNumbers: number;

    @observe("frameNumbers")
    frameNumbersChanged(frameNumbers: number) {
        var ids = _.range(1, frameNumbers*10 + 1, 10);
        var checks = _.fill(new Array(ids.length), false);
        this.frameIds = ids;
        this.checkList = checks;
    }

    @property({ type: Number, value: 5 })
    strokeSize: number;

    @computed({ type: String })
    strokeColor(isForeground) {
        return isForeground ? "rgb(0,255,0)" : "rgb(255,0,0)";
    }

    nextFrame() {
        this.currentFrame = this.currentFrame + 1;
        if (this.currentFrame == this.frameNumbers) {
            this.fire("redirect", { tab: "preview" });
            this.currentFrame--;
        }
    }

    previousFrame() {
        this.currentFrame = Math.max(0, this.currentFrame - 1);
    }

    tryInference(e: CustomEvent) {
        if (this.isAutomatic) {
            this.computeInference(e);
        }
    }

    _currentCanvas(): XCanvas {
        return <XCanvas>this.$$(`x-canvas:nth-child(${this.currentFrame + 1})`)
    }

    computeInference(e?: CustomEvent) {
        this._currentCanvas().inference();
        // mark the frame has been modified
    }

    resetInference(e: CustomEvent) {
        this._currentCanvas().reset();
    }

    _generatePreview(): Q.Promise<void> {
        let ctx_coco = <CanvasRenderingContext2D>this.$.cocopreview.getContext('2d');
        let ctx_pascal = <CanvasRenderingContext2D>this.$.pascalpreview.getContext('2d');
        let canvas = this._currentCanvas();
        let canvas_width = this.canvasWidth * this.previewRatio;
        let canvas_height = this.canvasHeight * this.previewRatio;
        return canvas._ready
            .then(() => canvas.reset("coco"))
            .then(() => canvas.drawPreview(ctx_coco, this.previewWidth, this.previewHeight))
            .then(() => canvas.reset("pascal"))
            .then(() => canvas.drawPreview(ctx_pascal, this.previewWidth, this.previewHeight))
    }

    resetcanvas(e: MouseEvent) {
        let canvas = this._currentCanvas();
        let el = e.target as HTMLElement;
        if (el.id == "cocopreview") {
            canvas.reset("coco");
            canvas.model = "coco";
        }
        if (el.id == "pascalpreview") {
            canvas.reset("pascal");
            canvas.model = "pascal";
        }
        this.checkList = this.checkList.map(
            (d, i) => d || i == this.currentFrame);
        this.$.choicepreview.close();
    }


}
XAnnotationTab.register();

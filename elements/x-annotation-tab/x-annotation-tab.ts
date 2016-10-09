/// <reference path="../../bower_components/polymer-ts/polymer-ts.d.ts"/>
/// <reference path="../x-canvas/x-canvas.ts"/>
/// <reference path="../../typings/globals/q/index.d.ts"/>
/// <reference path="../../typings/globals/lodash/index.d.ts"/>

@component('x-annotation-tab')
class XAnnotationTab extends polymer.Base {
    @property({ type: Number })
    hitId: string;

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

    attached(){
        this.async(()=>{
            this.currentFrameChanged(0);
        })
    }
    @property({ type: Array })
    frameIds: Array<number>;

    @property({ type: Number })
    frameNumbers: number;

    @observe("frameNumbers")
    frameNumbersChanged(frameNumbers: number) {
        var ids = _.range(1, frameNumbers + 1);
        var checks = _.fill(new Array(frameNumbers), false);
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
        if (this.currentFrame == this.frameNumbers){
            this.fire("redirect", {tab: "preview"});
            this.currentFrame --;
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
        this._currentCanvas().updateResult();
        // mark the frame has been modified
        this.checkList = this.checkList.map(
            (d, i) => d || i == this.currentFrame);
    }

    resetInference(e: CustomEvent) {
        this._currentCanvas().reset();
        this.checkList = this.checkList.map(
            (d, i) => d && i != this.currentFrame)
    }

    _generatePreview(): Q.Promise<void> {
        let ctx_coco = <CanvasRenderingContext2D>this.$.cocopreview.getContext('2d');
        let ctx_pascal = <CanvasRenderingContext2D>this.$.pascalpreview.getContext('2d');
        let canvas = this._currentCanvas();
        return canvas.reset("coco")
            .then(() => canvas.drawPreview(ctx_coco))
            .then(() => canvas.reset("pascal"))
            .then(() => canvas.drawPreview(ctx_pascal))
    }

    resetcanvas(e: MouseEvent) {
        let canvas = this._currentCanvas();
        let el = e.target as HTMLElement;
        if (el.id == "cocopreview"){
            canvas.reset("coco");
            canvas.model = "coco";
        }
        if (el.id == "pascalpreview"){
            canvas.reset("pascal");
            canvas.model = "pascal";
        }
        canvas.updateResult();
        this.computeInference();
        this.$.choicepreview.close();
    }


}
XAnnotationTab.register();

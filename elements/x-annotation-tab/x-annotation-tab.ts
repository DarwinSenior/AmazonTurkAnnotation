/// <reference path="../../bower_components/polymer-ts/polymer-ts.d.ts"/>
/// <reference path="../x-canvas/x-canvas.ts"/>

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


    @property({ type: Array })
    frameIds: Array<number>;

    @property({ type: Number })
    frameNumbers: number;

    @observe("frameNumbers")
    frameNumbersChanged(frameNumbers: number) {
	var ids = [];
	var checks = [];
	for (let i = 0; i < frameNumbers; i++) {
	    ids.push(i * 3 + 1);
	    checks.push(false); //TODO
	}
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
	this.currentFrame = Math.min(this.currentFrame + 1, this.frameNumbers - 1);
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
}
XAnnotationTab.register();

/// <reference path="../../bower_components/polymer-ts/polymer-ts.d.ts"/>

@component('drawable-canvas')
class DrawableCanvas extends polymer.Base {
    @property({ type: Number })
    strokeSize;

    @property({ type: String })
    strokeColor;

    @property({ type: Number })
    canvasHeight;

    @property({ type: Number })
    canvasWidth;

    dragging: boolean;
    c_ctx: CanvasRenderingContext2D;
    c_pts: Array<[number, number]>;
    c_canvas: HTMLCanvasElement;

    attached(): void {
	this.c_canvas = this.$.canvas;
	this.c_ctx = this.c_canvas.getContext('2d');
	this.c_pts = [];
	this.dragging = false;
	this.c_ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    dragStart(e: MouseEvent): void {
	this.dragging = true;
	const ctx = this.c_ctx;
	const pts = this.c_pts;
	ctx.strokeStyle = this.strokeColor;
	ctx.lineWidth = this.strokeSize;
	ctx.globalCompositeOperation = 'source-over';
	ctx.lineCap = ctx.lineJoin = 'round';
	pts.length = 0;
	e.stopPropagation();
    }

    dragMove(e: MouseEvent): void {
	const ctx = this.c_ctx;
	const pts = this.c_pts;
	if (this.dragging) {
	    const rect = this.c_canvas.getBoundingClientRect();
	    const x = e.clientX - rect.left;
	    const y = e.clientY - rect.top;
	    if (pts.length == 2) {
		ctx.beginPath();
		ctx.bezierCurveTo(pts[0][0], pts[0][1], pts[1][0], pts[1][1], x, y);
		ctx.stroke();
		ctx.moveTo(x, y);
		pts.length = 0;
	    }
	    pts.push([x, y]);
	}
    }

    dragEnd(e: MouseEvent): void {
	this.dragging = false;
	this.c_pts.length = 0;
	this.fire('change', {});
    }

    getImage(): ImageData {
	return this.c_ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
    }

    setImage(imagedata: ImageData) {
	this.c_ctx.putImageData(imagedata, 0, 0);
    }
}
DrawableCanvas.register();

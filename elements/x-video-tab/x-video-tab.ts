/// <reference path="../../bower_components/polymer-ts/polymer-ts.d.ts"/>

@component('x-video-tab')
class XVideoTab extends polymer.Base {
    @property({ type: String })
    vid: String;

    @property({ type: Number })
    frameHeight: number;

    @property({ type: Number })
    frameWidth: number;


    @computed({ type: String })
    videourlCoco(vid) {
	let path = window.location.pathname.replace('index.html', '');
	return `${path}resources-2/segmentation/${vid}/visuals/segmentations/segmentation-coco-deconvet-obj0.mp4`
    }

    @computed({ type: String })
    videourlPascal(vid) {
	let path = window.location.pathname.replace('index.html', '');
	return `${path}resources-2/segmentation/${vid}/visuals/segmentations/segmentation-pascal-deconvet-obj0.mp4`
    }

    redirect(e: Event){
	this.fire('redirect', {tab: 'annotation'})
    }
}
XVideoTab.register();

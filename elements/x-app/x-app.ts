/// <reference path="../../bower_components/polymer-ts/polymer-ts.d.ts"/>
/// <reference path="../../typings/globals/urijs/index.d.ts"/>
/// <reference path="../x-annotation-tab/x-annotation-tab.ts"/>

@component('x-app')
class XApp extends polymer.Base {
    @property({ type: String })
    selected = '';

    @property({ type: Number, value: 400 })
    frameHeight: number;

    @property({ type: Number, value: 600 })
    frameWidth: number;

    @property({ type: String, value: ""})
    hitId: string;

    settings: {string: string};

    attached() {
	this.settings = URI(window.location).search(true);
	this.selected = this.settings["selected"] || this.selected || 'video';
	this.hitId = this.settings['hitId'] || this.hitId;
    }

    _getForms(){
	let data:HTMLCanvasElement[] = [];
	let tab = <XAnnotationTab>this.$$('x-annotation-tab');
	tab.frameIds.forEach((key)=>{
	    let canvas = <XCanvas>tab.$$(`x-canvas[frame-id="${key}"]`);
	    let el = canvas.$.inferenceCanvas;
	    data[key] = el;
	});
	return data;
    }

    redirect(evt: CustomEvent){
	console.log(evt.detail);
	this.selected = evt.detail['tab'];
	if (evt.detail['page']){
	    this.$$('x-annotation-tab').currentFrame = evt.detail['page'];
	}
    }

    submitForm() {
	let form = document.createElement('form');
	let data = this._getForms();
	for (let key in data){
	    let inputelement = document.createElement('input');
	    inputelement.value = data[key].toDataURL();
	    inputelement.name = key;
	    inputelement.type = 'text';
	    form.appendChild(inputelement);
	}
	form.action = this.settings['turkSubmitTo'];
	form.submit();
    }

}
XApp.register();

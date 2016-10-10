/// <reference path="../../bower_components/polymer-ts/polymer-ts.d.ts"/>
/// <reference path="../../typings/globals/urijs/index.d.ts"/>
/// <reference path="../x-annotation-tab/x-annotation-tab.ts"/>
/// <reference path="../../js/grabcut.d.ts"/>
/// <reference path="../../typings/globals/q/index.d.ts"/>

@component('x-app')
class XApp extends polymer.Base {
    @property({ type: String })
    selected = '';

    @property({ type: Number, value: 400 })
    frameHeight: number;

    @property({ type: Number, value: 600 })
    frameWidth: number;

    @property({ type: String, value: "" })
    vid: string;

    settings: { string: string };

    hitid: string;

    intro: Any;


    attached() {
	this.settings = URI(window.location).search(true);
	this.selected = this.settings["selected"] || this.selected || 'video';
	this.vid = this.settings['vid'] || this.vid;
	this.hitid = this.hitid || "dev";
        this.intro = this.createIntroduction()
        this.addEventListener('redirect', this.redirect.bind(this))
        AWS.config.setPromisesDependency(Q.Promise);
	AWS.config.update({
	    accessKeyId : 'AKIAJVK7INOUTATLACQQ',
	    secretAccessKey : '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'
	});
	AWS.config.region = 'us-west-2';
    }

    _getMask() {
	let data = <Array<Uint8Array>>new Array();
	let tab = <XAnnotationTab>this.$$('x-annotation-tab');
	tab.frameIds.forEach((key) => {
	    let canvas = <XCanvas>tab.$$(`x-canvas[frame-id="${key}"]`);
	    let ctx = canvas.$.inferenceCanvas.getContext('2d');
	    data[key] = image2mask(ctx.getImageData(0, 0, this.frameWidth, this.frameWidth));
	});
	return data;
    }

    redirect(evt: CustomEvent) {
        console.log("fired")
	this.selected = evt.detail['tab'];
	if ('page' in evt.detail) {
	    this.$$('x-annotation-tab').currentFrame = evt.detail['page'];
	}
    }

    startHelp() {
        this.intro.start();
    }

    createIntroduction(){
        let intro = introJs(this);
        intro.setOptions({
            tooltipPosition: 'auto',
            positionPrecedence: ['right', 'top', 'left', 'bottom'],
            steps: [
                {intro: `Welcome, this annotation tool is here to help us collect the data from the source,
let us get through some intructions`},
                {intro: "First, there are three sections for this tools, Video, Annotation, Result"},
                {
                    intro: "The video section tab contains a video to give you a general overview of the task",
                    element: this.$$('paper-tab[name="video"]')
                },
                {
                    
                    intro: "This is video that has been segmented, and the green outline indicate the result we calculated from the computer. Feel free to watch the video as many times as you wish, and help us improve the segmentation result",
                    element: this.$$('x-video-tab').$$('video')
                },
                {
                    intro: "You could improve our annotation within the annotation section",
                    element: this.$$('paper-tab[name="annotation"]')
                },
                {
                    intro: "After watching the video, we wish you could improve the segmentation by annotate the wrong image",
                },
                {
                    intro: "We have several images chosen from the video, and you need to annotate those you think are not correctly."
                },
                {
        
                    intro: "You could use these buttons to control your annotation",
                    element: this.$$('x-annotation-tab').$$('div.controllers')
                },
                {
                    intro: "reset if you are not satisfied with the annotation, and you want to start over",
                    element: this.$$('x-annotation-tab').$$('#control-reset')
                },
                {
                    intro: "You could tune the stroke size with the slider",
                    element: this.$$('x-annotation-tab').$$('paper-slider')
                },
                {
                    element: this.$$('x-annotation-tab').$$('div#indicator'),
                    intro: "This indicates the size and color(foreground/background) of your current stroke",
                },
                {
                    element: this.$$('x-annotation-tab').$$('paper-toggle-button#toggleground'),
                    intro: `There are two types of annotation: foreground and background,
We annotate the foreground with green color,
And we annotate the background with red color,
Toggle this button to switch between these two modes`
                },
                {
                    
                    intro: `The left side is the canvas you could annotate with.
You could simply drag the mouse as stroke to annotate.
The right side is the carved out result of the background.
If you are currently in manual mode, you could press COMPUTE to update the result`,
                    element: this.$$('x-annotation-tab').$$('iron-pages')
                },
                {
                 intro: `We provide two mode for annotation calculation,
First is Manual, you stroke the canvas as many time as you want,
and then press COMPUTE to get the annotation.
Second is Automatic, we will calculate the annotation everytime
you stroke the canvas`,
                    element: this.$$('x-annotation-tab').$$('div#automaticgrp')
                },
                {
                    intro: "This button will take you back to the previous frame for you to annotate",
                    element: this.$$('x-annotation-tab').$$("paper-icon-button#prebtn")
                },
                {
                    intro: "This line indicates which annotation frame you are on and how many are there in total",
                    element: this.$$('x-annotation-tab').$$("h1#title")
                },
                {
                    intro: "After you finished annotation, This button will take you to the next frame for you to annotate",
                    element: this.$$('x-annotation-tab').$$("paper-icon-button#nextbtn")
                },
                {
                    intro: "When you are ready to share your annotation, you could go to the submission section",
                    element: this.$$('paper-tab[name="preview"]')
                },
                { 
                    intro: `If there are some images that you have yet annotated, 
the button will show CONTINUE FINSISH TASK, you could press this button to simply go back,
or it will show SUBMIT, and you could then submit your result`,
                    element: this.$$('x-result-tab').$$('#submitbtn')
                },
                {
                    intro: `These buttons are checklist which frame you have annotated,
square means it has not been annotated, and check means you have annotated that frame,
you could also choose to go back to certain frame by pressing the corresponding button`,
                    element: this.$$('x-result-tab').$$('#checklist')
                }
                ] 
            }).onbeforechange((element) =>{
                console.log(element.tagName)
                if (element.tagName == 'PAPER-TAB'){
                    this.selected = element.getAttribute('name');
                }
            })
            return intro;
        }
    submitForm() {
	let data = this._getMask();
	var bucket = new AWS.S3();
	var qs = <[Q.Promise<any>]>data.map((mask, key) => {
	    if (mask) {
		let file = new File([mask], "newfile", { 'type': 'text/binary' });
		return bucket.putObject({
		    Key: `experimentdata/${this.hitid}-${this.vid}-${key}.mask`,
		    ContentType: file.type,
		    Body: file,
		    Bucket: 'bucket-for-annotation-search'
		}).promise();
	    } else {
		return Q.when(0)
	    }
	});
	Q.all(qs).then((d) => {
	    let form = <HTMLFormElement>document.createElement('form');
	    form.action = this.settings['turkSubmitTo'];
	    form.submit();
	});
    }

}
XApp.register();

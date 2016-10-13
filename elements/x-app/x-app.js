/// <reference path="../../bower_components/polymer-ts/polymer-ts.d.ts"/>
/// <reference path="../../typings/globals/urijs/index.d.ts"/>
/// <reference path="../x-annotation-tab/x-annotation-tab.ts"/>
/// <reference path="../../js/grabcut.d.ts"/>
/// <reference path="../../typings/globals/q/index.d.ts"/>
/// <reference path="../../typings/globals/jszip/index.d.ts"/>
/// <reference path="../../typings/globals/filesaver/index.d.ts"/>
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
var XApp = (function (_super) {
    __extends(XApp, _super);
    function XApp() {
        _super.apply(this, arguments);
        this.selected = '';
    }
    XApp.prototype.selectedChange = function () {
        if (this.selected == 'annotation') {
            var tab = this.$$('x-annotation-tab');
            tab.currentFrameChanged(tab.currentFrame);
            console.log(tab.currentFrame);
        }
    };
    XApp.prototype.attached = function () {
        this.settings = URI(window.location).search(true);
        this.selected = this.settings["selected"] || this.selected || 'video';
        this.vid = this.settings['vid'] || this.vid;
        this.hitid = this.hitid || "dev";
        this.intro = this.createIntroduction();
        this.addEventListener('redirect', this.redirect.bind(this));
        // AWS.config.setPromisesDependency(Q.Promise);
        // AWS.config.update({
        //     accessKeyId: 'AKIAJVK7INOUTATLACQQ',
        //     secretAccessKey: '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'
        // });
        // AWS.config.region = 'us-west-2';
    };
    XApp.prototype._getMask = function () {
        var _this = this;
        var data = new Array();
        var tab = this.$$('x-annotation-tab');
        tab.frameIds.forEach(function (key) {
            var canvas = tab.$$("x-canvas[frame-id=\"" + key + "\"]");
            var ctx = canvas.$.inferenceCanvas.getContext('2d');
            data[key] = image2mask(ctx.getImageData(0, 0, _this.frameWidth, _this.frameWidth));
        });
        return data;
    };
    XApp.prototype.redirect = function (evt) {
        console.log("fired");
        this.selected = evt.detail['tab'];
        if ('page' in evt.detail) {
            this.$$('x-annotation-tab').currentFrame = evt.detail['page'];
        }
    };
    XApp.prototype.startHelp = function () {
        this.intro.start();
    };
    XApp.prototype.submit = function () {
        this._createZip(this._getMask());
    };
    XApp.prototype._createZip = function (data) {
        var _this = this;
        var zip = new JSZip();
        data.map(function (mask, key) {
            if (mask) {
                var file = new File([mask], "newfile", { 'type': 'text/binary' });
                zip.file(_this.vid + "-" + key + ".mask", mask);
            }
        });
        zip.generateAsync({ type: 'blob' }).then(function (blob) {
            saveAs(blob, "data.zip");
            _this.$$('x-result-tab').done();
        });
    };
    // submitForm() {
    //     let data = this._getMask();
    //     var bucket = new AWS.S3();
    //     var qs = <[Q.Promise<any>]>data.map((mask, key) => {
    //         if (mask) {
    //             let file = new File([mask], "newfile", { 'type': 'text/binary' });
    //             return bucket.putObject({
    //                 Key: `experimentdata/${this.hitid}-${this.vid}-${key}.mask`,
    //                 ContentType: file.type,
    //                 Body: file,
    //                 Bucket: 'bucket-for-annotation-search'
    //             }).promise();
    //         } else {
    //             return Q.when(0)
    //         }
    //     });
    //     Q.all(qs).then((d) => {
    //         let form = <HTMLFormElement>document.createElement('form');
    //         form.action = this.settings['turkSubmitTo'];
    //         form.submit();
    //     });
    // }
    XApp.prototype.createIntroduction = function () {
        var _this = this;
        var intro = introJs(this);
        intro.setOptions({
            tooltipPosition: 'auto',
            positionPrecedence: ['right', 'top', 'left', 'bottom'],
            steps: [
                {
                    intro: "Welcome, this annotation tool is here to help us collect the data from the source,\nlet us get through some intructions" },
                { intro: "First, there are three sections for this tools, Video, Annotation, Result" },
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
                    intro: "After watching the video, we wish you could improve the segmentation by annotate the wrong image"
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
                    intro: "This indicates the size and color(foreground/background) of your current stroke"
                },
                {
                    element: this.$$('x-annotation-tab').$$('paper-toggle-button#toggleground'),
                    intro: "There are two types of annotation: foreground and background,\nWe annotate the foreground with green color,\nAnd we annotate the background with red color,\nToggle this button to switch between these two modes"
                },
                {
                    intro: "The left side is the canvas you could annotate with.\nYou could simply drag the mouse as stroke to annotate.\nThe right side is the carved out result of the background.\nIf you are currently in manual mode, you could press COMPUTE to update the result",
                    element: this.$$('x-annotation-tab').$$('iron-pages')
                },
                {
                    intro: "We provide two mode for annotation calculation,\nFirst is Manual, you stroke the canvas as many time as you want,\nand then press COMPUTE to get the annotation.\nSecond is Automatic, we will calculate the annotation everytime\nyou stroke the canvas",
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
                    intro: "If there are some images that you have yet annotated, \nthe button will show CONTINUE FINSISH TASK, you could press this button to simply go back,\nor it will show SUBMIT, and you could then submit your result",
                    element: this.$$('x-result-tab').$$('#submitbtn')
                },
                {
                    intro: "These buttons are checklist which frame you have annotated,\nsquare means it has not been annotated, and check means you have annotated that frame,\nyou could also choose to go back to certain frame by pressing the corresponding button",
                    element: this.$$('x-result-tab').$$('#checklist')
                }
            ]
        }).onbeforechange(function (element) {
            console.log(element.tagName);
            if (element.tagName == 'PAPER-TAB') {
                _this.selected = element.getAttribute('name');
            }
        });
        return intro;
    };
    __decorate([
        property({ type: String })
    ], XApp.prototype, "selected");
    Object.defineProperty(XApp.prototype, "selectedChange",
        __decorate([
            observe('selected')
        ], XApp.prototype, "selectedChange", Object.getOwnPropertyDescriptor(XApp.prototype, "selectedChange")));
    __decorate([
        property({ type: Number, value: 400 })
    ], XApp.prototype, "frameHeight");
    __decorate([
        property({ type: Number, value: 600 })
    ], XApp.prototype, "frameWidth");
    __decorate([
        property({ type: String, value: "" })
    ], XApp.prototype, "vid");
    XApp = __decorate([
        component('x-app')
    ], XApp);
    return XApp;
})(polymer.Base);
XApp.register();

/// <reference path="../../bower_components/polymer-ts/polymer-ts.d.ts"/>
/// <reference path="../../typings/globals/urijs/index.d.ts"/>
/// <reference path="../x-annotation-tab/x-annotation-tab.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var XApp = (function (_super) {
    __extends(XApp, _super);
    function XApp() {
        _super.apply(this, arguments);
        this.selected = '';
    }
    XApp.prototype.attached = function () {
        this.settings = URI(window.location).search(true);
        this.selected = this.settings["selected"] || this.selected || 'video';
        this.hitId = this.settings['hitId'] || this.hitId;
    };
    XApp.prototype._getForms = function () {
        var data = [];
        var tab = this.$$('x-annotation-tab');
        tab.frameIds.forEach(function (key) {
            var canvas = tab.$$("x-canvas[frame-id=\"" + key + "\"]");
            var el = canvas.$.inferenceCanvas;
            data[key] = el;
        });
        return data;
    };
    XApp.prototype.redirect = function (evt) {
        console.log(evt.detail);
        this.selected = evt.detail['tab'];
        if (evt.detail['page']) {
            this.$$('x-annotation-tab').currentFrame = evt.detail['page'];
        }
    };
    XApp.prototype.submitForm = function () {
        var form = document.createElement('form');
        var data = this._getForms();
        for (var key in data) {
            var inputelement = document.createElement('input');
            inputelement.value = data[key].toDataURL();
            inputelement.name = key;
            inputelement.type = 'text';
            form.appendChild(inputelement);
        }
        form.action = this.settings['turkSubmitTo'];
        form.submit();
    };
    __decorate([
        property({ type: String })
    ], XApp.prototype, "selected", void 0);
    __decorate([
        property({ type: Number, value: 400 })
    ], XApp.prototype, "frameHeight", void 0);
    __decorate([
        property({ type: Number, value: 600 })
    ], XApp.prototype, "frameWidth", void 0);
    __decorate([
        property({ type: String, value: "" })
    ], XApp.prototype, "hitId", void 0);
    XApp = __decorate([
        /// <reference path="../../bower_components/polymer-ts/polymer-ts.d.ts"/>
        component('x-app')
    ], XApp);
    return XApp;
}(polymer.Base));
XApp.register();

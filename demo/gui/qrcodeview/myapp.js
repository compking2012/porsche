define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var App = require("../../../framework/app/app");
var QRCodeView = require("../../../framework/ui/view/qrcodeview");

Class.define("MyApp", App, {
    onStart: function() {
        this.qrCodeView = new QRCodeView();
        this.qrCodeView.background = "#FFFFFF";
        this.qrCodeView.width = 180;
        this.qrCodeView.height = 180;
        this.qrCodeView.margin = 3;
        this.qrCodeView.scale = 6;
        this.qrCodeView.color = "#0000FF";
        this.qrCodeView.background = "#EEEEEE";
        this.qrCodeView.correctLevel = "H";
        this.qrCodeView.value = "283197578276228209";
        this.window.addChild(this.qrCodeView);
    }
}, module);

});
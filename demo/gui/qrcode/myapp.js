define(function(require, exports, module) {
"use strict";

var Class = require("/framework/class");
var App = require("/framework/app/app");
var QRCode = require("/framework/ui/view/qrcode");

Class.define("MyApp", App, {
    onStart: function() {
        this.qrcode = new QRCode();
        this.qrcode.background = "#FFFFFF";
        this.qrcode.width = 180;
        this.qrcode.height = 180;
        this.qrcode.margin = 3;
        this.qrcode.scale = 6;
        this.qrcode.color = "#0000FF";
        this.qrcode.background = "#EEEEEE";
        this.qrcode.correctLevel = "H";
        this.qrcode.value = "283197578276228209";
        this.window.addChild(this.qrcode);
    }
}, module);

});
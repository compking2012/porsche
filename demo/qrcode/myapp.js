define(function(require, exports, module) {

"use strict";
var Class = require("/framework/class");
var App = require("/framework/app/app");
var QRCode = require("/framework/ui/view/qrcode");

Class.define("MyApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        this.qrcode = new QRCode();
        this.qrcode.background = "#FFFFFF";
        this.qrcode.width = 320;
        this.qrcode.height = 320;
        this.qrcode.value = "http://www.google.com";

        this.window.addChild(this.qrcode);
    }
}, module);

});

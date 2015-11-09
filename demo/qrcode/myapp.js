"use strict";
var fx = require("cloudappfx");
var Class = fx.import("framework.Class");
var CloudApp = fx.import("framework.app.CloudApp");
var QRCode = fx.import("framework.ui.view.QRCode");

Class.define("MyApp", CloudApp, {
    initialize: function() {
        CloudApp.prototype.initialize.apply(this, arguments);

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

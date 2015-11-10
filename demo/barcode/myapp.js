"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var BarCode = fx.import("framework.ui.view.BarCode");

Class.define("MyApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        this.barcode = new BarCode();
        this.barcode.width = 300;
        this.barcode.height = 150;
        this.barcode.background = "#FFFFFF";
        this.barcode.color = "#0000FF";
        this.barcode.type = "CODE128C";
        this.barcode.value = "283197578276228209";
        this.barcode.fontSize = 20;
        this.barcode.displayValue = true;

        this.window.addChild(this.barcode);
    }
}, module);

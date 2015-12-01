"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var BarCodeView = fx.import("framework.ui.view.BarCodeView");

Class.define("MyApp", App, {
    onStart: function() {
        this.barCodeView = new BarCodeView();
        this.barCodeView.width = 300;
        this.barCodeView.height = 150;
        this.barCodeView.background = "#FFFFFF";
        this.barCodeView.color = "#0000FF";
        this.barCodeView.type = "CODE128C";
        this.barCodeView.value = "283197578276228209";
        this.barCodeView.fontSize = 20;
        this.barCodeView.displayValue = true;

        this.window.addChild(this.barCodeView);
    }
}, module);

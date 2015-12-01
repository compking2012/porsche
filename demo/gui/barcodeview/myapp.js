define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var App = require("../../../framework/app/app");
var BarCodeView = require("../../../framework/ui/view/barcodeview");

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

});
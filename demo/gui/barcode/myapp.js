define(function(require, exports, module) {
"use strict";

var Class = require("/framework/class");
var App = require("/framework/app/app");
var BarCode = require("/framework/ui/view/barcode");

Class.define("MyApp", App, {
    onStart: function() {
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

});
define(function(require, exports, module) {

"use strict";
var Class = require("/framework/class");
var App = require("/framework/app/app");
var BarCode = require("/framework/ui/view/barcode");

Class.define("MyApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        this.barcode = new BarCode();
        this.barcode.background = "#FFFFFF";
        this.barcode.width = 320;
        this.barcode.height = 320;
        this.barcode.type = "ITF14";
        this.barcode.value = "10012345000017";

        this.window.addChild(this.barcode);
    }
}, module);

});


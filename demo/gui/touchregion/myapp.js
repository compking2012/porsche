define(function(require, exports, module) {
"use strict";

var Class = require("/framework/class");
var App = require("/framework/app/app");
var View = require("/framework/ui/view/view");

Class.define("MyApp", App, {
    onStart: function() {
        var view = new View();
        view.background = "#FF0000";
        view.left = 110;
        view.top = 110;
        view.width = 100;
        view.height = 100;

        this.window.addChild(view);
    }
}, module);

});
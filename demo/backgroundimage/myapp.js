define(function(require, exports, module) {

"use strict";
var Class = require("/framework/class");
var App = require("/framework/app/app");
var View = require("/framework/ui/view/view");

Class.define("MyApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        var view = new View();
        view.background = "url(background.gif" + ") repeat";
        view.left = 110;
        view.top = 110;
        view.width = 100;
        view.height = 100;

        this.window.addChild(view);
    }
}, module);

});

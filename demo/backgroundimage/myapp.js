"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var View = fx.import("framework.ui.view.View");

Class.define("MyApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        var view = new View();
        view.background = "url(" + __dirname + "/background.gif" + ") repeat";
        view.left = 110;
        view.top = 110;
        view.width = 100;
        view.height = 100;

        this.window.addChild(view);
    }
}, module);

"use strict";
var fx = require("cloudappfx");
var Class = fx.import("framework.Class");
var CloudApp = fx.import("framework.app.CloudApp");
var View = fx.import("framework.ui.view.View");

Class.define("MyApp", CloudApp, {
    initialize: function() {
        CloudApp.prototype.initialize.apply(this, arguments);

        var view = new View();
        view.background = "url(" + __dirname + "/background.gif" + ") repeat";
        view.left = 110;
        view.top = 110;
        view.width = 100;
        view.height = 100;

        this.window.addChild(view);
    }
}, module);

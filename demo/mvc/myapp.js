"use strict";
var fx = require("cloudappfx");
var Class = fx.import("framework.Class");
var CloudApp = fx.import("framework.app.CloudApp");
var MainController = require("./maincontroller");

Class.define("MyApp", CloudApp, {
    initialize: function() {
        CloudApp.prototype.initialize.apply(this, arguments);

        var mainController = new MainController();

        this.rootController = mainController;
    }
}, module);

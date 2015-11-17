"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var MainController = require("./maincontroller");

Class.define("MyApp", App, {
    onStart: function() {
        var mainController = new MainController();

        this.rootController = mainController;
    }
}, module);

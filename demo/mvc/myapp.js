"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var MainController = require("./maincontroller");

Class.define("MyApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        var mainController = new MainController();

        this.rootController = mainController;
    }
}, module);

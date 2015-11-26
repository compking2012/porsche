define(function(require, exports, module) {
"use strict";

var Class = require("/framework/class");
var App = require("/framework/app/app");
var MainController = require("./maincontroller");

Class.define("MyApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        var mainController = new MainController();

        this.rootController = mainController;
    }
}, module);

});
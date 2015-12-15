"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");

Class.define("MyApp", App, {
    onStart: function() {
        this.window.loadContent();
    }
}, module);

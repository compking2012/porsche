"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var H5App = fx.import("framework.app.H5App");
var View = fx.import("framework.h5.view.View");

Class.define("MyApp", H5App, {
    onStart: function() {
        this.view = new View();
        this.view.background = "#FF0000";
        this.view.left = 110;
        this.view.top = 110;
        this.view.width = 100;
        this.view.height = 100;
        this.view.addEventListener("touchend", this.onTouchEnd.bind(this));

        this.window.addChild(this.view);
    },

    onTouchEnd: function() {
        this.view.background = "#00FF00";
    }
}, module);

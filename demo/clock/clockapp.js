"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var Clock6View = require("./view/clock6/clock6view");

Class.define("framework.apps.simpleclock.ClockApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        this.clockView = new Clock6View();
        this.clockView.width = 320;
        this.clockView.height = 320;
        this.window.addChild(this.clockView);
        setInterval(function() {
            this.clockView.setTime(new Date());
        }.bind(this), 1);
    }
}, module);

"use strict";
var fx = require("cloudappfx");
var Class = fx.import("framework.Class");
var CloudApp = fx.import("framework.app.CloudApp");
var Clock6View = require("./view/clock6/clock6view");

Class.define("framework.apps.simpleclock.ClockApp", CloudApp, {
    initialize: function() {
        CloudApp.prototype.initialize.apply(this, arguments);

        this.clockView = new Clock6View();
        this.clockView.width = 320;
        this.clockView.height = 320;
        this.window.addChild(this.clockView);
        setInterval(function() {
            this.clockView.setTime(new Date());
        }.bind(this), 1);
    }
}, module);

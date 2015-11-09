"use strict";
var fx = require("cloudappfx");
var Class = fx.import("framework.Class");
var CompositeView = fx.import("framework.ui.view.CompositeView");
var ImageView = fx.import("framework.ui.view.ImageView");

Class.define("framework.apps.simpleclock.Clock6Pointers", CompositeView, {
    initialize: function() {
        CompositeView.prototype.initialize.apply(this, arguments);

        this.secondHand = new ImageView();
        this.secondHand.src = __dirname + "/../../res/6/second_hand.png";
        this.secondHand.originX = 3;
        this.secondHand.originY = 127;
        this.secondHand.left = 160 - 3;
        this.secondHand.top = 160 - 127;
        this.secondHand.width = 6;
        this.secondHand.height = 12;

        this.minuteHandProjection = new ImageView();
        this.minuteHandProjection.src = __dirname + "/../../res/6/minute_hand_projection.png";
        this.minuteHandProjection.originX = 15;
        this.minuteHandProjection.originY = 113;
        this.minuteHandProjection.left = 160 - 15;
        this.minuteHandProjection.top = 163 - 113;
        this.minuteHandProjection.width = 30;
        this.minuteHandProjection.height = 126;

        this.minuteHand = new ImageView();
        this.minuteHand.src = __dirname + "/../../res/6/minute_hand.png";
        this.minuteHand.originX = 15;
        this.minuteHand.originY = 113;
        this.minuteHand.left = 160 - 15;
        this.minuteHand.top = 160 - 113;
        this.minuteHand.width = 30;
        this.minuteHand.height = 126;

        this.hourHandProjection = new ImageView();
        this.hourHandProjection.src = __dirname + "/../../res/6/hour_hand_projection.png";
        this.hourHandProjection.originX = 15;
        this.hourHandProjection.originY = 113;
        this.hourHandProjection.left = 160 - 15;
        this.hourHandProjection.top = 160 - 113;
        this.hourHandProjection.width = 30;
        this.hourHandProjection.height = 126;

        this.hourHand = new ImageView();
        this.hourHand.src = __dirname + "/../../res/6/hour_hand.png";
        this.hourHand.originX = 15;
        this.hourHand.originY = 113;
        this.hourHand.left = 160 - 15;
        this.hourHand.top = 160 - 113;
        this.hourHand.width = 30;
        this.hourHand.height = 126;

        this.point = new ImageView();
        this.point.src = __dirname + "/../../res/6/point.png";
        this.point.left = 160 - 4;
        this.point.top = 160 - 4;
        this.point.width = 8;
        this.point.height = 8;

        this.addChild(this.secondHand);
        this.addChild(this.minuteHandProjection);
        this.addChild(this.minuteHand);
        this.addChild(this.hourHandProjection);
        this.addChild(this.hourHand);
        this.addChild(this.point);

        this.now = 0;
    },

    setTime: function(time) {
        this.now = time;

        var hour = this.now.getHours(),
            min = this.now.getMinutes(),
            sec = this.now.getSeconds(),
            hr = hour >= 12 ? hour - 12 : hour;

        this.secondHand.rotationZ = Math.PI / 30 * sec;
        this.minuteHandProjection.rotationZ = Math.PI / 30 * min + Math.PI / 1800 * sec;
        this.minuteHand.rotationZ = Math.PI / 30 * min + Math.PI / 1800 * sec;
        this.hourHandProjection.rotationZ = hr * Math.PI / 6 + Math.PI / 360 * min + Math.PI / 21600 * sec;
        this.hourHand.rotationZ = hr * Math.PI / 6 + Math.PI / 360 * min + Math.PI / 21600 * sec;
    }
}, module);

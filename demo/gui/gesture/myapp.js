"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var TextView = fx.import("framework.ui.view.TextView");
var TapRecognizer = fx.import("framework.ui.gesture.TapRecognizer");
var LongPressRecognizer = fx.import("framework.ui.gesture.LongPressRecognizer");
var SwipeRecognizer = fx.import("framework.ui.gesture.SwipeRecognizer");
var PanRecognizer = fx.import("framework.ui.gesture.PanRecognizer");

Class.define("MyApp", App, {
    onStart: function() {
        this.textView = new TextView();
        this.textView.width = 320;
        this.textView.height = 320;
        this.textView.background = "#00FF00";
        this.textView.fontSize = "40px";
        this.textView.color = "#000000";
        this.textView.addGestureRecognizer(new TapRecognizer({event: "tap"}));
        this.textView.addGestureRecognizer(new TapRecognizer({event: "doubletap", taps: 2}));
        this.textView.addGestureRecognizer(new LongPressRecognizer());
        this.textView.addGestureRecognizer(new PanRecognizer());
        this.textView.addGestureRecognizer(new SwipeRecognizer());
        this.textView.addEventListener("tap", this.onTap.bind(this));
        this.textView.addEventListener("doubletap", this.onDoubleTap.bind(this));
        this.textView.addEventListener("longpress", this.onLongPress.bind(this));
        this.textView.addEventListener("pan", this.onPan.bind(this));
        this.textView.addEventListener("swipe", this.onSwipe.bind(this));

        this.window.addChild(this.textView);
    },

    onTap: function(e) {
        this.textView.text = "Tap";
        this.textView.background = "#FF0000";
        e.stopPropagation();
    },

    onDoubleTap: function(e) {
        this.textView.text = "Double Tap";
        this.textView.background = "#00FF00";
        e.stopPropagation();
    },

    onLongPress: function(e) {
        this.textView.text = "Long Press";
        this.textView.background = "#0000FF";
    },

    onPan: function(e) {
        this.textView.text = "Pan: " + e.direction;
        this.textView.background = "#FFFF00";
    },

    onSwipe: function(e) {
        this.textView.text = "Swipe: " + e.direction;
        this.textView.background = "#00FFFF";
    }
}, module);

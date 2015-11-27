define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var App = require("../../../framework/app/app");
var TextView = require("../../../framework/ui/view/textview");
var TapRecognizer = require("../../../framework/ui/gesture/taprecognizer");
var LongPressRecognizer = require("../../../framework/ui/gesture/longpressrecognizer");
var SwipeRecognizer = require("../../../framework/ui/gesture/swiperecognizer");
var PanRecognizer = require("../../../framework/ui/gesture/panrecognizer");

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

});
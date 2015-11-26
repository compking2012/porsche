define(function(require, exports, module) {
"use strict";

var Class = require("/framework/class");
var App = require("/framework/app/app");
var SwipeView = require("/framework/ui/view/swipeview");
var TextView = require("/framework/ui/view/textview");
var TapRecognizer = require("/framework/ui/gesture/taprecognizer");

Class.define("MyApp", App, {
    onStart: function() {
        this.swipeView = new SwipeView();
        this.swipeView.width = this.window.width;
        this.swipeView.height = this.window.height;

        this.radialGradientView = new TextView();
        this.radialGradientView.text = "Radial Gradient";
        this.radialGradientView.addGestureRecognizer(new TapRecognizer({event: "doubletap", taps: 2}));
        this.radialGradientView.addEventListener("doubletap", this.onChangeRadialGradient.bind(this));
        this.swipeView.addChild(this.radialGradientView);

        this.conicGradientView = new TextView();
        this.conicGradientView.text = "Conic Gradient";
        this.conicGradientView.addGestureRecognizer(new TapRecognizer({event: "doubletap", taps: 2}));
        this.conicGradientView.addEventListener("doubletap", this.onChangeConicGradient.bind(this));
        this.swipeView.addChild(this.conicGradientView);

        this.linearGradientView = new TextView();
        this.linearGradientView.text = "Linear Gradient";
        this.linearGradientView.addGestureRecognizer(new TapRecognizer({event: "doubletap", taps: 2}));
        this.linearGradientView.addEventListener("doubletap", this.onChangeLinearGradient.bind(this));
        this.swipeView.addChild(this.linearGradientView);

        this.window.addChild(this.swipeView);

        this.linearGradients = [
            "linear-gradient(135deg, red 30%, yellow 60%)",
            "linear-gradient(to left, red, orange, yellow, green, blue, indigo, violet)",
            "linear-gradient(to left, #2F2727, #1a82f7 5%, #2F2727, #1a82f7 95%, #2F2727)"
        ];
        this.linearIndex = 0;
        this.linearGradientView.background = this.linearGradients[this.linearIndex];

        this.conicGradients = [
            "conic-gradient(at center, #FF0000, #FFFF00 50%, #FF0000)",
            "conic-gradient(at center, red, orange, yellow, green, blue, indigo, violet)",
            "conic-gradient(at left top, red, yellow 50%, red)"
        ];
        this.conicIndex = 0;
        this.conicGradientView.background = this.conicGradients[this.conicIndex];

        this.radialGradients = [
            "radial-gradient(circle at 150px 150px, red, white)",
            "radial-gradient(circle at top right, red, white)",
            "radial-gradient(circle closest-side, red, white)",
            "radial-gradient(red, white 75%)"
        ];
        this.radialIndex = 0;
        this.radialGradientView.background = this.radialGradients[this.radialIndex];
    },

    onChangeLinearGradient: function() {
        this.linearIndex = (this.linearIndex + 1) % this.linearGradients.length;
        this.linearGradientView.background = this.linearGradients[this.linearIndex];
    },

    onChangeRadialGradient: function() {
        this.radialIndex = (this.radialIndex + 1) % this.radialGradients.length;
        this.radialGradientView.background = this.radialGradients[this.radialIndex];
    },

    onChangeConicGradient: function() {
        this.conicIndex = (this.conicIndex + 1) % this.conicGradients.length;
        this.conicGradientView.background = this.conicGradients[this.conicIndex];
    }
}, module);

});
define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var App = require("../../../framework/app/app");
var View = require("../../../framework/ui/view/view");
var TapRecognizer = require("../../../framework/ui/gesture/taprecognizer");
var PropertyTransition = require("../../../framework/ui/transition/propertytransition");

Class.define("MyApp", App, {
    onStart: function() {
        this.view = new View();
        this.view.background = "#FF0000";
        this.view.left = 0;
        this.view.top = 0;
        this.view.width = 100;
        this.view.height = 100;
        this.view.addGestureRecognizer(new TapRecognizer());
        this.view.addEventListener("tap", this.onTap.bind(this));

        this.view.addTransition(new PropertyTransition("left"));
        this.view.addTransition(new PropertyTransition("top"));
        this.view.addTransition(new PropertyTransition("opacity"));

        this.window.addChild(this.view);
        this.moved = false;
    },

    onTap: function(/*e*/) {
        if (!this.moved) {
            this.view.left = 200;
            this.view.top = 200;
            this.view.opacity = 0.3;
        } else {
            this.view.left = 0;
            this.view.top = 0;
            this.view.opacity = 1;
        }
        this.moved = !this.moved;
    }
}, module);

});
define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var App = require("../../../framework/app/app");
var CompositeView = require("../../../framework/ui/view/compositeview");
var View = require("../../../framework/ui/view/view");

Class.define("MyApp", App, {
    onStart: function() {
        this.window.background = "#00FFFF";
        this.window.addEventListener("touchstart", this.onWindowTouchStart.bind(this));
        this.window.addEventListener("touchend", this.onWindowTouchEnd.bind(this));

        this.compositeView1 = new CompositeView();
        this.compositeView1.background = "#FF0000";
        this.compositeView1.left = 20;
        this.compositeView1.top = 20;
        this.compositeView1.width = 280;
        this.compositeView1.height = 140;
        this.compositeView1.addEventListener("touchstart", this.onCompositeView1TouchStart.bind(this));
        this.compositeView1.addEventListener("touchend", this.onCompositeView1TouchEnd.bind(this));
        this.window.addChild(this.compositeView1);

        this.view1 = new View();
        this.view1.background = "#00FF00";
        this.view1.left = 20;
        this.view1.top = 20;
        this.view1.width = 240;
        this.view1.height = 100;
        this.compositeView1.addChild(this.view1);

        this.view2 = new View();
        this.view2.background = "#0000FF";
        this.view2.left = 20;
        this.view2.top = 160;
        this.view2.width = 280;
        this.view2.height = 140;
        this.window.addChild(this.view2);
    },

    onWindowTouchStart: function(e) {
        this.window.background = "#00AAAA";
        e.stopPropagation();
    },

    onWindowTouchEnd: function(e) {
        this.window.background = "#00FFFF";
        e.stopPropagation();
    },

    onCompositeView1TouchStart: function(e) {
        this.compositeView1.background = "#AA0000";
        e.stopPropagation();
    },

    onCompositeView1TouchEnd: function(e) {
        this.compositeView1.background = "#FF0000";
        e.stopPropagation();
    }
}, module);

});
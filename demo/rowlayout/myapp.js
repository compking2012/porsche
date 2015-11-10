"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var View = fx.import("framework.ui.view.View");
var CompositeView = fx.import("framework.ui.view.CompositeView");
var RowLayout = fx.import("framework.ui.layout.RowLayout");
var ScrollableView = fx.import("framework.ui.view.ScrollableView");
var ImageButton = fx.import("framework.ui.view.ImageButton");

Class.define("MyApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        var scrollableView = new ScrollableView();
        scrollableView.width = this.window.width;
        scrollableView.height = this.window.height;;
        this.window.addChild(scrollableView);

        var colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF"];

        this.rowLayout = new RowLayout();
        this.rowLayout.defaultparam.topmargin = 10;
        this.rowLayout.defaultparam.leftmargin = 30;
        this.rowLayout.defaultparam.layoutgravity = "middle";


        this.cv = new CompositeView();
        this.cv.width = 800;
        this.cv.height = this.window.height;

        var layoutparam = this.rowLayout.getParamAtIndex(1);
        layoutparam.layoutgravity = "top";
        layoutparam.topmargin = 30;
        layoutparam = this.rowLayout.getParamAtIndex(2);
        layoutparam.layoutgravity = "bottom";
        layoutparam = this.rowLayout.getParamAtIndex(3);
        layoutparam.layoutgravity = "middle";
        layoutparam = this.rowLayout.getParamAtIndex(4);
        layoutparam.layoutgravity = "fill";

        this.cv.layout = this.rowLayout;
        scrollableView.addChild(this.cv);

        this.imageButton = new ImageButton();
        this.imageButton.src = __dirname + "/res/wall3.png";
        this.imageButton.pressedSrc = __dirname + "/res/wall1.png";
        this.imageButton.disabledSrc = __dirname + "/res/wall2.png";
        this.imageButton.width = 100;
        this.imageButton.height = 100;
        this.imageButton.addEventListener("click", this.onClick.bind(this));
        this.cv.addChild(this.imageButton);

        for (var i = 0; i < 10; i++) {
            var view = new View();
            view.background = colors[i % 5];
            view.width = 50;
            view.height = 200;
            this.cv.addChild(view);
        }
        setTimeout(function(){alert("Hello world");},1000000);
    },

    destroy: function() {
        this.imageButton.destroy();
        this.imageButton = null;
    },

    onClick: function() {
        console.log("lili clicked!");
        var layoutparam = this.rowLayout.getParamAtIndex(1);
        if (layoutparam.layoutgravity === "top") {
            layoutparam.layoutgravity = "bottom";
        }
        else
            layoutparam.layoutgravity = "top";
    }
}, module);

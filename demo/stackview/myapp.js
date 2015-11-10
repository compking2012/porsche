"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var StackView = fx.import("framework.ui.view.StackView");
var Button = fx.import("framework.ui.view.Button");
var View = fx.import("framework.ui.view.View");

Class.define("MyApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        var buttonPush = new Button();
        buttonPush.width = 160;
        buttonPush.height = 100;
        buttonPush.text = "Push a view";
        buttonPush.background = "#FF0000";
        buttonPush.addEventListener("tap", this.onTapPush.bind(this));
        this.window.addChild(buttonPush);

        var buttonPop = new Button();
        buttonPop.width = 160;
        buttonPop.height = 100;
        buttonPop.left = 160;
        buttonPop.text = "Pop this view";
        buttonPop.background = "#00FF00";
        buttonPop.addEventListener("tap", this.onTapPop.bind(this));
        this.window.addChild(buttonPop);

        this.stackView = new StackView();
        this.stackView.width = 320;
        this.stackView.height = 220;
        this.stackView.top = 100;
        this.stackView.background = "#CCCCCC";
        this.window.addChild(this.stackView);
    },

    onTapPush: function() {
        var colors = ["#0000FF", "#FFFF00", "#00FFFF"];
        var view = new View();
        view.background = colors[this.stackView.children.length % colors.length];
        console.log("StackView:", view.background);
        if (this.stackView.children.length === 0) {
            this.stackView.addChild(view);
        } else {
            this.stackView.pushChild(view);
        }
    },

    onTapPop: function() {
        var view = this.stackView.popChild();
        if (view !== null) {
            view.destroy();
        }
    }
}, module);

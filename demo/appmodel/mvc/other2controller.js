"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var Controller = fx.import("framework.controller.Controller");
var View = fx.import("framework.ui.view.View");

Class.define("MyApp.Other2Controller", Controller, {
    initialize: function() {
        this.super.initialize.apply(this, arguments);

        var view = new View();
        view.background = "#0000FF";
        view.left = 110;
        view.top = 110;
        view.width = 100;
        view.height = 100;

        view.addEventListener("click", this.onClick.bind(this));

        this.view = view;
    },

    onClick: function() {
        console.log("Other2Controller clicked");
        console.log("Other2Controller app:", this.app);
    }
}, module);

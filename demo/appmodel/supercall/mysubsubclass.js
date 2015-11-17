"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var MySubClass = require("./mysubclass");

Class.define("MySubSubClass", MySubClass, {
    initialize: function() {
        this.super.initialize();

        this._instanceProperty = "MySubSubClass Instance Property";
        console.log("MySubSubClass object is initialized.");
    },

    static: {
        takeStaticAction: function() {
            this.super.takeStaticAction();
            console.log("MySubSubClass takeStaticAction method invoked. staticProperty is " + this._staticProperty);
        }
    },

    takeInstanceAction: function() {
        this.super.takeInstanceAction();
        console.log("MySubSubClass takeInstanceAction method invoked. instanceProperty is " + this._instanceProperty);
    }
}, module);

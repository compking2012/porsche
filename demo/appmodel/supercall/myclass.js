"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");

Class.define("MyClass", {
    initialize: function() {
        this.myProperty = "MyClass";
        console.log("MyClass object is initialized.");
    },

    static: {
        takeStaticAction: function() {
            console.log("MyClass takeStaticAction method invoked.");
        }
    },

    takeInstanceAction: function() {
        console.log("MyClass takeInstanceAction method invoked, and invoker is " + this.myProperty);
    }
}, module);

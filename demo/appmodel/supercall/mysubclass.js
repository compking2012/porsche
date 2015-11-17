"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var MyClass = require("./myclass");

Class.define("MySubClass", MyClass, {
    initialize: function() {
        this.super.initialize.apply(this, arguments);

        this.myProperty = "MySubClass";
        console.log("MySubClass object is initialized.");
    },

    static: {
        takeStaticAction: function() {
            MyClass.takeStaticAction();
            console.log("MySubClass takeStaticAction method invoked.");
        }
    },

    takeInstanceAction: function() {
        this.super.takeInstanceAction.apply(this, arguments);
        console.log("MySubClass takeInstanceAction method invoked, and invoker is " + this.myProperty);
    }
}, module);

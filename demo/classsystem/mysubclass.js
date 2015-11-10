"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var MyClass = require("./myclass");

Class.define("MySubClass", MyClass, {
    initialize: function() {
        this.instanceProperty = "This is a instance property of MySubClass instance";
    },

    static: {
        staticProperty: "This is a staic property of MySubClass class",

        staticMethod: function() {
            console.log("This is a static method of MySubClass class.");
        }
    }
}, module);

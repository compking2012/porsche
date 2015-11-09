"use strict";
var fx = require("cloudappfx");
var Class = fx.import("framework.Class");

Class.define("MyClass", {
    initialize: function() {
        this.instanceProperty = "This is a instance property of MyClass instance";
    },

    static: {
        staticProperty: "This is a staic property of MyClass class",

        staticMethod: function() {
            console.log("This is a static method of MyClass class.");
        }
    },

    showInstanceProperty: function() {
        console.log("Instance Property: ", this.instanceProperty);
    },

    showStaticProperty: function() {
        console.log("Static Property: ", this.constructor.staticProperty);
    }
}, module);

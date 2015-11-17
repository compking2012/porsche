"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");

Class.define("MyClass", {
    initialize: function() {
        this._instanceProperty = "MyClass Instance Property";
        console.log("MyClass object is initialized.");
    },

    static: {
        _staticProperty: "MyClass Static Property",

        takeStaticAction: function() {
            console.log("MyClass takeStaticAction method invoked. staticProperty is " + this._staticProperty);
        },

        get staticProperty() {
            console.log("MyClass staticProperty Getter accessed.");
            return this._staticProperty;
        },

        set staticProperty(value) {
            console.log("MyClass staticProperty Setter accessed.");
            this._staticProperty = value;
        }
    },

    takeInstanceAction: function() {
        console.log("MyClass takeInstanceAction method invoked. instanceProperty is " + this._instanceProperty);
    },

    get instanceProperty() {
        console.log("MyClass instanceProperty Getter accessed.");
        return this._instanceProperty;
    },

    set instanceProperty(value) {
        console.log("MyClass instanceProperty Setter accessed.");
        this._instanceProperty = value;
    }
}, module);

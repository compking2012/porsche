"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var MyClass = require("./myclass");

Class.define("MySubClass", MyClass, {
    initialize: function() {
        this.super.initialize();

        this._instanceProperty = "MySubClass Instance Property";
        console.log("MySubClass object is initialized.");
    },

    static: {
        _staticProperty: "MySubClass Static Property",

        takeStaticAction: function() {
            this.super.takeStaticAction();
            console.log("MySubClass takeStaticAction method invoked. staticProperty is " + this._staticProperty);
        },

        get staticProperty() {
            console.log("MySubClass staticProperty Getter accessed.");
            return this.super.staticProperty;
        },

        set staticProperty(value) {
            console.log("MySubClass staticProperty Setter accessed.");
            this.super.staticProperty = value;
        }
    },

    takeInstanceAction: function() {
        this.super.takeInstanceAction();
        console.log("MySubClass takeInstanceAction method invoked. instanceProperty is " + this._instanceProperty);
    },

    get instanceProperty() {
        console.log("MySubClass instanceProperty Getter accessed.");
        return this.super.instanceProperty;
    },

    set instanceProperty(value) {
        console.log("MySubClass instanceProperty Setter accessed.");
        this.super.instanceProperty = value;
    }
}, module);

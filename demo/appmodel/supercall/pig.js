"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var Animal = fx.import("Animal");

Class.define("Pig", Animal, {
    initialize: function(age, name) {
        this.super(age);
        console.log("Pig created.");

        this.name = name;
    },

    static: {
        TestStaticProperty2: 3,

        TestStaticMethod2: function() {
            return 3;
        }
    },

    climbTree: function() {
        return this.super.eat();
    },

    eat: function() {
        return this.name + ", very " + this.super.eat();
    },

    toString: function() {
        return "Pig";
    }
}, module);

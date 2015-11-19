"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");

Class.define("Animal", {
    initialize: function(age) {
        console.log("Animal created.");
        this.age = age;
        this.testProp = "animal";
    },

    static: {
        TestStaticProperty: 1,

        TestStaticProperty2: 2,

        TestStaticMethod: function() {
            return 2;
        },

        TestStaticMethod2: function() {
            return 33;
        }
    },

    eat: function() {
        return "nice";
    },

    drink: function() {
        return "good";
    },

    toString: function() {
        return "Animal";
    }
}, module);

"use strict";
var fx = require("framework");
var Class2 = fx.import("framework.Class2");

var Animal = module.exports = Class2.extend({
    initialize: function(age) {
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
    }
});

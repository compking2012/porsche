"use strict";
var fx = require("framework");
var Animal = require("./animal");

var Pig = module.exports = Animal.extend({
    initialize: function(age, name) {
        this.super(age);

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
        return "very nice";
    }
});

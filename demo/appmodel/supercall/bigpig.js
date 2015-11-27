define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var Pig = require("./pig");

Class.define("BigPig", Pig, {
    initialize: function(age, name, weight) {
        this.super(age, name);
        console.log(typeof this.super === "function");
        console.log("BigPig created.");
        this.weight = weight;
    },

    getSuper: function() {
        return this.super;
    },

    eat: function() {
        return this.super.eat() + ", weight is " + this.weight + "kg!!!";
    },

    toString: function() {
        return "BigPig";
    }
}, module);

});
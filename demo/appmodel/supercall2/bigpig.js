"use strict";
var fx = require("framework");
var Pig = require("./pig");

var BigPig = module.exports = Pig.extend({
    initialize: function () {
        console.log(typeof this.super === "function");
    },

    getSuper: function () {
        return this.super;
    }
});

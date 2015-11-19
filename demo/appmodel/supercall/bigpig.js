"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var Pig = require("./pig");

Class.define("BigPig", Pig, {
    initialize: function () {
        console.log(typeof this.super === "function");
        console.log("BigPig created.");
    },

    getSuper: function () {
        return this.super;
    }
}, module);

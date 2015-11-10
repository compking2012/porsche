"use strict";
var Class = require("../class");
var EventEmitter = require("../eventemitter");

Class.define("framework.ui.platform.H5AppService", EventEmitter, {
    initialize: function() {
        EventEmitter.prototype.initialize.apply(this, arguments);

    },

    destroy: function() {
        EventEmitter.prototype.destroy.apply(this, arguments);
    },

    getRootPath: function() {
        return "/";
    },

    loadFile: function(file) {

    },

    getAppName: function() {
        return "";
    },

    registerSelfToGlobal: function() {
        window.global = window;
    }
}, module);

"use strict";
var Class = require("../class");
var EventEmitter = require("../eventemitter");
var path = require("path");
var fs = require("fs");

Class.define("framework.ui.platform.NodeAppService", EventEmitter, {
    initialize: function() {
        EventEmitter.prototype.initialize.apply(this, arguments);

    },

    destroy: function() {
        EventEmitter.prototype.destroy.apply(this, arguments);
    },

    getFXRootPath: function() {
        return path.dirname(__dirname);
    },

    getAppRootPath: function() {
        return path.dirname(require.main.filename);
    },

    loadFile: function(file) {
        if (!fs.existsSync(file)) {
            return {};
        }
        return JSON.parse(fs.readFileSync(file));
    },

    getAppName: function() {
        return "App";
    },

    registerSelfToGlobal: function() {
        // Nothing need to do
    }
}, module);

/**
* Porsche.js is licensed under the MIT license. If a copy of the
* MIT-license was not distributed with this file, You can obtain one at:
* http://opensource.org/licenses/mit-license.html.
*
* @author: Yang Yang (compking@gmail.com)
* @license MIT
* @copyright Yang Yang, 2015
*/

"use strict";
var Class = require("../class");
var EventEmitter = require("../eventemitter");
var path = require("path");
var fs = require("fs");

Class.define("framework.ui.platform.NodeAppService", EventEmitter, {
    initialize: function() {
        EventEmitter.prototype.initialize.apply(this, arguments);

        setTimeout(this.onStart.bind(this), 0);
    },

    destroy: function() {
        this.onEnd();

        EventEmitter.prototype.destroy.apply(this, arguments);
    },

    getFXRootPath: function() {
        return path.dirname(__dirname);
    },

    getAppRootPath: function() {
        return path.dirname(require.main.filename);
    },

    loadFile: function(file, callback) {
        if (!fs.existsSync(file)) {
            callback(null);
            return;
        }
        fs.readFile(file, function(err, data) {
            if (err) {
                callback(null);
                return;
            }
            callback(data.toString());
        }.bind(this));
    },

    getAppName: function() {
        return "App";
    },

    registerGlobal: function() {
        // Nothing need to do
    },

    asyncLoadModule: function(file, callback) {
        var mod = require(file);
        callback(mod);
    },

    onStart: function() {
        this.dispatchEvent("start");
    },

    onEnd: function() {
        this.dispatchEvent("finish");
    }
}, module);

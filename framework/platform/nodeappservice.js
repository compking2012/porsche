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
        this.super.initialize.apply(this);

    },

    destroy: function() {
        this.super.destroy.apply(this);
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
            callback(data);
        }.bind(this));
    },

    getAppName: function() {
        return "App";
    },

    registerGlobal: function() {
        // Nothing need to do
    }
}, module);

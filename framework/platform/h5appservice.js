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

Class.define("framework.ui.platform.H5AppService", EventEmitter, {
    initialize: function() {
        this.super.initialize();

    },

    destroy: function() {
        this.super.destroy();
    },

    getFXRootPath: function() {
        return "/framework";
    },

    getAppRootPath: function() {
        return ".";
    },

    loadFile: function(file, callback) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    callback(xhr.responseText);
                } else {
                    callback(null);
                }
            }
        }.bind(this));
        xhr.open("GET", file, true);
        xhr.send(null);
    },

    getAppName: function() {
        return "App";
    },

    registerGlobal: function() {
        window.global = window;
    }
}, module);

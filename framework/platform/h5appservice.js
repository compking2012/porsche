define(function(require, exports, module) {
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
        EventEmitter.prototype.initialize.apply(this, arguments);

        window.addEventListener("load", this._onLoadFunc = this.onLoad.bind(this));
        window.addEventListener("unload", this._onUnloadFunc = this.onUnload.bind(this));
        document.addEventListener("visibilitychange", this._onVisibilityChangeFunc = this.onVisibilityChange.bind(this));
    },

    destroy: function() {
        window.removeEventListener("load", this._onLoadFunc);
        this._onLoadFunc = null;

        window.removeEventListener("unload", this._onUnloadFunc);
        this._onUnloadFunc = null;

        document.removeEventListener("visibilitychange", this._onVisibilityChangeFunc);
        this._onVisibilityChangeFunc = null;

        EventEmitter.prototype.destroy.apply(this, arguments);
    },

    getFXRootPath: function() {
        return window.__prefix__ + "/framework";
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
    },

    onLoad: function() {
        this.dispatchEvent("start");
    },

    onUnload: function() {
        this.dispatchEvent("finish");
    },

    onVisibilityChange: function() {
        if (document.visibilityState === "hidden") {
            this.dispatchEvent("inactive");
        } else if (document.visibilityState === "visible") {
            this.dispatchEvent("active");
        }
    }
}, module);

});
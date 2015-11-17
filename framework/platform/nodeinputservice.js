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

Class.define("framework.ui.platform.InputService", EventEmitter, {
    initialize: function(target) {
        this.super.initialize.apply(this);

        this._uiServer = target;
        this._uiServer.on("input", this._processInputEventFunc = this.processInputEvent.bind(this));
    },

    destroy: function() {
        this._uiServer.off("input", this._processInputEventFunc);
        this._processInputEventFunc = null;
        this._uiServer = null;

        this.super.destroy.apply(this);
    },

    processInputEvent: function(e) {
        e.type = Number(e.type);
        e.x = Number(e.x);
        e.y = Number(e.y);

        // FIXME: only support single touch
        var points = [];
        points.push({x: e.x, y: e.y});
        if (e.type === 0) {
            this.dispatchEvent("input", "touchstart", points);
        } else if (e.type === 6) {
            this.dispatchEvent("input", "touchmove", points);
        } else if (e.type === 1) {
            this.dispatchEvent("input", "touchend", points);
        }
    }
}, module);

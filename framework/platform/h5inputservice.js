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

Class.define("framework.ui.platform.H5InputService", EventEmitter, {
    initialize: function(target) {
        EventEmitter.prototype.initialize.apply(this, arguments);

        this._canvas = target;
        this._canvas.addEventListener("mousedown", this._onMouseDownFunc = this.onMouseDown.bind(this));
        this._canvas.addEventListener("mousemove", this._onMouseMoveFunc = this.onMouseMove.bind(this));
        this._canvas.addEventListener("mouseup", this._onMouseUpFunc = this.onMouseUp.bind(this));
        this._canvas.addEventListener("touchstart", this._onTouchStartFunc = this.onTouchStart.bind(this));
        this._canvas.addEventListener("touchmove", this._onTouchMoveFunc = this.onTouchMove.bind(this));
        this._canvas.addEventListener("touchend", this._onTouchEndFunc = this.onTouchEnd.bind(this));
        this._canvas.addEventListener("touchcancel", this._onTouchCancelFunc = this.onTouchCancel.bind(this));
        window.addEventListener("keydown", this._onKeyDownFunc = this.onKeyDown.bind(this));
        window.addEventListener("keyup", this._onKeyUpFunc = this.onKeyUp.bind(this));
    },

    destroy: function() {
        this._canvas.removeEventListener("mousedown", this._onMouseDownFunc);
        this._onMouseDownFunc = null;
        this._canvas.removeEventListener("mousemove", this._onMouseMoveFunc);
        this._onMouseMoveFunc = null;
        this._canvas.removeEventListener("mouseup", this._onMouseUpFunc);
        this._onMouseUpFunc = null;
        this._canvas.removeEventListener("touchstart", this._onTouchStartFunc);
        this._onTouchStartFunc = null;
        this._canvas.removeEventListener("touchmove", this._onTouchMoveFunc);
        this._onTouchMoveFunc = null;
        this._canvas.removeEventListener("touchend", this._onTouchEndFunc);
        this._onTouchEndFunc = null;
        this._canvas.removeEventListener("touchcancel", this._onTouchCancelFunc);
        this._onTouchCancelFunc = null;
        window.removeEventListener("keydown", this._onKeyDownFunc);
        this._onKeyDownFunc = null;
        window.removeEventListener("keyup", this._onKeyUpFunc);
        this._onKeyUpFunc = null;

        EventEmitter.prototype.destroy.apply(this, arguments);
    },

    onMouseDown: function(e) {
        var point = {x: e.clientX, y: e.clientY, button: e.button};
        this.dispatchEvent("input", "mousedown", point);
    },

    onMouseMove: function(e) {
        var point = {x: e.clientX, y: e.clientY, button: e.button};
        this.dispatchEvent("input", "mousemove", point);
    },

    onMouseUp: function(e) {
        var point = {x: e.clientX, y: e.clientY, button: e.button};
        this.dispatchEvent("input", "mouseup", point);
    },

    onTouchStart: function(e) {
        var points = [];
        for (var i = 0; i < e.targetTouches.length; i++) {
            points.push({x: e.targetTouches[i].clientX, y: e.targetTouches[i].clientY});
        }
        this.dispatchEvent("input", "touchstart", points);
    },

    onTouchMove: function(e) {
        var points = [];
        for (var i = 0; i < e.targetTouches.length; i++) {
            points.push({x: e.targetTouches[i].clientX, y: e.targetTouches[i].clientY});
        }
        this.dispatchEvent("input", "touchmove", points);
    },

    onTouchEnd: function(e) {
        var points = [];
        for (var i = 0; i < e.changedTouches.length; i++) {
            points.push({x: e.changedTouches[i].clientX, y: e.changedTouches[i].clientY});
        }
        this.dispatchEvent("input", "touchend", points);
    },

    onTouchCancel: function(e) {
        var points = [];
        for (var i = 0; i < e.changedTouches.length; i++) {
            points.push({x: e.changedTouches[i].clientX, y: e.changedTouches[i].clientY});
        }
        this.dispatchEvent("input", "touchend", points);
    },

    onKeyDown: function(e) {
        this.dispatchEvent("input", "keydown", {keyCode: e.keyCode});
    },

    onKeyUp: function(e) {
        this.dispatchEvent("input", "keyup", {keyCode: e.keyCode});
    }
}, module);

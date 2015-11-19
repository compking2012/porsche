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
        this.super.initialize.call(this);

        this._canvas = target;
        this._canvas.addEventListener("touchstart", this._onTouchStartFunc = this.onTouchStart.bind(this));
        this._canvas.addEventListener("touchmove", this._onTouchMoveFunc = this.onTouchMove.bind(this));
        this._canvas.addEventListener("touchend", this._onTouchEndFunc = this.onTouchEnd.bind(this));
        this._canvas.addEventListener("touchcancel", this._onTouchCancelFunc = this.onTouchCancel.bind(this));
        window.addEventListener("keydown", this._onKeyDownFunc = this.onKeyDown.bind(this));
        window.addEventListener("keyup", this._onKeyUpFunc = this.onKeyUp.bind(this));
    },

    destroy: function() {
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

        this.super.destroy.call(this);
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
        this.dispatchEvent("input", "touchcancel", points);
    },

    onKeyDown: function(e) {
        this.dispatchEvent("input", "keydown", {keyCode: e.keyCode});
    },

    onKeyUp: function(e) {
        this.dispatchEvent("input", "keyup", {keyCode: e.keyCode});
    }
}, module);

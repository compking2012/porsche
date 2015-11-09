"use strict";
var Class = require("../class");
var EventEmitter = require("../eventemitter");

Class.define("framework.ui.platform.H5InputService", EventEmitter, {
    initialize: function(target) {
        EventEmitter.prototype.initialize.apply(this, arguments);

        this._canvas = target;
        this._canvas.addEventListener("touchstart", this.onTouchStartFunc = this.onTouchStart.bind(this));
        this._canvas.addEventListener("touchmove", this._onTouchMoveFunc = this.onTouchMove.bind(this));
        this._canvas.addEventListener("touchend", this._onTouchEndFunc = this.onTouchEnd.bind(this));
        this._canvas.addEventListener("touchcancel", this._onTouchCancelFunc = this.onTouchCancel.bind(this));
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

        EventEmitter.prototype.destroy.apply(this, arguments);
    },

    onTouchStart: function(e) {
        this.dispatchEvent("input", "touchstart", {x: e.touches[0], y: e.y});
    },

    onTouchMove: function(e) {
        this.dispatchEvent("input", "touchmove", {x: e.x, y: e.y});
    },

    onTouchEnd: function(e) {
        this.dispatchEvent("input", "touchend", {x: e.x, y: e.y});
    },

    onTouchCancel: function(e) {
        this.dispatchEvent("input", "touchcancel", {x: e.x, y: e.y});
    }
}, module);

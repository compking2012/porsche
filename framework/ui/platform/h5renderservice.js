"use strict";
var Class = require("../class");
var EventEmitter = require("../eventemitter");

Class.define("framework.ui.platform.H5RenderService", EventEmitter, {
    initialize: function() {
        EventEmitter.prototype.initialize.apply(this, arguments);

        this._canvas = document.createElement("canvas");
        document.body.addChild(this._canvas);
    },

    destroy: function() {
        document.body.removeChild(this._canvas);
        this._canvas = null;

        EventEmitter.prototype.destroy.apply(this, arguments);
    },

    getTarget: function() {
        return this._canvas;
    },

    createCanvas: function(width, height) {
        this._canvas.style.width = width + "px";
        this._canvas.style.height = height + "px";
        return this._canvas;
    },

    destroyCanvas: function(canvas) {
        document.removeChild(canvas);
    },

    getWidth: function() {
        return 320;
    },

    getHeight: function() {
        return 320;
    },

    requestRenderFrame: function(renderFrameCallback) {
        requestAnimationFrame(renderFrameCallback);
    },

    render: function() {

    }
}, module);

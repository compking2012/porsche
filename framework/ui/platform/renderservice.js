"use strict";
var Class = require("../class");
var EventEmitter = require("../eventemitter");
var UIServer = require("core/ui");

Class.define("{Framework}.ui.platform.RenderService", EventEmitter, {
    initialize: function() {
        EventEmitter.prototype.initialize.apply(this, arguments);

        this._uiServer = new UIServer();
        this._canvasIdGen = 0;
        this._timer = null;
    },

    destroy: function() {
        clearTimeout(this._timer);
        this._timer = null;

        this._uiServer = null;

        EventEmitter.prototype.destroy.apply(this, arguments);
    },

    getTarget: function() {
        return this._uiServer;
    },

    createCanvas: function(width, height) {
        this._canvasIdGen++;
        var canvas = this._uiServer.createCanvas(String(this._canvasIdGen), 0, 0, width, height, 0);
        this._uiServer.setCanvasTouchRegion(canvas, 0, 0, width, height);
        return canvas;
    },

    destroyCanvas: function(canvas) {
        this._uiServer.deleteCanvas(canvas);
        this._uiServer.invalidateAll();
    },

    getWidth: function() {
        return this._uiServer.getScreenSize().width;
    },

    getHeight: function() {
        return this._uiServer.getScreenSize().height;
    },

    requestRenderFrame: function(renderFrameCallback) {
        this._timer = setTimeout(renderFrameCallback, 0);
    },

    render: function() {
        this._uiServer.invalidateAll();
        this._uiServer.dumpAllCanvas();
    }
}, module);

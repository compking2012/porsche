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
var UIServer = require("core/ui");
var Canvas = require("canvas/lib/canvas");
var fs = require("fs");

Class.define("framework.ui.platform.RenderService", EventEmitter, {
    initialize: function() {
        EventEmitter.prototype.initialize.apply(this, arguments);

        this._uiServer = new UIServer("MyApp");
        this._canvasIdGen = 0;
        this._timer = null;
    },

    destroy: function() {
        clearTimeout(this._timer);
        this._timer = null;

        this._uiServer = null;

        EventEmitter.prototype.destroy.apply(this, arguments);
    },

    registerImageToGlobal: function() {
        global.Image = Canvas.Image;
        global.Image.prototype.__defineSetter__("src", function(val) {
            if ("string" === typeof val && 0 === val.indexOf("data:")) {
                val = val.slice(val.indexOf(",") + 1);
                this.source = new Buffer(val, "base64");
            } else {
                this.source = new Buffer(fs.readFileSync(val), "base64");
            }
        });
    },

    getTarget: function() {
        return this._uiServer;
    },

    createCanvas: function(width, height) {
        this._canvasIdGen++;
        var canvas = this._uiServer.createCanvas(String(this._canvasIdGen), 0, 0, width, height, 0);
        this._uiServer.setCanvasTouchRegion(canvas, 0, 0, width, height);
        var chsFont = new Canvas.Font("sans-serif", "/system/bin/ui_res/chsfont2.ttf");
        canvas.getContext("2d").addFont(chsFont);

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

});
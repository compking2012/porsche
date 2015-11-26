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

Class.define("framework.ui.platform.H5RenderService", EventEmitter, {
    initialize: function() {
        EventEmitter.prototype.initialize.apply(this, arguments);

        this._canvas = document.createElement("canvas");
        document.body.appendChild(this._canvas);
    },

    destroy: function() {
        document.body.removeChild(this._canvas);
        this._canvas = null;

        EventEmitter.prototype.destroy.apply(this, arguments);
    },

    registerImageToGlobal: function() {
        // Nothing need to do
    },

    getTarget: function() {
        return this._canvas;
    },

    createCanvas: function(width, height) {
        this._canvas.style.background = "#000000";
        this._canvas.width = width;
        this._canvas.height = height;
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

});
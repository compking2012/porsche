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
var Polyfiller = require("../util/polyfiller");

Class.define("framework.ui.platform.H5RenderService", EventEmitter, {
    initialize: function() {
        EventEmitter.prototype.initialize.apply(this, arguments);

        this._renderFrameId = null;
        this._canvas = document.createElement("canvas");
        document.body.appendChild(this._canvas);
    },

    destroy: function() {
        document.body.removeChild(this._canvas);
        this._canvas = null;

        if (this._renderFrameId !== null) {
            window.cancelAnimationFrame(this._renderFrameId);
        }
        this._renderFrameId = null;

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

    getContext: function(canvas) {
        var context = canvas.getContext("2d");
        Polyfiller.polyfillContext(context);
        context.clearRect(0, 0, canvas.width, canvas.height);

        return context;
    },

    destroyCanvas: function(canvas) {
        document.removeChild(canvas);
    },

    createWebGLCanvas: function(width, height) {
        this._canvas.style.background = "#000000";
        this._canvas.width = width;
        this._canvas.height = height;
        return this._canvas;
    },

    getWebGLContext: function(canvas) {
        var context = canvas.getContext("webgl");
        context.clearColor(0, 0, 0, 1);
        context.clearDepth(1.0);
        context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
        context.enable(context.DEPTH_TEST);
        context.depthFunc(context.LEQUAL);
        context.activeTexture(context.TEXTURE0);
        context.viewport(0, 0, canvas.width, canvas.height);

        var vShaderScript =
            "attribute vec3 position;" +
            "attribute vec4 color;" +
            "attribute vec2 textureCoord;" +
            "uniform   mat4 mvpMatrix;" +
            "varying   vec4 vColor;" +
            "varying   vec2 vTextureCoord;" +
            "void main(void) {" +
            "    vColor = color;" +
            "    vTextureCoord = textureCoord;" +
            "    gl_Position = mvpMatrix * vec4(position, 1.0);" +
            "}";
        var vShader = context.createShader(context.VERTEX_SHADER);
        context.shaderSource(vShader, vShaderScript);
        context.compileShader(vShader);
        if (!context.getShaderParameter(vShader, context.COMPILE_STATUS)) {
            console.log(context.getShaderInfoLog(vShader));
            return null;
        }

        var fShaderScript =
            "precision mediump float;" +
            "uniform sampler2D texture;" +
            "varying vec4 vColor;" +
            "varying vec2 vTextureCoord;" +
            "void main(void) {" +
            "    vec4 smpColor = texture2D(texture, vTextureCoord);" +
            "    gl_FragColor  = smpColor;" +
            "}";
        var fShader = context.createShader(context.FRAGMENT_SHADER);
        context.shaderSource(fShader, fShaderScript);
        context.compileShader(fShader);
        if (!context.getShaderParameter(fShader, context.COMPILE_STATUS)) {
            console.log(context.getShaderInfoLog(fShader));
            return null;
        }

        var program = context.createProgram();
        context.attachShader(program, vShader);
        context.attachShader(program, fShader);
        context.linkProgram(program);

        if (!context.getProgramParameter(program, context.LINK_STATUS)) {
            console.log(context.getProgramInfoLog(program));
            return null;
        }

        context.useProgram(program);

        context.program = program;
        context.attPosition = context.getAttribLocation(program, "position");
        context.attColor = context.getAttribLocation(program, "color");
        context.attTextureCoord = context.getAttribLocation(program, "textureCoord");
        context.attPositionStride = 3;
        context.attColorStride = 4;
        context.attTextureCoordStride = 2;

        return context;
    },

    destroyWebGLCanvas: function(canvas) {
        document.removeChild(canvas);
    },

    createBackBuffer: function(width, height) {
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        return canvas;
    },

    getBackBufferContext: function(canvas) {
        var context = canvas.getContext("2d");
        Polyfiller.polyfillContext(context);
        context.clearRect(0, 0, canvas.width, canvas.height);

        return context;
    },

    destroyBackBuffer: function(canvas) {
    },

    getWidth: function() {
        return 320;
    },

    getHeight: function() {
        return 320;
    },

    requestRenderFrame: function(renderFrameCallback) {
        this._renderFrameId = window.requestAnimationFrame(renderFrameCallback);
    },

    render: function() {
    }
}, module);

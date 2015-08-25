define(function(require, exports, module) {

"use strict";
var Class = require("../class");
var EventEmitter = require("../eventemitter");
var Window = require("../ui/view/window");
var WindowManager = require("../ui/windowmanager");

/**
 * Base App class
 * @class App
 * @extends EventEmitter
 * @abstract
 */
Class.define("framework.app.App", EventEmitter, {
    /**
     * Constructor
     * @method App#initialize
     */
    initialize: function() {
        EventEmitter.prototype.initialize.apply(this, arguments);
        this._manifest = this.loadManifest();
        this._rootController = null;

        var canvas = document.querySelector("canvas");
        var rect = canvas.getBoundingClientRect();
        var width = rect.width;
        var height = rect.height;
        this._window = new Window();
        this._windowManager = new WindowManager(this._window, width, height);
    },

    /**
     * Destructor
     * @method App#destroy
     */
    destroy: function() {
        this._windowManager.destroy();
        this._windowManager = null;
        this._window.destroy();
        this._window = null;
        this._rootController = null;
        this._manifest = null;
        EventEmitter.prototype.destroy.apply(this, arguments);
    },

    get rootController() {
        return this._rootController;
    },

    set rootController(value) {
        if (this._rootController) {
            this._window.removeChild(this._rootController.view);
        }
        this._rootController = value;
        value.parent = this;
        this._window.addChild(this._rootController.view);
    },

    /**
     * @name App#window
     * @type {Window}
     * @description the Window associated with the current app
     */
    get window() {
        return this._window;
    },

    get windowManager() {
        return this._windowManager;
    },

    loadManifest: function() {
        return null;
    },

    /**
     * Bring an app to the front
     * @method App#bringAppToFront
     * @param {String} appname the name of apps
     */
    bringAppToFront: function(appname) {
    },

    /**
     * Hide an app for system
     * @method App#hideApp
     * @param {String} appname the name of apps
     */
    hideApp: function(appname) {
    },

    /**
     * Handle Event when set app start
     * @method App#onStart
     * @abstract
     */
    onStart: function() {

    },

    /**
     * Handle Event when set app run in background
     * @method App#onInactive
     * @abstract
     */
    onInactive: function() {

    },

    /**
     * Handle Event when set app run in foreground
     * @method App#onActive
     * @abstract
     */
    onActive: function() {

    },

    processDebug: function(debug) {
        if (debug.paintFPS) {
            window.debugPaintFPS = true;
        }
        if (debug.dirtyRect) {
            window.debugDirtyRect = true;
        }
    }
}, module);

});

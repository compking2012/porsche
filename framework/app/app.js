define(function(require, exports, module) {

"use strict";
var Class = require("../class");
var EventEmitter = require("../eventemitter");
var Window = require("../ui/view/window");
var WindowManager = require("../ui/windowmanager");

/**
 * Base App, a new app must extend this class
 * @class App
 * @extends EventEmitter
 * @param {String} appName name of current app
 * @abstract
 **/
Class.define("framework.app.App", EventEmitter, {
    initialize: function() {
        EventEmitter.prototype.initialize.apply(this, arguments);

        // this._manifest = this.loadManifest();
        // this._appName = this._manifest.appName;
        // this._rootController = null;

        var canvas = document.querySelector("canvas");
        var rect = canvas.getBoundingClientRect();
        var width = rect.width;
        var height = rect.height;
        this._window = new Window();

        this._windowManager = new WindowManager(this._window, width, height);

        // // this.window.on("apptofront", this.bringAppToFront.bind(this));
        // // this.window.on("hideapp", this.hideApp.bind(this));
        // // this._uiServer.on("start", function() {
        //     this.bringAppToFront(this._appName);
        //     this.onStart.call(this);
        // // }.bind(this));

        // this._uiServer.on("state", function(state) {
        //     if (state === UIServer.BACKGROUND) {
        //         this.onInactive.call(this);
        //     } else if (state === UIServer.FOREGROUND) {
        //         this._uiServer.invalidateAll();
        //         this.onActive.call(this);
        //     }
        // }.bind(this));
    },

    destroy: function() {

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

    get uiServer() {
        return this._uiServer;
    },

    get windowManager() {
        return this._windowManager;
    },

    /**
     * Bring an app to the front
     * @method App#bringAppToFront
     * @param {String} appname the name of apps
     */
    bringAppToFront: function(appname) {
        return this._uiServer.bringAppToFront(appname);
    },

    /**
     * Hide an app for system
     * @method App#hideApp
     * @param {String} appname the name of apps
     */
    hideApp: function(appname) {
        return this._uiServer.hideApp(appname);
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
     * @abstract
     * @method App#onActive
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

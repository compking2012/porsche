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
var Window = require("../ui/view/window");
var WindowManager = require("../ui/windowmanager");
var I18nManager = require("../util/i18nmanager");
var AppService = require("../platform/h5appservice");
var InputService = require("../platform/h5inputservice");
var RenderService = require("../platform/h5renderservice");

/**
 * Base class for those who need to maintain global application state.
 * You can provide your own implementation by specifying its name in your manifest.json,
 * which will cause that class to be instantiated for you when the process for your application/package is created.
 * @class App
 * @extends EventEmitter
 * @abstract
 */
Class.define("framework.app.App", EventEmitter, {
    initialize: function() {
        EventEmitter.prototype.initialize.apply(this, arguments);

        this._appService = new AppService();
        this._renderService = new RenderService();
        this._inputService = new InputService(this._renderService.getTarget());

        this._appService.addEventListener("start", this._onStartFunc = this.onStart.bind(this));
        this._appService.addEventListener("background", this._onInactiveFunc = this.onInactive.bind(this));
        this._appService.addEventListener("foreground", this._onActiveFunc = this.onActive.bind(this));
        this._appService.addEventListener("finish", this._onFinishFunc = this.onFinish.bind(this));
        this._appService.registerGlobal();
        this._renderService.registerImageToGlobal();

        global.app = this;
        global.AppFXRootPath = this._appService.getFXRootPath();

        this._appName = this._appService.getAppName();
        this._rootController = null;

        this._i18nManager = new I18nManager();
        this._i18nManager.addEventListener("load", this._onLoadI18nFunc = function() {
            this._windowManager = new WindowManager(this._inputService, this._renderService);

            this._window = new Window(this._appName);
            this._windowManager.addWindow(this._window);

            this.onStart();
        }.bind(this));
        this._i18nManager.locale = "zh-CN";
    },

    /**
     * Destructor
     * @method App#destroy
     */
    destroy: function() {
        this._i18nManager.removeEventListener("load", this._onLoadI18nFunc);
        this._onLoadI18nFunc = null;
        this._i18nManager.destroy();
        this._i18nManager = null;
        this._windowManager.destroy();
        this._windowManager = null;
        this._window.destroy();
        this._window = null;
        this._rootController = null;
        this._appService.removeEventListener("start", this._onStartFunc);
        this._onStartFunc = null;
        this._appService.removeEventListener("background", this._onInactiveFunc);
        this._onInactiveFunc = null;
        this._appService.removeEventListener("foreground", this._onActiveFunc);
        this._onActiveFunc = null;
        this._appService.removeEventListener("finish", this._onFinishFunc);
        this._onFinishFunc = null;
        global.app = null;

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
     * @description the window associated with this current app
     */
    get window() {
        return this._window;
    },

    /**
     * @name App#windowManager
     * @type {WindowManager}
     * @description access the window manager associated with this current app
     * @private
     */
    get windowManager() {
        return this._windowManager;
    },

    get appService() {
        return this._appService;
    },

    getI18nString: function(key) {
        return this._i18nManager.getString(key);
    },

    /**
     * Handle Event when set app start
     * @abstract
     * @method App#onStart
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

    /**
     * Handle Event when set app finish
     * @abstract
     * @method App#onFinish
     */
    onFinish: function() {

    },

    get rootPath() {
        return this._appService.getAppRootPath();
    },

    processDebug: function(debug) {
        if (debug.paintFPS) {
            global.AppFXDebugPaintFPS = true;
        }
        if (debug.dirtyRect) {
            global.AppFXDebugDirtyRect = true;
        }
    }
}, module);

});
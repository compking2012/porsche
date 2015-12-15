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
var LayoutManager = require("../ui/layout/layoutmanager");
var AppService = require("../platform/appservice");
var InputService = require("../platform/inputservice");
var RenderService = require("../platform/renderservice");

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

        this._appService.addEventListener("start", this._onStartFunc = function() {
            this._i18nManager = new I18nManager();
            this._i18nManager.addEventListener("load", this._onLoadI18nFunc = function() {
                this._windowManager = new WindowManager(this._inputService, this._renderService);
                this._layoutManager = new LayoutManager();
                this._layoutManager.addEventListener("load", this._onLoadLayoutManagerFunc = function() {
                    this._window = new Window(this._appName);
                    this._windowManager.addWindow(this._window);

                    this.onStart();
                }.bind(this));
                this._layoutManager.load();
            }.bind(this));
            this._i18nManager.locale = "zh-CN";
        }.bind(this));
        this._appService.addEventListener("inactive", this._onInactiveFunc = this.onInactive.bind(this));
        this._appService.addEventListener("active", this._onActiveFunc = this.onActive.bind(this));
        this._appService.addEventListener("finish", this._onFinishFunc = this.onFinish.bind(this));
        this._appService.registerGlobal();
        this._renderService.registerImageToGlobal();

        global.app = this;
        global.AppFXRootPath = this._appService.getFXRootPath();

        this._appName = this._appService.getAppName();
        this._rootController = null;
    },

    /**
     * Destructor
     * @method App#destroy
     */
    destroy: function() {
        if (this._layoutManager !== undefined) {
            this._layoutManager.removeEventListener("load", this._onLoadLayoutManagerFunc);
            this._onLoadLayoutManagerFunc = null;
            this._layoutManager.destroy();
            this._layoutManager = null;
        }

        if (this._i18nManager !== undefined) {
            this._i18nManager.removeEventListener("load", this._onLoadI18nFunc);
            this._onLoadI18nFunc = null;
            this._i18nManager.destroy();
            this._i18nManager = null;
        }

        if (this._windowManager !== undefined) {
            this._windowManager.destroy();
            this._windowManager = null;
            this._window.destroy();
            this._window = null;
        }
        this._rootController = null;

        this._appService.removeEventListener("start", this._onStartFunc);
        this._onStartFunc = null;

        this._appService.removeEventListener("inactive", this._onInactiveFunc);
        this._onInactiveFunc = null;

        this._appService.removeEventListener("active", this._onActiveFunc);
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
     * @description the window associated with this current app.
     * @readonly
     */
    get window() {
        return this._window;
    },

    get layoutManager() {
        return this._layoutManager;
    },

    /**
     * @name App#rootPath
     * @type {String}
     * @description the root path of this current app.
     * @readonly
     */
    get rootPath() {
        return this._appService.getAppRootPath();
    },

    /**
     * Get the internationalization text of the specified key.
     * @method App#getI18nString
     * @param  {String} key - the key value.
     * @return {String} the corresponding internationalization text.
     */
    getI18nString: function(key) {
        return this._i18nManager.getString(key);
    },

    /**
     * Handle event when set app start.
     * @method App#onStart
     * @protected
     * @abstract
     */
    onStart: function() {
        // TO BE IMPLEMENTED
    },

    /**
     * Handle event when set app run in background.
     * @method App#onInactive
     * @protected
     * @abstract
     */
    onInactive: function() {
        // TO BE IMPLEMENTED
    },

    /**
     * Handle event when set app run in foreground.
     * @method App#onActive
     * @protected
     * @abstract
     */
    onActive: function() {
        // TO BE IMPLEMENTED
    },

    /**
     * Handle event when set app finish.
     * @method App#onFinish
     * @protected
     * @abstract
     */
    onFinish: function() {
        // TO BE IMPLEMENTED
    },

    /**
     * @name App#windowManager
     * @type {WindowManager}
     * @description access the window manager associated with this current app
     * @readonly
     * @private
     */
    get windowManager() {
        return this._windowManager;
    },

    /**
     * @name App#appService
     * @type {AppService}
     * @description access the app service associated with this current app
     * @readonly
     * @private
     */
    get appService() {
        return this._appService;
    },

    /**
     * Process debug flag.
     * @method App#processDebug
     * @param {Object} debug - the debug info.
     * @private
     */
    processDebug: function(debug) {
        if (debug.paintFPS) {
            global.AppFXDebugPaintFPS = true;
        }
        if (debug.dirtyRect) {
            global.AppFXDebugDirtyRect = true;
        }
    }
}, module);

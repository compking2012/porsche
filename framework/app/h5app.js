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
var Window = require("../h5/view/window");
var WindowManager = require("../h5/windowmanager");
var I18nManager = require("../util/i18nmanager");
var H5AppService = require("../platform/h5appservice");

Class.define("framework.app.H5App", EventEmitter, {
    initialize: function() {
        EventEmitter.prototype.initialize.apply(this, arguments);

        this._appService = new H5AppService();

        this._appService.addEventListener("start", this._onStartFunc = function() {
            this._i18nManager = new I18nManager();
            this._i18nManager.addEventListener("load", this._onLoadI18nFunc = function() {
                this._windowManager = new WindowManager();
                // this._layoutManager = new LayoutManager();
                // this._layoutManager.addEventListener("load", this._onLoadLayoutManagerFunc = function() {
                    this._window = new Window(this._appName);
                    this._windowManager.addWindow(this._window);

                    this.onStart();
                // }.bind(this));
                // this._layoutManager.load();
            }.bind(this));
            this._i18nManager.locale = "zh-CN";
        }.bind(this));
        this._appService.addEventListener("inactive", this._onInactiveFunc = this.onInactive.bind(this));
        this._appService.addEventListener("active", this._onActiveFunc = this.onActive.bind(this));
        this._appService.addEventListener("finish", this._onFinishFunc = this.onFinish.bind(this));
        this._appService.registerGlobal();

        global.app = this;
        global.AppFXRootPath = this._appService.getFXRootPath();

        this._appName = this._appService.getAppName();
    },

    /**
     * Destructor
     * @method H5App#destroy
     */
    destroy: function() {
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

    /**
     * @name H5App#window
     * @type {Window}
     * @description the window associated with this current app.
     * @readonly
     */
    get window() {
        return this._window;
    },

    /**
     * @name H5App#rootPath
     * @type {String}
     * @description the root path of this current app.
     * @readonly
     */
    get rootPath() {
        return this._appService.getAppRootPath();
    },

    /**
     * Get the internationalization text of the specified key.
     * @method H5App#getI18nString
     * @param  {String} key - the key value.
     * @return {String} the corresponding internationalization text.
     */
    getI18nString: function(key) {
        return this._i18nManager.getString(key);
    },

    /**
     * Handle event when set app start.
     * @method H5App#onStart
     * @protected
     * @abstract
     */
    onStart: function() {
        // TO BE IMPLEMENTED
    },

    /**
     * Handle event when set app run in background.
     * @method H5App#onInactive
     * @protected
     * @abstract
     */
    onInactive: function() {
        // TO BE IMPLEMENTED
    },

    /**
     * Handle event when set app run in foreground.
     * @method H5App#onActive
     * @protected
     * @abstract
     */
    onActive: function() {
        // TO BE IMPLEMENTED
    },

    /**
     * Handle event when set app finish.
     * @method H5App#onFinish
     * @protected
     * @abstract
     */
    onFinish: function() {
        // TO BE IMPLEMENTED
    },

    /**
     * @name H5App#appService
     * @type {AppService}
     * @description access the app service associated with this current app
     * @readonly
     * @private
     */
    get appService() {
        return this._appService;
    }
}, module);

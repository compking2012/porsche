"use strict";
var Class = require("../class");
var EventEmitter = require("../eventemitter");
var Window = require("../ui/view/window");
var WindowManager = require("../ui/windowmanager");
var I18nManager = require("../util/i18nmanager");
var AppService = typeof window !== "undefined" ? require("../platform/h5appservice") : require("../platform/nodeappservice");
var InputService = typeof window !== "undefined" ? require("../platform/h5inputservice") : require("../platform/nodeinputservice");
var RenderService = typeof window !== "undefined" ? require("../platform/h5renderservice") : require("../platform/noderenderservice");

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

        this._appService = new AppService();
        this._renderService = new RenderService();
        this._inputService = new InputService(this._renderService.getTarget());

        this._appName = this._appService.getAppName();
        this._rootController = null;

        this._i18nManager = new I18nManager();
        this._i18nManager.locale = "zh-CN";

        this._windowManager = new WindowManager(this._inputService, this._renderService);

        this._window = new Window(this._appName);
        this._windowManager.addWindow(this._window);

        this._appService.addEventListener("start", this._onStartFunc = this.onStart.bind(this));
        this._appService.addEventListener("background", this._onInactiveFunc = this.onInactive.bind(this));
        this._appService.addEventListener("foreground", this._onActiveFunc = this.onActive.bind(this));
        this._appService.addEventListener("finish", this._onFinishFunc = this.onFinish.bind(this));

        this._appService.registerSelfToGlobal();
        this._renderService.registerImageToGlobal();
        global.app = this;
        global.AppFXRootPath = this._appService.getFXRootPath();
    },

    /**
     * Destructor
     * @method App#destroy
     */
    destroy: function() {
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
     * @description the Window associated with the current app
     */
    get window() {
        return this._window;
    },

    get windowManager() {
        return this._windowManager;
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

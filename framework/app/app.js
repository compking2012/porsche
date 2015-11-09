"use strict";
var Class = require("../class");
var EventEmitter = require("../eventemitter");
var Window = require("../ui/view/window");
var WindowManager = require("../ui/windowmanager");
var I18nManager = require("../util/i18nmanager");
var InputService = require("./platform/inputservice");
var RenderService = require("./platform/renderservice");

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
        this._appName = this._manifest.appName;
        this._rootController = null;

        this._i18nManager = new I18nManager();
        // this._i18nManager.locale = "zh-CN";

        this._renderService = new RenderService();
        this._inputService = new InputService(this._renderService.getTarget());

        this._windowManager = new WindowManager(this._inputService, this._renderService);

        this._window = new Window(this._appName);
        this._window.width = this._uiServer.getScreenSize().width;
        this._window.height = this._uiServer.getScreenSize().height;
        this._windowManager.addWindow(this._window);

        // this.window.on("apptofront", this.bringAppToFront.bind(this));
        // this.window.on("hideapp", this.hideApp.bind(this));
        // this._uiServer.on("start", function() {
            this.bringAppToFront(this._appName);
            this.onStart.call(this);
        // }.bind(this));

        this._uiServer.on("state", function(state) {
            if (state === UIServer.BACKGROUND) {
                this.onInactive.call(this);
            } else if (state === UIServer.FOREGROUND) {
                this._uiServer.invalidateAll();
                this.onActive.call(this);
            }
        }.bind(this));

        global.app = this;
    },

    /**
     * Destructor
     * @method App#destroy
     */
    destroy: function() {
        this._uiServer = null;
        this._i18nManager.destroy();
        this._i18nManager = null;
        this._windowManager.destroy();
        this._windowManager = null;
        this._window.destroy();
        this._window = null;
        this._rootController = null;
        this._manifest = null;
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
        return path.dirname(require.main.filename);
    },

    loadManifest: function() {
        var manifestFile = this.rootPath + "/manifest.json";
        if (!fs.existsSync(manifestFile)) {
            return {};
        }
        var json = JSON.parse(fs.readFileSync(manifestFile));

        if (json.debug) {
            this.processDebug(json.debug);
        }

        return json;
    },

    processDebug: function(debug) {
        if (debug.paintFPS) {
            global.CloudAppFXDebugPaintFPS = true;
        }
        if (debug.dirtyRect) {
            global.CloudAppFXDebugDirtyRect = true;
        }
    }
}, module);

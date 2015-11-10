"use strict";
var Class = require("../class");
var YObject = require("../yobject");
var I18next = require("../vendor/i18next");
var fs = require("fs");

Class.define("framework.util.I18nManager", YObject, {
    initialize: function() {
        YObject.prototype.initialize.apply(this, arguments);
    },

    destroy: function() {
        YObject.prototype.destroy.apply(this, arguments);
    },

    get locale() {
        return this._locale;
    },

    set locale(value) {
        this._locale = value;
    },

    getString: function(key) {
        if (!this._initialized) {
            this.initLocale();
        }
        return I18next.t(key);
    },

    initLocale: function() {
        var locale = this.getLocale();
        var json = JSON.parse(fs.readFileSync(global.app.rootPath + "/locales/" + locale + "/strings.json").toString());
        var store = {};
        store[locale] = {
            translation: json
        };

        I18next.init({
            lng: locale,
            load: "current",
            fallbackLng: false,
            resStore: store
        });
    },

    getLocale: function() {
        if (this._locale) {
            return this._locale || "en-US";
        } else {
            var envLANG = process.env["LANG"];
            var lang = envLANG !== undefined ? envLANG.split(".")[0].replace("_", "-") : "en-US";
            return lang;
        }
    }
}, module);

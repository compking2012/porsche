define(function(require, exports, module) {
define(function(require, exports, module) {
define(function(require, exports, module) {
define(function(require, exports, module) {define(function(require, exports, module) {

"use strict";
var Class = require("/framework/class");
var App = require("/framework/app/app");
var TextView = require("/framework/ui/view/textview");
var I18nManager = require("/framework/util/i18nmanager");

Class.define("MyApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        var i18n = new I18nManager();
        i18n.locale = "zh-CN";

        var textview = new TextView();
        textview.text = i18n.getString("MY_TEXT");
        textview.fontSize = "60px";
        textview.textAlign = "center";
        textview.fontStyle = "normal";
        textview.background = "#FF0000";
        textview.color = "#00FF00";
        textview.width = 300;
        textview.height = 100;
        textview.left = 10;
        textview.top = 100;
        textview.multiLine = false;

        this.window.addChild(textview);
    }
}, module);

});
});
});
});
});
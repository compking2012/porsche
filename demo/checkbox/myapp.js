define(function(require, exports, module) {
define(function(require, exports, module) {
define(function(require, exports, module) {
define(function(require, exports, module) {define(function(require, exports, module) {

"use strict";
var Class = require("/framework/class");
var App = require("/framework/app/app");
var CheckBox = require("/framework/ui/view/checkbox");
var TextView = require("/framework/ui/view/textview");

Class.define("MyApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        this.textView = new TextView();
        this.textView.width = 320;
        this.textView.height = 50;
        this.textView.fontSize = "30px";
        this.textView.textAlign = "center";
        this.textView.fontStyle = "normal";
        this.textView.background = "#FF0000";
        this.textView.color = "#00FF00";
        this.textView.text = "Click the Checkbox";
        this.window.addChild(this.textView);

        this.checkbox = new CheckBox();
        this.checkbox.left = 50;
        this.checkbox.top = 50;
        this.checkbox.width = 100;
        this.checkbox.height = 100;
        this.checkbox.addEventListener("click", this.onClick.bind(this));
        this.window.addChild(this.checkbox);
    },

    destroy: function() {
        this.checkbox.destroy();
        this.checkbox = null;
    },

    onClick: function() {
        if (this.checkbox.value) {
            this.textView.text = "Checkbox is on";
        } else {
            this.textView.text = "Checkbox is off";
        }
    }
}, module);

});
});
});
});
});
define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var App = require("../../../framework/app/app");
var ListView = require("../../../framework/ui/view/listview");
var TextView = require("../../../framework/ui/view/textview");
var ListItem = require("../../../framework/ui/view/listitem");
var ScrollBar = require("../../../framework/ui/view/scrollbar");

Class.define("MyApp", App, {
    onStart: function() {
        this.list = new ListView();
        this.list.width = this.window.width;
        this.list.height = this.window.height;
        this.list.itemHeight = 100;
        this.list.addEventListener("tap", this.onTap.bind(this));
        this.window.addChild(this.list);

        this.list.verticalScrollBar = new ScrollBar();
        this.list.verticalScrollBar.left = 310;
        this.list.verticalScrollBar.width = 10;
        this.list.verticalScrollBar.height = 50;
        this.window.addChild(this.list.verticalScrollBar);

        var colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF"];
        for (var i = 0; i < 1000; i++) {
            var listItem = new ListItem();
            listItem.background = colors[i % colors.length];
            listItem.width = this.list.width;

            var textView = new TextView();
            textView.width = listItem.width;
            textView.height = this.list.itemHeight;
            textView.fontSize = "36px";
            textView.color = "#FFFFFF";
            textView.align = "center";
            textView.text = "Item" + i;
            listItem.addChild(textView);

            this.list.addChild(listItem);
        }
    },

    onTap: function(e) {
        var listItem = e.target;
        listItem.children[0].text = "Clicked";
    }
}, module);

});
"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var ListView = fx.import("framework.ui.view.ListView");
var TextView = fx.import("framework.ui.view.TextView");
var ListItem = fx.import("framework.ui.view.ListItem");
var ScrollBar = fx.import("framework.ui.view.ScrollBar");

Class.define("MyApp", App, {
    onStart: function() {
        this.list = new ListView();
        this.list.width = this.window.width;
        this.list.height = this.window.height;
        this.list.orientation = "horizontal";
        this.list.itemWidth = 100;
        this.list.addEventListener("tap", this.onTap.bind(this));
        this.window.addChild(this.list);

        this.list.horizontalScrollBar = new ScrollBar();
        this.list.horizontalScrollBar.orientation = "horizontal";
        this.list.horizontalScrollBar.top = 310;
        this.list.horizontalScrollBar.width = 50;
        this.list.horizontalScrollBar.height = 10;
        this.window.addChild(this.list.horizontalScrollBar);

        var colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF"];
        for (var i = 0; i < 1000; i++) {
            var listItem = new ListItem();
            listItem.background = colors[i % colors.length];
            listItem.height = this.list.height;

            var textView = new TextView();
            textView.id = "text" + i;
            textView.width = listItem.width;
            textView.height = listItem.height;
            textView.fontSize = "36px";
            textView.color = "#FFFFFF";
            listItem.addChild(textView);

            this.list.addChild(listItem);
        }
    },

    onTap: function(e) {
        var listItem = e.target;
        listItem.children[0].text = "Clicked";
    }
}, module);

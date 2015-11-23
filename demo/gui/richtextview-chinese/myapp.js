"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var RichTextView = fx.import("framework.ui.view.RichTextView");

Class.define("MyApp", App, {
    onStart: function() {
        var text = "2. In the last decades, advances in medical technology have made it possible for people to live longer than in the past." +
                    "我喜欢<class=\"blue\">蓝色</class><style=\"font-size:42px; color:#FF0000\">零一二三四五六七八九十</style>零一二三四五六<br />七八九十<class=\"big\">零一二三四五</class>六七八九十!" +
                    "If you usually work with <style=\"font-style: italic; font-size: 28px; font-weight: bold; color: #00FFFF\">HTML5</style> Canvas, <class=\"big\"> you will know for sure the difficulty of drawing styled text into it.</class> CanvasText is a library writte in JavasScript that lets you write<br/> with a similar HTML & CSS syntax.";
        var richTextView = new RichTextView();
        richTextView.width = 320;
        richTextView.height = 320;
        richTextView.fontSize = "18px";
        richTextView.color = "#00FF00";
        richTextView.lineHeight = 24;

        richTextView.defineClass("blue", {
            fontFamily: "sans-serif",
            fontSize: "24px",
            fontColor: "#29A1F1",
            fontWeight: "normal",
            textShadow: "2px 2px 2px #919191"
        });
        richTextView.defineClass("big", {
            fontFamily: "sans-serif",
            fontSize: "30px",
            fontColor: "#FF5E99",
            fontWeight: "normal",
            fontStyle: "italic"
        });
        richTextView.text = text;
        this.window.addChild(richTextView);
    }
}, module);

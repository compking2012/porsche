"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var RichTextView = fx.import("framework.ui.view.RichTextView");

Class.define("MyApp", App, {
    initialize: function(){
        App.prototype.initialize.apply(this, arguments);

        var str = '2. In the last decades, advances in medical technology have made it possible for people to live longer than in the past.';
        var str1 = '我喜欢<class="blue">蓝色</class   ><style="font-family:default; font-size:42px; color:#FF0000">零一二三四五六七八九十</style>零一二三四五六<br />七八九十<class="big"  >零一二三四五<   /class   >六七八九十!';
        var str2 = 'If you usually work with <style="font-style: italic; font-family: Verdana; font-size: 28px; font-weight: bold; color: #00FFFF">HTML5< /style> Canvas, <class="big"> you will know for sure the difficulty of drawing styled text into it.</class> CanvasText is a library writte in JavasScript that lets you write<br/> with a similar HTML & CSS syntax.';
        var richtextview = new RichTextView(str1);

        richtextview.defineClass("blue", {
            _fontStyle: "italic",
            _fontSize: "22px",
            _fontColor: "#FA8072",
            _fontFamily: "default",
            _fontWeight: "bold"
        });
        richtextview.defineClass("big", {
            _fontStyle: "italic",
            _fontSize: "25px",
            _fontColor: "#FA8072",
            _fontFamily: "Verdana",
            _fontWeight: "bold"
        });

        richtextview.fontSize = "20px";
        richtextview.fontStyle = "normal";
        richtextview.align = "left";
        richtextview.left = 0;
        richtextview.top = 0;
        richtextview.width = 320;
        richtextview.height = 200;
        richtextview.isAdaptive = false;//true: compute the height of richtextview automatically and use the new height
        this.window.addChild(richtextview);

        setTimeout(function(){alert("Hello world");},1000000);
    }
}, module);

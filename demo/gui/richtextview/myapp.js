define(function(require, exports, module) {
"use strict";

var Class = require("/framework/class");
var App = require("/framework/app/app");
var RichTextView = require("/framework/ui/view/richtextview");

Class.define("MyApp", App, {
    onStart: function() {
        var text = "In this example I don\'t care about <class=\"blue\">blue</class> or <class=\"pink\">pink</class>.\n\
                I just care about the new and <class=\"blue\">exciting</class> <class=\"pink\">automatic</class>\n\
                <class=\"blue\">multiline</class> feature!! <br />Just to be sure:<br />Lorem ipsum dolor sit amet, \n\
                consectetur adipiscing elit. Nulla ut erat magna, quis commodo nulla.\n\
                Vestibulum <class=\"pink\">eget</class> mi quis sapien lacinia porta eget eget neque. Aliquam lacus \n\
                leo, sodales sit amet laoreet non, mollis ut nibh.";
        var richTextView = new RichTextView();
        richTextView.width = 320;
        richTextView.height = 320;
        richTextView.lineHeight = 24;

        richTextView.defineClass("blue", {
            fontFamily: "sans-serif",
            fontSize: "30px",
            fontColor: "#29A1F1",
            fontWeight: "normal",
            textShadow: "2px 2px 2px #919191"
        });
        richTextView.defineClass("pink", {
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

});
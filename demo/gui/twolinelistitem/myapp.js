define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var App = require("../../../framework/app/app");
var ListView = require("../../../framework/ui/view/listview");
var TwoLineListItem = require("../../../framework/ui/view/twolinelistitem");

Class.define("MyApp", App, {
    onStart: function() {
        this.list = new ListView();
        this.list.width = this.window.width;
        this.list.height = this.window.height;
        this.list.itemHeight = 100;

        for (var i = 0; i < 10; i++) {
            var item = new TwoLineListItem();
            switch (i % 10) {
                case 0:
                    item.mode = "TwoLinesOnly";
                    break;
                case 1:
                    item.mode = "TwoLinesWithSideText";
                    break;
                case 2:
                    item.mode = "TwoLinesWithSwitch";
                    break;
                case 3:
                    item.mode = "TwoLinesWithNavigator";
                    break;
                case 4:
                    item.mode = "TwoLinesWithCheckBox";
                    break;
                case 5:
                    item.mode = "TwoLinesWithImage";
                    break;
                case 6:
                    item.mode = "TwoLinesWithImageAndSideText";
                    break;
                case 7:
                    item.mode = "TwoLinesWithImageAndSwitch";
                    break;
                case 8:
                    item.mode = "TwoLinesWithImageAndNavigator";
                    break;
                case 9:
                    item.mode = "TwoLinesWithImageAndCheckBox";
                    break;
            }
            if (/^TwoLinesWithImage/.test(item.mode)) {
                item.image.src = global.app.rootPath + "/res/ic_measure.png";
            }
            item.mainText.text = "Item " + i;
            item.commentText.text = "This is an item.";
            if (/SideText/.test(item.mode)) {
                var t = new Date();
                item.sideText.text = t.getHours() + ":" + t.getMinutes();
            }
            this.list.addChild(item);
        }
        this.window.addChild(this.list);
    }
}, module);

});
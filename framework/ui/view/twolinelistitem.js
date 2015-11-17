/**
* Porsche.js is licensed under the MIT license. If a copy of the
* MIT-license was not distributed with this file, You can obtain one at:
* http://opensource.org/licenses/mit-license.html.
*
* @author: Yang Yang (compking@gmail.com)
* @license MIT
* @copyright Yang Yang, 2015
*/

"use strict";
var Class = require("../../class");
var ListItem = require("./listitem");
var ImageView = require("./imageview");
var TextView = require("./textview");
var Switch = require("./switch");
var CheckBox = require("./checkbox");

Class.define("framework.ui.view.TwoLineListItem", ListItem, {
    initialize: function() {
        this.super.initialize.apply(this, arguments);

        this.mode = "TwoLinesOnly";
    },

    destroy: function() {
        this.super.destroy.apply(this, arguments);
        this.showImage(false);
        this.showMainText(false);
        this.showCommentText(false);
        this.showSideText(false);
        this.showSwitch(false);
        this.showNavigator(false);
        this.showCheckBox(false);
    },

    get mode() {
        return this._mode;
    },

    set mode(value) {
        this._mode = value;
        if (value === "TwoLinesOnly") {
            this.showImage(false);
            this.showMainText(true);
            this.showCommentText(true);
            this.showSideText(false);
            this.showSwitch(false);
            this.showNavigator(false);
            this.showCheckBox(false);
        } else if (value === "TwoLinesWithSideText") {
            this.showImage(false);
            this.showMainText(true);
            this.showCommentText(true);
            this.showSideText(true);
            this.showSwitch(false);
            this.showNavigator(false);
            this.showCheckBox(false);
        } else if (value === "TwoLinesWithSwitch") {
            this.showImage(false);
            this.showMainText(true);
            this.showCommentText(true);
            this.showSideText(false);
            this.showSwitch(true);
            this.showNavigator(false);
            this.showCheckBox(false);
        } else if (value === "TwoLinesWithNavigator") {
            this.showImage(false);
            this.showMainText(true);
            this.showCommentText(true);
            this.showSideText(false);
            this.showSwitch(false);
            this.showNavigator(true);
            this.showCheckBox(false);
        } else if (value === "TwoLinesWithCheckBox") {
            this.showImage(false);
            this.showMainText(true);
            this.showCommentText(true);
            this.showSideText(false);
            this.showSwitch(false);
            this.showNavigator(false);
            this.showCheckBox(true);
        } else if (value === "TwoLinesWithImage") {
            this.showImage(true);
            this.showMainText(true);
            this.showCommentText(true);
            this.showSideText(false);
            this.showSwitch(false);
            this.showNavigator(false);
            this.showCheckBox(false);
        } else if (value === "TwoLinesWithImageAndSideText") {
            this.showImage(true);
            this.showMainText(true);
            this.showCommentText(true);
            this.showSideText(true);
            this.showSwitch(false);
            this.showNavigator(false);
            this.showCheckBox(false);
        } else if (value === "TwoLinesWithImageAndSwitch") {
            this.showImage(true);
            this.showMainText(true);
            this.showCommentText(true);
            this.showSideText(false);
            this.showSwitch(true);
            this.showNavigator(false);
            this.showCheckBox(false);
        } else if (value === "TwoLinesWithImageAndNavigator") {
            this.showImage(true);
            this.showMainText(true);
            this.showCommentText(true);
            this.showSideText(false);
            this.showSwitch(false);
            this.showNavigator(true);
            this.showCheckBox(false);
        } else if (value === "TwoLinesWithImageAndCheckBox") {
            this.showImage(true);
            this.showMainText(true);
            this.showCommentText(true);
            this.showSideText(false);
            this.showSwitch(false);
            this.showNavigator(false);
            this.showCheckBox(true);
        }
    },

    get image() {
        return this._image;
    },

    get mainText() {
        return this._mainText;
    },

    get commentText() {
        return this._commentText;
    },

    get sideText() {
        return this._sideText;
    },

    get switch() {
        return this._switch;
    },

    get navigator() {
        return this._navigator;
    },

    get checkbox() {
        return this._checkbox;
    },

    showImage: function(flag) {
        if (flag) {
            this._image = new ImageView();
            this._image.left = 20;
            this._image.top = 30;
            this._image.width = 40;
            this._image.height = 40;
            this.addChild(this._image);
        } else {
            if (this._image) {
                this._image.destroy();
                this._image = null;
            }
        }
    },

    showMainText: function(flag) {
        if (flag) {
            this._mainText = new TextView();
            this._mainText.font = "方正兰亭黑";
            this._mainText.fontSize = "24px";
            this._mainText.color = "#FFFFFF";
            this._mainText.left = this._mode.indexOf("TwoLinesWithImage") === -1 ? 20 : 70;
            this._mainText.top = 20;
            this._mainText.width = 260;
            this._mainText.height = 24;
            this._mainText.align = "left";
            this._mainText.verticalAlign = "bottom";
            this.addChild(this._mainText);
        } else {
            if (this._mainText) {
                this._mainText.destroy();
                this._mainText = null;
            }
        }
    },

    showCommentText: function(flag) {
        if (flag) {
            this._commentText = new TextView();
            this._commentText.font = "方正兰亭黑";
            this._commentText.fontSize = "20px";
            this._commentText.color = "#8D8D8D";
            this._commentText.align = "left";
            this._commentText.verticalAlign = "top";
            this._commentText.left = this._mode.indexOf("TwoLinesWithImage") === -1 ? 20 : 70;
            this._commentText.top = 52;
            this._commentText.width = 260;
            this._commentText.height = 20;
            this.addChild(this._commentText);
        } else {
            if (this._commentText) {
                this._commentText.destroy();
                this._commentText = null;
            }
        }
    },

    showSideText: function(flag) {
        if (flag) {
            this._sideText = new TextView();
            this._sideText.font = "方正兰亭黑";
            this._sideText.fontSize = "20px";
            this._sideText.color = "#8D8D8D";
            this._sideText.align = "right";
            this._sideText.verticalAlign = "top";
            this._sideText.left = 20;
            this._sideText.top = 52;
            this._sideText.width = 260;
            this._sideText.height = 20;
            this.addChild(this._sideText);
        } else {
            if (this._sideText) {
                this._sideText.destroy();
                this._sideText = null;
            }
        }
    },

    showSwitch: function(flag) {
        if (flag) {
            this._switch = new Switch();
            this._switch.left = 240;
            this._switch.top = 30;
            this._switch.width = 44;
            this._switch.height = 44;
            this.addChild(this._switch);
        } else {
            if (this._switch) {
                this._switch.destroy();
                this._switch = null;
            }
        }
    },

    showNavigator: function(flag) {
        if (flag) {
            this._navigator = new ImageView();
            this._navigator.src = global.AppFXRootPath + "/resources/navigator.png";
            this._navigator.left = 270;
            this._navigator.top = 40;
            this._navigator.width = 13;
            this._navigator.height = 23;
            this.addChild(this._navigator);
        } else {
            if (this._navigator) {
                this._navigator.destroy();
                this._navigator = null;
            }
        }
    },

    showCheckBox: function(flag) {
        if (flag) {
            this._checkbox = new CheckBox();
            this._checkbox.left = 240;
            this._checkbox.top = 24;
            this._checkbox.width = 48;
            this._checkbox.height = 48;
            this.addChild(this._checkbox);
        } else {
            if (this._checkbox) {
                this._checkbox.destroy();
                this._checkbox = null;
            }
        }
    }
}, module);

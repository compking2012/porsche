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
var Dialog = require("./dialog");
var RelativeLayout = require("../layout/relativelayout");
var TextView = require("./textview");
var Button = require("./button");

Class.define("framework.ui.view.ConfirmDialog", Dialog, {
    initialize: function(options) {
        this.super.initialize();

        this.layout = new RelativeLayout();
        this.layout.setLayoutParam(0, "align", {left: "parent", top: "parent", right: "parent"});
        this.layout.setLayoutParam(0, "margin", {left: 20, top: 40, right: 20});
        this.layout.setLayoutParam(1, "align", {right: "parent", bottom: "parent"});
        this.layout.setLayoutParam(1, "margin", {right: 10, bottom: 10});
        this.layout.setLayoutParam(2, "align", {left: "parent", bottom: "parent"});
        this.layout.setLayoutParam(2, "margin", {left: 10, bottom: 10});

        this._messageTextView = new TextView();
        this._messageTextView.fontSize = "24px";
        this._messageTextView.height = 60;
        this._messageTextView.fontStyle = "normal";
        this._messageTextView.align = "left";
        this._messageTextView.valign = "top";
        this._messageTextView.color = "#FFFFFF";
        this._messageTextView.multiLine = true;
        this.addChild(this._messageTextView);

        this._confirmButton = new Button();
        this._confirmButton.align = "center";
        this._confirmButton.width = 140;
        this._confirmButton.height = 60;
        this._confirmButton.color = "#13D767";
        this._confirmButton.fontSize = "30px";
        this._confirmButton.background = "#1E1E1E";
        this._confirmButton.radius = 14;
        this._confirmButton.addEventListener("tap", this._onTapConfirmFunc = this.onTapConfirm.bind(this));
        this.addChild(this._confirmButton);

        this._cancelButton = new Button();
        this._cancelButton.align = "center";
        this._cancelButton.width = 140;
        this._cancelButton.height = 60;
        this._cancelButton.color = "#FFFFFF";
        this._cancelButton.fontSize = "30px";
        this._cancelButton.background = "#1E1E1E";
        this._cancelButton.radius = 14;
        this._cancelButton.addEventListener("tap", this._onTapCancelFunc = this.onTapCancel.bind(this));
        this.addChild(this._cancelButton);

        this._messageTextView.text = options.messageText;
        this._confirmButton.text = options.confirmText;
        this._cancelButton.text = options.cancelText;
    },

    destroy: function() {
        this.removeChild(this._messageTextView);
        this._messageTextView.destroy();
        this._messageTextView = null;

        this.removeChild(this._confirmButton);
        this._confirmButton.removeEventListener("tap", this._onTapConfirmFunc);
        this._onTapConfirmFunc = null;
        this._confirmButton.destroy();
        this._confirmButton = null;

        this.removeChild(this._cancelButton);
        this._cancelButton.removeEventListener("tap", this._onTapCancelFunc);
        this._onTapCancelFunc = null;
        this._cancelButton.destroy();
        this._cancelButton = null;

        this.super.destroy();
    },

    onTapConfirm: function() {
        this.dispatchEvent("result", true);
        this.close();
    },

    onTapCancel: function() {
        this.dispatchEvent("result", false);
        this.close();
    }
}, module);

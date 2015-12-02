define(function(require, exports, module) {
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

/**
 * Confirm dialog which is a subclass of dialog that can display a message with two buttons.
 * User can tap the confirm button or the cancel button.
 * @class ConfirmDialog
 * @extends Dialog
 */
Class.define("framework.ui.view.ConfirmDialog", Dialog, {
    /**
     * Constructor that create an confirm dialog.
     * @method ConfirmDialog#initialize
     * @param  {Object} options - the required parameters for this confirm dialog.
     * messageText is a required parameter which is used to display a text as a message.
     * confirmText is a required parameter which is used for confirm button.
     * cancelText is a required parameter which is used for cancel button.
     */
    initialize: function(options) {
        Dialog.prototype.initialize.apply(this, arguments);

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

    /**
     * Destructor that destroy this dialog
     * @method ConfirmDialog#destroy
     */
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

        Dialog.prototype.destroy.apply(this, arguments);
    },

    /**
     * Handle the tap event of the confirm button and will dispatch a result event.
     * @method ConfirmDialog#onTapConfirm
     * @param {GestureEvent} e - the gesture event info.
     */
    onTapConfirm: function(/*e*/) {
        this.dispatchEvent("result", true);
        this.close();
    },

    /**
     * Handle the tap event of the cancel button and will dispatch a result event.
     * @method ConfirmDialog#onTapCancel
     * @param {GestureEvent} e - the gesture event info.
     */
    onTapCancel: function(/*e*/) {
        this.dispatchEvent("result", false);
        this.close();
    }
}, module);

});
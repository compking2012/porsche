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
 * Alert dialog which is a subclass of dialog that can display a message with one button.
 * User can only tap the button to continue.
 * @class AlertDialog
 * @extends Dialog
 */
Class.define("framework.ui.view.AlertDialog", Dialog, {
    /**
     * Constructor that create an alert dialog.
     * @method AlertDialog#initialize
     * @param  {Object} options - the required parameters for this alert dialog.
     * messageText is a required parameter which is used to display a text as a message.
     * actionText is a required parameter which is used for action button.
     */
    initialize: function(options) {
        Dialog.prototype.initialize.apply(this, arguments);

        this.layout = new RelativeLayout();
        this.layout.setLayoutParam(0, "align", {left: "parent", top: "parent", right: "parent"});
        this.layout.setLayoutParam(0, "margin", {left: 20, top: 40, right: 20});
        this.layout.setLayoutParam(1, "align", {center: "parent", bottom: "parent"});
        this.layout.setLayoutParam(1, "margin", {center: 0, bottom: 10});

        this._messageTextView = new TextView();
        this._messageTextView.fontSize = "24px";
        this._messageTextView.height = 60;
        this._messageTextView.fontStyle = "normal";
        this._messageTextView.align = "left";
        this._messageTextView.valign = "top";
        this._messageTextView.color = "#FFFFFF";
        this._messageTextView.multiLine = true;
        this.addChild(this._messageTextView);

        this._actionButton = new Button();
        this._actionButton.align = "center";
        this._actionButton.width = 200;
        this._actionButton.height = 60;
        this._actionButton.color = "#13D767";
        this._actionButton.fontSize = "30px";
        this._actionButton.background = "#1E1E1E";
        this._actionButton.radius = 14;
        this._actionButton.addEventListener("tap", this._onTapActionFunc = this.onTapAction.bind(this));
        this.addChild(this._actionButton);

        this._messageTextView.text = options.messageText;
        this._actionButton.text = options.actionText;
    },

    /**
     * Destructor that destroy this dialog
     * @method AlertDialog#destroy
     */
    destroy: function() {
        this.removeChild(this._messageTextView);
        this._messageTextView.destroy();
        this._messageTextView = null;

        this.removeChild(this._actionButton);
        this._actionButton.removeEventListener("tap", this._onTapActionFunc);
        this._onTapActionFunc = null;
        this._actionButton.destroy();
        this._actionButton = null;

        Dialog.prototype.destroy.apply(this, arguments);
    },

    /**
     * Handle the tap event of the action button and will dispatch a result event.
     * @method AlertDialog#onTapAction
     * @param {GestureEvent} e - the gesture event info.
     */
    onTapAction: function(/*e*/) {
        this.dispatchEvent("result");
        this.close();
    }
}, module);

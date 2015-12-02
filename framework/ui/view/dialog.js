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
var Window = require("./window");

/**
 * Base class for dialogs which provides a facility to manage the creation, saving and restoring of dialogs.
 * @class Dialog
 * @extends Window
 */
Class.define("framework.ui.view.Dialog", Window, {
    /**
     * Constructor that create a dialog
     * @method Dialog#initialize
     */
    initialize: function(/*options*/) {
        Window.prototype.initialize.apply(this, arguments);
    },

    /**
     * Destructor that destroy this dialog
     * @method Dialog#destroy
     */
    destroy: function() {
        Window.prototype.destroy.apply(this, arguments);
    },

    /**
     * Start the dialog and display it on screen.
     * The dialog is placed in the application layer and opaque.
     * Note that you should not override this method to do initialization when the dialog is shown.
     * @method Dialog#show
     */
    show: function() {
        global.app.windowManager.showDialog(this);
    },

    /**
     * Close this dialog, removing it from the screen.
     * Note that you should not override this method to do cleanup when the dialog is closed.
     */
    close: function() {
        global.app.windowManager.closeDialog();
    }
}, module);

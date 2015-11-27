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
var InputEvent = require("./inputevent");

/**
 * Mouse event from mouse input
 * @class MouseEvent
 * @extends InputEvent
 */
Class.define("framework.ui.event.MouseEvent", InputEvent, {
    /**
     * Constructor
     * @method MouseEvent#initialize
     */
    initialize: function(options) {
        InputEvent.prototype.initialize.apply(this, arguments);

        this._screenX = options.screenX !== undefined ? options.screenX : 0;
        this._screenY = options.screenY !== undefined ? options.screenY : 0;
        this._clientX = options.clientX !== undefined ? options.clientX : 0;
        this._clientY = options.clientY !== undefined ? options.clientY : 0;
        this._button = options.button !== undefined ? options.button : 0;
        this._buttons = options.buttons !== undefined ? options.buttons : 0;
    },

    /**
     * Destructor
     * @method MouseEvent#destroy
     */
    destroy: function() {
        InputEvent.prototype.destroy.apply(this, arguments);
    },

    /**
     * @name MouseEvent#screenX
     * @type {Number}
     * @description The horizontal coordinate at which the event occurred relative to the origin of the screen coordinate system.
     * @readonly
     */
    get screenX() {
        return this._screenX;
    },

    /**
     * @name MouseEvent#screenY
     * @type {Number}
     * @description The vertical coordinate at which the event occurred relative to the origin of the screen coordinate system.
     * @readonly
     */
    get screenY() {
        return this._screenY;
    },

    /**
     * @name MouseEvent#clientX
     * @type {Number}
     * @description The horizontal coordinate at which the event occurred relative to the viewport associated with the event.
     * @readonly
     */
    get clientX() {
        return this._clientX;
    },

    /**
     * @name MouseEvent#clientY
     * @type {Number}
     * @description The vertical coordinate at which the event occurred relative to the viewport associated with the event.
     * @readonly
     */
    get clientY() {
        return this._clientY;
    },

    /**
     * @name MouseEvent#button
     * @type {Number}
     * @description During mouse events caused by the depression or release of a mouse button, button must be used to indicate which pointer device button changed state.
     * The value of the MouseEvent.button attribute must be as follows:
     * 0 must indicate the primary button of the device (in general, the left button or the only button on single-button devices, used to activate a user interface control or select text) or the un-initialized value.
     * 1 must indicate the auxiliary button (in general, the middle button, often combined with a mouse wheel).
     * 2 must indicate the secondary button (in general, the right button, often used to display a context menu).
     * Some pointing devices provide or simulate more button states, and values higher than 2 or lower than 0 may be used to represent such buttons.
     * @readonly
     */
    get button() {
        return this._button;
    },

    /**
     * @name MouseEvent#buttons
     * @type {Number}
     * @description During any mouse events, buttons must be used to indicate which combination of mouse buttons are currently being pressed, expressed as a bitmask.
     * The value of the MouseEvent.buttons attribute must be as follows:
     * 0 must indicate no button is currently active.
     * 1 must indicate the primary button of the device (in general, the left button or the only button on single-button devices, used to activate a user interface control or select text).
     * 2 must indicate the secondary button (in general, the right button, often used to display a context menu), if present.
     * 4 must indicate the auxiliary button (in general, the middle button, often combined with a mouse wheel).
     * Some pointing devices provide or simulate more buttons. To represent such buttons, the value must be doubled for each successive button (in the binary series 8, 16, 32, ... ).
     * @readonly
     */
    get buttons() {
        return this._buttons;
    }
}, module);

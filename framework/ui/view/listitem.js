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
var CompositeView = require("./compositeview");
var TapRecognizer = require("../gesture/taprecognizer");

/**
 * List item that provides a item container only for the list view.
 * Note that list item cannot be contained in other composite view.
 * @class ListItem
 * @extends CompositeView
 */
Class.define("framework.ui.view.ListItem", CompositeView, {
    /**
     * Constructor that create a list item
     * @method ListItem#initialize
     */
    initialize: function() {
        CompositeView.prototype.initialize.apply(this, arguments);

        this.addGestureRecognizer(this._tapRecognizer = new TapRecognizer());
    },

    /**
     * Destructor that destroy this list item
     * @method ListItem#destroy
     */
    destroy: function() {
        this.removeGestureRecognizer(this._tapRecognizer);
        this._tapRecognizer = null;

        CompositeView.prototype.destroy.apply(this, arguments);
    }
}, module);

});
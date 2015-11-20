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
 * ListItem widget, it is used for ListView, SwipeList.
 * @class ListItem
 * @extends CompositeView
 */
Class.define("framework.ui.view.ListItem", CompositeView, {
    initialize: function() {
        CompositeView.prototype.initialize.apply(this, arguments);

        this.addGestureRecognizer(this._tapRecognizer = new TapRecognizer());
    },

    destroy: function() {
        this.removeGestureRecognizer(this._tapRecognizer);
        this._tapRecognizer = null;

        CompositeView.prototype.destroy.apply(this, arguments);
    }
}, module);

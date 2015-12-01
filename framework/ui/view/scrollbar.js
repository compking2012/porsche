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
var ProgressView = require("./progressview");

/**
 * Scroll Bar that can be used to associate with a scrollable view
 * and indicates the current scrolled position of the associated scrollable view.
 * @class ScrollBar
 * @extends View
 */
Class.define("framework.ui.view.ScrollBar", ProgressView, {
    /**
     * Constructor that create a scroll bar.
     * @method ScrollBar#initialize
     */
    initialize: function() {
        ProgressView.prototype.initialize.apply(this, arguments);

        this._orientation = "vertical";
        this._autoHidden = false;
        this._background = "rgba(255, 255, 255, 0.2)";
        this._color = "#7AE464";
        this._radius = 3;
        this._minBarOccupy = 0.4;
        this._associatedView = null;
    },

    /**
     * Destructor that destroy a scroll bar.
     * @method ScrollBar#destroy
     */
    destroy: function() {
        this.removeAssociatedView();

        ProgressView.prototype.destroy.apply(this, arguments);
    },

    /**
     * @method ScrollBar#orientation
     * @type {String}
     * @description the orientation, either horizontal" or "vertical".
     */
    get orientation() {
        return this._orientation;
    },

    set orientation(value) {
        this.setProperty("orientation", value);
    },

    /**
     * @method ScrollBar#autoHidden
     * @type {Boolean}
     * @description indicates whether this scroll bar will be hidden automatically when no scrolling.
     * @private
     */
    get autoHidden() {
        return this._autoHidden;
    },

    set autoHidden(value) {
        this.setProperty("autoHidden", value);
    },

    /**
     * Draw the background of the scroll bar.
     * @method ScrollBar#drawBackground
     * @param {Context} context - the canvas context to which the view is rendered
     * @protected
     * @override
     */
    drawBackground: function(context) {
        if (this._background === "") {
            return;
        }
        context.save();
        context.roundRect(0, 0, this._width , this._height, this._radius);
        context.fillStyle = this._colorManager.getColor(context, this._width, this._height, this._background, this._backgroundObject);
        context.fill();
        context.restore();
    },

    /**
     * Draw the scroll bar.
     * @method ScrollBar#draw
     * @param {Context} context - the canvas context to which the view is rendered
     * @protected
     * @override
     */
    draw: function(context) {
        if (this._associatedView !== null) {
            var barLength = 0;
            var barWidth = 0;
            var posX = 0;
            var posY = 0;
            if (this._orientation === "vertical" && this._associatedView.contentHeight > this._associatedView.height) {
                barLength = this._height * Math.max(this._minBarOccupy, this._associatedView.height / this._associatedView.contentHeight);
                barWidth = this._width;
                posY = this._value * this._height;
            } else if (this._orientation === "horizontal" && this._associatedView.contentWidth > this._associatedView.width) {
                barLength = this._height;
                barWidth = this._width * Math.max(this._minBarOccupy, this._associatedView.width / this._associatedView.contentWidth);
                posX = this._value * this._width;
            }
            context.save();
            context.fillStyle = this._colorManager.getColor(context, this._width, this._height, this._color, this._colorObject);
            context.roundRect(posX, posY, barWidth, barLength, this._radius);
            context.fill();
            context.restore();
        }
    },

    /**
     * @method ScrollBar#associatedView
     * @type {ScrollableView}
     * @description the scrollable view that associates with this scroll bar
     * @private
     */
    get associatedView() {
        return this._associatedView;
    },

    set associatedView(value) {
        this.removeAssociatedView();
        this._associatedView = value;
        this._associatedView.addEventListener("propertychange", this._onAssociatedViewChangeFunc = this.onAssociatedViewChange.bind(this));
    },

    /**
     * @method ScrollBar#value
     * @type {Number}
     * @description the scroll offset
     * @private
     */
    get value() {
        return this._value;
    },

    set value(value) {
        this._value = value;
        this.invalidate();
    },

    /**
     * Handle the changed event when associated view is changed.
     * @method ScrollBar#onAssociatedViewChange
     * @param {String} property - the changed property name.
     * @param {Object} oldValue - the old value.
     * @param {Object} newValue - the new value.
     * @private
     */
    onAssociatedViewChange: function(property, oldValue, newValue) {
        if (property === "scrollX" && this._orientation === "horizontal") {
            this.value = newValue / this._associatedView.contentWidth;
        } else if (property === "scrollY" && this._orientation === "vertical") {
            this.value = newValue / this._associatedView.contentHeight;
        }
    },

    /**
     * Remove the associated view.
     * @method ScrollBar#removeAssociatedView
     * @private
     */
    removeAssociatedView: function() {
        if (this._associatedView !== null) {
            this._associatedView.removeEventListener("propertychange", this._onAssociatedViewChangeFunc);
            this._onAssociatedViewChangeFunc = null;
            this._associatedView = null;
        }
    }
}, module);

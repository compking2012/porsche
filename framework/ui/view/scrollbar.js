"use strict";
var Class = require("../../class");
var ProgressView = require("./progressview");

/**
 * Scroll Bar
 * @class ScrollBar
 * @extends View
 */
Class.define("{Framework}.ui.view.ScrollBar", ProgressView, {
    /**
     * Constructor that create a view
     * @method ScrollBar#initialize
     */
    initialize: function() {
        ProgressView.prototype.initialize.apply(this, arguments);

        this._orientation = "vertical";
        this._autoHidden = false;

        this._background = "rgba(255, 255, 255, 0.2)";
        this._foreground = "#7AE464";
        this._radius = 3;

        this._associatedView = null;
    },

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
        var oldValue = this._value;
        if (oldValue === value) {
            return;
        }
        this._orientation = value;
        this.invalidate();
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
        var oldValue = this._value;
        if (oldValue === value) {
            return;
        }
        this._value = value;
        this.dispatchEvent("propertychange", "value", oldValue, value);
        this.invalidate();
    },

    get autoHidden() {
        return this._autoHidden;
    },

    set autoHidden(value) {
        var oldValue = this._autoHidden;
        if (oldValue === value) {
            return;
        }
        this._autoHidden = value;
        this.dispatchEvent("propertychange", "autoHidden", oldValue, value);
        this.invalidate();
    },

    /**
     * @method ScrollBar#associatedView
     * @type {ScrollableView}
     * @description the scrollable view that associates with this scroll bar
     * @private
     * @readonly
     */
    set associatedView(value) {
        var oldValue = this._associatedView;
        if (oldValue === value) {
            return;
        }
        this.removeAssociatedView();
        this._associatedView = value;
        this._associatedView.addEventListener("propertychange", this._onAssociatedViewChangeFunc = this.onAssociatedViewChange.bind(this));
    },

    removeAssociatedView: function() {
        if (this._associatedView !== null) {
            this._associatedView.removeEventListener("propertychange", this._onAssociatedViewChangeFunc);
            this._onAssociatedViewChangeFunc = null;
            this._associatedView = null;
        }
    },

    drawBackground: function(context) {
        context.save();
        context.fillStyle = this._background;
        context.roundRect(0, 0, this._width , this._height, this._radius);
        context.fill();
        context.restore();
    },

    draw: function(context) {
        if (this._associatedView !== null) {
            var barLength = 0;
            var barWidth = 0;
            var posX = 0;
            var posY = 0;
            if (this._orientation === "vertical" && this._associatedView.contentHeight > this._associatedView.height) {
                barLength = this._height * this._associatedView.height / this._associatedView.contentHeight;
                barWidth = this._width;
                posY = this._value * this._height;
            } else if (this._orientation === "horizontal" && this._associatedView.contentWidth > this._associatedView.width) {
                barLength = this._height;
                barWidth = this._width * this._associatedView.width / this._associatedView.contentWidth;
                posX = this._value * this._width;
            }
            context.save();
            context.fillStyle = this._foreground;
            context.roundRect(posX, posY, barWidth, barLength, this._radius);
            context.fill();
            context.restore();
        }
    },

    onAssociatedViewChange: function(property, oldValue, newValue) {
        if (property === "scrollX" && this._orientation === "horizontal") {
            this.value = newValue / this._associatedView.contentWidth;
        } else if (property === "scrollY" && this._orientation === "vertical") {
            this.value = newValue / this._associatedView.contentHeight;
        }
    }
}, module);

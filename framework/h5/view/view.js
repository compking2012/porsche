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
var EventEmitter = require("../../eventemitter");
var ColorManager = require("../../util/colormanager");

/**
 * This class represents the basic building block for user interface components.
 * A view occupies a rectangular area on the screen and is responsible for drawing and event handling.
 * View is the base class for all UI elements, which are used to create interactive UI components (buttons, text views, etc.).
 * @class View
 * @extends EventEmitter
 */
Class.define("framework.h5.view.View", EventEmitter, {
    /**
     * Constructor that create a view
     * @method View#initialize
     */
    initialize: function() {
        EventEmitter.prototype.initialize.apply(this, arguments);

        // Properties
        this._parent = null;
        this._id = "";
        this._element = document.createElement("div");
        this._element.style.width = "100px";
        this._element.style.height = "100px";
    },

    /**
     * Destructor that destroy this view
     * @method View#destroy
     */
    destroy: function() {
        this._element = null;
        this._parent = null;

        EventEmitter.prototype.destroy.apply(this, arguments);
    },

    get element() {
        return this._element;
    },

    /**
     * @name View#id
     * @type {String}
     * @description unique identifier of this view.
     */
    get id() {
        return this._id;
    },

    set id(value) {
        this.setProperty("id", value);
    },

    /**
     * @name View#left
     * @type {Number}
     * @description left position of this view relative to its parent.
     */
    get left() {
        return this._element.style.left;
    },

    set left(value) {
        value = Number(value);
        this._element.style.position = "absolute";
        this._element.style.left = value + "px";
    },

    /**
     * @name View#top
     * @type {Number}
     * @description top position of this view relative to its parent.
     */
    get top() {
        return this._top;
    },

    set top(value) {
        value = Number(value);
        this._element.style.position = "absolute";
        this._element.style.top = value + "px";
    },

    /**
     * @name View#bottom
     * @type {Number}
     * @description bottom position of this view relative to its parent.
     */
    get bottom() {
        return this._top + this._height;
    },

    set bottom(value) {
        value = Number(value);
    },

    /**
     * @name View#right
     * @type {Number}
     * @description right position of this view relative to its parent.
     */
    get right() {
        return this._left + this._width;
    },

    set right(value) {
        value = Number(value);
    },

    /**
     * @name View#width
     * @type {Number}
     * @description width of this view, in pixels.
     */
    get width() {
        return this._width;
    },

    set width(value) {
        value = Number(value);
        this._element.style.width = value + "px";
    },

    /**
     * @name View#height
     * @type {Number}
     * @description height of this view, in pixels.
     */
    get height() {
        return this._height;
    },

    set height(value) {
        value = Number(value);
        this._element.style.height = value + "px";
    },

    get background() {
        return this._element.style.background;
    },

    set background(value) {
        this._element.style.background = value;
    },

    /**
     * @name View#parent
     * @type {View}
     * @readonly
     * @description parent of this view.
     */
    get parent() {
        return this._parent;
    },

    set parent(value) {
        this._parent = value;
    },

    /**
     * Load content from the layout xml.
     * @method View#loadContent
     */
    loadContent: function(layoutFile) {
        if (layoutFile === undefined) {
            layoutFile = this.className;
        }
    },

    /**
     * Adds a listener to the end of the listeners array for the specified event.
     * @param {String} event - event name
     * @param {function} listener - a listener for the specified event
     * @method EventEmitter#addEventListener
     */
    addEventListener: function(event, handler) {
        if (!handler instanceof Function) {
            return;
        }

        this._element.addEventListener(event, handler);
    },

    /**
     * Remove a listener from the listener array for the specified event.
     * @param {String} event - event name
     * @param {function} listener - a listener for the specified event
     * @method EventEmitter#removeEventListener
     */
    removeEventListener: function(event, handler) {
        this._element.removeEventListener(event, handler);
    },

    /**
     * Removes all listeners, or those of the specified event.
     * @param {String} [event] - event name
     * @method EventEmitter#removeAllEventListeners
     */
    removeAllEventListeners: function(event) {
    }
}, module);

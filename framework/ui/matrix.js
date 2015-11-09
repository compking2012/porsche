"use strict";
var Class = require("../class");
var YObject = require("../yobject");

/**
 * Base struct for matrix
 * @class Matrix
 * @extends YObject
 */
Class.define("framework.ui.Matrix", YObject, {
    /**
     * Constructor
     * @method Matrix#initialize
     * @param {Matrix} matrix the matrix array.
     */
    initialize: function(matrix) {
        YObject.prototype.initialize.apply(this, arguments);

        if (!matrix) {
            matrix = [
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1]
            ];
        }
        this.assign(matrix);
    },

    assign: function(matrix) {
        if (!this[0]) {
            this[0] = [];
        }
        this[0][0] = matrix[0][0];
        this[0][1] = matrix[0][1];
        this[0][2] = matrix[0][2];

        if (!this[1]) {
            this[1] = [];
        }
        this[1][0] = matrix[1][0];
        this[1][1] = matrix[1][1];
        this[1][2] = matrix[1][2];

        if (!this[2]) {
            this[2] = [];
        }
        this[2][0] = 0;
        this[2][1] = 0;
        this[2][2] = 1;
    },

    muliple: function(matrix) {
        this[0] = [this[0][0] * matrix[0][0] + this[0][1] * matrix[1][0] + this[0][2] * matrix[2][0],
            this[0][0] * matrix[0][1] + this[0][1] * matrix[1][1] + this[0][2] * matrix[2][1],
            this[0][0] * matrix[0][2] + this[0][1] * matrix[1][2] + this[0][2] * matrix[2][2]];

        this[1] = [this[1][0] * matrix[0][0] + this[1][1] * matrix[1][0] + this[1][2] * matrix[2][0],
            this[1][0] * matrix[0][1] + this[1][1] * matrix[1][1] + this[1][2] * matrix[2][1],
            this[1][0] * matrix[0][2] + this[1][1] * matrix[1][2] + this[1][2] * matrix[2][2]];
    },

    rotate: function(radian) {
        this.muliple([
            [Math.cos(radian), -Math.sin(radian), 0],
            [Math.sin(radian), Math.cos(radian), 0],
            [0, 0, 1]
        ]);
    },

    scale: function(sx, sy) {
        this.muliple([
            [sx, 0, 0],
            [0, sy, 0],
            [0, 0, 1]
        ]);
    },

    skew: function(rx, ry) {
        this.muliple([
            [0, Math.tan(rx), 0],
            [Math.tan(ry), 0, 0],
            [0, 0, 1]
        ]);
    },

    translate: function(x, y) {
        this.muliple([
            [1, 0, x],
            [0, 1, y],
            [0, 0, 1]
        ]);
    },

    at: function(x, y) {
        this.translate(x, y);
    },

    toString: function() {
        return this.className + "(" + [
            [this[0][0], this[0][1], this[0][2]].join("\t"),
            [this[1][0], this[1][1], this[1][2]].join("\t"),
            [this[2][0], this[2][1], this[2][2]].join("\t")
        ].join("\n") + ")";
    },

    toTransformString: function() {
        return "matrix(" + Math.round(this[0][0] * 10) / 10 + "," +
            Math.round(this[1][0] * 10) / 10 + "," +
            Math.round(this[0][1] * 10) / 10 + "," +
            Math.round(this[1][1] * 10) / 10 + "," +
            Math.round(this[0][2] * 10) / 10 + "," +
            Math.round(this[1][2] * 10) / 10 + ")";
    },

    clone: function() {
        var matrix = new this();
        matrix.assign(this);
        return matrix;
    }
}, module);

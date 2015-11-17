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
var View = require("./view");

/**
 * Chart which can draw chart.
 * @class Chart
 * @extends CompositeView
 */
Class.define("framework.ui.view.Chart", View, {
    /**
     * Constructor that create a view
     * @method Chart#initialize
     * @param dataset {Number[]} the data values that the chart shows.
     * @param labelset {String[]} the labels of X Axis shows.
     */
    initialize: function(dataset, labelset) {
        this.super.initialize.apply(this, arguments);

        this._dataset = dataset;
        this._labels = labelset;
        this._mode = "bar";
        this._showGridLine = true;
        this._gridLineColor = "#FFFFFF";
        this._gridLineWidth = 1.0;
        this._fillColor = "#FF0000";
        this._strokeColor = "#FFFFFF";
        this._strokeLineWidth = 1.0;
        this._drawXAxis = true;
        this._drawYAxis = true;
        this._xLabelFontWeight = "normal";
        this._xLabelFontStyle = "normal";
        this._xLabelFontSize = "14px";
        this._xLabelFontFamily = "default";
        this._xLabelFontColor = "#FFFFFF";
        this._xLabelTextAlign = "center";
        this._yLabelFontWeight = "normal";
        this._yLabelFontStyle = "normal";
        this._yLabelFontSize = "12px";
        this._yLabelFontFamily = "default";
        this._yLabelFontColor = "#FFFFFF";
        this._yLabelTextAlign = "right";
        this._labelMargin = 10;
        this._stepsY = 10;
        this._barSpacing = 3;
        this._rightBlank = 20;
        this._topBlank = 20;

        this._dotRadius = 3;
        this._dotColor = "#FF0000";
        this._dotWidth = 1;
        this._showAverageLine = true;
        this._averageLineWidth = 1.0;
        this._averageLineColor = "#ffffff";
        this._bezierCurve = true;
        this._tension = 0.4;

        this._zeroX = 0;
        this._zeroY = 0;

    },

    destroy: function() {
        this._dataset = null;
        this._labels = null;

        this.super.destroy.apply(this, arguments);
    },

    /**
     * @name Chart#dataset
     * @type {Number[]}
     * @description the data values that the chart shows.
     */
    get dataset() {
        return this._dataset;
    },

    set dataset(value) {
        this._dataset = value;
        this.invalidate();
    },

    /**
     * @name Chart#mode
     * @type {String} the value should be "line" or "bar"
     * @description the type of chart to display.
     */
    get mode() {
        return this._mode;
    },

    set mode(value) {
        this._mode = value;
        this.invalidate();
    },

    /**
     * @name Chart#showGridLine
     * @type {Boolean}
     * @description Whether to show the gridlines or not, default true.
     */
    get showGridLine() {
        return this._showGridLine;
    },

    set showGridLine(value) {
        this._showGridLine = value;
        this.invalidate();
    },

    /**
     * @name Chart#gridlineColor
     * @type {String}
     * @description The color of gridlines, such as "#FF0000" or "rgba(255,255,0,0.4)"
     */
    get gridlineColor() {
        return this._gridLineColor;
    },

    set gridlineColor(value) {
        this._gridLineColor = value;
        this.invalidate();
    },

    /**
     * @name Chart#gridLineWidth
     * @type {Number}
     * @description The line width of gridlines
     */
    get gridLineWidth() {
        return this._gridLineWidth;
    },

    set gridLineWidth(value) {
        this._gridLineWidth = value;
        this.invalidate();
    },

    /**
     * @name Chart#fillColor
     * @type {String}
     * @description The color filled the chart, such as "#FF0000" or "rgba(255,255,0,0.4)"
     */
    get fillColor() {
        return this._fillColor;
    },

    set fillColor(value) {
        this._fillColor = value;
        this.invalidate();
    },

    /**
     * @name Chart#stepsY
     * @type {Number}
     * @description The number of gridlines on y axis
     */
    get stepsY() {
        return this._stepsY;
    },

    set stepsY(value) {
        this._stepsY = value;
        this.invalidate();
    },

    /**
     * @name Chart#strokeColor
     * @type {String}
     * @description The color of the chart lines
     */
    get strokeColor() {
        return this._strokeColor;
    },

    set strokeColor(value) {
        this._strokeColor = value;
        this.invalidate();
    },

    /**
     * @name Chart#strokeLineWidth
     * @type {String}
     * @description The width of the chart lines
     */
    get strokeLineWidth() {
        return this._strokeLineWidth;
    },

    set strokeLineWidth(value) {
        this._strokeLineWidth = value;
        this.invalidate();
    },

    /**
     * @name Chart#drawXAxis
     * @type {Boolean}
     * @description Whether to show x axis
     */
    get drawXAxis() {
        return this._drawXAxis;
    },

    set drawXAxis(value) {
        this._drawXAxis = value;
        this.invalidate();
    },

    /**
     * @name Chart#drawYAxis
     * @type {Boolean}
     * @description Wheter to show Y axis
     */
    get drawYAxis() {
        return this._drawYAxis;
    },

    set drawYAxis(value) {
        this._drawYAxis = value;
        this.invalidate();
    },

    /**
     * @name Chart#xLabelFontWeight
     * @type {String}
     * @description The fontWeight of x labels
     */
    get xLabelFontWeight() {
        return this._xLabelFontWeight;
    },

    set xLabelFontWeight(value) {
        this._xLabelFontWeight = value;
        this.invalidate();
    },

    /**
     * @name Chart#xLabelFontStyle
     * @type {String}
     * @description The fontStyle of x labels
     */
    get xLabelFontStyle() {
        return this._xLabelFontStyle;
    },

    set xLabelFontStyle(value) {
        this._xLabelFontStyle = value;
        this.invalidate();
    },

    /**
     * @name Chart#xLabelFontColor
     * @type {String}
     * @description The fontColor of x labels
     */
    get xLabelFontColor() {
        return this._xLabelFontColor;
    },

    set xLabelFontColor(value) {
        this._xLabelFontColor = value;
        this.invalidate();
    },

    /**
     * @name Chart#xLabelFontSize
     * @type {String}
     * @description The fontSize of x labels
     */
    get xLabelFontSize() {
        return this._xLabelFontSize;
    },

    set xLabelFontSize(value) {
        this._xLabelFontSize = value;
        this.invalidate();
    },

    /**
     * @name Chart#xLabelFontFamily
     * @type {String}
     * @description The fontFamily of x labels
     */
    get xLabelFontFamily() {
        return this._xLabelFontFamily;
    },

    set xLabelFontFamily(value) {
        this._xLabelFontFamily = value;
        this.invalidate();
    },

    /**
     * @name Chart#xLabelTextAlign
     * @type {String}
     * @description The property of textAlign of x labels
     */
    get xLabelTextAlign() {
        return this._xLabelTextAlign;
    },

    set xLabelTextAlign(value) {
        this._xLabelTextAlign = value;
        this.invalidate();
    },

    /**
     * @name Chart#yLabelFontWeight
     * @type {String}
     * @description The fontWeight of y labels
     */
    get yLabelFontWeight() {
        return this._yLabelFontWeight;
    },

    set yLabelFontWeight(value) {
        this._yLabelFontWeight = value;
        this.invalidate();
    },

    /**
     * @name Chart#yLabelFontStyle
     * @type {String}
     * @description The fontStyle of y labels
     */
    get yLabelFontStyle() {
        return this._yLabelFontStyle;
    },

    set yLabelFontStyle(value) {
        this._yLabelFontStyle = value;
        this.invalidate();
    },

    /**
     * @name Chart#yLabelFontColor
     * @type {String}
     * @description The fontColor of y labels
     */
    get yLabelFontColor() {
        return this._yLabelFontColor;
    },

    set yLabelFontColor(value) {
        this._yLabelFontColor = value;
        this.invalidate();
    },

    /**
     * @name Chart#yLabelFontSize
     * @type {String}
     * @description The fontSize of y labels
     */
    get yLabelFontSize() {
        return this._yLabelFontSize;
    },

    set yLabelFontSize(value) {
        this._yLabelFontSize = value;
        this.invalidate();
    },

    /**
     * @name Chart#yLabelFontFamily
     * @type {String}
     * @description The fontFamily of y labels
     */
    get yLabelFontFamily() {
        return this._yLabelFontFamily;
    },

    set yLabelFontFamily(value) {
        this._yLabelFontFamily = value;
        this.invalidate();
    },

    /**
     * @name Chart#yLabelTextAlign
     * @type {String}
     * @description The property of textAlign of y labels
     */
    get yLabelTextAlign() {
        return this._yLabelTextAlign;
    },

    set yLabelTextAlign(value) {
        this._yLabelTextAlign = value;
        this.invalidate();
    },

    /**
     * @name Chart#labelMargin
     * @type {Number}
     * @description The distance between x/y labels and x/y axis
     */
    get labelMargin() {
        return this._labelMargin;
    },

    set labelMargin(value) {
        this._labelMargin = value;
        this.invalidate();
    },

    /**
     * @name Chart#rightBlank
     * @type {Number}
     * @description The distance between graph and the right end of the view
     */
    get rightBlank() {
        return this._rightBlank;
    },

    set rightBlank(value) {
        this._rightBlank = value;
        this.invalidate();
    },

    /**
     * @name Chart#topBlank
     * @type {Number}
     * @description The distance between graph and top of the view
     */
    get topBlank() {
        return this._topBlank;
    },

    set topBlank(value) {
        this._topBlank = value;
        this.invalidate();
    },

    /**
     * @name Chart#dotRadius
     * @type {Number}
     * @description The size of data point
     */
    get dotRadius() {
        return this._dotRadius;
    },

    set dotRadius(value) {
        this._dotRadius = value;
        this.invalidate();
    },

    /**
     * @name Chart#dotColor
     * @type {String}
     * @description The color filled the data point
     */
    get dotColor() {
        return this._dotColor;
    },

    set dotColor(value) {
        this._dotColor = value;
        this.invalidate();
    },

    /**
     * @name Chart#showAverageLine
     * @type {Boolean}
     * @description Whether to show the averageline
     */
    get showAverageLine() {
        return this._showAverageLine;
    },

    set showAverageLine(value) {
        this._showAverageLine = value;
        this.invalidate();
    },

    /**
     * @name Chart#averageLineWidth
     * @type {Number}
     * @description The line width of averageline
     */
    get averageLineWidth() {
        return this._averageLineWidth;
    },

    set averageLineWidth(value) {
        this._averageLineWidth = value;
        this.invalidate();
    },

    /**
     * @name Chart#averageLineColor
     * @type {String}
     * @description The line color of averageline
     */
    get averageLineColor() {
        return this._averageLineColor;
    },

    set averageLineColor(value) {
        this._averageLineColor = value;
        this.invalidate();
    },

    /**
     * @name Chart#bezierCurve
     * @type {Boolean}
     * @description Whether to show curve or broken-line, true for bezierCurve and false for broken-line
     */
    get bezierCurve() {
        return this._bezierCurve;
    },

    set bezierCurve(value) {
        this._bezierCurve = value;
        this.invalidate();
    },

    /**
     * @method Chart#addData
     * @param {Number} The data value to be added into the Chart
     * @description Add new data at the end of the chart and then refresh the view
     */
    addData: function(value) {
        if (typeof value === "number") {
            this._dataset.push(value);
        }
        this.invalidate();
    },

    /**
     * @method Chart#addLabel
     * @param {String} The label value to be added into the end of the chart
     * @description Add new label to the chart and then refresh the view
     */
    addLabel: function(value) {
        if (typeof value === "string" && value !== "") {
            this._labels.push(value);
        }
        this.invalidate();
    },

    /**
     * @method Chart#removeData
     * @description Remove the first value of the datast on the chart and the refresh the view
     */
    removeData: function() {
        this._dataset.shift();
        this.invalidate();
    },

    /**
     * @method Chart#removeData
     * @param {Number[]} the new dataset that to be show
     * @param {Number[]} the new labelset that to be show
     * @description Reset the dataset and labelset of the chart and the refresh the view
     */
    resetData: function(dataset, labelset) {
        this._dataset = dataset;
        this._labels = labelset;
        this.invalidate();
    },

    draw: function(context) {
        var maxHeight = this.getMax(this._dataset);
        var xLabelHeight = Number(this._xLabelFontSize.substr(0, this._xLabelFontSize.length - 2)) + this._labelMargin;
        context.save();
        context.font = context.font = this._yLabelFontWeight + " " + this._yLabelFontStyle + " " + this._yLabelFontSize + " " + this._yLabelFontFamily;
        var yLabelWidth = context.measureText(maxHeight).width + this._labelMargin;
        context.restore();

        this._zeroX = yLabelWidth;
        this._zeroY = this._height - xLabelHeight;
        var barWidth = (this._width - this._zeroX - this._rightBlank) / this._dataset.length - this._barSpacing;
        var ceilHeight = Math.ceil(maxHeight / this._stepsY) * this._stepsY;

        this.drawAxis(context);

        this.drawXLabels(context);
        this.drawYLabels(context, ceilHeight);

        if (this._mode === "bar") {
            this.drawBars(context, barWidth, ceilHeight);
        } else if (this._mode === "line") {
            this.drawLines(context);
        }

        if (this._showGridLine) {
            this.drawGridLines(context);
        }
    },

    drawBars: function(context, barWidth, ceilHeight) {
        context.save();
        context.fillStyle = this._fillColor;
        for (var i = 0; i < this._dataset.length; i++) {
            context.beginPath();
            var rectHeight = this._dataset[i] * (this._zeroY - this._topBlank) / ceilHeight;
            var y = this._zeroY - rectHeight;
            context.rect(this._zeroX + i * (barWidth + this._barSpacing), y, barWidth, rectHeight);
            context.fill();
        }
        context.restore();
    },

    /**
     * @method Chart#drawAxis
     * @param {Context}
     * @description Draw X and Y axis of the chart
     * @private
     */
    drawAxis: function(context) {
        context.save();
        context.beginPath();
        context.lineWidth = this._strokeLineWidth;
        context.strokeStyle = this._strokeColor;

        if (this._drawXAxis) {
            context.moveTo(this._zeroX, this._zeroY);
            context.lineTo(this._width, this._zeroY);
        }
        if (this.drawYAxis) {
            context.moveTo(this._zeroX, this._zeroY);
            context.lineTo(this._zeroX, 0);
        }
        context.stroke();
        context.restore();
    },

    /**
     * @method Chart#drawGridLines
     * @param {Context}
     * @description Draw gridlines of the chart
     * @private
     */
    drawGridLines: function(context) {
        context.save();
        context.beginPath();
        context.lineWidth = this._gridLineWidth;
        context.strokeStyle = this._gridLineColor;
        var stepsX = this._labels.length - 1;
        var stepLength = (this._width - this._zeroX - this._rightBlank) / stepsX;
        for (var i = 0; i <= stepsX; i++) {
            context.moveTo(this._zeroX + i * stepLength, this._zeroY);
            context.lineTo(this._zeroX + i * stepLength, this._topBlank);
        }

        stepLength = (this._zeroY - this._topBlank) / this._stepsY;
        for (var j = 0; j <= this._stepsY; j++) {
            context.moveTo(this._zeroX, this._zeroY - stepLength * j);
            context.lineTo(this._width - this._rightBlank, this._zeroY - stepLength * j);
        } 
        context.stroke();
        context.restore();
    },

    /**
     * @method Chart#drawXLabels
     * @param {Context}
     * @description Draw labels of the x axis
     * @private
     */
    drawXLabels: function(context) {
        context.save();
        context.beginPath();
        context.font = this._xLabelFontWeight + " " + this._xLabelFontStyle + " " + this._xLabelFontSize + " " + this._xLabelFontFamily;
        context.textAlign = this._xLabelTextAlign;
        context.textBaseline = "top";
        context.fillStyle = this._xLabelFontColor;
        var steps = this._labels.length - 1;
        var stepLength = (this._width - this._zeroX - this._rightBlank) / steps;
        for (var i = 0; i <= steps; i++) {
            context.fillText(this._labels[i], this._zeroX + i * stepLength, this._zeroY);
        }
        context.restore();
    },

    /**
     * @method Chart#drawYLabels
     * @param {Context}
     * @param {Number} the distance of the adjacent two gridlines of y axis
     * @param {Number} the maxheigth among all the bar rects of the chart
     * @description Draw labels of the y axis
     * @private
     */
    drawYLabels: function(context, maxHeight) {
        context.save();
        context.beginPath();
        context.font = this._yLabelFontWeight + " " + this._yLabelFontStyle + " " + this._yLabelFontSize + " " + this._yLabelFontFamily;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = this._yLabelFontColor;
        var stepLength = (this._zeroY -  this._topBlank) / this._stepsY;
        var tmp = maxHeight / this._stepsY;
        for (var i = 1; i <= this._stepsY; i++) {
            context.fillText((i * tmp).toString(), this._zeroX / 2, this._zeroY - i * stepLength);
        }
        context.restore();
    },

    drawLines: function(context) {
        context.save();
        var maxHeight = this.getMax(this._dataset);
        var stepX = this._labels.length - 1;
        var stepLength = (this._width - this._zeroX - this._rightBlank) / stepX;
        context.beginPath();
        var collections = [];
        var preX = this._zeroX;
        var preY = this._zeroY - this._dataset[0] * (this._zeroY - this._topBlank) / maxHeight;
        context.moveTo(preX, preY);
        if (this._bezierCurve) {
            var curPoint = {x: this._zeroX, y: this._zeroY};
            for (var i = 0; i < this._dataset.length; i++) {
                var t = i > 0 && i < this._dataset.length - 1 ? this._tension : 0 ;
                curPoint.x = this._zeroX + i * stepLength;
                curPoint.y = this._zeroY - this._dataset[i] * (this._zeroY - this._topBlank) / maxHeight;
                var prePoint = i === 0 ? {x: curPoint.x, y: curPoint.y} : {x: curPoint.x - stepLength, y: this._zeroY - this._dataset[i-1] * (this._zeroY - this._topBlank) / maxHeight};
                var nextPoint = i === this._dataset.length - 1 ? {x: curPoint.x, y: curPoint.y} : {x: curPoint.x + stepLength, y: this._zeroY - this._dataset[i + 1] * (this._zeroY - this._topBlank) / maxHeight};
                collections[i] = {x: curPoint.x, y: curPoint.y};
                collections[i].controlPoint = this.splineCurve(prePoint, curPoint, nextPoint, t);
            }
            for (var i = 1; i < this._dataset.length; i++) {
                context.bezierCurveTo(
                    collections[i - 1].controlPoint.outer.x,
                    collections[i - 1].controlPoint.outer.y,
                    collections[i].controlPoint.inner.x,
                    collections[i].controlPoint.inner.y,
                    collections[i].x,
                    collections[i].y
                    );
            }
            i--;
            context.lineTo(this._zeroX + i * stepLength, this._zeroY);
            context.lineTo(this._zeroX, this._zeroY);
            context.lineTo(this._zeroX, this._zeroY - this._dataset[0] * (this._zeroY - this._topBlank) / maxHeight);
            context.closePath();
            context.fillStyle = this._fillColor;
            context.fill();
            context.beginPath();
            context.moveTo(preX, preY);
            for (var i = 1; i < this._dataset.length; i++) {
                context.bezierCurveTo(
                    collections[i - 1].controlPoint.outer.x,
                    collections[i - 1].controlPoint.outer.y,
                    collections[i].controlPoint.inner.x,
                    collections[i].controlPoint.inner.y,
                    collections[i].x,
                    collections[i].y
                    );
            }
            context.lineWidth = this.strokeLineWidth;
            context.strokeStyle = this.strokeColor;
            context.stroke();
        } else {
            for (var i = 1; i < this._dataset.length; i++) {
                var y = this._zeroY - this._dataset[i] * (this._zeroY - this._topBlank) / maxHeight; 
                context.lineTo(this._zeroX + i * stepLength, y);
            }
            i--;
            context.lineTo(this._zeroX + i * stepLength, this._zeroY);
            context.lineTo(this._zeroX, this._zeroY);
            context.lineTo(this._zeroX, this._zeroY - this._dataset[0] * (this._zeroY - this._topBlank) / maxHeight);
            context.closePath();
            context.fillStyle = this._fillColor;
            context.fill();
            context.beginPath();
            context.moveTo(preX, preY);
            for (var i = 1; i < this._dataset.length; i++) {
                var y = this._zeroY - this._dataset[i] * (this._zeroY - this._topBlank) / maxHeight; 
                context.lineTo(this._zeroX + i * stepLength, y);
            }
            context.lineWidth = this._strokeLineWidth;
            context.strokeStyle = this._strokeColor;
            context.stroke();
        }
        for (var i = 0; i < this._dataset.length; i++) {
            context.beginPath();
            var y = this._zeroY - this._dataset[i] * (this._zeroY - this._topBlank) / maxHeight;
            context.arc(this._zeroX + i * stepLength, y, this._dotRadius, 0, Math.PI * 2, true);
            context.closePath();
            context.strokeStyle = this._dotColor;
            context.stroke();
        }
        this.drawAxis(context);
        if (this._showGridLine) {
            this.drawGridLines(context, maxHeight);
        }
        if (this._showAverageLine) {
            this.drawAverageLine(context);
        }
        this.drawXLabels(context);
        context.restore();
    },

    drawAverageLine: function(context) {
        context.save();
        var averageValue = 0;
        for (var i = 0; i < this._dataset.length; i++) {
            averageValue += this._dataset[i];
        }
        averageValue /= this._dataset.length;
        var maxHeight = this.getMax(this._dataset);
        var averageLineHeight = this._height * averageValue / maxHeight;

        context.beginPath();
        var x = this._zeroX;
        var y = this._zeroY - averageLineHeight;
        while (x < this._width) {
            context.moveTo(x, y);
            context.lineTo(x + 3, y);
            x += 4;
        }
        context.lineWidth = this._averageLineWidth;
        context.strokeStyle = this._averageLineColor;
        context.stroke();
        context.restore();
    },

    getMax: function(dataArray) {
        var max = 0;
        for (var i = 0; i < dataArray.length; i++) {
            if (max < dataArray[i]) {
                max = dataArray[i];
            }
        }
        return max;
    },

    splineCurve: function(firstPoint, middlePoint, lastPoint, t) {
        var d1 = Math.sqrt(Math.pow(middlePoint.x - firstPoint.x, 2) + Math.pow(middlePoint.y - firstPoint.y, 2));
        var d2 = Math.sqrt(Math.pow(lastPoint.x - middlePoint.x, 2) + Math.pow(lastPoint.y - middlePoint.y, 2));

        var fa = t * d1 / (d1 + d2);
        var fb = t * d2 / (d1 + d2);
        return {
            inner: {
                x: middlePoint.x - fa * (lastPoint.x - firstPoint.x),
                y: middlePoint.y - fa * (lastPoint.y - firstPoint.y)
            },
            outer: {
                x: middlePoint.x + fb * (lastPoint.x - firstPoint.x),
                y: middlePoint.y + fb * (lastPoint.y - firstPoint.y)
            }
        };
    }
}, module);

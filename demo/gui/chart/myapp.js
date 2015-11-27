define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var App = require("../../../framework/app/app");
var Chart = require("../../../framework/ui/view/chart");

Class.define("MyApp", App, {
    onStart: function() {
        var dataset1 = [8, 48, 4, 19, 26, 27, 90, 34, 36];
        var labelset1 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        var chart1 = new Chart(dataset1, labelset1);
        chart1.mode = "bar";
        chart1.width = 320;
        chart1.height = 150;
        chart1.stepsY = 10; //set number of y labels or horizontal gridlines
        chart1.rightBlank = 25; //set the width of right blank
        chart1.topBlank = 10;//set the height of top blank
        chart1.xLabelFontWeight = "bold";
        chart1.xLabelFontStyle = "italic";
        chart1.xLabelFontSize = "14px";
        chart1.xLabelFontFamily = "Times New Roman";
        chart1.xLabelFontColor = "#0000FF";
        chart1.yLabelFontWeight = "normal";
        chart1.yLabelFontStyle = "italic";
        chart1.yLabelFontSize = "10px";
        chart1.yLabelFontFamily = "Times New Roman";
        chart1.yLabelFontColor = "#00FF00";
        chart1.labelMargin = 10;
        this.window.addChild(chart1);

        var dataset2 = [];
        dataset2 = [28, 48, 40, 19, 86, 27, 90, 34];
        var labelset2 = ["0", "1", "2", "3", "4", "5", "6", "7"];
        var chart2 = new Chart(dataset2, labelset2);
        chart2.mode = "line";
        chart2.width = 320;
        chart2.height = 150;
        chart2.top = 160;
        chart2.fillColor = "rgba(255,0,255,0.3)";
        chart2.dotRadius = 2;
        chart2.dotColor = "#E0FFFF";
        chart2.strokeLineWidth = 2;
        chart2.strokeColor = "#FFFFFF";
        chart2.drawYAxis = true;
        chart2.showAverageLine = true;
        chart2.showGridLine = false;
        chart2.bezierCurve = true;
        this.window.addChild(chart2);
    }
}, module);

});
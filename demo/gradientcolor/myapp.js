define(function(require, exports, module) {

"use strict";
var Class = require("/framework/class");
var App = require("/framework/app/app");
var View = require("/framework/ui/view/view");
var Animation = require("/framework/ui/animation/animation");

Class.define("MyApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        // var view1 = new View();
        // view1.background = "linear-gradient(#0065B5, #FFFFFF)";
        // view1.left = 10;
        // view1.top = 10;
        // view1.width = 100;
        // view1.height = 100;
        // this.window.addChild(view1);

        // var view2 = new View();
        // view2.background = "radial-gradient(#FF0000, #FFFFFF)";
        // view2.left = 120;
        // view2.top = 10;
        // view2.width = 100;
        // view2.height = 100;
        // this.window.addChild(view2);

        var view3 = new View();
        view3.background = "conical-gradient(#FF0000, #FFFFFF)";
        view3.originX = 150;
        view3.originY = 150;
        view3.left = 10;
        view3.top = 10;
        view3.width = 300;
        view3.height = 300;
        view3.drawBackground = function(context) {
            // // from rgb(255, 0, 0) to rgb(255, 255, 255)
            // var r1 = 251, g1 = 27, b1 = 84;
            // var r2 = 57, g2 = 3, b2 = 18;
            // var cx = this._width / 2;
            // var cy = this._height / 2;
            // for (var i = 0; i < 360; i += 0.1) {
            //     var rad = i * 2 * Math.PI / 360;
            //     var p = i / 360;
            //     var r = parseInt(r2 * p + r1 * (1 - p));
            //     var g = parseInt(g2 * p + g1 * (1 - p));
            //     var b = parseInt(b2 * p + b1 * (1 - p));
            //     context.strokeStyle = "rgb(" + r + "," + g + "," + b +")"; //"hsla(" + i + ", 100%, 50%, 1.0)";
            //     context.beginPath();
            //     context.moveTo(cx - 6 + (cx - 6) * Math.cos(rad), cy - 6 + (cy - 6) * Math.sin(rad));
            //     context.lineTo(cx + cx * Math.cos(rad), cy + cy * Math.sin(rad));
            //     context.stroke();
            // }
            // 
            // 
            var someColors = [];
            someColors.push('red');
            someColors.push('yellow');
            // someColors.push('lime');
            // someColors.push('aqua');
            // someColors.push("blue");
            // someColors.push("magenta");
            // someColors.push('red');

            drawMultiRadiantCircle(200, 200, 100, someColors, context);
        };


            function drawMultiRadiantCircle(xc, yc, r, radientColors, context) {
                var partLength = (2 * Math.PI) / radientColors.length;
                var start = 0;
                var gradient = null;
                var startColor = null,
                    endColor = null;

                for (var i = 0; i < radientColors.length; i++) {
                    startColor = radientColors[i];
                    endColor = radientColors[(i + 1) % radientColors.length];

                    // x start / end of the next arc to draw
                    var xStart = xc + Math.cos(start) * r;
                    var xEnd = xc + Math.cos(start + partLength) * r;
                    // y start / end of the next arc to draw
                    var yStart = yc + Math.sin(start) * r;
                    var yEnd = yc + Math.sin(start + partLength) * r;

                    context.beginPath();

                    gradient = context.createLinearGradient(xStart, yStart, xEnd, yEnd);
                    gradient.addColorStop(0, startColor);
                    gradient.addColorStop(1.0, endColor);

                    context.strokeStyle = gradient;
                    context.arc(xc, yc, r, start, start + partLength);
                    context.lineWidth = 30;
                    context.stroke();
                    context.closePath();

                    start += partLength;
                }
            }
        var animation = new Animation(view3);
        animation.from = {rotationZ: 0 * Math.PI / 180};
        animation.to = {rotationZ: 360 * Math.PI / 180};
        animation.duration = 3000;
        animation.repeat = 0;
        animation.easing = "cubic-bezier(0.42, 0, 0.58, 1.0)";
        animation.start();

        this.window.addChild(view3);
    }
}, module);

});

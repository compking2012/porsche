"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var View = fx.import("framework.ui.view.View");

Class.define("Recorder.WaveView", View, {
    initialize: function() {
        View.prototype.initialize.apply(this, arguments);
        this.data = [];
    },

    destroy: function() {

    },

    static: {
        MAX_SAMPLE_LENGTH: 58
    },

    update: function(data) {
        this.data = this.data.concat(data);

        if (this.data.length > this.constructor.MAX_SAMPLE_LENGTH) {
            var deletenum = this.data.length - this.constructor.MAX_SAMPLE_LENGTH;
            this.data.splice(0, deletenum);
        }
        this.invalidate();
    },

    draw: function(context) {
        context.clearRect(0, 0, this._width, this._height);
        context.fillStyle = "#000000";
        context.fillRect(0, 55, this._width, 155);

        var length = this.data.length;
        var x = length === 0 ? 20 : length * 4;

        context.save();
        context.lineCap = "round";
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(x, 10);
        context.lineTo(x, this.height);
        context.strokeStyle = "#FFFFFF";
        context.stroke();
        context.restore();

        var hx = x + 1;
        context.save();
        context.beginPath();
        context.moveTo(hx, this.height / 2);
        context.lineTo(this._width, this.height / 2);
        context.strokeStyle = "#FF4200";
        context.stroke();
        context.restore();

        for (var i = 0; i < length; i++) {
            var pointX = i * 4;
            var data = 0;
            if (this.data[i] > 25) {
                data = this.data[i] - 25;
            }
            var pointHeight = Math.pow(data, 2) * 0.035;
            context.save();
            context.beginPath();
            context.lineWidth = 2;
            context.moveTo(pointX, 134 + pointHeight / 2);
            context.lineTo(pointX, 134 - pointHeight / 2);
            context.strokeStyle = "#FF4200";
            context.stroke();
            context.restore();
        }
    }
}, module);

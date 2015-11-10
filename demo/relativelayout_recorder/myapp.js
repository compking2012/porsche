"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var CompositeView = fx.import("framework.ui.view.CompositeView");
var TextView = fx.import("framework.ui.view.TextView");
var ImageButton = fx.import("framework.ui.view.ImageButton");
var RelativeLayout = fx.import("framework.ui.layout.RelativeLayout");
var RelativeLayoutParam = fx.import("framework.ui.layout.RelativeLayoutParam");
var WaveView = require("./waveview");

Class.define("MyApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        this.stopflag = true;
        this.menuflag = true;

        this.compositeView = new CompositeView();
        this.compositeView.width = 320;
        this.compositeView.height = 320;
        //this.compositeView.background = "#00FF00";

        this.compositeView2 = new CompositeView();
        this.compositeView2.width = 320;
        this.compositeView2.height = 20;
        this.compositeView2.background = "#000000";

        var windowLayout = new RelativeLayout();
        windowLayout.setLayoutParam(0, "align", {center: "parent", middle: "parent"});
        windowLayout.setLayoutParam(0, "align", {bottom: "parent", left: "parent"});
        this.window.layout = windowLayout;

        this.currentTime = new TextView();
        this.currentTime.width = 150;
        this.currentTime.height = 24;
        this.currentTime.fontSize = "24px";
        this.currentTime.fontStyle = "normal";  // Default?
        this.currentTime.textAlign = "left";    // Default?
        this.currentTime.textVAlign = "top"; // Default?
        this.currentTime.color = "#ffffff";
        this.currentTime.multiLine = false;
        this.currentTime.background = "#000000";
        this.currentTime.text = "00:00:00";
        this.compositeView.addChild(this.currentTime);

        this.currentName = new TextView();
        this.currentName.width = 150;
        this.currentName.height = 24;
        this.currentName.fontSize = "24px";
        this.currentName.fontStyle = "normal";  // Default?
        this.currentName.textAlign = "right";
        this.currentName.textVAlign = "top"; // Default?
        this.currentName.color = "#ffffff";
        this.currentName.multiLine = false;
        this.currentName.background = "#000000";
        this.currentName.text = "我的新录音";
        this.compositeView.addChild(this.currentName);

        this.waveView = new WaveView();
        this.waveView.background ="#FF0000";
        this.compositeView.addChild(this.waveView);

        this.menuButton = new ImageButton();
        this.menuButton.width = 48;
        this.menuButton.height = 48;
        this.menuButton.src = __dirname + "/res/btn_menu.png";
        this.menuButton.pressedSrc = __dirname + "/res/btn_menu_press.png";
        this.menuButton.disabledSrc = __dirname + "/res/btn_menu_disable.png";
        this.menuButton.addEventListener("click", this.onclickmenu.bind(this));
        this.compositeView.addChild(this.menuButton);

        this.recordStopButton = new ImageButton();
        this.recordStopButton.width = 72;
        this.recordStopButton.height = 72;
        this.recordStopButton.src = __dirname + "/res/btn_start.png";
        this.recordStopButton.pressedSrc = __dirname + "/res/btn_start.png";
        this.recordStopButton.disabledSrc = __dirname + "/res/btn_stop.png";
        this.recordStopButton.addEventListener("click", this.onclickrecstop.bind(this));
        this.compositeView.addChild(this.recordStopButton);

        this.doneButton = new ImageButton();
        this.doneButton.width = 48;
        this.doneButton.height = 48;
        this.doneButton.align = "right";
        this.doneButton.verticalAlign = "bottom";
        this.doneButton.src = __dirname + "/res/btn_done_normal.png";
        this.doneButton.pressedSrc = __dirname + "/res/btn_done_press.png";
        this.doneButton.disabledSrc = __dirname + "/res/btn_done_disable.png";
        this.doneButton.enabled = false;
        this.compositeView.addChild(this.doneButton);

        this.addview = new TextView();
        this.addview.width = 200;
        this.addview.height = 24;
        this.addview.fontSize = "24px";
        this.addview.fontStyle = "normal";  // Default?
        this.addview.textAlign = "left";    // Default?
        this.addview.textVAlign = "top"; // Default?
        this.addview.color = "#ffffff";
        this.addview.multiLine = false;
        this.addview.background = "#000000";
        this.addview.text = "this is a new added view";

        //this is only for test cases, when actually should use var layout instead of this.layout
        this.layout = new RelativeLayout();
        this.layout.setLayoutParam(0, "align", {left: "parent", top: "parent"});
        this.layout.setLayoutParam(0, "margin", {left: 20, top: 20});

        this.layout.setLayoutParam(1, "align", {right: "parent", top: "parent"});
        this.layout.setLayoutParam(1, "margin", {right: 20, top: 20});

        this.layout.setLayoutParam(2, "align", {left: "parent", top: {target: 0, side: "bottom"}, right: "parent", bottom: {target: 4, side: "top"}});
        this.layout.setLayoutParam(2, "margin", {left: 0, top: 0, right: 0, bottom: 0});

        this.layout.setLayoutParam(3, "align", {left: "parent", middle: {target: 4, side: "middle"}});
        this.layout.setLayoutParam(3, "margin", {left: 20, middle: 0});

        this.layout.setLayoutParam(4, "align", {center: "parent", bottom: "parent"});
        this.layout.setLayoutParam(4, "margin", {bottom: 20});

        this.layout.setLayoutParam(5, "align", {right: "parent", middle: {target: 4, side: "middle"}});
        this.layout.setLayoutParam(5, "margin", {right: 20, middle: 0});
        this.compositeView.layout = this.layout;

        this.layout.setLayoutParam(6, "align", {left: "parent", top: "parent"});
        this.layout.setLayoutParam(6, "margin", {left: 20, top: 20});

        this.window.addChild(this.compositeView);
        this.window.addChild(this.compositeView2);
    },

    onclickrecstop: function() {


        if (this.stopflag) {
            this.compositeView.removeChild(this.doneButton);
            this.stopflag = false;
        } else {
            this.compositeView.addChild(this.doneButton);
            this.stopflag = true;
        }
    },

    onclickmenu: function() {
        if (this.menuflag) {
            console.log("lili  menubotton clicked!");
            this.compositeView.addChild(this.addview);
            this.menuflag = false;
        } else {
            console.log("lili  menubotton clicked twice!");
            this.layout.removeLayoutParam(6, "align");
            this.menuflag = true;
        }
    },



}, module);

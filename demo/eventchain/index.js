    var fx = require('cloudappfx'),
        CloudApp = fx.import('framework.app.CloudApp'),
        Class = fx.import('framework.Class'),
        View = fx.import("framework.ui.view.View");

    Class.define('main', CloudApp, {
        initialize: function(){
            CloudApp.prototype.initialize.apply(this, arguments);

            this.view = new View();
            this.view.width = this.width;
            this.view.height = this.height;
            this.view.backgroundColor = "#f0f0f0";
            this.view.addEventListener("touchstart", this.onTouchStart.bind(this)); //添加touchstart事件监听器，并绑定处理函数
            this.view.addEventListener("touchmove", this.onTouchMove.bind(this)); //添加touchmove事件监听器，并绑定处理函数
            this.view.addEventListener("touchend", this.onTouchEnd.bind(this)); //添加touchend事件监听器，并绑定处理函数
            this.window.addChild(this.view);
        },

        /**
         * Handle Event when set app start
         * @abstract
         * @method Card#handleStart
         */
        onStart : function() {
            //当程序成功初始化后首先执行handleStart中内容
            console.log("App is started");
        },

        /**
         * Handle Event when set app run in background
         * @method Card#handleBackGround
         * @abstract
         */
        onInactive : function() {
            //当程序被放置在后台运行，或者被其他应用切换后，执行该方法
            console.log("App is put to background");
        },

        /**
         * Handle Event when set app run in foreground
         * @abstract
         * @method Card#handleForeGround
         */
        onActive : function() {
            //当程序由后台变为前台运行，执行该方法
            console.log("App is put to front");
        },

        onTouchStart : function(e) {
            //手指按下时触发该事件
            console.log("View has been touched, point is", e.touches[0].screenX, e.touches[0].screenY);
            e.preventDefault();//阻止事件向系统发送
        },

        onTouchMove : function(e) {
            //手指在屏幕上移动，触发该事件
            console.log("View has touched and fingure move, point is ", e.touches[0].screenX, e.touches[0].screenY);
            e.preventDefault();//阻止事件向系统发送
        },

        onTouchEnd : function(e) {
            //手指离开屏幕触发该事件
            console.log("View has been touched fingure up, point is", e.touches[0].screenX, e.touches[0].screenY);
            e.preventDefault();//阻止事件向系统发送
        }

    }, module);
    var main = module.exports;
    new main();

"use strict";
var Class = require("../../class");
var TextView = require("./textview");
var TapRecognizer = require("../gesture/taprecognizer");

/**
 * Text field.
 * @class TextField
 * @extends TextView
 */
Class.define("framework.ui.view.TextField", TextView, {
    /**
     * Constructor that create a view
     * @constructor
     */
    initialize: function() {
        TextView.prototype.initialize.apply(this, arguments);

        this._placeHolderColor = "#BFBEBD";
        this._readonly = false;
        this._maxlength = 0;
        this._padding = 5;
        this._borderWidth = 1;
        this._borderColor = "#959595";
        this._borderRadius = 3;
        this._boxShadow = "1px 1px 0px rgba(255, 255, 255, 1)";
        this._innerShadow = "0px 0px 4px rgba(0, 0, 0, 0.4)";
        this._selectionColor = "rgba(179, 212, 253, 0.8)";
        this._placeHolder = "";

        this._cursor = false;
        this._cursorPos = 0;
        this._selection = [0, 0];
        this._wasOver = false;

        this.addGestureRecognizer(this._tapRecognizer = new TapRecognizer());

        this.addEventListener("keydown", this._onKeyDownFunc = this.onKeyDown.bind(this));
        this.addEventListener("keyup", this._onKeyUpFunc = this.onKeyUp.bind(this));

    },

    destroy: function() {
        this.removeGestureRecognizer(this._tapRecognizer);
        this._tapRecognizer = null;

        TextView.prototype.destroy.apply(this, arguments);
    },

    get placeHolderColor() {

    },

    set placeHolderColor(value) {

    },

    onKeyDown: function(e) {
        if (this._focused) {
            this.dispatchEvent("keydown", e);
        }
        this.invalidate();
    },

    onKeyUp: function(e) {
        if (this._focused) {
            this.dispatchEvent("keydown", e);
        }
        this.invalidate();
    },

    /**
     * Place focus on the text field, placing the cursor
     * either at the end of the text or where the user clicked.
     */
    focus: function() {
        // remove selection
        if (!this._selectionUpdated) {
            this._selection = [0, 0];
        }

        // if this is readonly, don't allow it to get focus
        if (this._readonly) {
            return;
        }
        this._focused = true;

        // update the cursor position
        this._cursorPos = this.clipText().length;

        // clear the place holder
        if (this._placeHolder === this._text) {
            this._text = "";
        }

        this._cursor = true;

        // setup cursor interval
        if (this._cursorInterval) {
            clearInterval(this._cursorInterval);
        }
        this._cursorInterval = setInterval(function() {
            this._cursor = !this._cursor;
            this.invalidate();
        }.bind(this), 500);
    },

    /**
     * Removes focus from the CanvasInput box.
     * @param  {Object} _this Reference to this.
     * @return {CanvasInput}
     */
    blur: function(_this) {
      var self = _this || this;

      self._onblur(self);

      if (self._cursorInterval) {
        clearInterval(self._cursorInterval);
      }
      self._hasFocus = false;
      self._cursor = false;
      self._selection = [0, 0];
      self._hiddenInput.blur();

      // fill the place holder
      if (self._value === '') {
        self._value = self._placeHolder;
      }

      return self.render();
    },

    /**
     * Clip the text string to only return what fits in the visible text box.
     * @param  {String} value The text to clip.
     * @return {String} The clipped text.
     */
    clipText: function(value) {
        value = value === undefined ? this._text : value;

        var textWidth = this.getTextWidth(value);
        var fillPer = textWidth / (self._width - self._padding),
        text = fillPer > 1 ? value.substr(-1 * Math.floor(value.length / fillPer)) : value;

      return text + '';
    },

    draw: function(context) {
        w = self.outerW,
        h = self.outerH,
        br = self._borderRadius,
        bw = self._borderWidth,
        sw = self.shadowW,
        sh = self.shadowH;

      if (!ctx) {
        return;
      }

      // clear the canvas
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // setup the box shadow
      ctx.shadowOffsetX = self._boxShadow.x;
      ctx.shadowOffsetY = self._boxShadow.y;
      ctx.shadowBlur = self._boxShadow.blur;
      ctx.shadowColor = self._boxShadow.color;

      // draw the border
      if (self._borderWidth > 0) {
        ctx.fillStyle = self._borderColor;
        self._roundedRect(ctx, self.shadowL, self.shadowT, w - sw, h - sh, br);
        ctx.fill();

        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 0;
      }

      // draw the text box background
      // only draw the background shape if no image is being used
      if (self._backgroundImage === '') {
        ctx.fillStyle = self._backgroundColor;
        self._roundedRect(ctx, bw + self.shadowL, bw + self.shadowT, w - bw * 2 - sw, h - bw * 2 - sh, br);
        ctx.fill();
      } else {
          ctx.drawImage(this._background, 0, 0, img.width, img.height, bw + self.shadowL, bw + self.shadowT, w, h);
      }



        // make sure all shadows are reset
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 0;

        // clip the text so that it fits within the box
        var text = self._clipText(context);

        // draw the selection
        var paddingBorder = self._padding + self._borderWidth + self.shadowT;
        if (self._selection[1] > 0) {
          var selectOffset = self._textWidth(text.substring(0, self._selection[0])),
            selectWidth = self._textWidth(text.substring(self._selection[0], self._selection[1]));

          ctx.fillStyle = self._selectionColor;
          ctx.fillRect(paddingBorder + selectOffset, paddingBorder, selectWidth, self._height);
        }

        // draw the cursor
        if (self._cursor) {
          var cursorOffset = self._textWidth(text.substring(0, self._cursorPos));
          ctx.fillStyle = self._fontColor;
          ctx.fillRect(paddingBorder + cursorOffset, paddingBorder, 1, self._height);
        }

        // draw the text
        var textX = self._padding + self._borderWidth + self.shadowL,
          textY = Math.round(paddingBorder + self._height / 2);

        // only remove the placeholder text if they have typed something
        text = (text === '' && self._placeHolder) ? self._placeHolder : text;

        ctx.fillStyle = (self._value !== '' && self._value !== self._placeHolder) ? self._fontColor : self._placeHolderColor;
        ctx.font = self._fontStyle + ' ' + self._fontWeight + ' ' + self._fontSize + 'px ' + self._fontFamily;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, textX, textY);

        // parse inner shadow
        var innerShadow = self._innerShadow.split('px '),
          isOffsetX = self._innerShadow === 'none' ? 0 : parseInt(innerShadow[0], 10),
          isOffsetY = self._innerShadow === 'none' ? 0 : parseInt(innerShadow[1], 10),
          isBlur = self._innerShadow === 'none' ? 0 : parseInt(innerShadow[2], 10),
          isColor = self._innerShadow === 'none' ? '' : innerShadow[3];

        // draw the inner-shadow (damn you canvas, this should be easier than this...)
        if (isBlur > 0) {
          var shadowCtx = self._shadowCtx,
            scw = shadowCtx.canvas.width,
            sch = shadowCtx.canvas.height;

          shadowCtx.clearRect(0, 0, scw, sch);
          shadowCtx.shadowBlur = isBlur;
          shadowCtx.shadowColor = isColor;

          // top shadow
          shadowCtx.shadowOffsetX = 0;
          shadowCtx.shadowOffsetY = isOffsetY;
          shadowCtx.fillRect(-1 * w, -100, 3 * w, 100);

          // right shadow
          shadowCtx.shadowOffsetX = isOffsetX;
          shadowCtx.shadowOffsetY = 0;
          shadowCtx.fillRect(scw, -1 * h, 100, 3 * h);

          // bottom shadow
          shadowCtx.shadowOffsetX = 0;
          shadowCtx.shadowOffsetY = isOffsetY;
          shadowCtx.fillRect(-1 * w, sch, 3 * w, 100);

          // left shadow
          shadowCtx.shadowOffsetX = isOffsetX;
          shadowCtx.shadowOffsetY = 0;
          shadowCtx.fillRect(-100, -1 * h, 100, 3 * h);

          // create a clipping mask on the main canvas
          self._roundedRect(ctx, bw + self.shadowL, bw + self.shadowT, w - bw * 2 - sw, h - bw * 2 - sh, br);
          ctx.clip();

          // draw the inner-shadow from the off-DOM canvas
          ctx.drawImage(self._shadowCanvas, 0, 0, scw, sch, bw + self.shadowL, bw + self.shadowT, scw, sch);
        }

        // draw to the visible canvas
        if (self._ctx) {
          self._ctx.clearRect(self._x, self._y, ctx.canvas.width, ctx.canvas.height);
          self._ctx.drawImage(self._renderCanvas, self._x, self._y);
        }

        return self;

      });
    }


}, module);

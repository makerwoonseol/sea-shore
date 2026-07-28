function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
export var Drawing = /*#__PURE__*/function () {
  function Drawing(ctx) {
    var _this = this;
    _classCallCheck(this, Drawing);
    this.ctx = ctx;
    this.ctx.lineWidth = 8;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.hasDrawn = false;
    this.lastDrawTime = 0;
    this.mouse = {
      x: 0,
      y: 0
    };
    this.lastMouse = {
      x: 0,
      y: 0
    };
    this.isDrawing = false;
    window.addEventListener("pointermove", function (event) {
      _this.mouse.x = event.clientX;
      _this.mouse.y = event.clientY;
      if (_this.isDrawing === true) {
        var dx = _this.mouse.x - _this.lastMouse.x;
        var dy = _this.mouse.y - _this.lastMouse.y;
        for (var i = 0; i <= 10; i++) {
          var x = _this.lastMouse.x + dx / 10 * i;
          var y = _this.lastMouse.y + dy / 10 * i;
          _this.drawBrush(x, y);
        }
        console.log("drawing");
      }
      _this.lastMouse.x = _this.mouse.x;
      _this.lastMouse.y = _this.mouse.y;
    });
    window.addEventListener("pointerdown", function (event) {
      _this.isDrawing = true;
      _this.lastMouse.x = _this.mouse.x;
      _this.lastMouse.y = _this.mouse.y;
    });
    window.addEventListener("pointerup", function (event) {
      _this.isDrawing = false;
    });
  }
  return _createClass(Drawing, [{
    key: "resize",
    value: function resize(stageWidth, stageHeight) {
      this.stageWidth = stageWidth;
      this.stageHeight = stageHeight;
    }
  }, {
    key: "drawBrush",
    value: function drawBrush(x, y) {
      for (var i = 0; i <= 10; i++) {
        var px = x + Math.random() * 20 - 10;
        var py = y + Math.random() * 20 - 10;
        var radius = 10;
        var dx = px - x;
        var dy = py - y;
        this.hasDrawn = true;
        this.lastDrawTime = Date.now();
        if (dx * dx + dy * dy <= radius * radius) {
          this.ctx.beginPath();
          this.ctx.arc(px, py, Math.random() * 2 + 0.1, 0, Math.PI * 2, false);
          this.ctx.fillStyle = "#e8dfc8";
          this.ctx.fill();
        }
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
      this.hasDrawn = false;
    }
  }]);
}();

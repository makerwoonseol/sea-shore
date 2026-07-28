function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { Point } from "./point.js";
import { Drawing } from "./drawing.js";
export var Wave = /*#__PURE__*/function () {
  function Wave(index, totalPoints, color) {
    _classCallCheck(this, Wave);
    this.index = index;
    this.totalPoints = totalPoints;
    this.color = color;
    this.isBack = false;
    this.points = [];
    this.trails = [];
    this.delay = 0;
    this.isResetWave = false;
    this.resetFinished = false;
  }
  return _createClass(Wave, [{
    key: "resize",
    value: function resize(stageWidth, stageHeight) {
      this.stageWidth = stageWidth;
      this.stageHeight = stageHeight;
      this.centerX = stageWidth / 2;
      this.centerY = stageHeight / 2;
      this.pointGap = this.stageWidth / (this.totalPoints - 1);
      this.init();
    }
  }, {
    key: "init",
    value: function init() {
      this.points = [];
      for (var i = 0; i < this.totalPoints; i++) {
        var point = new Point(this.index + i, this.pointGap * i, 0, Math.random() / 3 + 0.4);
        this.points[i] = point;
      }
    }
  }, {
    key: "makeWave",
    value: function makeWave() {
      for (var i = 0; i < this.totalPoints; i++) {
        this.points[i].targetY = 200 + Math.random() * 200;
        this.points[i].speed = Math.random() * 1.2 + 1;
      }
    }
  }, {
    key: "goBack",
    value: function goBack() {
      for (var i = 0; i < this.totalPoints; i++) {
        this.points[i].targetY = 0;
        this.points[i].speed = Math.random() * 2 + 0.4;
      }
    }
  }, {
    key: "resetWave",
    value: function resetWave() {
      this.isResetWave = true;
      for (var i = 0; i < this.totalPoints; i++) {
        this.points[i].y = 0;
        this.points[i].targetY = this.stageHeight;
        this.points[i].speed = Math.random() * 1.2 + 1;
      }
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      if (this.delay > 0) {
        this.delay--;
        return;
      }
      for (var i = this.trails.length - 1; i >= 0; i--) {
        var trail = this.trails[i];
        this.drawWave(ctx, trail.points, trail.alpha, this.color);
        trail.alpha -= 0.001;
        if (trail.alpha <= 0) {
          this.trails.splice(i, 1);
        }
      }
      var arrivedCount = 0;
      for (var _i = 0; _i < this.totalPoints; _i++) {
        var arrived = this.points[_i].y === this.points[_i].targetY;
        if (arrived == true) {
          arrivedCount++;
        }
        this.points[_i].update();
      }
      // this.drawWave(ctx, this.points, 0.5, "#daecffe8");
      // this.drawWave(ctx, this.points, 0.5, "#008cff83");
      // this.drawWave(ctx, this.points, 0.5, "#004cff83");

      this.drawWave(ctx, this.points, 0.99, this.color);
      if (arrivedCount === this.totalPoints) {
        var _trail = [];
        for (var _i2 = 0; _i2 < this.totalPoints; _i2++) {
          _trail.push({
            x: this.points[_i2].x,
            y: this.points[_i2].y
          });
        }
        if (this.isResetWave) {
          // "나 다 덮었어!"
          this.resetFinished = true;
          this.isResetWave = false;
          return;
        }
        this.trails.push({
          points: _trail,
          alpha: 0.5
        });
        console.log("모두 도착!");
        if (this.isBack == false) {
          this.goBack();
          this.isBack = true;
        } else {
          this.makeWave();
          this.isBack = false;
        }
      }
    }
  }, {
    key: "drawWave",
    value: function drawWave(ctx, points, alpha, waveColor) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      var prevX = points[0].x;
      var prevY = points[0].y;
      ctx.moveTo(prevX, prevY);
      ctx.fillStyle = waveColor;
      for (var i = 1; i < this.totalPoints; i++) {
        var cx = (prevX + points[i].x) / 2;
        var cy = (prevY + points[i].y) / 2;
        ctx.quadraticCurveTo(prevX, prevY, cx, cy);
        prevX = points[i].x;
        prevY = points[i].y;
      }
      ctx.lineTo(prevX, prevY);
      ctx.lineTo(this.stageWidth, 0);
      ctx.lineTo(0, 0);
      // ctx.strokeStyle = "white";
      // ctx.lineWidth = 5;
      // ctx.stroke();
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    }
  }]);
}();

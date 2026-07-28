// ==========================================
// 1. 공통 헬퍼 함수 (iOS 9 / ES5 호환용)
// ==========================================
function _classCallCheck(a, n) {
  if (!(a instanceof n))
    throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    ((o.enumerable = o.enumerable || !1),
      (o.configurable = !0),
      "value" in o && (o.writable = !0),
      Object.defineProperty(e, _toPropertyKey(o.key), o));
  }
}
function _createClass(e, r, t) {
  return (
    r && _defineProperties(e.prototype, r),
    t && _defineProperties(e, t),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    e
  );
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _createForOfIteratorHelper(r, e) {
  var t =
    ("undefined" != typeof Symbol && r[Symbol.iterator]) || r["@@iterator"];
  if (!t) {
    if (
      Array.isArray(r) ||
      (t = _unsupportedIterableToArray(r)) ||
      (e && r && "number" == typeof r.length)
    ) {
      t && (r = t);
      var _n = 0,
        F = function F() {};
      return {
        s: F,
        n: function n() {
          return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] };
        },
        e: function e(r) {
          throw r;
        },
        f: F,
      };
    }
    throw new TypeError(
      "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
    );
  }
  var o,
    a = !0,
    u = !1;
  return {
    s: function s() {
      t = t.call(r);
    },
    n: function n() {
      var r = t.next();
      return ((a = r.done), r);
    },
    e: function e(r) {
      ((u = !0), (o = r));
    },
    f: function f() {
      try {
        a || null == t.return || t.return();
      } finally {
        if (u) throw o;
      }
    },
  };
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return (
      "Object" === t && r.constructor && (t = r.constructor.name),
      "Map" === t || "Set" === t
        ? Array.from(r)
        : "Arguments" === t ||
            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
          ? _arrayLikeToArray(r, a)
          : void 0
    );
  }
}
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}

// ==========================================
// 2. Point 클래스
// ==========================================
var Point = /*#__PURE__*/ (function () {
  function Point(index, x, y, speed) {
    _classCallCheck(this, Point);
    this.x = x;
    this.y = y;
    this.fixedY = y;
    this.speed = speed;
    this.cur = index;
    this.targetY = 500 + Math.random() * 200;
  }
  return _createClass(Point, [
    {
      key: "update",
      value: function update() {
        if (this.y < this.targetY) {
          this.y += this.speed * 2;
          if (this.y > this.targetY) {
            this.y = this.targetY;
          }
        } else if (this.y > this.targetY) {
          this.y -= this.speed;
          if (this.y < this.targetY) {
            this.y = this.targetY;
          }
        }
      },
    },
  ]);
})();

// ==========================================
// 3. Tube 클래스
// ==========================================
var Tube = /*#__PURE__*/ (function () {
  function Tube(x, y, radius, closestPoint) {
    _classCallCheck(this, Tube);
    this.x = x;
    this.y = y;
    this.radius = radius || 40;
    this.closestPoint = closestPoint;
    this.angle = Math.random() * Math.PI;
    this.rotateSpeed = (Math.random() - 0.5) * 0.03;
    this.bounce = Math.random() * 10;
  }
  return _createClass(Tube, [
    {
      key: "update",
      value: function update(isResetting) {
        if (this.closestPoint) {
          this.x = this.closestPoint.x;
          var targetY = this.closestPoint.y;
          if (this.y < targetY) {
            this.y += (targetY - this.y) * 0.08 + 1.5;
          } else {
            this.bounce += 0.05;
            this.y = targetY + Math.sin(this.bounce) * 4;
          }
        } else {
          this.y += 3;
        }
        this.angle += this.rotateSpeed;
      },
    },
    {
      key: "isOut",
      value: function isOut() {
        if (this.closestPoint && this.closestPoint.y > 900 && this.y > 850) {
          return true;
        }
        return this.y > 1200;
      },
    },
    {
      key: "draw",
      value: function draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        var outerR = this.radius;
        var innerR = this.radius * 0.45;

        ctx.beginPath();
        ctx.arc(0, 0, outerR, 0, Math.PI * 2);
        ctx.arc(0, 0, innerR, 0, Math.PI * 2, true);
        ctx.fillStyle = "#FF5252";
        ctx.fill();

        for (var i = 0; i < 4; i++) {
          ctx.save();
          ctx.rotate((Math.PI / 2) * i);
          ctx.beginPath();
          ctx.arc(0, 0, outerR, -Math.PI / 8, Math.PI / 8);
          ctx.arc(0, 0, innerR, Math.PI / 8, -Math.PI / 8, true);
          ctx.fillStyle = "#FFFFFF";
          ctx.fill();
          ctx.restore();
        }

        ctx.beginPath();
        ctx.arc(0, 0, outerR, 0, Math.PI * 2);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(0, 0, 0, 0.12)";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, innerR, 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(0, 0, 0, 0.12)";
        ctx.stroke();

        ctx.restore();
      },
    },
  ]);
})();

// ==========================================
// 4. Drawing 클래스 (iOS 9 터치 지원 추가)
// ==========================================
var Drawing = /*#__PURE__*/ (function () {
  function Drawing(ctx) {
    var _this = this;
    _classCallCheck(this, Drawing);
    this.ctx = ctx;
    this.ctx.lineWidth = 8;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.hasDrawn = false;
    this.lastDrawTime = 0;
    this.mouse = { x: 0, y: 0 };
    this.lastMouse = { x: 0, y: 0 };
    this.isDrawing = false;

    // iOS 9 사파리 터치 지원 함수
    function getPos(e) {
      if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    }

    var onStart = function (event) {
      _this.isDrawing = true;
      var pos = getPos(event);
      _this.mouse.x = pos.x;
      _this.mouse.y = pos.y;
      _this.lastMouse.x = pos.x;
      _this.lastMouse.y = pos.y;
    };

    var onMove = function (event) {
      var pos = getPos(event);
      _this.mouse.x = pos.x;
      _this.mouse.y = pos.y;
      if (_this.isDrawing === true) {
        var dx = _this.mouse.x - _this.lastMouse.x;
        var dy = _this.mouse.y - _this.lastMouse.y;
        for (var i = 0; i <= 10; i++) {
          var x = _this.lastMouse.x + (dx / 10) * i;
          var y = _this.lastMouse.y + (dy / 10) * i;
          _this.drawBrush(x, y);
        }
      }
      _this.lastMouse.x = _this.mouse.x;
      _this.lastMouse.y = _this.mouse.y;
    };

    var onEnd = function () {
      _this.isDrawing = false;
    };

    // 마우스 이벤트 등록
    window.addEventListener("mousedown", onStart);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);

    // iOS 9 터치 이벤트 등록
    window.addEventListener("touchstart", onStart);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onEnd);
  }
  return _createClass(Drawing, [
    {
      key: "resize",
      value: function resize(stageWidth, stageHeight) {
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
      },
    },
    {
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
            this.ctx.arc(
              px,
              py,
              Math.random() * 2 + 0.1,
              0,
              Math.PI * 2,
              false,
            );
            this.ctx.fillStyle = "#e8dfc8";
            this.ctx.fill();
          }
        }
      },
    },
    {
      key: "clear",
      value: function clear() {
        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
        this.hasDrawn = false;
      },
    },
  ]);
})();

// ==========================================
// 5. Wave 클래스
// ==========================================
var Wave = /*#__PURE__*/ (function () {
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
  return _createClass(Wave, [
    {
      key: "resize",
      value: function resize(stageWidth, stageHeight) {
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
        this.centerX = stageWidth / 2;
        this.centerY = stageHeight / 2;
        this.pointGap = this.stageWidth / (this.totalPoints - 1);
        this.init();
      },
    },
    {
      key: "init",
      value: function init() {
        this.points = [];
        for (var i = 0; i < this.totalPoints; i++) {
          var point = new Point(
            this.index + i,
            this.pointGap * i,
            0,
            Math.random() / 3 + 0.4,
          );
          this.points[i] = point;
        }
      },
    },
    {
      key: "makeWave",
      value: function makeWave() {
        for (var i = 0; i < this.totalPoints; i++) {
          this.points[i].targetY = 200 + Math.random() * 200;
          this.points[i].speed = Math.random() * 1.2 + 1;
        }
      },
    },
    {
      key: "goBack",
      value: function goBack() {
        for (var i = 0; i < this.totalPoints; i++) {
          this.points[i].targetY = 0;
          this.points[i].speed = Math.random() * 2 + 0.4;
        }
      },
    },
    {
      key: "resetWave",
      value: function resetWave() {
        this.isResetWave = true;
        for (var i = 0; i < this.totalPoints; i++) {
          this.points[i].y = 0;
          this.points[i].targetY = this.stageHeight;
          this.points[i].speed = Math.random() * 1.2 + 1;
        }
      },
    },
    {
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

        this.drawWave(ctx, this.points, 0.99, this.color);
        if (arrivedCount === this.totalPoints) {
          var _trail = [];
          for (var _i2 = 0; _i2 < this.totalPoints; _i2++) {
            _trail.push({
              x: this.points[_i2].x,
              y: this.points[_i2].y,
            });
          }
          if (this.isResetWave) {
            this.resetFinished = true;
            this.isResetWave = false;
            return;
          }
          this.trails.push({
            points: _trail,
            alpha: 0.5,
          });
          if (this.isBack == false) {
            this.goBack();
            this.isBack = true;
          } else {
            this.makeWave();
            this.isBack = false;
          }
        }
      },
    },
    {
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
        ctx.fill();
        ctx.closePath();
        ctx.restore();
      },
    },
  ]);
})();

// ==========================================
// 6. WaveGroup 클래스
// ==========================================
var WaveGroup = /*#__PURE__*/ (function () {
  function WaveGroup() {
    _classCallCheck(this, WaveGroup);
    this.totalWaves = 3;
    this.waves = [
      new Wave(1, 6, "#8fd4ff"),
      new Wave(1, 6, "#0088ff"),
      new Wave(1, 6, "#0080ff"),
    ];
    this.waves[0].delay = 40;
    this.waves[1].delay = 20;
    this.waves[2].delay = 0;
    this.isResetting = false;
    this.resetFinished = false;
    this.hasTriggeredClear = false;

    this.tubes = [];
  }
  return _createClass(WaveGroup, [
    {
      key: "resize",
      value: function resize(stageWidth, stageHeight) {
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
        for (var i = 0; i < this.totalWaves; i++) {
          var waves = this.waves[i];
          waves.resize(this.stageWidth, this.stageHeight);
        }
      },
    },
    {
      key: "update",
      value: function update() {
        for (var i = this.tubes.length - 1; i >= 0; i--) {
          var tube = this.tubes[i];
          tube.update(this.isResetting);
          if (tube.isOut()) {
            this.tubes.splice(i, 1);
          }
        }
      },
    },
    {
      key: "draw",
      value: function draw(ctx, waveReset) {
        var _iterator = _createForOfIteratorHelper(this.waves),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done; ) {
            var wave = _step.value;
            wave.draw(ctx);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        var _iterator2 = _createForOfIteratorHelper(this.tubes),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
            var _tube = _step2.value;
            _tube.draw(ctx);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        if (waveReset && !this.isResetting) {
          this.isResetting = true;
          this.hasTriggeredClear = false;
          for (var i = 0; i < this.totalWaves; i++) {
            this.waves[i].resetWave();
          }
          var radius = 50;
          var x = Math.random() * (this.stageWidth - radius * 2) + radius;
          var y = -60 / 2;
          var closestPoint = null;
          var closestDistance = Infinity;
          var _iterator3 = _createForOfIteratorHelper(this.waves[2].points),
            _step3;
          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done; ) {
              var point = _step3.value;
              var distance = Math.abs(x - point.x);
              if (distance < closestDistance) {
                closestDistance = distance;
                closestPoint = point;
              }
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
          var tube = new Tube(x, y, radius, closestPoint);
          this.tubes.push(tube);
        }
        this.resetFinished = false;

        if (this.isResetting) {
          for (var _i = 0; _i < this.totalWaves; _i++) {
            if (this.waves[_i].resetFinished) {
              if (!this.hasTriggeredClear) {
                this.resetFinished = true;
                this.hasTriggeredClear = true;
              }
              this.waves[_i].resetFinished = false;
            }
          }

          var anyResetting = false;
          for (var _i2 = 0; _i2 < this.totalWaves; _i2++) {
            if (this.waves[_i2].isResetWave) {
              anyResetting = true;
              break;
            }
          }

          if (!anyResetting) {
            this.isResetting = false;
          }
        }
      },
    },
  ]);
})();

// ==========================================
// 7. App 클래스 및 실행 메인 로직
// ==========================================
var App = /*#__PURE__*/ (function () {
  function App() {
    _classCallCheck(this, App);
    this.waveCanvas = document.createElement("canvas");
    this.waveCtx = this.waveCanvas.getContext("2d");
    this.sandCanvas = document.createElement("canvas");
    this.sandCtx = this.sandCanvas.getContext("2d");
    this.drawCanvas = document.createElement("canvas");
    this.drawCtx = this.drawCanvas.getContext("2d");

    document.body.appendChild(this.sandCanvas);
    document.body.appendChild(this.drawCanvas);
    document.body.appendChild(this.waveCanvas);

    this.waveGroup = new WaveGroup();
    this.drawing = new Drawing(this.drawCtx);

    window.addEventListener("resize", this.resize.bind(this), false);
    this.resize();

    requestAnimationFrame(this.animate.bind(this));
  }
  return _createClass(App, [
    {
      key: "resize",
      value: function resize() {
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;
        this.waveCanvas.width = this.stageWidth * 2;
        this.waveCanvas.height = this.stageHeight * 2;
        this.waveCtx.scale(2, 2);
        this.drawCanvas.width = this.stageWidth * 2;
        this.drawCanvas.height = this.stageHeight * 2;
        this.drawCtx.scale(2, 2);
        this.waveGroup.resize(this.stageWidth, this.stageHeight);
        this.drawing.resize(this.stageWidth, this.stageHeight);
      },
    },
    {
      key: "animate",
      value: function animate(t) {
        var waveReset = false;
        if (this.drawing.hasDrawn === true) {
          var idleTime = Date.now() - this.drawing.lastDrawTime;
          waveReset = idleTime > 5000;
        }
        this.waveCtx.clearRect(0, 0, this.stageWidth, this.stageHeight);
        this.waveGroup.update();
        this.waveGroup.draw(this.waveCtx, waveReset);
        if (this.waveGroup.resetFinished) {
          this.drawing.clear();
          this.waveGroup.resetFinished = false;
        }
        requestAnimationFrame(this.animate.bind(this));
      },
    },
  ]);
})();

window.onload = function () {
  new App();
};

<<<<<<< HEAD
=======
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { Wave } from "./wave.js";
import { Tube } from "./tube.js";

// wavegroup.js 파일 수정
export var WaveGroup = /*#__PURE__*/function () {
  function WaveGroup() {
    _classCallCheck(this, WaveGroup);
    this.totalWaves = 3;
    this.waves = [new Wave(1, 6, "#8fd4ff"), new Wave(1, 6, "#0088ff"), new Wave(1, 6, "#0080ff")];
    this.waves[0].delay = 40;
    this.waves[1].delay = 20;
    this.waves[2].delay = 0;
    this.isResetting = false;
    this.resetFinished = false;
    this.hasTriggeredClear = false; // 💡 리셋 중 clear를 한 번만 실행하기 위한 플래그 추가

    this.tubes = [];
  }
  return _createClass(WaveGroup, [{
    key: "resize",
    value: function resize(stageWidth, stageHeight) {
      this.stageWidth = stageWidth;
      this.stageHeight = stageHeight;
      for (var i = 0; i < this.totalWaves; i++) {
        var waves = this.waves[i];
        waves.resize(this.stageWidth, this.stageHeight);
      }
    }
  }, {
    key: "update",
    value: function update() {
      for (var i = this.tubes.length - 1; i >= 0; i--) {
        var tube = this.tubes[i];
        tube.update(this.isResetting);
        if (tube.isOut()) {
          this.tubes.splice(i, 1);
        }
      }
    }
  }, {
    key: "draw",
    value: function draw(ctx, waveReset) {
      var _iterator = _createForOfIteratorHelper(this.waves),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
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
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _tube = _step2.value;
          _tube.draw(ctx);
        }

        // 1. 리셋 신호가 왔고, 아직 리셋 중이 아니라면 리셋 시작
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      if (waveReset && !this.isResetting) {
        this.isResetting = true;
        this.hasTriggeredClear = false; // 💡 리셋 시작 시 clear 플래그 초기화
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
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
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

      // 2. 리셋 진행 중일 때의 로직 처리
      if (this.isResetting) {
        for (var _i = 0; _i < this.totalWaves; _i++) {
          if (this.waves[_i].resetFinished) {
            // 💡 가장 먼저 캔버스를 다 덮은 웨이브가 있을 때 딱 한 번만 App에 신호를 보냄
            if (!this.hasTriggeredClear) {
              this.resetFinished = true;
              this.hasTriggeredClear = true;
            }
            this.waves[_i].resetFinished = false;
          }
        }

        // 💡 모든 웨이브가 리셋 상태(isResetWave)에서 벗어났는지 확인
        var anyResetting = false;
        for (var _i2 = 0; _i2 < this.totalWaves; _i2++) {
          if (this.waves[_i2].isResetWave) {
            anyResetting = true;
            break;
          }
        }

        // 💡 모든 웨이브가 리셋을 완료했다면, 다음 리셋을 위해 만능 열쇠를 돌려놓음
        if (!anyResetting) {
          this.isResetting = false;
        }
      }
    }
  }]);
}();
>>>>>>> 9cd10c7be323be68aa8c4f9054bd431330c4e9da

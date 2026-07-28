<<<<<<< HEAD
=======
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
export var Point = /*#__PURE__*/function () {
  function Point(index, x, y, speed) {
    _classCallCheck(this, Point);
    this.x = x;
    this.y = y;
    this.fixedY = y;
    this.speed = speed;
    this.cur = index;
    this.targetY = 500 + Math.random() * 200;
  }
  return _createClass(Point, [{
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
    }
  }]);
}();
>>>>>>> 9cd10c7be323be68aa8c4f9054bd431330c4e9da

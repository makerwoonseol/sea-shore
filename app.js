function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { WaveGroup } from "./wavegroup.js";
import { Drawing } from "./drawing.js";
var App = /*#__PURE__*/function () {
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
    // this.drawSand();

    requestAnimationFrame(this.animate.bind(this));
  }

  // drawSand() {
  //   this.sandCanvas.width = this.stageWidth;
  //   this.sandCanvas.height = this.stageHeight;

  //   for (let i = 0; i < 400; i++) {
  //     const radius = Math.random() * 2 + 0.1;
  //     const x = Math.random() * this.stageWidth;
  //     const y = Math.random() * this.stageHeight;

  //     this.sandCtx.beginPath();
  //     this.sandCtx.arc(x, y, radius, 0, Math.PI * 2);
  //     this.sandCtx.fillStyle = "#e8dfc8";
  //     this.sandCtx.fill();
  //   }
  // }
  return _createClass(App, [{
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

      // this.drawSand();
    }
  }, {
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
    }
  }]);
}();
window.onload = function () {
  new App();
};

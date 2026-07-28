import { WaveGroup } from "./wavegroup.js";

import { Drawing } from "./drawing.js";

class App {
  constructor() {
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

  resize() {
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

  animate(t) {
    let waveReset = false;

    if (this.drawing.hasDrawn === true) {
      const idleTime = Date.now() - this.drawing.lastDrawTime;

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
}

window.onload = () => {
  new App();
};

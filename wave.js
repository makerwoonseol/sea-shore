import { Point } from "./point.js";
import { Drawing } from "./drawing.js";

export class Wave {
  constructor(index, totalPoints, color) {
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

  resize(stageWidth, stageHeight) {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;

    this.centerX = stageWidth / 2;
    this.centerY = stageHeight / 2;

    this.pointGap = this.stageWidth / (this.totalPoints - 1);

    this.init();
  }

  init() {
    this.points = [];

    for (let i = 0; i < this.totalPoints; i++) {
      const point = new Point(
        this.index + i,
        this.pointGap * i,
        0,
        Math.random() / 3 + 0.4,
      );
      this.points[i] = point;
    }
  }
  makeWave() {
    for (let i = 0; i < this.totalPoints; i++) {
      this.points[i].targetY = 200 + Math.random() * 200;
      this.points[i].speed = Math.random() * 1.2 + 1;
    }
  }

  goBack() {
    for (let i = 0; i < this.totalPoints; i++) {
      this.points[i].targetY = 0;
      this.points[i].speed = Math.random() * 2 + 0.4;
    }
  }

  resetWave() {
    this.isResetWave = true;

    for (let i = 0; i < this.totalPoints; i++) {
      this.points[i].y = 0;
      this.points[i].targetY = this.stageHeight;
      this.points[i].speed = Math.random() * 1.2 + 1;
    }
  }

  draw(ctx) {
    if (this.delay > 0) {
      this.delay--;
      return;
    }
    for (let i = this.trails.length - 1; i >= 0; i--) {
      const trail = this.trails[i];

      this.drawWave(ctx, trail.points, trail.alpha, this.color);

      trail.alpha -= 0.001;

      if (trail.alpha <= 0) {
        this.trails.splice(i, 1);
      }
    }

    let arrivedCount = 0;

    for (let i = 0; i < this.totalPoints; i++) {
      let arrived = this.points[i].y === this.points[i].targetY;

      if (arrived == true) {
        arrivedCount++;
      }

      this.points[i].update();
    }
    // this.drawWave(ctx, this.points, 0.5, "#daecffe8");
    // this.drawWave(ctx, this.points, 0.5, "#008cff83");
    // this.drawWave(ctx, this.points, 0.5, "#004cff83");

    this.drawWave(ctx, this.points, 0.99, this.color);

    if (arrivedCount === this.totalPoints) {
      const trail = [];

      for (let i = 0; i < this.totalPoints; i++) {
        trail.push({
          x: this.points[i].x,
          y: this.points[i].y,
        });
      }

      if (this.isResetWave) {
        // "나 다 덮었어!"
        this.resetFinished = true;
        this.isResetWave = false;
        return;
      }

      this.trails.push({
        points: trail,
        alpha: 0.5,
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

  drawWave(ctx, points, alpha, waveColor) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();

    let prevX = points[0].x;
    let prevY = points[0].y;

    ctx.moveTo(prevX, prevY);

    ctx.fillStyle = waveColor;

    for (let i = 1; i < this.totalPoints; i++) {
      const cx = (prevX + points[i].x) / 2;
      const cy = (prevY + points[i].y) / 2;

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
}

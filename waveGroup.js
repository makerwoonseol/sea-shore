import { Wave } from "./wave.js";

export class WaveGroup {
  constructor() {
    this.totalWaves = 3;
    this.totalPoints = 6;

    this.color = "#000000";

    this.waves = [];

    for (let i = 0; i < this.totalWaves; i++) {
      const waves = new Wave(i, this.totalPoints, this.color);
      this.waves[i] = waves;
    }
  }

  resize(stageWidth, stageHeight) {
    for (let i = 0; i < this.totalWaves; i++) {
      const waves = this.waves[i];
      waves.resize(stageWidth, stageHeight);
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.totalWaves; i++) {
      const wave = this.waves[i];
      wave.draw(ctx);
    }
  }
}

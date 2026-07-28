import { Wave } from "./wave.js";
import { Tube } from "./tube.js";

// wavegroup.js 파일 수정
export class WaveGroup {
  constructor() {
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
    this.hasTriggeredClear = false; // 💡 리셋 중 clear를 한 번만 실행하기 위한 플래그 추가

    this.tubes = [];
  }

  resize(stageWidth, stageHeight) {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
    for (let i = 0; i < this.totalWaves; i++) {
      const waves = this.waves[i];
      waves.resize(this.stageWidth, this.stageHeight);
    }
  }

  update() {
    for (let i = this.tubes.length - 1; i >= 0; i--) {
      const tube = this.tubes[i];

      tube.update(this.isResetting);

      if (tube.isOut()) {
        this.tubes.splice(i, 1);
      }
    }
  }

  draw(ctx, waveReset) {
    for (const wave of this.waves) {
      wave.draw(ctx);
    }

    for (const tube of this.tubes) {
      tube.draw(ctx);
    }

    // 1. 리셋 신호가 왔고, 아직 리셋 중이 아니라면 리셋 시작
    if (waveReset && !this.isResetting) {
      this.isResetting = true;
      this.hasTriggeredClear = false; // 💡 리셋 시작 시 clear 플래그 초기화
      for (let i = 0; i < this.totalWaves; i++) {
        this.waves[i].resetWave();
      }

      const radius = 50;
      const x = Math.random() * (this.stageWidth - radius * 2) + radius;
      const y = -60 / 2;

      let closestPoint = null;
      let closestDistance = Infinity;

      for (const point of this.waves[2].points) {
        const distance = Math.abs(x - point.x);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestPoint = point;
        }
      }

      const tube = new Tube(x, y, radius, closestPoint);
      this.tubes.push(tube);
    }

    this.resetFinished = false;

    // 2. 리셋 진행 중일 때의 로직 처리
    if (this.isResetting) {
      for (let i = 0; i < this.totalWaves; i++) {
        if (this.waves[i].resetFinished) {
          // 💡 가장 먼저 캔버스를 다 덮은 웨이브가 있을 때 딱 한 번만 App에 신호를 보냄
          if (!this.hasTriggeredClear) {
            this.resetFinished = true;
            this.hasTriggeredClear = true;
          }
          this.waves[i].resetFinished = false;
        }
      }

      // 💡 모든 웨이브가 리셋 상태(isResetWave)에서 벗어났는지 확인
      let anyResetting = false;
      for (let i = 0; i < this.totalWaves; i++) {
        if (this.waves[i].isResetWave) {
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
}

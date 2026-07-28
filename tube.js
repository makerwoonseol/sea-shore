export class Tube {
  constructor(x, y, radius, point) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.point = point;

    this.time = 0;
    this.rotation = 0;
  }

  update(isResetting) {
    if (isResetting) {
      this.y += 2 * 0.9;
    } else {
      this.y -= this.point.speed * 0.9;
    }
    this.time += 0.02;

    this.rotation = Math.sin(this.time) * 0.2;
  }

  isOut() {
    return this.y + this.radius * 2 < 0;
    this.rotation += 0.2;
  }

  drawShadowRing(ctx) {
    const outer = this.radius + 3;
    const inner = 28;

    ctx.beginPath();

    for (let deg = 0; deg <= 360; deg += 6) {
      const rad = (deg * Math.PI) / 180;

      const noise =
        Math.sin(rad * 5 + this.time * 2.5) * 2 +
        Math.sin(rad * 8 - this.time * 3.2) * 1.2;

      const r = outer + noise;

      const x = Math.cos(rad) * r;
      const y = Math.sin(rad) * r;

      if (deg === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.closePath();

    for (let deg = 360; deg >= 0; deg -= 6) {
      const rad = (deg * Math.PI) / 180;

      const noise = Math.sin(rad * 4 + this.time * 1.7) * 1.5;

      const r = inner + noise;

      const x = Math.cos(rad) * r;
      const y = Math.sin(rad) * r;

      ctx.lineTo(x, y);
    }

    ctx.closePath();

    ctx.fill();
  }

  draw(ctx) {
    ctx.save();

    ctx.translate(this.x + 12, this.y + 12);

    // 그림자는 회전 안 해도 되고,
    // 살짝만 따라가게 하려면 아래 한 줄 추가
    ctx.rotate(this.rotation * 0.3);

    ctx.globalAlpha = 0.22;
    ctx.fillStyle = "#001122";
    ctx.filter = "blur(10px)";

    this.drawShadowRing(ctx);

    ctx.restore();

    ctx.filter = "none";
    ctx.globalAlpha = 1;

    ctx.save();

    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // --- [수정 구간 시작] 도넛 모양으로 구멍 뚫기 (클리핑 패스 설정) ---
    ctx.beginPath();
    // 1. 바깥쪽 원 정의 (시계 방향)
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
    // 2. 안쪽 원 정의 (반시계 방향 - true로 설정하여 구멍을 냄)
    ctx.arc(0, 0, 28, 0, Math.PI * 2, true);
    // 3. 이 영역만 그리도록 클리핑 영역으로 지정 (이후 그리는 모든 것은 도넛 내부에만 그려짐)
    ctx.clip();
    // --- [수정 구간 끝] ---

    // 빨간색 바탕 (이제 도넛 모양 안쪽에만 칠해집니다)
    ctx.fillStyle = "#F2360C";
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
    ctx.fill();

    // 흰색 줄무늬 1
    ctx.fillStyle = "#F2F2F2";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, this.radius, 0, Math.PI / 6, false);
    ctx.fill();

    // 흰색 줄무늬 2
    ctx.fillStyle = "#F2F2F2";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, this.radius, Math.PI, Math.PI + Math.PI / 6, false);
    ctx.fill();

    // 흰색 줄무늬 3
    ctx.fillStyle = "#F2F2F2";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, this.radius, -Math.PI / 2, -Math.PI / 2 + Math.PI / 6, false);
    ctx.fill();

    // 흰색 줄무늬 4
    ctx.fillStyle = "#F2F2F2";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, this.radius, Math.PI / 2, Math.PI / 2 + Math.PI / 6, false);
    ctx.fill();

    // 기존 파란색 원을 그리던 코드는 완전히 삭제합니다.

    ctx.restore();
  }
}

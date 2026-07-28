export class Drawing {
  constructor(ctx) {
    this.ctx = ctx;
    this.ctx.lineWidth = 8;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";

    this.hasDrawn = false;
    this.lastDrawTime = 0;

    this.mouse = {
      x: 0,
      y: 0,
    };
    this.lastMouse = {
      x: 0,
      y: 0,
    };
    this.isDrawing = false;

    window.addEventListener("pointermove", (event) => {
      this.mouse.x = event.clientX;
      this.mouse.y = event.clientY;

      if (this.isDrawing === true) {
        const dx = this.mouse.x - this.lastMouse.x;
        const dy = this.mouse.y - this.lastMouse.y;

        for (let i = 0; i <= 10; i++) {
          const x = this.lastMouse.x + (dx / 10) * i;
          const y = this.lastMouse.y + (dy / 10) * i;

          this.drawBrush(x, y);
        }
        console.log("drawing");
      }
      this.lastMouse.x = this.mouse.x;
      this.lastMouse.y = this.mouse.y;
    });

    window.addEventListener("pointerdown", (event) => {
      this.isDrawing = true;
      this.lastMouse.x = this.mouse.x;
      this.lastMouse.y = this.mouse.y;
    });

    window.addEventListener("pointerup", (event) => {
      this.isDrawing = false;
    });
  }

  resize(stageWidth, stageHeight) {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
  }

  drawBrush(x, y) {
    for (let i = 0; i <= 10; i++) {
      const px = x + Math.random() * 20 - 10;
      const py = y + Math.random() * 20 - 10;

      const radius = 10;

      const dx = px - x;
      const dy = py - y;

      this.hasDrawn = true;
      this.lastDrawTime = Date.now();

      if (dx * dx + dy * dy <= radius * radius) {
        this.ctx.beginPath();
        this.ctx.arc(px, py, Math.random() * 2 + 0.1, 0, Math.PI * 2, false);
        this.ctx.fillStyle = "#e8dfc8";
        this.ctx.fill();
      }
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
    this.hasDrawn = false;
  }
}

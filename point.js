export class Point {
  constructor(index, x, y, speed) {
    this.x = x;
    this.y = y;
    this.fixedY = y;
    this.speed = speed;
    this.cur = index;

    this.targetY = 500 + Math.random() * 200;
  }

  update() {
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
}

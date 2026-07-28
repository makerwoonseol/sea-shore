// 0. requestAnimationFrame 폴리필
window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  function (callback) {
    return setTimeout(callback, 1000 / 60);
  };

// 1. Point 클래스
function Point(index, x, y, speed) {
  this.x = x;
  this.y = y;
  this.fixedY = y;
  this.speed = speed;
  this.cur = index;
  this.targetY = 500 + Math.random() * 200;
}

Point.prototype.update = function () {
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
};

// 2. Tube 클래스
function Tube(x, y, radius, point) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.point = point;
  this.time = 0;
  this.rotation = 0;
}

Tube.prototype.update = function (isResetting) {
  var speedVal = 1;
  if (this.point) {
    speedVal = this.point.speed;
  }
  if (isResetting) {
    this.y += 1.8;
  } else {
    this.y -= speedVal * 0.9;
  }
  this.time += 0.02;
  this.rotation = Math.sin(this.time) * 0.2;
};

Tube.prototype.isOut = function () {
  var totalY = this.y + this.radius * 2;
  return totalY < 0;
};

Tube.prototype.drawShadowRing = function (ctx) {
  var outer = this.radius + 3;
  var inner = 28;
  var deg = 0;
  var rad = 0;
  var noise = 0;
  var r = 0;
  var x = 0;
  var y = 0;

  ctx.beginPath();
  for (deg = 0; deg <= 360; deg += 6) {
    rad = (deg * Math.PI) / 180;
    noise =
      Math.sin(rad * 5 + this.time * 2.5) * 2 +
      Math.sin(rad * 8 - this.time * 3.2) * 1.2;
    r = outer + noise;
    x = Math.cos(rad) * r;
    y = Math.sin(rad) * r;

    if (deg === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();

  for (deg = 360; deg >= 0; deg -= 6) {
    rad = (deg * Math.PI) / 180;
    noise = Math.sin(rad * 4 + this.time * 1.7) * 1.5;
    r = inner + noise;
    x = Math.cos(rad) * r;
    y = Math.sin(rad) * r;

    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
};

Tube.prototype.draw = function (ctx) {
  ctx.save();
  ctx.translate(this.x + 12, this.y + 12);
  ctx.rotate(this.rotation * 0.3);

  ctx.globalAlpha = 0.22;
  ctx.fillStyle = "#001122";

  this.drawShadowRing(ctx);
  ctx.restore();

  ctx.globalAlpha = 1;

  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate(this.rotation);

  ctx.beginPath();
  ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
  ctx.arc(0, 0, 28, 0, Math.PI * 2, true);
  ctx.clip();

  ctx.fillStyle = "#F2360C";
  ctx.beginPath();
  ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
  ctx.fill();

  ctx.fillStyle = "#F2F2F2";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, this.radius, 0, Math.PI / 6, false);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, this.radius, Math.PI, Math.PI + Math.PI / 6, false);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, this.radius, -Math.PI / 2, -Math.PI / 2 + Math.PI / 6, false);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, this.radius, Math.PI / 2, Math.PI / 2 + Math.PI / 6, false);
  ctx.fill();

  ctx.restore();
};

// 3. Drawing 클래스
function Drawing(ctx) {
  var self = this;
  this.ctx = ctx;
  this.ctx.lineWidth = 8;
  this.ctx.lineCap = "round";
  this.ctx.lineJoin = "round";
  this.hasDrawn = false;
  this.lastDrawTime = 0;
  this.mouse = { x: 0, y: 0 };
  this.lastMouse = { x: 0, y: 0 };
  this.isDrawing = false;

  function getPos(e) {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    if (e.changedTouches && e.changedTouches.length > 0) {
      return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    }
    return { x: e.clientX || 0, y: e.clientY || 0 };
  }

  function handleStart(event) {
    self.isDrawing = true;
    var pos = getPos(event);
    self.mouse.x = pos.x;
    self.mouse.y = pos.y;
    self.lastMouse.x = pos.x;
    self.lastMouse.y = pos.y;
  }

  function handleMove(event) {
    var pos = getPos(event);
    var dx = 0;
    var dy = 0;
    var i = 0;
    var x = 0;
    var y = 0;

    self.mouse.x = pos.x;
    self.mouse.y = pos.y;
    if (self.isDrawing === true) {
      dx = self.mouse.x - self.lastMouse.x;
      dy = self.mouse.y - self.lastMouse.y;
      for (i = 0; i <= 10; i++) {
        x = self.lastMouse.x + (dx / 10) * i;
        y = self.lastMouse.y + (dy / 10) * i;
        self.drawBrush(x, y);
      }
    }
    self.lastMouse.x = self.mouse.x;
    self.lastMouse.y = self.mouse.y;
  }

  function handleEnd() {
    self.isDrawing = false;
  }

  window.addEventListener("mousedown", handleStart, false);
  window.addEventListener("mousemove", handleMove, false);
  window.addEventListener("mouseup", handleEnd, false);

  window.addEventListener("touchstart", handleStart, false);
  window.addEventListener("touchmove", handleMove, false);
  window.addEventListener("touchend", handleEnd, false);
}

Drawing.prototype.resize = function (stageWidth, stageHeight) {
  this.stageWidth = stageWidth;
  this.stageHeight = stageHeight;
};

Drawing.prototype.drawBrush = function (x, y) {
  var i = 0;
  var px = 0;
  var py = 0;
  var radius = 10;
  var dx = 0;
  var dy = 0;
  var distSq = 0;
  var radSq = radius * radius;

  for (i = 0; i <= 10; i++) {
    px = x + Math.random() * 20 - 10;
    py = y + Math.random() * 20 - 10;
    dx = px - x;
    dy = py - y;
    distSq = dx * dx + dy * dy;

    this.hasDrawn = true;
    this.lastDrawTime = new Date().getTime();

    if (distSq <= radSq) {
      this.ctx.beginPath();
      this.ctx.arc(px, py, Math.random() * 2 + 0.1, 0, Math.PI * 2, false);
      this.ctx.fillStyle = "#e8dfc8";
      this.ctx.fill();
    }
  }
};

Drawing.prototype.clear = function () {
  this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
  this.hasDrawn = false;
};

// 4. Wave 클래스
function Wave(index, totalPoints, color) {
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

Wave.prototype.resize = function (stageWidth, stageHeight) {
  this.stageWidth = stageWidth;
  this.stageHeight = stageHeight;
  this.centerX = stageWidth / 2;
  this.centerY = stageHeight / 2;
  this.pointGap = this.stageWidth / (this.totalPoints - 1);
  this.init();
};

Wave.prototype.init = function () {
  var i = 0;
  this.points = [];
  for (i = 0; i < this.totalPoints; i++) {
    this.points[i] = new Point(
      this.index + i,
      this.pointGap * i,
      0,
      Math.random() / 3 + 0.4,
    );
  }
};

Wave.prototype.makeWave = function () {
  var i = 0;
  for (i = 0; i < this.totalPoints; i++) {
    this.points[i].targetY = 200 + Math.random() * 200;
    this.points[i].speed = Math.random() * 1.2 + 1;
  }
};

Wave.prototype.goBack = function () {
  var i = 0;
  for (i = 0; i < this.totalPoints; i++) {
    this.points[i].targetY = 0;
    this.points[i].speed = Math.random() * 2 + 0.4;
  }
};

Wave.prototype.resetWave = function () {
  var i = 0;
  this.isResetWave = true;
  for (i = 0; i < this.totalPoints; i++) {
    this.points[i].y = 0;
    this.points[i].targetY = this.stageHeight;
    this.points[i].speed = Math.random() * 1.2 + 1;
  }
};

Wave.prototype.draw = function (ctx) {
  var i = 0;
  var j = 0;
  var k = 0;
  var trail = null;
  var arrivedCount = 0;
  var trailPoints = [];

  if (this.delay > 0) {
    this.delay--;
    return;
  }

  for (i = this.trails.length - 1; i >= 0; i--) {
    trail = this.trails[i];
    this.drawWave(ctx, trail.points, trail.alpha, this.color);
    trail.alpha -= 0.001;
    if (trail.alpha <= 0) {
      this.trails.splice(i, 1);
    }
  }

  for (j = 0; j < this.totalPoints; j++) {
    if (this.points[j].y === this.points[j].targetY) {
      arrivedCount++;
    }
    this.points[j].update();
  }

  this.drawWave(ctx, this.points, 0.99, this.color);

  if (arrivedCount === this.totalPoints) {
    for (k = 0; k < this.totalPoints; k++) {
      trailPoints.push({ x: this.points[k].x, y: this.points[k].y });
    }
    if (this.isResetWave) {
      this.resetFinished = true;
      this.isResetWave = false;
      return;
    }
    this.trails.push({ points: trailPoints, alpha: 0.5 });
    if (this.isBack === false) {
      this.goBack();
      this.isBack = true;
    } else {
      this.makeWave();
      this.isBack = false;
    }
  }
};

Wave.prototype.drawWave = function (ctx, points, alpha, waveColor) {
  var prevX = points[0].x;
  var prevY = points[0].y;
  var i = 1;
  var cx = 0;
  var cy = 0;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.moveTo(prevX, prevY);
  ctx.fillStyle = waveColor;

  for (i = 1; i < this.totalPoints; i++) {
    cx = (prevX + points[i].x) / 2;
    cy = (prevY + points[i].y) / 2;
    ctx.quadraticCurveTo(prevX, prevY, cx, cy);
    prevX = points[i].x;
    prevY = points[i].y;
  }
  ctx.lineTo(prevX, prevY);
  ctx.lineTo(this.stageWidth, 0);
  ctx.lineTo(0, 0);
  ctx.fill();
  ctx.closePath();
  ctx.restore();
};

// 5. WaveGroup 클래스
function WaveGroup() {
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
  this.hasTriggeredClear = false;
  this.tubes = [];
}

WaveGroup.prototype.resize = function (stageWidth, stageHeight) {
  var i = 0;
  this.stageWidth = stageWidth;
  this.stageHeight = stageHeight;
  for (i = 0; i < this.totalWaves; i++) {
    this.waves[i].resize(this.stageWidth, this.stageHeight);
  }
};

WaveGroup.prototype.update = function () {
  var i = 0;
  var tube = null;
  for (i = this.tubes.length - 1; i >= 0; i--) {
    tube = this.tubes[i];
    tube.update(this.isResetting);
    if (tube.isOut()) {
      this.tubes.splice(i, 1);
    }
  }
};

WaveGroup.prototype.draw = function (ctx, waveReset) {
  var i = 0;
  var j = 0;
  var k = 0;
  var m = 0;
  var n = 0;
  var p = 0;
  var radius = 50;
  var x = 0;
  var y = -30;
  var closestPoint = null;
  var closestDistance = 999999;
  var point = null;
  var distance = 0;
  var anyResetting = false;

  for (i = 0; i < this.waves.length; i++) {
    this.waves[i].draw(ctx);
  }

  for (j = 0; j < this.tubes.length; j++) {
    this.tubes[j].draw(ctx);
  }

  if (waveReset && !this.isResetting) {
    this.isResetting = true;
    this.hasTriggeredClear = false;
    for (k = 0; k < this.totalWaves; k++) {
      this.waves[k].resetWave();
    }
    x = Math.random() * (this.stageWidth - radius * 2) + radius;

    if (this.waves[2] && this.waves[2].points) {
      for (m = 0; m < this.waves[2].points.length; m++) {
        point = this.waves[2].points[m];
        distance = Math.abs(x - point.x);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestPoint = point;
        }
      }
    }
    this.tubes.push(new Tube(x, y, radius, closestPoint));
  }

  this.resetFinished = false;

  if (this.isResetting) {
    for (n = 0; n < this.totalWaves; n++) {
      if (this.waves[n].resetFinished) {
        if (!this.hasTriggeredClear) {
          this.resetFinished = true;
          this.hasTriggeredClear = true;
        }
        this.waves[n].resetFinished = false;
      }
    }

    anyResetting = false;
    for (p = 0; p < this.totalWaves; p++) {
      if (this.waves[p].isResetWave) {
        anyResetting = true;
        break;
      }
    }

    if (!anyResetting) {
      this.isResetting = false;
    }
  }
};

// 6. App 클래스
function App() {
  var self = this;

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

  function onResize() {
    self.resize();
  }

  function onFrame(t) {
    self.animate(t);
  }

  this.onFrameCallback = onFrame;

  window.addEventListener("resize", onResize, false);

  this.resize();

  window.requestAnimationFrame(this.onFrameCallback);
}

App.prototype.resize = function () {
  this.stageWidth = window.innerWidth || document.body.clientWidth || 800;
  this.stageHeight = window.innerHeight || document.body.clientHeight || 600;

  this.waveCanvas.width = this.stageWidth * 2;
  this.waveCanvas.height = this.stageHeight * 2;
  this.waveCtx.scale(2, 2);

  this.drawCanvas.width = this.stageWidth * 2;
  this.drawCanvas.height = this.stageHeight * 2;
  this.drawCtx.scale(2, 2);

  this.waveGroup.resize(this.stageWidth, this.stageHeight);
  this.drawing.resize(this.stageWidth, this.stageHeight);
};

App.prototype.animate = function (t) {
  var waveReset = false;
  var idleTime = 0;
  var now = new Date().getTime();

  if (this.drawing.hasDrawn === true) {
    idleTime = now - this.drawing.lastDrawTime;
    waveReset = idleTime > 5000;
  }

  this.waveCtx.clearRect(0, 0, this.stageWidth, this.stageHeight);
  this.waveGroup.update();
  this.waveGroup.draw(this.waveCtx, waveReset);

  if (this.waveGroup.resetFinished) {
    this.drawing.clear();
    this.waveGroup.resetFinished = false;
  }

  window.requestAnimationFrame(this.onFrameCallback);
};

window.onload = function () {
  new App();
};

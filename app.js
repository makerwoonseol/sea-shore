// 0. requestAnimationFrame 폴리필
window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  function (callback) {
    return setTimeout(callback, 16);
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
    this.y = this.y + this.speed * 2;
    if (this.y > this.targetY) {
      this.y = this.targetY;
    }
  } else if (this.y > this.targetY) {
    this.y = this.y - this.speed;
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
    this.y = this.y + 1.8;
  } else {
    this.y = this.y - speedVal * 0.9;
  }
  this.time = this.time + 0.02;
  this.rotation = Math.sin(this.time) * 0.2;
};

Tube.prototype.isOut = function () {
  var totalY = this.y + this.radius * 2;
  return totalY < 0;
};

// 경량화된 그림자 계산
Tube.prototype.drawShadowRing = function (ctx) {
  var outer = this.radius + 3;
  var inner = 28;
  var deg = 0;
  var rad = 0;
  var noise = 0;
  var r = 0;

  ctx.beginPath();
  for (deg = 0; deg <= 360; deg = deg + 20) {
    // 연산 주기 20도로 완화 (경량화)
    rad = deg * Math.PI * 0.005555555555555556;
    noise = Math.sin(rad * 5 + this.time * 2.5) * 2;
    r = outer + noise;
    if (deg === 0) {
      ctx.moveTo(Math.cos(rad) * r, Math.sin(rad) * r);
    } else {
      ctx.lineTo(Math.cos(rad) * r, Math.sin(rad) * r);
    }
  }
  ctx.closePath();

  for (deg = 360; deg >= 0; deg = deg - 20) {
    rad = deg * Math.PI * 0.005555555555555556;
    r = inner + Math.sin(rad * 4 + this.time * 1.7) * 1.5;
    ctx.lineTo(Math.cos(rad) * r, Math.sin(rad) * r);
  }
  ctx.closePath();
  ctx.fill();
};

Tube.prototype.draw = function (ctx) {
  var PI = Math.PI;
  var sector = PI * 0.16666666666666666;

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
  ctx.arc(0, 0, this.radius, 0, PI * 2, false);
  ctx.arc(0, 0, 28, 0, PI * 2, true);
  ctx.clip();

  ctx.fillStyle = "#F2360C";
  ctx.beginPath();
  ctx.arc(0, 0, this.radius, 0, PI * 2, false);
  ctx.fill();

  ctx.fillStyle = "#F2F2F2";

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, this.radius, 0, sector, false);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, this.radius, PI, PI + sector, false);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, this.radius, -PI * 0.5, -PI * 0.5 + sector, false);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, this.radius, PI * 0.5, PI * 0.5 + sector, false);
  ctx.fill();

  ctx.restore();
};

// 3. Drawing 클래스
var globalDrawingInstance = null;

function getEventPos(e) {
  if (e.touches && e.touches.length > 0) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  if (e.changedTouches && e.changedTouches.length > 0) {
    return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
  }
  return { x: e.clientX || 0, y: e.clientY || 0 };
}

function handleStart(event) {
  if (!globalDrawingInstance) return;
  globalDrawingInstance.isDrawing = true;
  var pos = getEventPos(event);
  globalDrawingInstance.mouse.x = pos.x;
  globalDrawingInstance.mouse.y = pos.y;
  globalDrawingInstance.lastMouse.x = pos.x;
  globalDrawingInstance.lastMouse.y = pos.y;
}

function handleMove(event) {
  if (!globalDrawingInstance) return;
  var pos = getEventPos(event);
  globalDrawingInstance.mouse.x = pos.x;
  globalDrawingInstance.mouse.y = pos.y;
  if (globalDrawingInstance.isDrawing === true) {
    var dx = globalDrawingInstance.mouse.x - globalDrawingInstance.lastMouse.x;
    var dy = globalDrawingInstance.mouse.y - globalDrawingInstance.lastMouse.y;
    for (var i = 0; i <= 5; i = i + 1) {
      // 브러시 루프 5회로 단축
      var x = globalDrawingInstance.lastMouse.x + dx * 0.2 * i;
      var y = globalDrawingInstance.lastMouse.y + dy * 0.2 * i;
      globalDrawingInstance.drawBrush(x, y);
    }
  }
  globalDrawingInstance.lastMouse.x = globalDrawingInstance.mouse.x;
  globalDrawingInstance.lastMouse.y = globalDrawingInstance.mouse.y;
}

function handleEnd() {
  if (!globalDrawingInstance) return;
  globalDrawingInstance.isDrawing = false;
}

function Drawing(ctx) {
  this.ctx = ctx;
  this.hasDrawn = false;
  this.lastDrawTime = 0;
  this.mouse = { x: 0, y: 0 };
  this.lastMouse = { x: 0, y: 0 };
  this.isDrawing = false;

  globalDrawingInstance = this;

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
  var px = x + Math.random() * 14 - 7;
  var py = y + Math.random() * 14 - 7;

  this.hasDrawn = true;
  this.lastDrawTime = new Date().getTime();

  this.ctx.beginPath();
  this.ctx.arc(px, py, Math.random() * 2 + 0.5, 0, Math.PI * 2, false);
  this.ctx.fillStyle = "#e8dfc8";
  this.ctx.fill();
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
  var count = this.totalPoints - 1;
  this.pointGap = this.stageWidth / count;
  this.init();
};

Wave.prototype.init = function () {
  var i = 0;
  this.points = [];
  for (i = 0; i < this.totalPoints; i = i + 1) {
    this.points[i] = new Point(
      this.index + i,
      this.pointGap * i,
      0,
      Math.random() * 0.333 + 0.4,
    );
  }
};

Wave.prototype.makeWave = function () {
  var i = 0;
  for (i = 0; i < this.totalPoints; i = i + 1) {
    this.points[i].targetY = 200 + Math.random() * 200;
    this.points[i].speed = Math.random() * 1.2 + 1;
  }
};

Wave.prototype.goBack = function () {
  var i = 0;
  for (i = 0; i < this.totalPoints; i = i + 1) {
    this.points[i].targetY = 0;
    this.points[i].speed = Math.random() * 2 + 0.4;
  }
};

Wave.prototype.resetWave = function () {
  var i = 0;
  this.isResetWave = true;
  for (i = 0; i < this.totalPoints; i = i + 1) {
    this.points[i].y = 0;
    this.points[i].targetY = this.stageHeight;
    this.points[i].speed = Math.random() * 1.2 + 1;
  }
};

Wave.prototype.draw = function (ctx) {
  var i = 0;
  var j = 0;
  var k = 0;
  var arrivedCount = 0;
  var trailPoints = [];

  if (this.delay > 0) {
    this.delay = this.delay - 1;
    return;
  }

  // 잔상 최대 3개로 제한 (메모리 누수 방지)
  if (this.trails.length > 3) {
    this.trails.shift();
  }

  for (i = this.trails.length - 1; i >= 0; i = i - 1) {
    var trail = this.trails[i];
    this.drawWave(ctx, trail.points, trail.alpha, this.color);
    trail.alpha = trail.alpha - 0.002;
    if (trail.alpha <= 0) {
      this.trails.splice(i, 1);
    }
  }

  for (j = 0; j < this.totalPoints; j = j + 1) {
    if (this.points[j].y === this.points[j].targetY) {
      arrivedCount = arrivedCount + 1;
    }
    this.points[j].update();
  }

  this.drawWave(ctx, this.points, 0.99, this.color);

  // 핵심 수정: 도착 시 무한 실행 및 메모리 누수 방지
  if (arrivedCount === this.totalPoints) {
    if (this.isResetWave) {
      this.resetFinished = true;
      this.isResetWave = false;
      this.makeWave(); // 바닥 도착 후 상태를 재설정하여 무한 루프 차단!
      return;
    }

    for (k = 0; k < this.totalPoints; k = k + 1) {
      trailPoints.push({ x: this.points[k].x, y: this.points[k].y });
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

  for (i = 1; i < this.totalPoints; i = i + 1) {
    cx = (prevX + points[i].x) * 0.5;
    cy = (prevY + points[i].y) * 0.5;
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
  for (i = 0; i < this.totalWaves; i = i + 1) {
    this.waves[i].resize(this.stageWidth, this.stageHeight);
  }
};

WaveGroup.prototype.update = function () {
  var i = 0;
  for (i = this.tubes.length - 1; i >= 0; i = i - 1) {
    var tube = this.tubes[i];
    tube.update(this.isResetting);
    if (tube.isOut()) {
      this.tubes.splice(i, 1);
    }
  }
};

WaveGroup.prototype.draw = function (ctx, waveReset) {
  var i = 0;
  var radius = 50;
  var availWidth = 0;
  var x = 0;
  var y = -30;

  for (i = 0; i < this.waves.length; i = i + 1) {
    this.waves[i].draw(ctx);
  }

  for (i = 0; i < this.tubes.length; i = i + 1) {
    this.tubes[i].draw(ctx);
  }

  if (waveReset && !this.isResetting) {
    this.isResetting = true;
    this.hasTriggeredClear = false;
    for (i = 0; i < this.totalWaves; i = i + 1) {
      this.waves[i].resetWave();
    }

    availWidth = this.stageWidth - radius * 2;
    x = Math.random() * availWidth + radius;
    this.tubes.push(new Tube(x, y, radius, null));
  }

  this.resetFinished = false;

  if (this.isResetting) {
    for (i = 0; i < this.totalWaves; i = i + 1) {
      if (this.waves[i].resetFinished) {
        if (!this.hasTriggeredClear) {
          this.resetFinished = true;
          this.hasTriggeredClear = true;
        }
        this.waves[i].resetFinished = false;
      }
    }

    var anyResetting = false;
    for (i = 0; i < this.totalWaves; i = i + 1) {
      if (this.waves[i].isResetWave) {
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
var globalAppInstance = null;

function onAppResize() {
  if (globalAppInstance) globalAppInstance.resize();
}

function onAppFrame(t) {
  if (globalAppInstance) globalAppInstance.animate(t);
}

function App() {
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

  globalAppInstance = this;

  window.addEventListener("resize", onAppResize, false);
  this.resize();

  window.requestAnimationFrame(onAppFrame);
}

// 1배율 표준 해상도로 전면 변경 (메모리 사용량 75% 감소)
App.prototype.resize = function () {
  var w = window.innerWidth || document.body.clientWidth || 800;
  var h = window.innerHeight || document.body.clientHeight || 600;
  this.stageWidth = w;
  this.stageHeight = h;

  this.waveCanvas.width = this.stageWidth;
  this.waveCanvas.height = this.stageHeight;

  this.drawCanvas.width = this.stageWidth;
  this.drawCanvas.height = this.stageHeight;

  this.waveGroup.resize(this.stageWidth, this.stageHeight);
  this.drawing.resize(this.stageWidth, this.stageHeight);
};

App.prototype.animate = function (t) {
  var waveReset = false;
  var now = new Date().getTime();

  if (this.drawing.hasDrawn === true) {
    var idleTime = now - this.drawing.lastDrawTime;
    waveReset = idleTime > 5000;
  }

  this.waveCtx.clearRect(0, 0, this.stageWidth, this.stageHeight);
  this.waveGroup.update();
  this.waveGroup.draw(this.waveCtx, waveReset);

  if (this.waveGroup.resetFinished) {
    this.drawing.clear();
    this.waveGroup.resetFinished = false;
  }

  window.requestAnimationFrame(onAppFrame);
};

window.onload = function () {
  new App();
};

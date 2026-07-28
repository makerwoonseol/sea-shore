// ==========================================
// 0. 아이패드 온스크린 에러 디버거 (최상단)
// ==========================================
window.onerror = function (msg, url, line, col, error) {
  var div = document.getElementById("debug-log");
  if (!div) {
    div = document.createElement("div");
    div.id = "debug-log";
    div.style.cssText =
      "position:fixed;top:0;left:0;width:100%;height:120px;background:rgba(0,0,0,0.85);color:#ff5555;z-index:99999;font-size:12px;overflow:auto;padding:8px;box-sizing:border-box;font-family:monospace;";
    document.body.appendChild(div);
  }
  div.innerHTML +=
    '<div style="margin-bottom:4px;">[Error] ' +
    msg +
    " (Line: " +
    line +
    ")</div>";
  return false;
};

// requestAnimationFrame 대응
window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  function (callback) {
    return setTimeout(callback, 1000 / 60);
  };

// ==========================================
// 1. Point 클래스
// ==========================================
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
    if (this.y > this.targetY) this.y = this.targetY;
  } else if (this.y > this.targetY) {
    this.y -= this.speed;
    if (this.y < this.targetY) this.y = this.targetY;
  }
};

// ==========================================
// 2. Tube 클래스
// ==========================================
function Tube(x, y, radius, point) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.point = point;
  this.time = 0;
  this.rotation = 0;
}

Tube.prototype.update = function (isResetting) {
  if (isResetting) {
    this.y += 2 * 0.9;
  } else {
    this.y -= (this.point ? this.point.speed : 1) * 0.9;
  }
  this.time += 0.02;
  this.rotation = Math.sin(this.time) * 0.2;
};

Tube.prototype.isOut = function () {
  return this.y + this.radius * 2 < 0;
};

Tube.prototype.drawShadowRing = function (ctx) {
  var outer = this.radius + 3;
  var inner = 28;

  ctx.beginPath();
  for (var deg = 0; deg <= 360; deg += 6) {
    var rad = (deg * Math.PI) / 180;
    var noise =
      Math.sin(rad * 5 + this.time * 2.5) * 2 +
      Math.sin(rad * 8 - this.time * 3.2) * 1.2;
    var r = outer + noise;
    var x = Math.cos(rad) * r;
    var y = Math.sin(rad) * r;

    if (deg === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();

  for (var deg = 360; deg >= 0; deg -= 6) {
    var rad = (deg * Math.PI) / 180;
    var noise = Math.sin(rad * 4 + this.time * 1.7) * 1.5;
    var r = inner + noise;
    var x = Math.cos(rad) * r;
    var y = Math.sin(rad) * r;

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

  if ("filter" in ctx) {
    ctx.filter = "blur(10px)";
  }

  this.drawShadowRing(ctx);
  ctx.restore();

  if ("filter" in ctx) {
    ctx.filter = "none";
  }
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

// ==========================================
// 3. Drawing 클래스
// ==========================================
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
    var t =
      e.touches && e.touches.length > 0
        ? e.touches[0]
        : e.changedTouches && e.changedTouches.length > 0
          ? e.changedTouches[0]
          : null;
    if (t) {
      return { x: t.clientX, y: t.clientY };
    }
    return { x: e.clientX || 0, y: e.clientY || 0 };
  }

  var onStart = function (event) {
    self.isDrawing = true;
    var pos = getPos(event);
    self.mouse.x = pos.x;
    self.mouse.y = pos.y;
    self.lastMouse.x = pos.x;
    self.lastMouse.y = pos.y;
  };

  var onMove = function (event) {
    var pos = getPos(event);
    self.mouse.x = pos.x;
    self.mouse.y = pos.y;
    if (self.isDrawing === true) {
      var dx = self.mouse.x - self.lastMouse.x;
      var dy = self.mouse.y - self.lastMouse.y;
      for (var i = 0; i <= 10; i++) {
        var x = self.lastMouse.x + (dx / 10) * i;
        var y = self.lastMouse.y + (dy / 10) * i;
        self.drawBrush(x, y);
      }
    }
    self.lastMouse.x = self.mouse.x;
    self.lastMouse.y = self.mouse.y;
  };

  var onEnd = function () {
    self.isDrawing = false;
  };

  window.addEventListener("mousedown", onStart);
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onEnd);

  window.addEventListener("touchstart", onStart);
  window.addEventListener("touchmove", onMove);
  window.addEventListener("touchend", onEnd);
}

Drawing.prototype.resize = function (stageWidth, stageHeight) {
  this.stageWidth = stageWidth;
  this.stageHeight = stageHeight;
};

Drawing.prototype.drawBrush = function (x, y) {
  for (var i = 0; i <= 10; i++) {
    var px = x + Math.random() * 20 - 10;
    var py = y + Math.random() * 20 - 10;
    var radius = 10;
    var dx = px - x;
    var dy = py - y;
    this.hasDrawn = true;
    this.lastDrawTime = Date.now();
    if (dx * dx + dy * dy <= radius * radius) {
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

// ==========================================
// 4. Wave 클래스
// ==========================================
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
  this.points = [];
  for (var i = 0; i < this.totalPoints; i++) {
    this.points[i] = new Point(
      this.index + i,
      this.pointGap * i,
      0,
      Math.random() / 3 + 0.4,
    );
  }
};

Wave.prototype.makeWave = function () {
  for (var i = 0; i < this.totalPoints; i++) {
    this.points[i].targetY = 200 + Math.random() * 200;
    this.points[i].speed = Math.random() * 1.2 + 1;
  }
};

Wave.prototype.goBack = function () {
  for (var i = 0; i < this.totalPoints; i++) {
    this.points[i].targetY = 0;
    this.points[i].speed = Math.random() * 2 + 0.4;
  }
};

Wave.prototype.resetWave = function () {
  this.isResetWave = true;
  for (var i = 0; i < this.totalPoints; i++) {
    this.points[i].y = 0;
    this.points[i].targetY = this.stageHeight;
    this.points[i].speed = Math.random() * 1.2 + 1;
  }
};

Wave.prototype.draw = function (ctx) {
  if (this.delay > 0) {
    this.delay--;
    return;
  }
  for (var i = this.trails.length - 1; i >= 0; i--) {
    var trail = this.trails[i];
    this.drawWave(ctx, trail.points, trail.alpha, this.color);
    trail.alpha -= 0.001;
    if (trail.alpha <= 0) {
      this.trails.splice(i, 1);
    }
  }
  var arrivedCount = 0;
  for (var j = 0; j < this.totalPoints; j++) {
    if (this.points[j].y === this.points[j].targetY) {
      arrivedCount++;
    }
    this.points[j].update();
  }

  this.drawWave(ctx, this.points, 0.99, this.color);

  if (arrivedCount === this.totalPoints) {
    var trailPoints = [];
    for (var k = 0; k < this.totalPoints; k++) {
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
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  var prevX = points[0].x;
  var prevY = points[0].y;
  ctx.moveTo(prevX, prevY);
  ctx.fillStyle = waveColor;
  for (var i = 1; i < this.totalPoints; i++) {
    var cx = (prevX + points[i].x) / 2;
    var cy = (prevY + points[i].y) / 2;
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

// ==========================================
// 5. WaveGroup 클래스
// ==========================================
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
  this.stageWidth = stageWidth;
  this.stageHeight = stageHeight;
  for (var i = 0; i < this.totalWaves; i++) {
    this.waves[i].resize(this.stageWidth, this.stageHeight);
  }
};

WaveGroup.prototype.update = function () {
  for (var i = this.tubes.length - 1; i >= 0; i--) {
    var tube = this.tubes[i];
    tube.update(this.isResetting);
    if (tube.isOut()) {
      this.tubes.splice(i, 1);
    }
  }
};

WaveGroup.prototype.draw = function (ctx, waveReset) {
  for (var i = 0; i < this.waves.length; i++) {
    this.waves[i].draw(ctx);
  }

  for (var j = 0; j < this.tubes.length; j++) {
    this.tubes[j].draw(ctx);
  }

  if (waveReset && !this.isResetting) {
    this.isResetting = true;
    this.hasTriggeredClear = false;
    for (var k = 0; k < this.totalWaves; k++) {
      this.waves[k].resetWave();
    }
    var radius = 50;
    var x = Math.random() * (this.stageWidth - radius * 2) + radius;
    var y = -60 / 2;
    var closestPoint = null;
    var closestDistance = Infinity;

    if (this.waves[2] && this.waves[2].points) {
      for (var m = 0; m < this.waves[2].points.length; m++) {
        var point = this.waves[2].points[m];
        var distance = Math.abs(x - point.x);
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
    for (var n = 0; n < this.totalWaves; n++) {
      if (this.waves[n].resetFinished) {
        if (!this.hasTriggeredClear) {
          this.resetFinished = true;
          this.hasTriggeredClear = true;
        }
        this.waves[n].resetFinished = false;
      }
    }

    var anyResetting = false;
    for (var p = 0; p < this.totalWaves; p++) {
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

// ==========================================
// 6. App 클래스
// ==========================================
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

  var self = this;
  window.addEventListener(
    "resize",
    function () {
      self.resize();
    },
    false,
  );
  this.resize();

  requestAnimationFrame(function (t) {
    self.animate(t);
  });
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
  var self = this;
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

  requestAnimationFrame(function (t) {
    self.animate(t);
  });
};

window.onload = function () {
  new App();
};

// Parallax background: sky, hills, clouds, castle.

export class Background {
  constructor(worldW, worldH) {
    this.worldW = worldW;
    this.worldH = worldH;

    this.clouds = [
      { x: 120, y: 60, s: 1.0 },
      { x: 420, y: 90, s: 0.8 },
      { x: 780, y: 50, s: 1.2 },
      { x: 1100, y: 100, s: 0.9 },
      { x: 1500, y: 70, s: 1.1 },
      { x: 1820, y: 110, s: 0.7 },
    ];
    this.hills = [
      { x: 60, y: 420, s: 1.0 },
      { x: 540, y: 420, s: 1.3 },
      { x: 1100, y: 420, s: 0.9 },
      { x: 1600, y: 420, s: 1.1 },
    ];
  }

  draw(ctx, cameraX) {
    // Sky gradient already on canvas bg; draw sun
    ctx.fillStyle = "#fff7a8";
    ctx.beginPath();
    ctx.arc(820, 90, 38, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 247, 168, 0.35)";
    ctx.beginPath();
    ctx.arc(820, 90, 54, 0, Math.PI * 2);
    ctx.fill();

    // Far hills (slow parallax)
    for (const h of this.hills) {
      const hx = h.x - cameraX * 0.4;
      this._drawHill(ctx, hx, h.y, h.s);
    }

    // Clouds (medium parallax)
    for (const c of this.clouds) {
      const cx = c.x - cameraX * 0.6;
      this._drawCloud(ctx, cx, c.y, c.s);
    }

    // Castle at far right
    const castleX = this.worldW - 220 - cameraX;
    this._drawCastle(ctx, castleX, 300);
  }

  _drawHill(ctx, x, y, s) {
    const w = 260 * s;
    const h = 90 * s;
    ctx.fillStyle = "#00a800";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + w / 2, y - h, x + w, y);
    ctx.closePath();
    ctx.fill();
    // shading
    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y - h + 4);
    ctx.quadraticCurveTo(x + w * 0.75, y - h / 2, x + w, y);
    ctx.lineTo(x + w / 2, y);
    ctx.closePath();
    ctx.fill();
  }

  _drawCloud(ctx, x, y, s) {
    ctx.fillStyle = "#ffffff";
    const r = 16 * s;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.arc(x + r, y - r * 0.6, r * 1.2, 0, Math.PI * 2);
    ctx.arc(x + r * 2.4, y - r * 0.2, r, 0, Math.PI * 2);
    ctx.arc(x + r * 3.2, y + r * 0.2, r * 0.9, 0, Math.PI * 2);
    ctx.fill();
  }

  _drawCastle(ctx, x, y) {
    // Main keep
    ctx.fillStyle = "#e6e6e6";
    ctx.fillRect(x, y, 160, 140);
    // Battlements
    ctx.fillStyle = "#e6e6e6";
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(x + i * 32 + 4, y - 14, 20, 14);
    }
    // Door
    ctx.fillStyle = "#3a1c05";
    ctx.fillRect(x + 62, y + 80, 36, 60);
    // Door arch
    ctx.beginPath();
    ctx.arc(x + 80, y + 80, 18, Math.PI, 0);
    ctx.fill();
    // Windows
    ctx.fillStyle = "#1b1b1b";
    ctx.fillRect(x + 24, y + 40, 16, 22);
    ctx.fillRect(x + 120, y + 40, 16, 22);
    // Flag pole
    ctx.fillStyle = "#444";
    ctx.fillRect(x + 78, y - 60, 2, 50);
    // Flag
    ctx.fillStyle = "#e52521";
    ctx.beginPath();
    ctx.moveTo(x + 80, y - 58);
    ctx.lineTo(x + 110, y - 48);
    ctx.lineTo(x + 80, y - 38);
    ctx.closePath();
    ctx.fill();
  }
}

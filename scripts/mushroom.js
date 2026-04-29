const GRAVITY = 0.5;
const SPEED   = 1.8;

export class Mushroom {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 28;
    this.h = 28;
    this.vx = SPEED;
    this.vy = 0;
    this.collected = false;
    this._rising = true;
    this._riseAmt = 0;
  }

  get left()   { return this.x; }
  get right()  { return this.x + this.w; }
  get top()    { return this.y; }
  get bottom() { return this.y + this.h; }
  get removable() { return this.collected; }

  collect() { this.collected = true; }

  update(platforms, worldW, worldH) {
    if (this.collected) return;

    // Rise animation: floats up out of the block before moving
    if (this._rising) {
      this._riseAmt += 1.5;
      this.y -= 1.5;
      if (this._riseAmt >= 32) this._rising = false;
      return;
    }

    this.vy += GRAVITY;
    if (this.vy > 12) this.vy = 12;

    this.x += this.vx;
    if (this.x < 0)                  { this.x = 0;              this.vx *= -1; }
    if (this.x + this.w > worldW)    { this.x = worldW - this.w; this.vx *= -1; }

    for (const p of platforms) {
      if (this._overlaps(p)) {
        if (this.vx > 0) { this.x = p.left - this.w; this.vx *= -1; }
        else             { this.x = p.right;          this.vx *= -1; }
      }
    }

    this.y += this.vy;
    for (const p of platforms) {
      if (this._overlaps(p)) {
        if (this.vy > 0) { this.y = p.top - this.h;  this.vy = 0; }
        else             { this.y = p.bottom;          this.vy = 0; }
      }
    }

    if (this.y > worldH + 100) this.collected = true;
  }

  _overlaps(p) {
    return this.right  > p.left  && this.left < p.right &&
           this.bottom > p.top   && this.top  < p.bottom;
  }

  draw(ctx) {
    if (this.collected) return;
    ctx.save();
    ctx.translate(Math.round(this.x), Math.round(this.y));

    // Stem / face
    ctx.fillStyle = "#fcd7bd";
    ctx.fillRect(4, 16, 20, 12);
    ctx.fillStyle = "#000";
    ctx.fillRect(7,  19, 4, 5);
    ctx.fillRect(17, 19, 4, 5);
    ctx.fillStyle = "#fff";
    ctx.fillRect(9,  20, 2, 2);
    ctx.fillRect(19, 20, 2, 2);

    // Red cap
    ctx.fillStyle = "#e52521";
    ctx.fillRect(0,  4, 28, 14);
    ctx.fillRect(4,  1, 20,  4);
    ctx.fillRect(8,  0, 12,  2);
    // White spots
    ctx.fillStyle = "#fff";
    ctx.fillRect(2,  7, 6, 6);
    ctx.fillRect(11, 4, 5, 5);
    ctx.fillRect(20, 7, 6, 6);

    ctx.restore();
  }
}

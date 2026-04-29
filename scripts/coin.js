export class Coin {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 16;
    this.h = 22;
    this.collected = false;
    this._t = Math.floor(Math.random() * 64);
  }

  get left()   { return this.x; }
  get right()  { return this.x + this.w; }
  get top()    { return this.y; }
  get bottom() { return this.y + this.h; }
  get removable() { return this.collected; }

  collect() { this.collected = true; }

  draw(ctx) {
    if (this.collected) return;
    this._t++;
    const spin = Math.abs(Math.cos(this._t * 0.09));
    const cw   = Math.max(2, Math.round(10 * spin));
    const cx   = Math.round(this.x + (this.w - cw) * 0.5);
    const cy   = Math.round(this.y);

    ctx.fillStyle = "#ffd700";
    ctx.fillRect(cx + 1, cy,     cw - 2, this.h);
    ctx.fillRect(cx,     cy + 3, cw,     this.h - 6);

    if (cw >= 4) {
      ctx.fillStyle = "#fff0a0";
      ctx.fillRect(cx + 1, cy + 4, Math.max(1, Math.floor(cw * 0.35)), this.h - 10);
    }
  }
}

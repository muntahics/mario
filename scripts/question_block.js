export class QuestionBlock {
  constructor(x, y, content = "coin") {
    this.x = x;
    this.y = y;
    this.w = 32;
    this.h = 32;
    this.content = content;
    this.used = false;
    this._bounceOffset = 0;
    this._bouncing = false;
    this._bounceDir = -1;
    this._t = 0;
  }

  get left()   { return this.x; }
  get right()  { return this.x + this.w; }
  get top()    { return this.y; }            // collision uses fixed position
  get bottom() { return this.y + this.h; }

  get removable() { return false; }

  update() {
    this._t++;
    if (!this._bouncing) return;
    this._bounceOffset += this._bounceDir * 2;
    if (this._bounceOffset <= -10) this._bounceDir = 1;
    if (this._bounceOffset >= 0) {
      this._bounceOffset = 0;
      this._bouncing = false;
      this._bounceDir = -1;
    }
  }

  // Returns "coin" | "mushroom" on first activation, null if already used.
  activate() {
    if (this.used) return null;
    this.used = true;
    this._bouncing = true;
    return this.content;
  }

  draw(ctx) {
    const bx = this.x;
    const by = this.y + this._bounceOffset;

    if (this.used) {
      ctx.fillStyle = "#8b7355";
      ctx.fillRect(bx, by, this.w, this.h);
      ctx.fillStyle = "#6b5535";
      ctx.fillRect(bx,              by,                  this.w, 2);
      ctx.fillRect(bx,              by + this.h - 2,     this.w, 2);
      ctx.fillRect(bx,              by,                  2, this.h);
      ctx.fillRect(bx + this.w - 2, by,                  2, this.h);
    } else {
      ctx.fillStyle = "#f0a000";
      ctx.fillRect(bx, by, this.w, this.h);
      ctx.fillStyle = "#c07800";
      ctx.fillRect(bx,              by,                  this.w, 2);
      ctx.fillRect(bx,              by + this.h - 2,     this.w, 2);
      ctx.fillRect(bx,              by,                  2, this.h);
      ctx.fillRect(bx + this.w - 2, by,                  2, this.h);
      ctx.fillStyle = "#ffd700";
      ctx.fillRect(bx + 2, by + 2, this.w - 4, this.h - 4);
      // Flashing ? symbol
      ctx.fillStyle = Math.floor(this._t / 18) % 2 === 0 ? "#ffffff" : "#ffe080";
      ctx.fillRect(bx + 11, by + 5,  10, 3);
      ctx.fillRect(bx + 18, by + 8,   3, 4);
      ctx.fillRect(bx + 11, by + 12, 10, 3);
      ctx.fillRect(bx + 13, by + 21,  6, 4);
    }
  }
}

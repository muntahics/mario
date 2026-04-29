// A static rectangular platform (ground, brick, pipe).

export class Platform {
  constructor(x, y, w, h, type = "ground") {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.type = type; // "ground" | "brick" | "pipe"
  }

  get left()   { return this.x; }
  get right()  { return this.x + this.w; }
  get top()    { return this.y; }
  get bottom() { return this.y + this.h; }

  draw(ctx) {
    switch (this.type) {
      case "ground":
        this._drawGround(ctx);
        break;
      case "brick":
        this._drawBrick(ctx);
        break;
      case "pipe":
        this._drawPipe(ctx);
        break;
    }
  }

  _drawGround(ctx) {
    // Base
    ctx.fillStyle = "#c84c0c";
    ctx.fillRect(this.x, this.y, this.w, this.h);
    // Top edge highlight
    ctx.fillStyle = "#8b3003";
    ctx.fillRect(this.x, this.y, this.w, 6);
    // Brick pattern
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    const tile = 24;
    for (let row = 0; row < Math.ceil(this.h / tile); row++) {
      for (let col = 0; col < Math.ceil(this.w / tile); col++) {
        const offset = row % 2 === 0 ? 0 : tile / 2;
        ctx.fillRect(this.x + col * tile + offset, this.y + row * tile, 1, tile);
      }
      ctx.fillRect(this.x, this.y + row * tile, this.w, 1);
    }
  }

  _drawBrick(ctx) {
    ctx.fillStyle = "#b5651d";
    ctx.fillRect(this.x, this.y, this.w, this.h);
    // Highlight
    ctx.fillStyle = "#d48a3e";
    ctx.fillRect(this.x, this.y, this.w, 3);
    // Shadow
    ctx.fillStyle = "#7a4111";
    ctx.fillRect(this.x, this.y + this.h - 3, this.w, 3);
    // Brick lines
    ctx.fillStyle = "#7a4111";
    const cell = 24;
    for (let r = 0; r < Math.ceil(this.h / cell); r++) {
      ctx.fillRect(this.x, this.y + r * cell, this.w, 1);
      const offset = r % 2 === 0 ? 0 : cell / 2;
      for (let c = 0; c <= Math.ceil(this.w / cell); c++) {
        ctx.fillRect(this.x + c * cell + offset, this.y + r * cell, 1, cell);
      }
    }
  }

  _drawPipe(ctx) {
    // Body
    ctx.fillStyle = "#00a800";
    ctx.fillRect(this.x, this.y, this.w, this.h);
    // Left shine
    ctx.fillStyle = "#55d455";
    ctx.fillRect(this.x + 4, this.y, 6, this.h);
    // Right shadow
    ctx.fillStyle = "#006400";
    ctx.fillRect(this.x + this.w - 10, this.y, 6, this.h);
    // Top lip
    ctx.fillStyle = "#00a800";
    ctx.fillRect(this.x - 6, this.y, this.w + 12, 14);
    ctx.fillStyle = "#55d455";
    ctx.fillRect(this.x - 6, this.y, this.w + 12, 4);
    ctx.fillStyle = "#006400";
    ctx.fillRect(this.x - 6, this.y + 10, this.w + 12, 4);
  }
}

// Princess Peach - the goal. Reaching her triggers a win.

export class Princess {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 28;
    this.h = 48;
    this._t = 0;
  }

  get left()   { return this.x; }
  get right()  { return this.x + this.w; }
  get top()    { return this.y; }
  get bottom() { return this.y + this.h; }

  update(dt) {
    this._t += dt;
  }

  intersects(o) {
    return (
      this.right > o.left &&
      this.left < o.right &&
      this.bottom > o.top &&
      this.top < o.bottom
    );
  }

  draw(ctx) {
    const bob = Math.sin(this._t * 0.005) * 2;
    const px = Math.round(this.x);
    const py = Math.round(this.y + bob);

    ctx.save();
    ctx.translate(px, py);

    // Crown
    ctx.fillStyle = "#ffd166";
    ctx.fillRect(6, 0, 16, 4);
    ctx.fillRect(8, -3, 3, 4);
    ctx.fillRect(13, -4, 3, 5);
    ctx.fillRect(18, -3, 3, 4);
    // Crown jewel
    ctx.fillStyle = "#ff3366";
    ctx.fillRect(13, 1, 3, 2);

    // Hair (blonde)
    ctx.fillStyle = "#f4c430";
    ctx.fillRect(2, 4, 24, 12);
    ctx.fillRect(0, 8, 4, 18);
    ctx.fillRect(24, 8, 4, 18);

    // Face
    ctx.fillStyle = "#fcd7bd";
    ctx.fillRect(6, 8, 16, 12);
    // Eyes
    ctx.fillStyle = "#1b53c2";
    ctx.fillRect(10, 12, 2, 3);
    ctx.fillRect(16, 12, 2, 3);
    // Lips
    ctx.fillStyle = "#d93a5a";
    ctx.fillRect(12, 17, 4, 2);

    // Dress top
    ctx.fillStyle = "#ff9ecf";
    ctx.fillRect(6, 20, 16, 6);
    // Neck gem
    ctx.fillStyle = "#66d9ef";
    ctx.fillRect(13, 20, 2, 2);

    // Dress body (triangle via stacked rects)
    ctx.fillStyle = "#ff9ecf";
    ctx.fillRect(4, 26, 20, 4);
    ctx.fillRect(2, 30, 24, 6);
    ctx.fillRect(0, 36, 28, 8);
    // Dress trim
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 44, 28, 2);

    // Arms
    ctx.fillStyle = "#fcd7bd";
    ctx.fillRect(2, 24, 3, 6);
    ctx.fillRect(23, 24, 3, 6);

    // Help sparkle
    const sparkle = (Math.sin(this._t * 0.008) + 1) * 0.5;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + sparkle * 0.6})`;
    ctx.fillRect(-4, 6, 2, 2);
    ctx.fillRect(30, 10, 2, 2);

    ctx.restore();
  }
}

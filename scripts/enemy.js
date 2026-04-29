// Enemies: Goomba and Koopa Troopa.

const GRAVITY = 0.7;
const GOOMBA_SPEED = 1.2;
const KOOPA_SPEED  = 1.0;
const SHELL_SPEED  = 7.5;
const REVIVE_FRAMES = 320;

export class Goomba {
  constructor(x, y, minX, maxX) {
    this.x = x;
    this.y = y;
    this.w = 32;
    this.h = 30;
    this.vx = -GOOMBA_SPEED;
    this.vy = 0;
    this.minX = minX;
    this.maxX = maxX;
    this.alive = true;
    this.squashTimer = 0;
    this._t = 0;
  }

  get left()   { return this.x; }
  get right()  { return this.x + this.w; }
  get top()    { return this.y; }
  get bottom() { return this.y + this.h; }

  update(platforms, worldH) {
    this._t++;

    if (!this.alive) {
      this.squashTimer--;
      return;
    }

    this.x += this.vx;

    // Reverse at patrol bounds
    if (this.x < this.minX) { this.x = this.minX; this.vx *= -1; }
    if (this.x + this.w > this.maxX) { this.x = this.maxX - this.w; this.vx *= -1; }

    // Wall collision (reverse)
    for (const p of platforms) {
      if (this._overlaps(p)) {
        if (this.vx > 0) this.x = p.left - this.w;
        else if (this.vx < 0) this.x = p.right;
        this.vx *= -1;
      }
    }

    // Gravity + vertical collision
    this.vy += GRAVITY;
    if (this.vy > 15) this.vy = 15;
    this.y += this.vy;

    for (const p of platforms) {
      if (this._overlaps(p)) {
        if (this.vy > 0) {
          this.y = p.top - this.h;
          this.vy = 0;
        } else if (this.vy < 0) {
          this.y = p.bottom;
          this.vy = 0;
        }
      }
    }

    if (this.y > worldH + 100) this.alive = false;
  }

  _overlaps(p) {
    return (
      this.right > p.left &&
      this.left < p.right &&
      this.bottom > p.top &&
      this.top < p.bottom
    );
  }

  stomp() {
    this.alive = false;
    this.squashTimer = 30;
    this.vx = 0;
  }

  get removable() {
    return !this.alive && this.squashTimer <= 0;
  }

  draw(ctx) {
    const px = Math.round(this.x);
    let py = Math.round(this.y);
    let h = this.h;

    // Squashed pose
    if (!this.alive) {
      h = 10;
      py = this.y + this.h - h;
    }

    ctx.save();
    ctx.translate(px, py);

    // Body
    ctx.fillStyle = "#8b4513";
    ctx.fillRect(2, 0, this.w - 4, h - 6);
    ctx.fillRect(0, 4, this.w, h - 10);

    // Belly
    ctx.fillStyle = "#d2a679";
    ctx.fillRect(6, 10, this.w - 12, h - 16);

    if (this.alive) {
      // Eyes
      ctx.fillStyle = "#fff";
      ctx.fillRect(6, 8, 6, 6);
      ctx.fillRect(20, 8, 6, 6);
      ctx.fillStyle = "#000";
      ctx.fillRect(8, 10, 3, 4);
      ctx.fillRect(22, 10, 3, 4);
      // Eyebrows (angry)
      ctx.fillStyle = "#3a1c05";
      ctx.fillRect(5, 5, 7, 2);
      ctx.fillRect(20, 5, 7, 2);
      // Fangs
      ctx.fillStyle = "#fff";
      ctx.fillRect(10, 18, 3, 3);
      ctx.fillRect(19, 18, 3, 3);
    }

    // Feet (animate walk)
    const step = Math.floor(this._t / 10) % 2;
    ctx.fillStyle = "#3a1c05";
    if (this.alive) {
      if (step === 0) {
        ctx.fillRect(0, h - 4, 10, 4);
        ctx.fillRect(this.w - 10, h - 4, 10, 4);
      } else {
        ctx.fillRect(2, h - 4, 10, 4);
        ctx.fillRect(this.w - 12, h - 4, 10, 4);
      }
    } else {
      ctx.fillRect(0, h - 2, this.w, 2);
    }

    ctx.restore();
  }
}

// ─── Koopa Troopa ────────────────────────────────────────────────────────────
// States: "walking" → stomped → "shelled" (stopped) → kicked → "sliding"
// A sliding shell kills other enemies on contact. Stopped shell revives after REVIVE_FRAMES.

export class Koopa {
  constructor(x, y, minX, maxX) {
    this.x = x;
    this.y = y;
    this.w = 30;
    this.h = 40;
    this.vx = -KOOPA_SPEED;
    this.vy = 0;
    this.minX = minX;
    this.maxX = maxX;
    this.state = "walking"; // "walking" | "shelled" | "sliding"
    this.alive = true;
    this._reviveTimer = 0;
    this._squashTimer = 0;
    this._t = 0;
  }

  get left()   { return this.x; }
  get right()  { return this.x + this.w; }
  get top()    { return this.y; }
  get bottom() { return this.y + this.h; }
  get removable() { return !this.alive && this._squashTimer <= 0; }

  // fromRight: true if the player is to the right of the Koopa when kicking
  stomp(fromRight = false) {
    if (this.state === "walking") {
      this.state = "shelled";
      this.vx = 0;
      this._reviveTimer = REVIVE_FRAMES;
    } else if (this.state === "shelled") {
      this.state = "sliding";
      this.vx = fromRight ? -SHELL_SPEED : SHELL_SPEED;
      this._reviveTimer = 0;
    } else {
      // Stomp a sliding shell stops it
      this.state = "shelled";
      this.vx = 0;
      this._reviveTimer = REVIVE_FRAMES;
    }
  }

  kill() {
    this.alive = false;
    this._squashTimer = 30;
    this.vx = 0;
    this.vy = -4;
  }

  update(platforms, worldH) {
    this._t++;
    if (!this.alive) {
      this._squashTimer--;
      this.y += this.vy;
      this.vy += 0.5;
      return;
    }

    if (this.state === "shelled") {
      this._reviveTimer--;
      if (this._reviveTimer <= 0) {
        this.state = "walking";
        this.vx = -KOOPA_SPEED;
      }
    }

    this.x += this.vx;

    if (this.state === "walking") {
      if (this.x < this.minX)              { this.x = this.minX;              this.vx =  Math.abs(this.vx); }
      if (this.x + this.w > this.maxX)     { this.x = this.maxX - this.w;     this.vx = -Math.abs(this.vx); }
    }

    for (const p of platforms) {
      if (!this._overlaps(p)) continue;
      if (this.vx > 0) { this.x = p.left - this.w; if (this.state === "sliding") this.vx *= -1; else this.vx = 0; }
      else if (this.vx < 0) { this.x = p.right;    if (this.state === "sliding") this.vx *= -1; else this.vx = 0; }
    }

    this.vy += GRAVITY;
    if (this.vy > 15) this.vy = 15;
    this.y += this.vy;

    for (const p of platforms) {
      if (!this._overlaps(p)) continue;
      if (this.vy > 0) { this.y = p.top - this.h; this.vy = 0; }
      else             { this.y = p.bottom;         this.vy = 0; }
    }

    if (this.y > worldH + 100) this.alive = false;
  }

  _overlaps(p) {
    return this.right > p.left && this.left < p.right &&
           this.bottom > p.top && this.top < p.bottom;
  }

  draw(ctx) {
    const px = Math.round(this.x);
    const py = Math.round(this.y);
    ctx.save();
    ctx.translate(px, py);

    if (!this.alive) {
      ctx.globalAlpha = Math.max(0, this._squashTimer / 30);
    }

    if (this.state === "walking") {
      const step = Math.floor(this._t / 12) % 2;
      // Shell back
      ctx.fillStyle = "#4a7c2f";
      ctx.fillRect(2, 12, this.w - 4, this.h - 18);
      ctx.fillStyle = "#78b44a";
      ctx.fillRect(4, 14, this.w - 8, this.h - 22);
      ctx.fillStyle = "#3a6020";
      ctx.fillRect(8, 16, 14, 2);
      ctx.fillRect(6, 20, 18, 2);
      ctx.fillRect(8, 24, 14, 2);
      // Head
      ctx.fillStyle = "#78b44a";
      ctx.fillRect(6, 2, 18, 12);
      ctx.fillStyle = "#fff";
      ctx.fillRect(8, 4, 5, 5);
      ctx.fillRect(17, 4, 5, 5);
      ctx.fillStyle = "#000";
      ctx.fillRect(11, 5, 2, 3);
      ctx.fillRect(20, 5, 2, 3);
      // Feet
      ctx.fillStyle = "#f0c060";
      if (step === 0) {
        ctx.fillRect(2,            this.h - 6, 10, 6);
        ctx.fillRect(this.w - 12,  this.h - 6, 10, 6);
      } else {
        ctx.fillRect(0,            this.h - 6, 10, 6);
        ctx.fillRect(this.w - 10,  this.h - 6, 10, 6);
      }
    } else {
      // Shell
      const sh = 28;
      ctx.fillStyle = "#4a7c2f";
      ctx.fillRect(0, 0, this.w, sh);
      ctx.fillStyle = "#78b44a";
      ctx.fillRect(2, 2, this.w - 4, sh - 4);
      ctx.fillStyle = "#3a6020";
      ctx.fillRect(7, 5, 16, 3);
      ctx.fillRect(4, 10, 22, 3);
      ctx.fillRect(7, 16, 16, 3);
      // Rim
      ctx.fillStyle = "#c8a830";
      ctx.fillRect(0, 0, this.w, 2);
      ctx.fillRect(0, sh - 2, this.w, 2);
      ctx.fillRect(0, 0, 2, sh);
      ctx.fillRect(this.w - 2, 0, 2, sh);
      // Warning flash when about to revive
      if (this.state === "shelled" && this._reviveTimer < 80 && Math.floor(this._t / 6) % 2 === 0) {
        ctx.fillStyle = "rgba(255,80,80,0.4)";
        ctx.fillRect(2, 2, this.w - 4, sh - 4);
      }
    }

    ctx.restore();
  }
}

// Mario - the player character.
// Handles movement physics, collision response, and pixel-style drawing.

const GRAVITY = 0.7;
const MOVE_ACCEL = 0.6;
const MAX_SPEED = 4.5;
const FRICTION = 0.82;
const JUMP_POWER = 15;

export class Player {
  constructor(x, y) {
    this.spawnX = x;
    this.spawnY = y;
    this.x = x;
    this.y = y;
    this.w = 32;
    this.h = 44;
    this.vx = 0;
    this.vy = 0;
    this.onGround = false;
    this.facing = 1; // 1 = right, -1 = left
    this.animTime = 0;
    this.dead = false;
    this.big = false;
    this.invincible = 0;    // countdown frames of post-hit invincibility
    this._justJumped = false;
    this.bumpedPlatform = null; // set when head hits a platform/block from below
  }

  get left()   { return this.x; }
  get right()  { return this.x + this.w; }
  get top()    { return this.y; }
  get bottom() { return this.y + this.h; }

  reset() {
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.vx = 0;
    this.vy = 0;
    this.dead = false;
    this.onGround = false;
    this.big = false;
    this.h = 44;
    this.invincible = 0;
  }

  grow() {
    if (this.big) return;
    this.big = true;
    this.y -= 12; // keep feet at same position
    this.h = 56;
  }

  shrink() {
    this.big = false;
    this.y += 12; // keep feet at same position
    this.h = 44;
    this.invincible = 120; // ~2 seconds of invincibility
  }

  update(input, platforms, worldW, worldH) {
    if (this.dead) return;

    this._justJumped = false;
    if (this.invincible > 0) this.invincible--;

    // Horizontal input
    if (input.left) {
      this.vx -= MOVE_ACCEL;
      this.facing = -1;
    }
    if (input.right) {
      this.vx += MOVE_ACCEL;
      this.facing = 1;
    }
    if (!input.left && !input.right) {
      this.vx *= FRICTION;
      if (Math.abs(this.vx) < 0.05) this.vx = 0;
    }
    this.vx = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, this.vx));

    // Jump
    if (input.jump && this.onGround) {
      this.vy = -JUMP_POWER;
      this.onGround = false;
      this._justJumped = true;
    }

    // Gravity
    this.vy += GRAVITY;
    if (this.vy > 18) this.vy = 18;

    // Move + resolve collisions axis-by-axis
    this.x += this.vx;
    this._resolveX(platforms);

    this.y += this.vy;
    this.onGround = false;
    this._resolveY(platforms);

    // World bounds
    if (this.x < 0) { this.x = 0; this.vx = 0; }
    if (this.x + this.w > worldW) { this.x = worldW - this.w; this.vx = 0; }

    // Fell off the world
    if (this.y > worldH + 200) this.dead = true;

    this.animTime += Math.abs(this.vx) * 0.1;
  }

  _resolveX(platforms) {
    for (const p of platforms) {
      if (!this._overlaps(p)) continue;
      if (this.vx > 0) this.x = p.left - this.w;
      else if (this.vx < 0) this.x = p.right;
      this.vx = 0;
    }
  }

  _resolveY(platforms) {
    this.bumpedPlatform = null;
    for (const p of platforms) {
      if (!this._overlaps(p)) continue;
      if (this.vy > 0) {
        this.y = p.top - this.h;
        this.vy = 0;
        this.onGround = true;
      } else if (this.vy < 0) {
        this.y = p.bottom;
        this.vy = 0;
        this.bumpedPlatform = p;
      }
    }
  }

  _overlaps(p) {
    return (
      this.right > p.left &&
      this.left < p.right &&
      this.bottom > p.top &&
      this.top < p.bottom
    );
  }

  /** Bounce up after stomping an enemy. */
  bounce() {
    this.vy = -JUMP_POWER * 0.7;
  }

  draw(ctx) {
    // Flash during invincibility
    if (this.invincible > 0 && Math.floor(this.invincible / 5) % 2 === 0) return;

    const px = Math.round(this.x);
    const py = Math.round(this.y);
    const flip = this.facing === -1;

    ctx.save();
    if (flip) {
      ctx.translate(px + this.w, py);
      ctx.scale(-1, 1);
    } else {
      ctx.translate(px, py);
    }
    // Big Mario: scale the drawing to fill the larger hitbox
    if (this.big) ctx.scale(1, this.h / 44);

    // Walking animation: swap leg positions
    const step = !this.onGround
      ? 2
      : Math.abs(this.vx) > 0.2
      ? Math.floor(this.animTime) % 2
      : 0;

    // --- Mario sprite drawn with rects (approx 32 x 44) ---
    // Hat
    ctx.fillStyle = "#e52521";
    ctx.fillRect(6, 0, 20, 6);
    ctx.fillRect(2, 6, 28, 6);
    // Hat brim
    ctx.fillStyle = "#b01818";
    ctx.fillRect(2, 10, 28, 2);

    // Face/skin
    ctx.fillStyle = "#fcb69f";
    ctx.fillRect(6, 12, 20, 12);
    // Hair sideburns
    ctx.fillStyle = "#6b3410";
    ctx.fillRect(2, 12, 4, 8);
    ctx.fillRect(26, 12, 4, 4);
    // Mustache
    ctx.fillStyle = "#6b3410";
    ctx.fillRect(10, 20, 14, 3);
    // Eye
    ctx.fillStyle = "#000";
    ctx.fillRect(18, 14, 3, 5);

    // Shirt (overalls strap area)
    ctx.fillStyle = "#e52521";
    ctx.fillRect(4, 24, 24, 8);
    // Arms
    ctx.fillStyle = "#e52521";
    ctx.fillRect(0, 24, 4, 10);
    ctx.fillRect(28, 24, 4, 10);
    // Hands
    ctx.fillStyle = "#fcb69f";
    ctx.fillRect(0, 32, 4, 4);
    ctx.fillRect(28, 32, 4, 4);

    // Overalls
    ctx.fillStyle = "#1b53c2";
    ctx.fillRect(4, 30, 24, 10);
    // Overall buttons
    ctx.fillStyle = "#ffd700";
    ctx.fillRect(9, 32, 2, 2);
    ctx.fillRect(21, 32, 2, 2);

    // Legs (animated)
    ctx.fillStyle = "#1b53c2";
    if (step === 0) {
      ctx.fillRect(6, 38, 8, 4);
      ctx.fillRect(18, 38, 8, 4);
    } else if (step === 1) {
      ctx.fillRect(4, 38, 8, 4);
      ctx.fillRect(20, 38, 8, 4);
    } else {
      // Jumping pose
      ctx.fillRect(6, 38, 20, 4);
    }
    // Shoes
    ctx.fillStyle = "#6b3410";
    if (step === 0) {
      ctx.fillRect(4, 42, 10, 2);
      ctx.fillRect(18, 42, 10, 2);
    } else if (step === 1) {
      ctx.fillRect(2, 42, 10, 2);
      ctx.fillRect(20, 42, 10, 2);
    } else {
      ctx.fillRect(4, 42, 24, 2);
    }

    ctx.restore();
  }
}

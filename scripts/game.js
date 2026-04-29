import { Input } from "./input.js";
import { Player } from "./player.js";
import { Princess } from "./princess.js";
import { Background } from "./background.js";
import { buildLevel } from "./level.js";
import { Mushroom } from "./mushroom.js";
import { SoundManager } from "./sound.js";
import { QuestionBlock } from "./question_block.js";
import { Koopa } from "./enemy.js";

const VIEW_W = 960;
const VIEW_H = 540;

export class Game {
  constructor(canvas, hud) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;

    this.hud = hud;
    this.input = new Input();
    this.sounds = new SoundManager();

    this.state = "idle";
    this.score = 0;
    this.lives = 3;
    this.timeLeft = 400;
    this._timeAccumulator = 0;

    this._onWinCb = null;
    this._onLoseCb = null;

    this._loop = this._loop.bind(this);
    this._lastTs = 0;
  }

  onWin(cb)  { this._onWinCb = cb; }
  onLose(cb) { this._onLoseCb = cb; }

  start() {
    const lvl = buildLevel();
    this.worldW = lvl.worldW;
    this.worldH = lvl.worldH;
    this.platforms = lvl.platforms;
    this.questionBlocks = lvl.questionBlocks;
    this.coins = lvl.coins;
    this.mushrooms = [];
    this.enemies = lvl.enemies;

    this.player = new Player(lvl.playerSpawn.x, lvl.playerSpawn.y);
    this.princess = new Princess(lvl.princessPos.x, lvl.princessPos.y);
    this.background = new Background(this.worldW, this.worldH);

    this.score = 0;
    this.lives = 3;
    this.timeLeft = 400;
    this.cameraX = 0;
    this.state = "playing";

    this._updateHUD();

    if (!this._running) {
      this._running = true;
      requestAnimationFrame((ts) => {
        this._lastTs = ts;
        this._loop(ts);
      });
    }
  }

  _loop(ts) {
    const dt = Math.min(ts - this._lastTs, 50);
    this._lastTs = ts;

    if (this.state === "playing") this._update(dt);
    this._draw();

    if (this._running) requestAnimationFrame(this._loop);
  }

  _update(dt) {
    // Countdown timer
    this._timeAccumulator += dt;
    if (this._timeAccumulator >= 1000) {
      this._timeAccumulator -= 1000;
      this.timeLeft--;
      this._updateHUD();
      if (this.timeLeft <= 0) { this._loseLife(); return; }
    }

    // Platforms + question blocks are all solid for physics
    const solid = [...this.platforms, ...this.questionBlocks];

    this.player.update(this.input, solid, this.worldW, this.worldH);
    if (this.player._justJumped) this.sounds.jump();

    // Question block hits (player bumped underside while jumping)
    if (this.player.bumpedPlatform instanceof QuestionBlock) {
      const content = this.player.bumpedPlatform.activate();
      if (content === "coin") {
        this.score += 200;
        this.sounds.coin();
        this._updateHUD();
      } else if (content === "mushroom") {
        const b = this.player.bumpedPlatform;
        this.mushrooms.push(new Mushroom(b.x + 2, b.y - 28));
        this.sounds.powerUp();
      }
    }

    // Update question blocks (bounce animation)
    for (const b of this.questionBlocks) b.update();

    // Mushrooms
    for (const m of this.mushrooms) m.update(solid, this.worldW, this.worldH);
    for (const m of this.mushrooms) {
      if (!m.collected && this._intersects(this.player, m)) {
        m.collect();
        this.player.grow();
        this.sounds.powerUp();
        this.score += 1000;
        this._updateHUD();
      }
    }
    this.mushrooms = this.mushrooms.filter(m => !m.removable);

    // Coins
    for (const c of this.coins) {
      if (!c.collected && this._intersects(this.player, c)) {
        c.collect();
        this.score += 100;
        this.sounds.coin();
        this._updateHUD();
      }
    }
    this.coins = this.coins.filter(c => !c.removable);

    // Enemies
    for (const e of this.enemies) e.update(solid, this.worldH);

    // Sliding Koopa shells kill other enemies
    for (let i = 0; i < this.enemies.length; i++) {
      const shell = this.enemies[i];
      if (!(shell instanceof Koopa) || shell.state !== "sliding" || !shell.alive) continue;
      for (let j = 0; j < this.enemies.length; j++) {
        if (i === j || !this.enemies[j].alive) continue;
        if (this._intersects(shell, this.enemies[j])) {
          this.enemies[j].stomp();
          this.score += 200;
          this.sounds.stomp();
          this._updateHUD();
        }
      }
    }

    // Player / enemy interactions
    for (const e of this.enemies) {
      if (!e.alive) continue;
      if (!this._intersects(this.player, e)) continue;

      const playerFalling = this.player.vy > 0;
      const stomp = playerFalling &&
                    this.player.bottom - e.top < 20 &&
                    this.player.top < e.top;

      if (stomp) {
        const fromRight = this.player.x + this.player.w / 2 > e.x + e.w / 2;
        e.stomp(fromRight);
        this.player.bounce();
        this.score += (e instanceof Koopa) ? 200 : 100;
        this.sounds.stomp();
        this._updateHUD();
      } else {
        // Side collision with a stopped Koopa shell — kick it
        if (e instanceof Koopa && e.state === "shelled") {
          const fromRight = this.player.x + this.player.w / 2 > e.x + e.w / 2;
          e.stomp(fromRight);
          this.score += 100;
          this._updateHUD();
        } else if (this.player.invincible <= 0) {
          if (this.player.big) {
            this.player.shrink();
            this.sounds.shrink();
          } else {
            this._loseLife();
            return;
          }
        }
      }
    }

    this.enemies = this.enemies.filter(e => !e.removable);

    this.princess.update(dt);

    // Win
    if (this._intersects(this.player, this.princess)) {
      this._win();
      return;
    }

    // Pit death
    if (this.player.dead) {
      this._loseLife();
      return;
    }

    // Camera
    const targetX = this.player.x + this.player.w / 2 - VIEW_W / 2;
    this.cameraX = Math.max(0, Math.min(this.worldW - VIEW_W, targetX));
  }

  _intersects(a, b) {
    return a.right > b.left && a.left < b.right &&
           a.bottom > b.top && a.top  < b.bottom;
  }

  _loseLife() {
    this.sounds.die();
    this.lives--;
    this._updateHUD();
    if (this.lives <= 0) {
      this.state = "lost";
      this._onLoseCb && this._onLoseCb();
    } else {
      this.player.reset();
      this.timeLeft = 400;
    }
  }

  _win() {
    this.state = "won";
    this.score += this.timeLeft * 10;
    this._updateHUD();
    this._onWinCb && this._onWinCb();
  }

  _updateHUD() {
    if (!this.hud) return;
    this.hud.score.textContent = String(this.score).padStart(6, "0");
    this.hud.time.textContent  = String(Math.max(0, this.timeLeft));
    this.hud.lives.textContent = String(Math.max(0, this.lives));
  }

  _draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, VIEW_W, VIEW_H);

    this.background.draw(ctx, this.cameraX);

    ctx.save();
    ctx.translate(-Math.round(this.cameraX), 0);

    for (const p of this.platforms)      p.draw(ctx);
    for (const b of this.questionBlocks) b.draw(ctx);
    for (const c of this.coins)          c.draw(ctx);
    for (const m of this.mushrooms)      m.draw(ctx);
    this.princess.draw(ctx);
    for (const e of this.enemies)        e.draw(ctx);
    this.player.draw(ctx);

    ctx.restore();
  }
}

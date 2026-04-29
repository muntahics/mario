import { Platform } from "./platform.js";
import { Goomba, Koopa } from "./enemy.js";
import { Coin } from "./coin.js";
import { QuestionBlock } from "./question_block.js";

export function buildLevel() {
  const WORLD_W = 2400;
  const WORLD_H = 540;
  const GROUND_Y = 480;

  // ── Platforms ────────────────────────────────────────────────────────────
  const platforms = [];

  // Ground (gap between 820–920)
  platforms.push(new Platform(0,    GROUND_Y, 820,             60, "ground"));
  platforms.push(new Platform(920,  GROUND_Y, 560,             60, "ground"));
  platforms.push(new Platform(1580, GROUND_Y, WORLD_W - 1580,  60, "ground"));

  // Floating bricks
  platforms.push(new Platform(260, 360, 120, 24, "brick"));
  platforms.push(new Platform(440, 280, 160, 24, "brick"));
  platforms.push(new Platform(700, 360,  96, 24, "brick"));

   // Pipes
   platforms.push(new Platform( 520, GROUND_Y - 60,  56, 60, "pipe"));
   platforms.push(new Platform(1200, GROUND_Y - 90,  56, 90, "pipe"));
   platforms.push(new Platform(1800, GROUND_Y - 60,  56, 60, "pipe"));

  // Stair-steps to princess
  platforms.push(new Platform(1680, 420,  48,  60, "brick"));
  platforms.push(new Platform(1728, 380,  48, 100, "brick"));
  platforms.push(new Platform(1776, 340,  48, 140, "brick"));
  platforms.push(new Platform(1824, 300,  48, 180, "brick"));

  // Princess pedestal
  platforms.push(new Platform(2100, 400, 120, 20, "brick"));

  // ── Question Blocks ──────────────────────────────────────────────────────
  const questionBlocks = [
    new QuestionBlock( 200, 352, "coin"),       // open ground area, early
    new QuestionBlock( 390, 192, "mushroom"),   // above the high brick platform
    new QuestionBlock( 600, 352, "coin"),       // mid-level open area
    new QuestionBlock( 992, 352, "coin"),       // just after the gap
    new QuestionBlock(1160, 352, "mushroom"),   // near koopa patrol
    new QuestionBlock(1380, 352, "coin"),       // approach to staircase
  ];

  // ── Coins ────────────────────────────────────────────────────────────────
  const coins = [];
  const addCoins = (startX, y, count, step = 32) => {
    for (let i = 0; i < count; i++) coins.push(new Coin(startX + i * step, y));
  };

  addCoins( 100, 420, 4);           // ground level, early run-up
  addCoins( 290, 322, 3);           // on top of first brick platform
  addCoins( 460, 248, 4);           // on top of high brick platform
  addCoins( 712, 322, 2);           // on top of third brick
  addCoins( 940, 420, 3);           // after gap
  addCoins(1100, 420, 4);           // near second pipe
  addCoins(1600, 420, 5);           // heading toward staircase
  addCoins(1950, 360, 4);           // staircase area (mid-air)
  addCoins(2060, 320, 3);           // approach to princess

  // ── Enemies ──────────────────────────────────────────────────────────────
  const enemies = [
    new Goomba( 360, GROUND_Y - 30,  200,  500),
    new Goomba(1150, GROUND_Y - 30, 1100, 1260),
    new Goomba(1620, GROUND_Y - 30, 1580, 1680),
    new Koopa(  730, GROUND_Y - 40,  600,  820),
    new Koopa( 1320, GROUND_Y - 40, 1100, 1480),
  ];

  return {
    worldW: WORLD_W,
    worldH: WORLD_H,
    platforms,
    questionBlocks,
    coins,
    enemies,
    playerSpawn: { x: 60, y: GROUND_Y - 80 },
    princessPos: { x: 2132, y: 352 },
  };
}

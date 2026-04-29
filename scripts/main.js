// Entry point: boot the game and wire overlay buttons.

import { Game } from "./game.js";

const canvas = document.getElementById("game");
const hud = {
  score: document.getElementById("score"),
  time: document.getElementById("time"),
  lives: document.getElementById("lives"),
};

const startScreen = document.getElementById("start-screen");
const winScreen = document.getElementById("win-screen");
const loseScreen = document.getElementById("lose-screen");

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const retryBtn = document.getElementById("retry-btn");

const game = new Game(canvas, hud);

game.onWin(() => {
  winScreen.classList.remove("hidden");
});

game.onLose(() => {
  loseScreen.classList.remove("hidden");
});

function hideAllOverlays() {
  startScreen.classList.add("hidden");
  winScreen.classList.add("hidden");
  loseScreen.classList.add("hidden");
}

function beginGame() {
  hideAllOverlays();
  game.start();
}

startBtn.addEventListener("click", beginGame);
restartBtn.addEventListener("click", beginGame);
retryBtn.addEventListener("click", beginGame);

// Allow Enter / Space to start too
window.addEventListener("keydown", (e) => {
  if (
    (e.code === "Enter" || e.code === "Space") &&
    (!startScreen.classList.contains("hidden") ||
      !winScreen.classList.contains("hidden") ||
      !loseScreen.classList.contains("hidden"))
  ) {
    beginGame();
  }
});

// Simple keyboard input manager.
// Tracks which keys are currently held down and exposes semantic actions.

export class Input {
  constructor() {
    this.keys = new Set();

    this._onDown = (e) => {
      this.keys.add(e.code);
      // Prevent page scroll on Space / Arrow keys while playing
      if (
        ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
          e.code
        )
      ) {
        e.preventDefault();
      }
    };

    this._onUp = (e) => {
      this.keys.delete(e.code);
    };

    window.addEventListener("keydown", this._onDown);
    window.addEventListener("keyup", this._onUp);
  }

  isDown(...codes) {
    return codes.some((c) => this.keys.has(c));
  }

  get left() {
    return this.isDown("ArrowLeft", "KeyA");
  }

  get right() {
    return this.isDown("ArrowRight", "KeyD");
  }

  get jump() {
    return this.isDown("Space", "ArrowUp", "KeyW");
  }

  destroy() {
    window.removeEventListener("keydown", this._onDown);
    window.removeEventListener("keyup", this._onUp);
  }
}

# Super Mario - Save the Princess

A retro, 2D platformer game inspired by Super Mario. Built entirely with HTML5 Canvas, Vanilla JavaScript (ES6 Modules), and SCSS!

## 🛠️ Prerequisites

To build and run this project locally, you will need to have [Node.js](https://nodejs.org/) and `npm` installed on your machine.

## 🚀 How to Build and Run

1. **Install dependencies:**
   First, install the required development dependencies (Sass).
   ```bash
   npm install
   ```

2. **Build the CSS:**
   The game uses SCSS for styling. You need to compile it into regular CSS before playing.
   ```bash
   npm run build:css
   ```
   *(Note: If you are actively modifying the styles, you can use `npm run watch:css` to automatically recompile on changes).*

3. **Start the local server:**
   Launch the game using the built-in server script.
   ```bash
   npm run serve
   ```

4. **Play:**
   Open your browser and navigate to [http://localhost:8645](http://localhost:8645).

## 🎮 How to Play

**Objective:**
Navigate through the level, stomp on enemies, collect coins and mushrooms, and reach the Princess before time runs out!

**Controls:**
- **Move Left/Right**: `Left/Right Arrow Keys` or `A`/`D`
- **Jump**: `Spacebar`, `Up Arrow`, or `W`
- **Start/Restart Game**: Click the buttons on screen or press `Enter`/`Space`

**Game Mechanics:**
- **Mushrooms**: Collect them to grow bigger. If you get hit while big, you will shrink instead of losing a life.
- **Koopas (Turtles)**: Stomp them once to hide them in their shell. Stomp the shell again to send it sliding across the screen to take out other enemies!
- **Question Blocks**: Jump and hit them from below to reveal coins or mushrooms.

## 🤫 Secret Cheat Code

Feeling overwhelmed? There is a secret cheat code built into the game:
- During gameplay, simply type the word **`cheat`** anywhere on your keyboard.
- You'll hear a confirmation sound, and the game will enter **"Bullet Time"** (Slow Motion).
- Type **`cheat`** again to return to normal speed.

Enjoy saving the Princess!

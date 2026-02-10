// Sounds
const clapSound = new Audio("audio/clap.wav");
const sound = document.getElementById("bgSound");

// Unlock sounds after first user interaction (required by browsers)
let soundUnlocked = false;
function unlockSounds() {
  if (!soundUnlocked) {
    clapSound.play().then(() => clapSound.pause());
    clapSound.currentTime = 0;

    sound.play().then(() => sound.pause());
    sound.currentTime = 0;

    soundUnlocked = true;
  }
}
document.addEventListener("click", unlockSounds, { once: true });
document.addEventListener("keydown", unlockSounds, { once: true });

// Elements
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const playBtn = document.getElementById("playBtn");
const player = document.getElementById("player");
const enemy = document.getElementById("enemy");
const controls = document.getElementById("controls");

let px, py, ex, ey;
let score = 0;
let scoreInterval;

// Start Game
function startGame() {
  startScreen.style.display = "none";
  gameScreen.style.display = "block";
  controls.style.display = "block";

  // Play background music
  sound.play();

  // Reset positions
  px = 600; py = 400;
  ex = 100; ey = 100;

  // Reset score
  score = 0;
  document.getElementById("score").textContent = "Score: 0";
  clearInterval(scoreInterval);
  scoreInterval = setInterval(() => {
    score++;
    document.getElementById("score").textContent = "Score: " + score;
  }, 1000);

  gameLoop();
}

// Play button
playBtn.onclick = startGame;

// Auto random movement for player
function movePlayerRandom() {
  px += Math.random() * 6 - 3;
  py += Math.random() * 6 - 3;
  clampPositions();
}

// Enemy chase logic
function chase() {
  ex += (px - ex) * 0.008;
  ey += (py - ey) * 0.008;
}

// Keep player & enemy inside screen
function clampPositions() {
  const playerWidth = player.offsetWidth;
  const enemyWidth = enemy.offsetWidth;

  px = Math.max(0, Math.min(window.innerWidth - playerWidth, px));
  py = Math.max(0, Math.min(window.innerHeight - playerWidth, py));

  ex = Math.max(0, Math.min(window.innerWidth - enemyWidth, ex));
  ey = Math.max(0, Math.min(window.innerHeight - enemyWidth, ey));
}

// Main game loop
function gameLoop() {
  movePlayerRandom();
  chase();
  clampPositions();

  player.style.left = px + "px";
  player.style.top = py + "px";

  enemy.style.left = ex + "px";
  enemy.style.top = ey + "px";

  // Collision detection
  if (Math.abs(px - ex) < 60 && Math.abs(py - ey) < 60) {
    // Play clap sound
    clapSound.currentTime = 0;
    clapSound.play();

    alert("YOU GOT EPSTEINED 💀");
    clearInterval(scoreInterval);
    startGame();
    return;
  }

  requestAnimationFrame(gameLoop);
}

// Button controls
function moveUp() { py -= 20; clampPositions(); }
function moveDown() { py += 20; clampPositions(); }
function moveLeft() { px -= 20; clampPositions(); }
function moveRight() { px += 20; clampPositions(); }

// Keyboard controls
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp": moveUp(); break;
    case "ArrowDown": moveDown(); break;
    case "ArrowLeft": moveLeft(); break;
    case "ArrowRight": moveRight(); break;
  }
});

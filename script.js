// Game Constants
const GAME = {
  LEVELS: {
    EASY: "Easy",
    HARD: "Hard",
    PRO: "Pro",
  },
  OPERATIONS: {
    ADD: "add",
    REMOVE: "remove",
  },
  EVENTS: {
    CLICK: "click",
    TOUCH: "touchstart",
  },
  CLASSES: {
    ACTIVE: "active",
    RESTRICTED: "restrictedSquare",
    HIDDEN: "noDisplay",
  },
  MESSAGES: {
    CORRECT: "✨ Correct!",
    FAILED: "↻ Try again...",
    RESTART: "Play Again",
    INFO: "ⓘ Tap on color for above RGB code",
  },
  UI: {
    BUTTON_TEXT: "New Colors",
    EMPTY: "",
    COLORS: {
      BG_DARK: "var(--color-bg-primary)",
      ACCENT: "var(--color-accent)",
    },
  },
};

// DOM Elements
const UI = {
  colorDisplay: document.querySelector("#colorDisplay"),
  resultDisplay: document.querySelector("#resultDisplay"),
  heading: document.querySelector("h1"),
  resetButton: document.querySelector("#reset"),
  squares: document.querySelectorAll(".square"),
  modeButtons: document.querySelectorAll(".mode"),
  scoreDisplay: document.querySelector(".scoreDisplay"),
  healthIndicators: document.querySelectorAll(".healthIndicator"),
  gameStatScreen: document.querySelector(".gameStatScreen"),
  scoreCard: document.querySelector(".scoreCard"),
};

// Game State
const gameState = {
  squareCount: 3,
  colors: [],
  targetColorIndex: null,
  score: 0,
  health: 5,
  isAnimating: false,
  resultTimeout: null,
};

// Initialize game
function initGame() {
  // Set initial game mode to Easy
  updateGameMode(GAME.LEVELS.EASY);
  resetPlayArea();
  updateScore("reset");
  updateHealth("reset");
  setupEventListeners();

  // Update the UI to show Easy mode is selected
  UI.modeButtons.forEach((button) => {
    if (button.textContent === GAME.LEVELS.EASY) {
      button.classList.add(GAME.CLASSES.ACTIVE);
    } else {
      button.classList.remove(GAME.CLASSES.ACTIVE);
    }
  });
}

// Event Listeners Setup
function setupEventListeners() {
  // Square click handlers
  UI.squares.forEach((square) => {
    square.addEventListener(GAME.EVENTS.CLICK, handleSquareClick);
  });

  // Game stat screen click handler
  UI.gameStatScreen.addEventListener(GAME.EVENTS.CLICK, () => {
    UI.gameStatScreen.classList.add(GAME.CLASSES.HIDDEN);
  });

  // Reset button handler
  UI.resetButton.addEventListener(GAME.EVENTS.CLICK, handleReset);

  // Mode button handlers
  UI.modeButtons.forEach((button) => {
    button.addEventListener(GAME.EVENTS.CLICK, handleModeChange);
  });
}

// Square click handler
function handleSquareClick(e) {
  if (gameState.isAnimating) return;

  const clickedColor = this.style.backgroundColor;
  const correctColor = gameState.colors[gameState.targetColorIndex];

  if (clickedColor === correctColor) {
    handleCorrectGuess(this);
  } else {
    handleIncorrectGuess(this);
  }
}

// Handle correct color guess
function handleCorrectGuess(square) {
  gameState.isAnimating = true;
  // show correct message and auto-hide after 2s
  UI.resultDisplay.textContent = GAME.MESSAGES.CORRECT;
  // clear any previous pending timeout
  if (gameState.resultTimeout) clearTimeout(gameState.resultTimeout);
  gameState.resultTimeout = setTimeout(() => {
    UI.resultDisplay.textContent = GAME.UI.EMPTY;
    gameState.resultTimeout = null;
  }, 2000);

  // Animate success
  const squares = Array.from(UI.squares).slice(0, gameState.squareCount);
  squares.forEach((sq, i) => {
    setTimeout(() => {
      sq.style.backgroundColor = gameState.colors[gameState.targetColorIndex];
      sq.style.transform = "scale(1.05)";
    }, i * 100);
  });

  // Animate header
  UI.heading.style.backgroundColor =
    gameState.colors[gameState.targetColorIndex];

  // Update score with animation
  updateScore("increase");

  // Reset after animation
  setTimeout(() => {
    squares.forEach((sq) => (sq.style.transform = ""));
    gameState.isAnimating = false;
    resetPlayArea();
  }, gameState.squareCount * 100 + 500);
}

// Handle incorrect color guess
function handleIncorrectGuess(square) {
  UI.resultDisplay.textContent = GAME.MESSAGES.FAILED;

  // Animate failure
  square.style.transform = "scale(0.95)";
  setTimeout(() => {
    square.style.backgroundColor = GAME.UI.COLORS.BG_DARK;
    square.style.transform = "";
  }, 300);

  updateHealth("decrease");
  evaluateGameState();
}

// Reset button handler
function handleReset() {
  if (gameState.isAnimating) return;

  resetPlayArea();
  UI.resetButton.textContent = GAME.UI.BUTTON_TEXT;
  UI.resultDisplay.textContent = GAME.MESSAGES.INFO;
  // clear pending correct-message timeout if any
  if (gameState.resultTimeout) {
    clearTimeout(gameState.resultTimeout);
    gameState.resultTimeout = null;
  }
}

// Mode change handler
function handleModeChange() {
  if (gameState.isAnimating) return;

  UI.modeButtons.forEach((button) =>
    button.classList.remove(GAME.CLASSES.ACTIVE)
  );
  this.classList.add(GAME.CLASSES.ACTIVE);

  // Update game state based on selected mode
  const mode = this.textContent;
  updateGameMode(mode);

  // Reset game
  updateHealth("reset");
  updateScore("reset");
  resetPlayArea();
}

// Update game mode
function updateGameMode(mode) {
  // First hide all squares
  UI.squares.forEach((square) => {
    square.classList.add(GAME.CLASSES.RESTRICTED);
    square.style.backgroundColor = GAME.UI.COLORS.BG_DARK;
  });

  // Set square count based on mode
  switch (mode) {
    case GAME.LEVELS.EASY:
      gameState.squareCount = 3;
      break;
    case GAME.LEVELS.HARD:
      gameState.squareCount = 6;
      break;
    case GAME.LEVELS.PRO:
      gameState.squareCount = 9;
      break;
  }

  // Show only required squares
  for (let i = 0; i < gameState.squareCount; i++) {
    UI.squares[i].classList.remove(GAME.CLASSES.RESTRICTED);
  }
}

// Generate random color
function randomColor() {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  return `rgb(${red}, ${green}, ${blue})`;
}

// Generate array of random colors
function generateColors(count) {
  return Array(count)
    .fill()
    .map(() => randomColor());
}

// Select target color
function selectTargetColor() {
  return Math.floor(Math.random() * gameState.colors.length);
}

// Update square colors
function updateSquareColors() {
  // First, ensure all squares beyond squareCount are hidden
  UI.squares.forEach((square, index) => {
    if (index >= gameState.squareCount) {
      square.classList.add(GAME.CLASSES.RESTRICTED);
      square.style.backgroundColor = GAME.UI.COLORS.BG_DARK;
    } else {
      square.classList.remove(GAME.CLASSES.RESTRICTED);
      square.style.backgroundColor = gameState.colors[index];
      // Add animation
      square.style.transform = "scale(0)";
      setTimeout(() => {
        square.style.transform = "scale(1)";
      }, index * 50);
    }
  });
}

// Reset play area
function resetPlayArea() {
  gameState.colors = generateColors(gameState.squareCount);
  gameState.targetColorIndex = selectTargetColor();

  UI.colorDisplay.textContent = gameState.colors[gameState.targetColorIndex];
  UI.heading.style.backgroundColor = GAME.UI.COLORS.ACCENT;

  updateSquareColors();
}

// Update score with animation
function updateScore(operation) {
  if (operation === "reset") {
    gameState.score = 0;
  } else {
    gameState.score += 1;
    UI.scoreDisplay.style.transform = "scale(1.2)";
    setTimeout(() => {
      UI.scoreDisplay.style.transform = "";
    }, 200);
  }
  UI.scoreDisplay.textContent = gameState.score;
}

// Update health with animation
function updateHealth(operation) {
  if (operation === "reset") {
    gameState.health = UI.healthIndicators.length;
  } else if (gameState.health > 0) {
    gameState.health -= 1;
  }

  UI.healthIndicators.forEach((indicator, index) => {
    if (index < gameState.health) {
      indicator.classList.remove(GAME.CLASSES.HIDDEN);
      indicator.style.transform = "scale(1)";
    } else {
      indicator.style.transform = "scale(0)";
      setTimeout(() => {
        indicator.classList.add(GAME.CLASSES.HIDDEN);
      }, 300);
    }
  });
}

// Evaluate game state
function evaluateGameState() {
  if (gameState.health === 0) {
    displayGameStats();
    UI.resultDisplay.textContent = GAME.UI.EMPTY;
  } else {
    UI.resultDisplay.textContent = GAME.MESSAGES.FAILED;
  }
}

// Display game stats with animation
function displayGameStats() {
  UI.gameStatScreen.classList.remove(GAME.CLASSES.HIDDEN);
  UI.scoreCard.textContent = gameState.score;

  // Reset game state
  setTimeout(() => {
    resetPlayArea();
    updateHealth("reset");
    updateScore("reset");
  }, 300);
}

// Utility: Update class list for element range
function updateClassListForElementRange(array, start, end, operation) {
  for (let i = start; i < end; i++) {
    const element = array[i];
    if (operation === GAME.OPERATIONS.ADD) {
      element.classList.add(GAME.CLASSES.RESTRICTED);
    } else {
      element.classList.remove(GAME.CLASSES.RESTRICTED);
    }
  }
}

// Initialize the game
initGame();

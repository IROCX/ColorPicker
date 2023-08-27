// CONSTANTS
const LEVEL_EASY = 'Easy'
const LEVEL_HARD = 'Hard'
const LEVEL_PRO = 'Pro'

const OPERATION_ADD = 'add'
const OPERATION_REMOVE = 'remove'

const EVENT_CLICK = 'click'
const CLASS_ACTIVE = 'active'

const MESSAGE_CORRECT = "Correct!"
const MESSAGE_FAILED = 'Try again...'
const MESSAGE_RESTART = 'Play Again'

const TEXT_RESET_BUTTON = 'New Colors'
const TEXT_EMPTY = ''

const BACKGROUND_BUTTON_ACTIVE = '#232323'
const BACKGROUND_HEADER = "#4682b4"

var rgbColorCodeDisplay = document.querySelector('#colorDisplay');
var resultDisplay = document.querySelector('#resultDisplay');
var heading = document.querySelector('h1');
var resetButton = document.querySelector('#reset'); // New Colors button
var squares = document.querySelectorAll('.square');
var modeButton = document.querySelectorAll('.mode');

var squareCount = 3;
var colors = [];
var ans = [];

// initial setting of play area
resetPlayArea();

for (let index = 0; index < modeButton.length; index++) {
    modeButton[index].addEventListener(EVENT_CLICK, function () {
        modeButton.forEach(mode => mode.classList.remove(CLASS_ACTIVE))
        this.classList.add(CLASS_ACTIVE);
        updateClassListForElementRange(squares, 0, 9, OPERATION_ADD)

        var x = this.textContent;

        if (x === LEVEL_EASY) {
            squareCount = 3;
        } else if (x === LEVEL_HARD) {
            squareCount = 6;
        } else {
            squareCount = 9;
        }

        updateClassListForElementRange(squares, 0, squareCount, OPERATION_REMOVE)
        resetPlayArea();
    });
}

function successColor(n) {
    for (let i = 0; i < n; i++) {
        squares[i].style.backgroundColor = colors[ans];
    }
}

function GenerateTargetColor() {
    var x = parseInt(Math.random() * colors.length);
    return x;
}

function PopulateColors(n) {
    var arr = [];
    for (let index = 0; index < n; index++) {
        arr[index] = randomColor();
    }
    return arr;
}

function randomColor() {
    var red = parseInt(Math.random() * 256);
    var green = parseInt(Math.random() * 256);
    var blue = parseInt(Math.random() * 256);
    var finalColor = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
    return finalColor;
}

function setSquareColors() {
    for (let index = 0; index < squares.length; index++) {
        //colors assign
        squares[index].style.backgroundColor = colors[index];

        //event handler
        squares[index].addEventListener(EVENT_CLICK, function () {
            var clickedColor = this.style.backgroundColor;
            if (clickedColor === colors[ans]) {
                resultDisplay.textContent = MESSAGE_CORRECT;
                successColor(squareCount);
                heading.style.backgroundColor = colors[ans];
                resetButton.textContent = MESSAGE_RESTART;
            }
            else {
                this.style.backgroundColor = BACKGROUND_BUTTON_ACTIVE;
                resultDisplay.textContent = MESSAGE_FAILED
            }
        });
    }
}

function resetPlayArea() {
    colors = PopulateColors(squareCount);
    ans = GenerateTargetColor();
    colorDisplay.textContent = colors[ans];
    heading.style.backgroundColor = BACKGROUND_HEADER;
    setSquareColors();
}

resetButton.addEventListener(EVENT_CLICK, function () {
    resetPlayArea();
    resetButton.textContent = TEXT_RESET_BUTTON;
    resultDisplay.textContent = TEXT_EMPTY;
});

// UTIL FUNCTIONS
function updateClassListForElementRange(array, start, end, operation) {
    for (let i = start; i < end; i++) {
        operation == OPERATION_ADD ? array[i].classList.add('restrictedSquare') : array[i].classList.remove('restrictedSquare');
    }
}
var colorDisplay = document.querySelector('#colorDisplay');
var resultDisplay = document.querySelector('#resultDisplay');
var heading = document.querySelector('h1');
var resetButton = document.querySelector('#reset');
var sq = document.querySelectorAll('.square');
var modeButton = document.querySelectorAll('.mode');

var n = 3;
var colors = [];
var ans = [];
resetter();

for (let index = 0; index < modeButton.length; index++) {

    modeButton[index].addEventListener('click', function () {
        modeButton[0].classList.remove('active');
        modeButton[1].classList.remove('active');
        this.classList.add('active');
        var x = this.textContent;
        if (x === 'Easy') {
            console.log(1);
            n = 3;
            for (let i = 3; i < 6; i++) {
                sq[i].classList.add('restrictedSquare');
            }
        } else {
            console.log(2);
            n = 6;
            for (let i = 3; i < 6; i++) {
                sq[i].classList.remove('restrictedSquare');
            }
        }
        resetter();
    });
}


function successColor(n) {
    for (let i = 0; i < n; i++) {
        sq[i].style.backgroundColor = colors[ans];
    }
}

function goalColor() {
    var x = parseInt(Math.random() * colors.length);
    return x;
}

function colorGen(n) {

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
function colorSet() {
    for (let index = 0; index < sq.length; index++) {
        //colors assign
        sq[index].style.backgroundColor = colors[index];

        //event handler
        sq[index].addEventListener('click', function () {
            var clickedColor = this.style.backgroundColor;
            if (clickedColor === colors[ans]) {
                resultDisplay.textContent = ' Correct!';
                successColor(n);
                heading.style.backgroundColor = colors[ans];
                resetButton.textContent = 'Play Again';
            }
            else {
                this.style.backgroundColor = '#232323';
                resultDisplay.textContent = 'Try again...'
            }
        });
    }
}

function resetter() {
    colors = colorGen(n);
    ans = goalColor();
    colorDisplay.textContent = colors[ans];
    heading.style.backgroundColor = '#4682b4';
    colorSet();
}
resetButton.addEventListener('click', function () {
    resetter();
    resetButton.textContent = 'New Colors';
    resultDisplay.textContent = '';
});

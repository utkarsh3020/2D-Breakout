const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const ballRadius = 10;
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;

var x = canvasWidth/2;
var dx = 3;

var y = canvasHeight/2;
var dy = 3;

// Score Counter
const scoreContainer = document.querySelector(".score")

var paddleWidth = 70;
var paddleHeight = 8;
var paddleX = canvasWidth - paddleWidth;

// color
const color = "#f58442";

// brick var
var brickPadding = 20;
var bricksoffsetTop = 10;
var bricksoffsetLeft = 10;
var brickWidth = 80;
var brickHeight = 20;
var bricks = [];
var numOfRow = 3;
var numOfCol = 5;

function generateBricks() {
    for(var row=0; row<numOfRow; row++){
        bricks[row] = [];
        for(var col=0; col<numOfCol; col++){
            bricks[row][col] = {x:row, y:col, status: 1 };
        }
    }
}

generateBricks();

function drawAllBricks() {
    for(var row=0; row<numOfRow; row++){
        for(var col=0; col<numOfCol; col++){
            const brick = bricks[row][col];
            const brickX = col*(brickWidth + brickPadding) + bricksoffsetLeft;
            const brickY = row*(brickHeight + brickPadding) + bricksoffsetTop;
            brick.x = brickX;
            brick.y = brickY;

            if(brick.status) {
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = color;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function checkBoundaryCollision() {
    if(x <= ballRadius || x + ballRadius >= canvasWidth) dx = -dx;
    else if(y <= ballRadius) dy = -dy;
    else if(y >= canvasHeight - paddleHeight) {
        // checks if ball in the range of paddle or not
        if(x > paddleX && x < paddleX + paddleWidth){
            // ball must bounce
            dy = -dy;
        }
        else handleGameOver();
    }
}

function handleGameOver() {
    clearInterval(interval);
    alert("Game Over, your score is "+ getScore());
    window.location.reload();
}

function collisionDetection() {
    for(var row=0; row<numOfRow; row++){
        for(var col=0; col<numOfCol; col++){
            const brick = bricks[row][col];
            // this brick must be alive
            if(brick.status &&
                x >= brick.x &&
                x <= brick.x + brickWidth &&
                y >= brick.y &&
                y <= brick.y + brickHeight
            ) {
                dy = -dy;
                brick.status = 0;
                updateScore();
                if(score == numOfRow * numOfCol) {
                    clearInterval(interval); // Needed for Chrome to end game
                    alert("YOU WIN, CONGRATS!");
                    window.location.reload();
                }
            }
        }
    }
}

function draw() {
    ctx.beginPath();
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#426cf5";
    ctx.fill();
    ctx.closePath();
    checkBoundaryCollision();
    drawPaddle();
    drawAllBricks();
    x = x + dx;
    y = y + dy;
    collisionDetection();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvasHeight - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

// Score Calculator
function getScore() {
    var score = 0;
    for(var row=0; row<numOfRow; row++){
        for(var col=0; col<numOfCol; col++){
            const brick = bricks[row][col];
            if(brick.status === 0) score++;
        }
    }
    return score;
}

function updateScore() {
    scoreContainer.textContent = `Score: ${getScore()}`;
}

window.onkeydown = (event) => {
    if(event.key == "Left" || event.key == "ArrowLeft") {
        // move paddle to left
        if(paddleX - 10 >= 0) paddleX = paddleX - 10;
    }

    else if(event.key == "Right" || event.key == "ArrowRight") {
        // move paddle to right
        if(paddleX + 10 + paddleWidth <= canvasWidth) paddleX = paddleX + 10;
    }
}

const interval = setInterval(draw, 20);
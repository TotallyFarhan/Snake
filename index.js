const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let scoreEl = document.getElementById('score');
let highscoreEl = document.getElementById('highscore');

const scale = 20;
const columns = canvas.width / scale;
const rows = canvas.height / scale;

let snake;
let food;

class Snake {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = scale;
        this.height = scale;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.tail = [];
        this.total = 0;
        this.score = 0;
    }

    draw () {
        ctx.fillStyle = "green";
        for (let i = 0; i < this.tail.length; i++) {
            ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);        
        }
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    borders (food) {
        if (this.x < 0) {
            this.resetGame(food);
            scoreEl.innerHTML = this.score;
        }
        else if (this.x > canvas.width - scale) {
            this.resetGame(food);
            scoreEl.innerHTML = this.score;
        }
        else if (this.y < 0) {
            this.resetGame(food);
            scoreEl.innerHTML = this.score;
        }
        else if (this.y > canvas.height - scale) {
            this.resetGame(food);
            scoreEl.innerHTML = this.score;
        }
    }

    resetGame (food) {
        this.x = 60;
        this.y = canvas.height / 2 - scale;
        this.total = 0;
        this.tail = [];
        this.xSpeed = 0;
        this.ySpeed =  0;
        this.score = 0;
        food.randomLocation();
    }

    checkCollisions (food) {
        for (let i = 0; i < this.tail.length; i++) {
            if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
                this.resetGame(food);
                scoreEl.innerHTML = this.score;
            }
        }
    }

    update (food) {
        this.borders(food);
        this.draw();
        for (let i = 0; i < this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i + 1];
        }

        this.tail[this.total - 1] = { x:this.x, y:this.y };

        this.x += this.xSpeed;
        this.y += this.ySpeed;
        this.checkCollisions(food);

    }

    eat (food) {
        if (food.x === this.x && food.y === this.y) {
            food.randomLocation();
            this.total ++;
            this.score ++;
            scoreEl.innerHTML = this.score;
        }
    }
}

class Food {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    randomLocation = (snake) => {
        this.x = (Math.floor(Math.random() * rows - 1) + 1) * scale;
        this.y = (Math.floor(Math.random() * columns - 1) + 1) * scale;
    }

    draw () {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, scale, scale);
    }
}

(function setUp (){
    snake = new Snake(60, canvas.height / 2 - scale);
    food = new Food();

    food.randomLocation(snake);
    window.setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        document.addEventListener('keydown', evt => {
            if (evt.key === "ArrowUp" && snake.ySpeed != scale * 1) {
                snake.xSpeed = 0;
                snake.ySpeed = scale * -1;
            }
            else if (evt.key === "ArrowDown" && snake.ySpeed != scale * -1) {
                snake.xSpeed = 0;
                snake.ySpeed = scale * 1;
            }
            else if (evt.key === "ArrowLeft" && snake.xSpeed != scale * 1) {
                snake.xSpeed = scale * -1;
                snake.ySpeed = 0;
            }
            else if (evt.key === "ArrowRight"  && snake.xSpeed != scale * -1) {
                snake.xSpeed = scale * 1;
                snake.ySpeed = 0;
            }
        });

        snake.eat(food);
        food.draw();
        snake.update(food);
    }, 1000/15);
}());
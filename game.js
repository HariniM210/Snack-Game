class Snake {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = 200;
        this.y = 200;
        this.dx = 20;
        this.dy = 0;
        this.tail = [];
        this.length = 1;
    }

    update() {
        // Update tail
        this.tail.push({ x: this.x, y: this.y });
        if (this.tail.length > this.length) {
            this.tail.shift();
        }

        // Update position
        this.x += this.dx;
        this.y += this.dy;
    }

    draw(ctx) {
        ctx.fillStyle = '#4CAF50';
        // Draw tail
        this.tail.forEach(segment => {
            ctx.fillRect(segment.x, segment.y, 18, 18);
        });
        // Draw head
        ctx.fillStyle = '#45a049';
        ctx.fillRect(this.x, this.y, 18, 18);
    }

    checkCollision(width, height) {
        // Wall collision
        if (this.x < 0 || this.x >= width || this.y < 0 || this.y >= height) {
            return true;
        }

        // Self collision
        for (let i = 0; i < this.tail.length - 1; i++) {
            if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
                return true;
            }
        }

        return false;
    }
}

class Food {
    constructor() {
        this.move();
    }

    move() {
        this.x = Math.floor(Math.random() * 20) * 20;
        this.y = Math.floor(Math.random() * 20) * 20;
    }

    draw(ctx) {
        ctx.fillStyle = '#FF4136';
        ctx.beginPath();
        ctx.arc(this.x + 10, this.y + 10, 8, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.snake = new Snake();
        this.food = new Food();
        this.score = 0;
        this.gameOver = false;

        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        this.gameLoop = this.gameLoop.bind(this);
    }

    handleKeyPress(event) {
        const key = event.key;
        if (this.gameOver) return;

        switch (key) {
            case 'ArrowUp':
                if (this.snake.dy === 0) {
                    this.snake.dx = 0;
                    this.snake.dy = -20;
                }
                break;
            case 'ArrowDown':
                if (this.snake.dy === 0) {
                    this.snake.dx = 0;
                    this.snake.dy = 20;
                }
                break;
            case 'ArrowLeft':
                if (this.snake.dx === 0) {
                    this.snake.dx = -20;
                    this.snake.dy = 0;
                }
                break;
            case 'ArrowRight':
                if (this.snake.dx === 0) {
                    this.snake.dx = 20;
                    this.snake.dy = 0;
                }
                break;
        }
    }

    checkFoodCollision() {
        if (this.snake.x === this.food.x && this.snake.y === this.food.y) {
            this.food.move();
            this.snake.length++;
            this.score += 10;
            document.getElementById('score').textContent = this.score;
        }
    }

    showGameOver() {
        document.getElementById('gameOver').style.display = 'block';
        document.getElementById('finalScore').textContent = this.score;
    }

    reset() {
        this.snake.reset();
        this.food.move();
        this.score = 0;
        this.gameOver = false;
        document.getElementById('score').textContent = '0';
        document.getElementById('gameOver').style.display = 'none';
    }

    gameLoop() {
        if (this.gameOver) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw snake
        this.snake.update();
        this.snake.draw(this.ctx);

        // Draw food
        this.food.draw(this.ctx);

        // Check collisions
        if (this.snake.checkCollision(this.canvas.width, this.canvas.height)) {
            this.gameOver = true;
            this.showGameOver();
            return;
        }

        this.checkFoodCollision();

        // Next frame
        setTimeout(this.gameLoop, 100);
    }

    start() {
        this.reset();
        this.gameLoop();
    }
}

const game = new Game();
game.start();

function restartGame() {
    game.start();
}
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const bird = {
    x: 50,
    y: canvas.height / 2 - 20,
    radius: 20,
    color: "#FFD700",
    velocity: 0,
    gravity: 1
};

const pipes = [];
let score = 0;
let gameover = false;

window.addEventListener("keydown", jump);
window.addEventListener("click", jump);

function jump() {
    if (!gameover) {
        bird.velocity = -15;
    } else {
        resetGame();
    }
}

function update() {
    if (gameover) {
        return;
    }

    // Update bird
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Check for collision with ground or ceiling
    if (bird.y > canvas.height - bird.radius) {
        bird.y = canvas.height - bird.radius;
        bird.velocity = 0;
    } else if (bird.y < bird.radius) {
        bird.y = bird.radius;
        bird.velocity = 0;
    }

    // Update pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= 5;

        // Check for collision with pipes
        if (
            bird.x + bird.radius > pipes[i].x &&
            bird.x - bird.radius < pipes[i].x + pipes[i].width &&
            (bird.y + bird.radius > pipes[i].y && bird.y - bird.radius < pipes[i].y + pipes[i].height)
        ) {
            gameOver();
            return;
        }

        // Remove pipes that are off-screen
        if (pipes[i].x + pipes[i].width < 0) {
            pipes.splice(i, 1);
            score++;
        }
    }

    // Generate new pipes
    if (Math.random() < 0.02) {
        const gap = 200;
        const pipeHeight = Math.random() * (canvas.height - gap - 100);
        const pipe = {
            x: canvas.width,
            y: 0,
            width: 50,
            height: pipeHeight
        };
        pipes.push(pipe);

        const bottomPipe = {
            x: canvas.width,
            y: pipeHeight + gap,
            width: 50,
            height: canvas.height - pipeHeight - gap
        };
        pipes.push(bottomPipe);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw pipes
    ctx.fillStyle = "#008000";
    for (let i = 0; i < pipes.length; i++) {
        ctx.fillRect(pipes[i].x, pipes[i].y, pipes[i].width, pipes[i].height);
    }

    // Draw bird
    ctx.fillStyle = bird.color;
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, 2 * Math.PI);
    ctx.fill();

    // Draw score
    ctx.font = "30px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText("Score: " + score, 10, 30);

    // Draw game over text
    if (gameover) {
        ctx.font = "50px Arial";
        ctx.fillText("Game Over", canvas.width / 2 - 150, canvas.height / 2 - 25);
        ctx.fillText("Click to Play Again", canvas.width / 2 - 250, canvas.height / 2 + 25);
    }
}

function gameOver() {
    gameover = true;
}

function resetGame() {
    bird.y = canvas.height / 2 - 20;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    gameover = false;
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
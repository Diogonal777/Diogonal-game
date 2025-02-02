document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Загрузка изображений
    const shipImage = new Image();
    shipImage.src = "images/ship.png";

    const meteorImage = new Image();
    meteorImage.src = "images/meteor.png";

    // Корабль
    const ship = {
        width: canvas.width * 0.12,
        height: (canvas.width * 0.12) * (3 / 4),
        x: canvas.width / 2 - (canvas.width * 0.06),
        y: canvas.height * 0.8,
        speed: canvas.width * 0.01,
        movingLeft: false,
        movingRight: false
    };

    // Метеориты
    const meteors = [];
    function createMeteor() {
        const size = canvas.width * 0.08;
        meteors.push({
            x: Math.random() * (canvas.width - size),
            y: -size,
            width: size,
            height: size,
            speed: canvas.height * 0.005 + Math.random() * 2
        });
    }

    setInterval(createMeteor, 1000);

    // Управление
    document.getElementById("leftButton").addEventListener("touchstart", () => ship.movingLeft = true);
    document.getElementById("leftButton").addEventListener("touchend", () => ship.movingLeft = false);
    document.getElementById("leftButton").addEventListener("mousedown", () => ship.movingLeft = true);
    document.getElementById("leftButton").addEventListener("mouseup", () => ship.movingLeft = false);
    document.getElementById("rightButton").addEventListener("touchstart", () => ship.movingRight = true);
    document.getElementById("rightButton").addEventListener("touchend", () => ship.movingRight = false);
    document.getElementById("rightButton").addEventListener("mousedown", () => ship.movingRight = true);
    document.getElementById("rightButton").addEventListener("mouseup", () => ship.movingRight = false);


    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") ship.movingLeft = true;
        if (e.key === "ArrowRight") ship.movingRight = true;
    });
    document.addEventListener("keyup", (e) => {
        if (e.key === "ArrowLeft") ship.movingLeft = false;
        if (e.key === "ArrowRight") ship.movingRight = false;
    });

    let gameOver = false;
    let score = 0;
    let highScore = localStorage.getItem("highScore") || 0;
    let slowMotionFactor = 1; // Замедление всей игры (1 = обычная скорость)

    function update() {
        if (gameOver) {
            slowMotionFactor = 0.2; // При окончании игры замедляем игру
        }

        if (ship.movingLeft && ship.x > 0) {
            ship.x -= ship.speed * slowMotionFactor;
        }
        if (ship.movingRight && ship.x + ship.width < canvas.width) {
            ship.x += ship.speed * slowMotionFactor;
        }

        for (let i = 0; i < meteors.length; i++) {
            meteors[i].y += meteors[i].speed;

            if (checkCollision(ship, meteors[i])) {
                showGameOver();
                return;
            }

            if (meteors[i].y > canvas.height) {
                meteors.splice(i, 1);
                if (!gameOver) {
                    score++;
                    if (score > highScore) {
                        highScore = score;
                        localStorage.setItem("highScore", highScore);
                    }
                }
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(shipImage, ship.x, ship.y, ship.width, ship.height);  
        
        for (const meteor of meteors) {
            ctx.drawImage(meteorImage, meteor.x, meteor.y, meteor.width, meteor.height);
        }
        
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText(`Score: ${score}`, 10, 30);
        ctx.fillText(`High Score: ${highScore}`, 10, 60);
    }

    function showGameOver() {
        gameOver = true;
        let gameOverText = document.createElement("div");
        gameOverText.innerText = "GAME OVER\nTap to Restart";
        gameOverText.style.position = "absolute";
        gameOverText.style.top = "50%";
        gameOverText.style.left = "50%";
        gameOverText.style.transform = "translate(-50%, -50%)";
        gameOverText.style.fontSize = "5vw";
        gameOverText.style.color = "white";
        gameOverText.style.fontFamily = "Arial, sans-serif";
        gameOverText.style.fontWeight = "bold";
        gameOverText.style.textAlign = "center";
        gameOverText.style.textShadow = "2px 2px 5px black";
        document.body.appendChild(gameOverText);

        document.body.addEventListener("click", () => location.reload(), { once: true });
    }

    function checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }

    function gameLoop() {
        update();
        draw();
        setTimeout(() => requestAnimationFrame(gameLoop), 1000 / 60 * slowMotionFactor);
    }

    gameLoop();
});

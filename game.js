document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("startButton");

    // Проверка, если кнопка существует
    if (!startButton) {
        console.error("Кнопка не найдена!");
        return;
    }

    const menu = document.getElementById("menu");
    let gameStarted = false;
    let gameOver = false;
    let score = 0;
    let highScore = localStorage.getItem("highScore") || 0;
    let slowMotionFactor = 1;

    // Ресайз канваса
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const shipImage = new Image();
    shipImage.src = "images/ship.png";

    const meteorImage = new Image();
    meteorImage.src = "images/meteor.png";

    const ship = {
        width: canvas.width * 0.12,
        height: (canvas.width * 0.12) * (3 / 4),
        x: canvas.width / 2 - (canvas.width * 0.06),
        y: canvas.height * 0.8,
        speed: canvas.width * 0.01,
        movingLeft: false,
        movingRight: false
    };

    const meteors = [];
    function createMeteor() {
        const size = canvas.width * (0.05 + Math.random() * 0.06); // Разный размер метеоритов
        meteors.push({
            x: Math.random() * (canvas.width - size),
            y: -size,
            width: size,
            height: size,
            speed: (canvas.height * 0.005 + Math.random() * 2) * (1 + score / 50)
        });
    }

    setInterval(() => {
        if (gameStarted) createMeteor();
    }, 1000);

    // Управление кораблём
    document.getElementById("leftButton").addEventListener("touchstart", () => ship.movingLeft = true);
    document.getElementById("leftButton").addEventListener("touchend", () => ship.movingLeft = false);
    document.getElementById("rightButton").addEventListener("touchstart", () => ship.movingRight = true);
    document.getElementById("rightButton").addEventListener("touchend", () => ship.movingRight = false);
    document.getElementById("leftButton").addEventListener("mousedown", () => ship.movingLeft = true);
    document.getElementById("leftButton").addEventListener("mouseup", () => ship.movingLeft = false);
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

    // Функция обновления игры
    function update() {
        if (gameOver) return;

        // Движение корабля
        if (ship.movingLeft && ship.x > 0) {
            ship.x -= ship.speed * slowMotionFactor;
        }
        if (ship.movingRight && ship.x + ship.width < canvas.width) {
            ship.x += ship.speed * slowMotionFactor;
        }

        // Движение метеоритов
        for (let i = 0; i < meteors.length; i++) {
            meteors[i].y += meteors[i].speed;

            // Проверка на столкновение
            if (checkCollision(ship, meteors[i])) {
                showGameOver();
                return;
            }

            // Удаляем метеориты, которые ушли за экран
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

    // Функция отрисовки
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Отрисовка метеоритов
        for (const meteor of meteors) {
            ctx.drawImage(meteorImage, meteor.x, meteor.y, meteor.width, meteor.height);
        }

        // Отрисовка корабля
        ctx.drawImage(shipImage, ship.x, ship.y, ship.width, ship.height);

        // Отображение счёта
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText(`Score: ${score}`, 10, 30);
        ctx.fillText(`High Score: ${highScore}`, 10, 60);
    }

    // Функция конца игры
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

    // Функция проверки столкновения
    function checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }

    // Главный игровой цикл
    function gameLoop() {
        if (gameStarted) {
            update();
            draw();
            setTimeout(() => requestAnimationFrame(gameLoop), 1000 / 60 * slowMotionFactor);
        }
    }

    // Обработчик клика по кнопке "Играть"
    startButton.addEventListener("click", startGame);
    startButton.addEventListener("mousedown", startGame);
    startButton.addEventListener("touchstart", startGame);

    function startGame() {
        menu.style.display = "none";  // Скрываем меню
        gameStarted = true;
        gameLoop();  // Запускаем игровой цикл
    }
});

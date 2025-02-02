document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") ship.movingLeft = true;
    if (event.key === "ArrowRight") ship.movingRight = true;
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft") ship.movingLeft = false;
    if (event.key === "ArrowRight") ship.movingRight = false;
});

document.getElementById("leftButton").addEventListener("mousedown", () => ship.movingLeft = true);
document.getElementById("leftButton").addEventListener("mouseup", () => ship.movingLeft = false);
document.getElementById("leftButton").addEventListener("mouseleave", () => ship.movingLeft = false);

document.getElementById("rightButton").addEventListener("mousedown", () => ship.movingRight = true);
document.getElementById("rightButton").addEventListener("mouseup", () => ship.movingRight = false);
document.getElementById("rightButton").addEventListener("mouseleave", () => ship.movingRight = false);

  let score = 0;
  let highScore = localStorage.getItem("highScore") || 0; // Загружаем рекорд
  let gameOver = false;

    function slowDownMeteors() {
    for (let meteor of meteors) {
        meteor.y += meteor.speed * 0.1; // Уменьшаем скорость метеоритов
    }
    draw(); // Перерисовываем сцену, чтобы метеориты двигались медленно
    requestAnimationFrame(slowDownMeteors); // Продолжаем анимацию, но медленнее
}

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

    let gameSpeed = 1; // Начальная скорость игры (1 = нормальная, < 1 = замедление)

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
            speed: (canvas.height * 0.005 + Math.random() * 2) * gameSpeed
        });
    }

    setInterval(createMeteor, 1000); 

    // Обработчики касаний
    document.getElementById("leftButton").addEventListener("touchstart", () => ship.movingLeft = true);
    document.getElementById("leftButton").addEventListener("touchend", () => ship.movingLeft = false);
    document.getElementById("rightButton").addEventListener("touchstart", () => ship.movingRight = true);
    document.getElementById("rightButton").addEventListener("touchend", () => ship.movingRight = false);
    
    function update() {
    if (gameOver) {
        // Если игра окончена, замедляем метеориты
        for (let meteor of meteors) {
            meteor.y += meteor.speed * 0.1; // Уменьшаем скорость в 10 раз
        }
        return; // Выходим из функции, чтобы очки не начислялись
    }

    // Движение корабля
    if (ship.movingLeft && ship.x > 0) {
        ship.x -= ship.speed;
    }
    if (ship.movingRight && ship.x + ship.width < canvas.width) {
        ship.x += ship.speed;
    }

    // Движение метеоритов
    for (let i = 0; i < meteors.length; i++) {
        meteors[i].y += meteors[i].speed;

        // Проверка столкновения с кораблём
        if (checkCollision(ship, meteors[i])) {
            showGameOver();
            gameOver = true; // Устанавливаем флаг окончания игры
            return; // Выходим из update(), чтобы прекратить начисление очков
        }

        // Удаляем метеориты, вышедшие за экран
        if (meteors[i].y > canvas.height) {
            meteors.splice(i, 1);
            i--;
        }
    }

    // Начисление очков (только если игра не окончена)
    score++;
}

    function draw() {
       ctx.clearRect(0, 0, canvas.width, canvas.height);

       // Рисуем очки
       ctx.fillStyle = "white";
       ctx.font = "3vw Arial";
       ctx.fillText("Score: " + score, 20, 50);
       ctx.fillText("High Score: " + highScore, 20, 100);

        // Рисуем корабль
        ctx.drawImage(shipImage, ship.x, ship.y, ship.width, ship.height);

        // Рисуем метеориты
        for (const meteor of meteors) {
            ctx.drawImage(meteorImage, meteor.x, meteor.y, meteor.width, meteor.height);
        }
    }

    function checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }

    function showGameOver() {
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

        // Замедляем игру после столкновения
        gameSpeed = 0.2;

        gameOver = true;

        if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore); // Сохраняем новый рекорд
    }
        // Добавляем обработчик клика для перезапуска игры
        document.body.addEventListener("click", function restartGame() {
            location.reload();
        }, { once: true });
    }

    function gameLoop() {
    if (!gameOver) { // Если игра не окончена, продолжаем обновление
        update();
        draw();
        requestAnimationFrame(gameLoop);
    } else {
        slowDownMeteors(); // Замедляем метеориты после окончания игры
    }
 }

    gameLoop();
});
 

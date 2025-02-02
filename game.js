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
    shipImage.src = "images/ship.png";  // Путь к изображению корабля

    const meteorImage = new Image();
    meteorImage.src = "images/meteor.png";  // Путь к изображению метеорита

    // Корабль
    const ship = {
        width: canvas.width * 0.12, // 12% от ширины экрана
        height: (canvas.width * 0.12) * (3 / 4), // Соотношение 4:3
        x: canvas.width / 2 - (canvas.width * 0.06),
        y: canvas.height * 0.8,
        speed: canvas.width * 0.01,
        movingLeft: false,
        movingRight: false
    };

    // Метеориты
    const meteors = [];
    function createMeteor() {
        const size = canvas.width * 0.08; // Размер метеорита
        meteors.push({
            x: Math.random() * (canvas.width - size),
            y: -size,
            width: size,
            height: size,
            speed: canvas.height * 0.005 + Math.random() * 2
        });
    }

    setInterval(createMeteor, 1000); // Создаём метеориты каждую секунду

    // Обработчики касаний
    document.getElementById("leftButton").addEventListener("touchstart", () => ship.movingLeft = true);
    document.getElementById("leftButton").addEventListener("touchend", () => ship.movingLeft = false);
    document.getElementById("rightButton").addEventListener("touchstart", () => ship.movingRight = true);
    document.getElementById("rightButton").addEventListener("touchend", () => ship.movingRight = false);

    function update() {
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

            // Проверка столкновения
            if (checkCollision(ship, meteors[i])) {
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

    // Добавляем обработчик клика для перезапуска игры
    document.body.addEventListener("click", function restartGame() {
        location.reload();
    }, { once: true }); // { once: true } позволяет выполнить обработчик только один раз
}

// Вызываем вместо alert
showGameOver();

            // Удаляем метеориты, вышедшие за экран
            if (meteors[i].y > canvas.height) {
                meteors.splice(i, 1);
                i--;
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

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

    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});
 

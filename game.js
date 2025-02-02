document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Загружаем изображение корабля
    const shipImage = new Image();
    shipImage.src = "ship.png";  // Убедись, что этот файл есть в проекте

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

    document.getElementById("leftButton").addEventListener("touchstart", () => ship.movingLeft = true);
    document.getElementById("leftButton").addEventListener("touchend", () => ship.movingLeft = false);
    document.getElementById("rightButton").addEventListener("touchstart", () => ship.movingRight = true);
    document.getElementById("rightButton").addEventListener("touchend", () => ship.movingRight = false);

    function update() {
        if (ship.movingLeft && ship.x > 0) {
            ship.x -= ship.speed;
        }
        if (ship.movingRight && ship.x + ship.width < canvas.width) {
            ship.x += ship.speed;
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(shipImage, ship.x, ship.y, ship.width, ship.height);
    }

    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
    gameLoop();
});
 

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Масштабирование под размер экрана
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Корабль
    const ship = {
        width: canvas.width * 0.1,  // 10% от ширины экрана
        height: canvas.width * 0.1, // Делаем квадратным, чтобы не сплющивался
        x: canvas.width / 2 - (canvas.width * 0.05),
        y: canvas.height * 0.8,
        speed: canvas.width * 0.005,
        movingLeft: false,
        movingRight: false
    };

    // Управление кнопками
    document.getElementById("leftButton").addEventListener("touchstart", () => ship.movingLeft = true);
    document.getElementById("leftButton").addEventListener("touchend", () => ship.movingLeft = false);
    document.getElementById("rightButton").addEventListener("touchstart", () => ship.movingRight = true);
    document.getElementById("rightButton").addEventListener("touchend", () => ship.movingRight = false);

    // Движение корабля
    function update() {
        if (ship.movingLeft && ship.x > 0) {
            ship.x -= ship.speed;
        }
        if (ship.movingRight && ship.x + ship.width < canvas.width) {
            ship.x += ship.speed;
        }
    }

    // Отрисовка
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Корабль (красный квадрат)
        ctx.fillStyle = "red";
        ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
    }

    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
    gameLoop();
});
 

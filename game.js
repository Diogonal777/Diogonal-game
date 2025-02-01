const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Настройка размера
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Игровой корабль
const ship = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 80,
    width: 50,
    height: 50,
    speed: 10,
    color: "blue"
};

// Функция отрисовки корабля
function drawShip() {
    ctx.fillStyle = ship.color;
    ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
}

// Управление кораблём
window.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft" && ship.x > 0) {
        ship.x -= ship.speed;
    }
    if (event.key === "ArrowRight" && ship.x < canvas.width - ship.width) {
        ship.x += ship.speed;
    }
});

// Основной игровой цикл
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShip();
    requestAnimationFrame(gameLoop);
}

gameLoop();



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

// Класс для метеоритов
class Meteor {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = 3; // Скорость падения
    }

    // Метод для рисования метеорита
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'gray';
        ctx.fill();
        ctx.closePath();
    }

    // Метод для обновления положения метеорита
    update() {
        this.y += this.speed; // Падение вниз
    }
}

// Список метеоритов
let meteors = [];

// Функция для создания нового метеорита
function createMeteor() {
    let x = Math.random() * canvas.width; // Случайное положение по оси X
    let radius = Math.random() * 20 + 10; // Случайный радиус метеорита
    meteors.push(new Meteor(x, -radius, radius)); // Добавляем метеорит в список
}

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

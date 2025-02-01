// Инициализация холста и контекста
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Размеры канваса
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Переменные для корабля
let shipWidth = 50;
let shipHeight = 50;
let shipX = canvas.width / 2 - shipWidth / 2;
let shipY = canvas.height - shipHeight - 10;
let shipSpeed = 7;

// Массив для метеоритов
let meteors = [];

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

// Функция для создания метеоритов
function createMeteor() {
    let x = Math.random() * canvas.width; // Случайное положение по оси X
    let radius = Math.random() * 20 + 10; // Случайный радиус метеорита
    meteors.push(new Meteor(x, -radius, radius)); // Добавляем метеорит в список
}

// Рисуем корабль
function drawShip() {
    ctx.beginPath();
    ctx.rect(shipX, shipY, shipWidth, shipHeight);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
}

// Основной цикл отрисовки
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем холст

    // Рисуем корабль
    drawShip();

    // Рисуем и обновляем метеориты
    for (let i = 0; i < meteors.length; i++) {
        meteors[i].draw(ctx);
        meteors[i].update();
    }
}

// Обновление игрового состояния
function update() {
    // Проверка столкновений
    for (let i = 0; i < meteors.length; i++) {
        if (checkCollision(meteors[i])) {
            alert('Game Over!');
            resetGame();
            return;
        }
    }
}

// Проверка столкновения между кораблем и метеоритом
function checkCollision(meteor) {
    // Проверка на пересечение прямоугольника (корабль) с кругом (метеорит)
    let dx = meteor.x - (shipX + shipWidth / 2);
    let dy = meteor.y - (shipY + shipHeight / 2);
    let distance = Math.sqrt(dx * dx + dy * dy);
    return distance < meteor.radius + shipWidth / 2;
}

// Сброс игры
function resetGame() {
    // Очистка списка метеоритов
    meteors = [];
    // Перемещение корабля в начальное положение
    shipX = canvas.width / 2 - shipWidth / 2;
    shipY = canvas.height - shipHeight - 10;
}

// Управление кораблем
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && shipX > 0) {
        shipX -= shipSpeed; // Двигаем влево
    }
    if (e.key === 'ArrowRight' && shipX < canvas.width - shipWidth) {
        shipX += shipSpeed; // Двигаем вправо
    }
});

// Основной игровой цикл
function gameLoop() {
    draw();
    update();
    requestAnimationFrame(gameLoop);
}

// Запуск игрового цикла
gameLoop();

// Создание метеоритов каждые 2 секунды
setInterval(createMeteor, 2000);
 

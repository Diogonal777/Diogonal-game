// Настройка канваса
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Настройка размеров канваса
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Начальные параметры
let shipX = canvas.width / 2;
let shipY = canvas.height - 100;
let shipWidth = canvas.width * 0.1;
let shipHeight = canvas.height * 0.1;
let shipSpeed = canvas.width * 0.02;

let meteors = [];
let score = 0;
let gameOver = false;

const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');

// Переменные для плавного перемещения
let targetX = shipX; // Цель для движения корабля
const movementSpeed = canvas.width * 0.05; // Скорость движения

// Управление кораблем с помощью кнопок
leftButton.addEventListener('click', () => {
    targetX = Math.max(0, shipX - shipSpeed);  // Ограничаем движение слева
});

rightButton.addEventListener('click', () => {
    targetX = Math.min(canvas.width - shipWidth, shipX + shipSpeed);  // Ограничаем движение справа
});

// Класс метеоритов
class Meteor {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -50;
        this.radius = canvas.width * 0.05;
        this.speed = 3;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
            meteors.splice(meteors.indexOf(this), 1);
        }
    }
}

// Рисуем корабль
function drawShip() {
    ctx.beginPath();
    ctx.rect(shipX, shipY, shipWidth, shipHeight);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
}

// Рисуем все метеориты
function drawMeteors() {
    meteors.forEach(meteor => {
        meteor.draw();
    });
}

// Проверка на столкновение
function checkCollision() {
    meteors.forEach(meteor => {
        const dx = meteor.x - shipX - shipWidth / 2;
        const dy = meteor.y - shipY - shipHeight / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < meteor.radius + shipWidth / 2) {
            gameOver = true;
        }
    });
}

// Обновление игры
function updateGame() {
    if (gameOver) {
        ctx.font = '50px Arial';
        ctx.fillStyle = 'red';
        ctx.fillText('GAME OVER', canvas.width / 2 - 150, canvas.height / 2);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Плавное перемещение корабля
    shipX += (targetX - shipX) * 0.1; // Интерполяция для плавного движения

    drawShip();
    drawMeteors();

    meteors.forEach(meteor => {
        meteor.update();
    });

    checkCollision();
}

// Создание метеоритов
function createMeteor() {
    if (!gameOver) {
        const meteor = new Meteor();
        meteors.push(meteor);
    }
}

// Добавление метеоритов каждые 1.5 секунды
setInterval(createMeteor, 1500);

// Обновление игры каждую 1/60 секунды
setInterval(updateGame, 1000 / 60);
 

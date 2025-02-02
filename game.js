const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Устанавливаем размер канваса
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Переменные игры
let shipWidth = canvas.width * 0.1; 
let shipHeight = shipWidth * 1.5; // Делаем корабль выше, чтобы не сплющивался
let shipX = (canvas.width - shipWidth) / 2;
let shipY = canvas.height - shipHeight - 20;
let shipSpeed = 0;

// Управление кнопками
document.getElementById("leftButton").addEventListener("touchstart", () => { shipSpeed = -5; });
document.getElementById("rightButton").addEventListener("touchstart", () => { shipSpeed = 5; });
document.getElementById("leftButton").addEventListener("touchend", () => { shipSpeed = 0; });
document.getElementById("rightButton").addEventListener("touchend", () => { shipSpeed = 0; });

function update() {
    shipX += shipSpeed;
    if (shipX < 0) shipX = 0;
    if (shipX + shipWidth > canvas.width) shipX = canvas.width - shipWidth;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем корабль
    ctx.fillStyle = "blue";
    ctx.fillRect(shipX, shipY, shipWidth, shipHeight);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

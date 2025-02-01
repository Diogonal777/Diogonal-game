var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;

var game = new Phaser.Game(config);

function preload() {
    this.load.image('player', 'https://example.com/player.png'); // Замените на свой спрайт
}

function create() {
    player = this.physics.add.image(400, 300, 'player');
}

function update() {
    if (this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.LEFT)) {
        player.x -= 5;
    } else if (this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.RIGHT)) {
        player.x += 5;
    }

    if (this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.UP)) {
        player.y -= 5;
    } else if (this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.DOWN)) {
        player.y += 5;
    }
}


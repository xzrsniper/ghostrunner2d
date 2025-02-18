const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 500 }, debug: false }
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: { preload, create, update }
};

let player;
let swipeStartX, swipeStartY;

const game = new Phaser.Game(config);

function preload() {
    console.log("🔄 Завантаження спрайтів...");
    
    // Переконайся, що файл існує
    this.load.spritesheet('player', 'https://xzrsniper.github.io/ghostrunner2d/assets/cyber_ninja_spritesheet.png', { 
        frameWidth: 160, 
        frameHeight: 360 
    });

    this.load.image('platform', 'https://xzrsniper.github.io/ghostrunner2d/assets/platform.png');
    this.load.image('laser', 'https://xzrsniper.github.io/ghostrunner2d/assets/laser.png');

    this.load.on('loaderror', function(file) {
        console.error("❌ Помилка завантаження:", file.src);
    });
}

function create() {
    let tg = window.Telegram.WebApp;
    tg.expand();

    this.add.text(10, 10, 'Ghostrunner 2D', { fontSize: '20px', fill: '#fff' });

    // Додаємо платформу
    const platforms = this.physics.add.staticGroup();
    platforms.create(this.scale.width / 2, this.scale.height - 20, 'platform')
        .setScale(this.scale.width / 400, 1)
        .refreshBody();

    // Додаємо персонажа
    player = this.physics.add.sprite(100, this.scale.height - 100, 'player');
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);

    // Анімації персонажа
    this.anims.create({ key: 'idle', frames: [{ key: 'player', frame: 0 }], frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'run', frames: this.anims.generateFrameNumbers('player', { start: 1, end: 2 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'jump', frames: [{ key: 'player', frame: 3 }], frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'attack', frames: [{ key: 'player', frame: 4 }], frameRate: 10, repeat: -1 });

    // Сенсорне керування (свайпи)
    this.input.on('pointerdown', function(pointer) {
        swipeStartX = pointer.x;
        swipeStartY = pointer.y;
    }, this);

    this.input.on('pointerup', function(pointer) {
        const diffX = pointer.x - swipeStartX;
        const diffY = pointer.y - swipeStartY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0) {
                player.setVelocityX(200);
                player.play('run', true);
            } else {
                player.setVelocityX(-200);
                player.play('run', true);
            }
        } else {
            if (diffY < 0) {
                player.setVelocityY(-350);
                player.play('jump', true);
            }
        }
    }, this);

    this.scale.on('resize', resizeGame, this);
}

function update() {
    if (player.body.touching.down) {
        if (player.body.velocity.x === 0) {
            player.play('idle', true);
        } else {
            player.play('run', true);
        }
    }
}

function resizeGame(gameSize) {
    let width = gameSize.width;
    let height = gameSize.height;

    game.scale.resize(width, height);
    game.scale.refresh();
}

// Подія зміни розміру
window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
    game.scale.refresh();
});

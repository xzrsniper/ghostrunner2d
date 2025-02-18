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
        mode: Phaser.Scale.RESIZE, // Автоматична адаптація
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: { preload, create, update }
};

let player, cursors;

const game = new Phaser.Game(config);

function preload() {
    this.load.spritesheet('player', 'player-sprite.png', { frameWidth: 64, frameHeight: 64 });
    this.load.image('platform', 'platform.png');
    this.load.image('laser', 'laser.png');
}

function create() {
    this.add.text(10, 10, 'Ghostrunner 2D', { fontSize: '20px', fill: '#fff' });

    // Платформа адаптується до ширини екрану
    const platforms = this.physics.add.staticGroup();
    platforms.create(this.scale.width / 2, this.scale.height - 20, 'platform')
        .setScale(this.scale.width / 400, 1)
        .refreshBody();

    player = this.physics.add.sprite(100, this.scale.height - 100, 'player');
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, platforms);

    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    // Додаємо адаптацію під мобільні сенсори
    this.input.on('pointerdown', startSwipe, this);
    this.input.on('pointerup', endSwipe, this);

    // Автоматичне оновлення розміру елементів
    this.scale.on('resize', resizeGame, this);
}

function update() {
    if (player.body.touching.down) {
        player.play('run', true);
    }
}

function startSwipe(pointer) {
    this.swipeStartX = pointer.x;
    this.swipeStartY = pointer.y;
}

function endSwipe(pointer) {
    const diffX = pointer.x - this.swipeStartX;
    const diffY = pointer.y - this.swipeStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
            player.setVelocityX(200);
        } else {
            player.setVelocityX(-200);
        }
    } else {
        if (diffY < 0) {
            player.setVelocityY(-350);
        }
    }
}

// Функція зміни розміру гри при зміні екрану
function resizeGame(gameSize) {
    let width = gameSize.width;
    let height = gameSize.height;

    this.cameras.resize(width, height);
    player.setPosition(width / 2, height - 100);
}

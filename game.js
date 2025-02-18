const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 500 }, debug: false }
    },
    scene: { preload, create, update }
};

let player, cursors;
let swipeStartX, swipeStartY;

const game = new Phaser.Game(config);

function preload() {}

function create() {
    this.add.text(10, 10, 'Ghostrunner 2D', { fontSize: '20px', fill: '#fff' });

    const platforms = this.physics.add.staticGroup();
    platforms.create(400, 580, 'platform').setScale(2).refreshBody();
    
    const graphics = this.add.graphics();
    graphics.fillStyle(0x00ff00, 1);
    graphics.fillRect(380, 570, 80, 20);

    player = this.physics.add.sprite(100, 450, 'player');
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, platforms);

    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();
    this.input.on('pointerdown', startSwipe, this);
    this.input.on('pointerup', endSwipe, this);

    const lasers = this.physics.add.group();
    const laser = this.add.graphics();
    laser.fillStyle(0xff0000, 1);
    laser.fillRect(300, 500, 50, 10);
    lasers.add(laser);
    this.physics.add.collider(player, lasers, hitLaser, null, this);
}

function update() {
    if (player.body.touching.down) {
        player.play('run', true);
    }
}

function startSwipe(pointer) {
    swipeStartX = pointer.x;
    swipeStartY = pointer.y;
}

function endSwipe(pointer) {
    const swipeEndX = pointer.x;
    const swipeEndY = pointer.y;
    const diffX = swipeEndX - swipeStartX;
    const diffY = swipeEndY - swipeStartY;
    
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

function hitLaser(player, laser) {
    player.setTint(0xff0000);
    player.setVelocity(0);
}

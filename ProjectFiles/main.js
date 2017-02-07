let brickBreak = new Phaser.Game(800, 600, Phaser.CANVAS, '', {
    preload,
    create,
    update
});

let ball;
let paddle;
let brick;
let gridBrick;
let brickStyle;
let brickField;

function preload() {
    brickBreak.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    brickBreak.scale.pageAlignHorizontally = true;
    brickBreak.scale.pageAlignVertically = true;
    brickBreak.stage.background = '#000';
    //add image sprites
    brickBreak.load.image("ball", "img/shiny green ball.png");
    brickBreak.load.image("paddle", "img/paddle.png");
    brickBreak.load.image("brick", "img/greenBrick.png");

}

function create() {
    //physics setUp with worldBounds
    brickBreak.physics.startSystem(Phaser.Physics.ARCADE);
    brickBreak.physics.arcade.checkCollision.down = false;
    //ball
    ball = brickBreak.add.sprite(brickBreak.world.width * 0.5, brickBreak.world.height - 75, "ball");
    brickBreak.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.anchor.set(0.5);
    ball.scale.setTo(0.04, 0.04);
    ball.body.velocity.set(200, -200);
    ball.body.collideWorldBounds = true;
    ball.checkWorldBounds = true;
    ball.events.onOutOfBounds.add(gameOver, this);
    ball.body.bounce.set(1);

    //main paddle
    paddle = brickBreak.add.sprite(brickBreak.world.width * 0.5, 550, "paddle");
    brickBreak.physics.enable(paddle, Phaser.Physics.ARCADE);
    paddle.scale.setTo(0.2, 0.2);
    paddle.anchor.set(0.5, 1);
    paddle.body.collideWorldBounds = true;
    paddle.body.immovable = true;
    //
    // let paddleHalf = paddle.width / 2;

    brickMap();
}

function update() {
    brickBreak.physics.arcade.collide(ball, paddle);
    brickBreak.physics.arcade.collide(ball, brickField, destroyBrick);
    paddle.x = brickBreak.input.x || brickBreak.world.width * 0.5;
}


function gameOver(ball) {
    alert("game over!");
}

function destroyBrick(ball, gridBrick) {
  gridBrick.kill();
}

function brickMap() {
    brickStyle = {
      padding: 10,
      width: 30,
      // height: 25
      offset: {
        top: 50,
        left: 160
      }
    };

    brickField = brickBreak.add.group();

    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 12; x++) {
          let xBrick = (x * (brickStyle.width+brickStyle.padding))+brickStyle.offset.left;
          let yBrick = (y * (brickStyle.width+brickStyle.padding))+brickStyle.offset.top;
          gridBrick = brickBreak.add.sprite(xBrick, yBrick, "brick");
          brickBreak.physics.enable(gridBrick, Phaser.Physics.ARCADE);
          gridBrick.body.immovable = true;
          gridBrick.anchor.set(0.5);
          brickField.add(gridBrick);


            // brickField.enableBody = true;
            // brickField.physicsBodyType = Phaser.physics.ARCADE;
        }
    }
}

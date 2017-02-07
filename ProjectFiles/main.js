/*jshint esversion: 6 */

let brickBreak = new Phaser.Game(800, 600, Phaser.CANVAS, '', {
    preload,
    create,
    update
});

let ball;
let paddle;
let innerBricks;
let brickStyle;
let brickField;
let score = 0;
let textScore;
let startText;
let highScore;
let lives = 3;
let livesText;
let start;
let paddleMove = false;
let ballOnPaddle = true;
let roundText;
let gameOverText;



function preload() {
    brickBreak.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    brickBreak.scale.pageAlignHorizontally = true;
    brickBreak.scale.pageAlignVertically = true;
    brickBreak.stage.background = '#000';
    //add image sprites
    brickBreak.load.image("ball", "img/shiny green ball.png");
    brickBreak.load.image("paddle", "img/paddle.png");
    brickBreak.load.image("brick", "img/greenBrick.png");
    brickBreak.load.image("start", "img/start.png");

}

function create() {
    //physics setUp with worldBounds
    brickBreak.physics.startSystem(Phaser.Physics.ARCADE);
    brickBreak.physics.arcade.checkCollision.down = false;

    start = brickBreak.add.button(brickBreak.world.width * 0.5, brickBreak.world.height - 200, "start", letsPlay);
    start.scale.setTo(0.5);
    start.anchor.set(0.5);
    roundText = brickBreak.add.text(brickBreak.world.centerX, 400, 'Ready?', { font: "40px Arial", fill: "#ffffff", align: "center" });
    roundText.anchor.set(0.5);
    roundText.visible = false;
    gameOverText = brickBreak.add.text(brickBreak.world.centerX, 400, 'Game Over Dude', { font: "40px Arial", fill: "#ffffff", align: "center" });
    gameOverText.visible = false;
    gameOverText.anchor.set(0.5);


    ball = brickBreak.add.sprite(brickBreak.world.width * 0.5, 514, "ball");
    brickBreak.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.anchor.set(0.5);
    ball.scale.setTo(0.04, 0.04);
    ball.body.collideWorldBounds = true;
    ball.checkWorldBounds = true;
    ball.events.onOutOfBounds.add(lostBall, this);
    ball.body.bounce.set(1);

    paddle = brickBreak.add.sprite(brickBreak.world.width * 0.5, 550, "paddle");
    brickBreak.physics.enable(paddle, Phaser.Physics.ARCADE);
    paddle.scale.setTo(0.2, 0.2);
    paddle.anchor.set(0.5, 1);
    paddle.body.collideWorldBounds = true;
    paddle.body.immovable = true;

  let textStuff = textMaker();
  fieldMaker();
}



function update() {
    brickBreak.physics.arcade.collide(ball, paddle);
    brickBreak.physics.arcade.collide(ball, brickField, destroyBrick);
    if (paddleMove) {
      paddle.x = brickBreak.input.x || brickBreak.world.width * 0.5;
    }
}
function letsPlay() {
  start.destroy();
  paddleMove = true;
  releaseBall();
}

function releaseBall() {
  roundText.visible = false;
  paddleMove = true;
  if (ballOnPaddle) {

  ball.body.velocity.set(300, -300);
  ballOnPaddle = false;
  }
}


function destroyBrick(ball, innerBricks) {
    innerBricks.kill();
    score += 5;
    textScore.setText(`Score: ${score}`);
    checkWin();
}

function checkWin() {
    if (brickField.countLiving() === 0) {
        alert("Winner! Winner!");
        location.reload();
    }
}

function lostBall(ball) {
  lives --;
  let reset = paddleReset();
  if (lives) {
    livesText.setText(`Lives: ${lives}`);
    ball.reset(brickBreak.world.width * 0.5, 514);
    ball.body.velocity.set(0);
    ballOnPaddle = true;
    roundText.visible = true;
    brickBreak.time.events.add(Phaser.Timer.SECOND * 2,releaseBall, this);
  }
  else {
    livesText.setText(`Lives: ${lives}`);
    gameOverText.visible = true;
  }
}

  function paddleReset() {
      paddle.reset(brickBreak.world.width * 0.5, 550);
      // paddle.anchor.set(0.5, 0.5)
      paddleMove = false;
  }

function textMaker() {
  let textInfo = {
    font: "20px Copperplate",
    fill: "#FFF"
  };
  textScore = brickBreak.add.text(20, 10, "Score: 0", textInfo);
  highScore = brickBreak.add.text(650, 50, "highScore: 0", textInfo);
  livesText = brickBreak.add.text(650, 10, "Lives: 3", textInfo);
}

function fieldMaker() {
    brickStyle = {
        padding: 10,
        width: 30,
        offset: {
            top: 50,
            left: 160
        }
    };
    brickField = brickBreak.add.group();
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 12; x++) {
            let xBrick = (x * (brickStyle.width + brickStyle.padding)) + brickStyle.offset.left;
            let yBrick = (y * (brickStyle.width + brickStyle.padding)) + brickStyle.offset.top;
            innerBricks = brickBreak.add.sprite(xBrick, yBrick, "brick");
            brickBreak.physics.enable(innerBricks, Phaser.Physics.ARCADE);
            innerBricks.body.immovable = true;
            innerBricks.anchor.set(0.5);
            brickField.add(innerBricks);
        }
    }
}

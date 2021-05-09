const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");


let score;
let scoreText;
let highscore;
let highscoreText;
let player;
let gravity;
let obstacles = [];
let gameSpeed;
let keys = {};
let dicemText;
let dicemText1;
var bg = new Image();
var amet = new Image();
var coin=new Image();
var marti=new Image();
var ses=new Audio();



ses.src="sounds/dogeMoon.mp3";
bg.src = "images/martian.jpeg";
amet.src="images/amet.png";
coin.src="images/coin.png";
marti.src="images/martian.jpeg";

document.addEventListener("keydown", function (evt) {
  keys[evt.code] = true;
});
document.addEventListener("keyup", function (evt) {
  keys[evt.code] = false;
});

class Player {
  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;

    this.dy = 0;
    this.jumpForce = 15;
    this.originalHeight = h;
    this.grounded = false;
    this.jumpTimer = 0;
  }

  Animate() {

    if (keys["Space"] || keys["KeyW"] | keys["KeyUp"]) {
      this.Jump();
    } else {
      this.jumpTimer = 0;
    }

    if (keys["ShiftLeft"] || keys["KeyS"]) {
      this.h = this.originalHeight / 2;
    } else {
      this.h = this.originalHeight;
    }

    this.y += this.dy;

    if (this.y + this.h < canvas.height) {
      this.dy += gravity;
      this.grounded = false;
    } else {
      this.dy = 0;
      this.grounded = true;
      this.y = canvas.height - this.h;
    }

    this.Draw();
  }

  Jump() {
    if (this.grounded && this.jumpTimer == 0) {
      this.jumpTimer = 1;
      this.dy = -this.jumpForce;
    } else if (this.jumpTimer > 0 && this.jumpTimer < 15) {
      this.jumpTimer++;
      this.dy = -this.jumpForce - this.jumpTimer / 50;
    }
  }

  Draw() {//elon musk nesnesi
    
    ctx.drawImage(amet,this.x,this.y-50,this.w,this.h);
    ses.play();
  }
}

class Obstacle {
  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;

    this.dx = -gameSpeed;
  }

  Update() {
    this.x += this.dx;
    this.Draw();
    this.dx = -gameSpeed;
  }

  Draw() {
    ctx.drawImage(coin,this.x,this.y-50,this.w,this.h);
  }
}

class Text {
  constructor(t, x, y, a, c, s) {
    this.t = t;
    this.x = x;
    this.y = y;
    this.a = a;
    this.c = c;
    this.s = s;
  }

  Draw() {
    ctx.beginPath();
    ctx.fillStyle = this.c;
    ctx.font = this.s + "px sans-serif";
    ctx.textAlign = this.a;
    ctx.fillText(this.t, this.x, this.y);
    ctx.closePath();
  }
}

function SpawnObstacle() {
  let size = RandomIntInRange(20, 70);
  let type = RandomIntInRange(0, 1);
  let obstacle = new Obstacle(
    canvas.width + size,
    canvas.height - size,
    size,
    size,
    "#7FFF00"
  );

  if (type == 1) {
    obstacle.y -= player.originalHeight - 10;
  }
  obstacles.push(obstacle);
}

function RandomIntInRange(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function Start() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ses.play();
  ctx.font = "20px sans-serif";

  gameSpeed = 4;
  gravity = 1;

  score = 0;
  highscore = 0;
  if (localStorage.getItem("highscore")) {
    highscore = localStorage.getItem("highscore");
  }

  player = new Player(250, 0, 60, 60, "#7FFF00");

  scoreText = new Text("To the Moon: " + score, 80, 50, "left", "green", "40");


  dicemText = new Text("Elon Musk dreams about dogecoin. Can you help him?", 50,300,"left","purple","15");
  dicemText1 = new Text("Up: W, Down: S. (Please play fullscreen.)", 50,370,"left","purple","15");


  highscoreText = new Text(
    "Best Score: " + highscore,
    canvas.width - 50,
    50,
    "right",
    "green",
    "40"
  );

}

let initialSpawnTimer = 200;
let spawnTimer = initialSpawnTimer;

function Update() {
  let pattern = ctx.createPattern(bg, "repeat");
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  //ctx.clearRect(0, 0, canvas.width, canvas.height);

  spawnTimer--;
  if (spawnTimer <= 0) {
    SpawnObstacle();
    console.log(obstacles);
    spawnTimer = initialSpawnTimer - gameSpeed * 8;

    if (spawnTimer < 60) {
      spawnTimer = 60;
    }
  }

  for (let i = 0; i < obstacles.length; i++) {
    let o = obstacles[i];

    if (o.x + o.w < 0) {
      obstacles.splice(i, 1);
    }

    if (
      player.x < o.x + o.w &&
      player.x + player.w > o.x &&
      player.y < o.y + o.h &&
      player.y + player.h > o.y
    ) {
      obstacles = [];
      score = 0;
      spawnTimer = initialSpawnTimer;
      gameSpeed = 3;
      window.localStorage.setItem("highscore", highscore);
    }

    o.Update();
  }

  player.Animate();

  score++;
  scoreText.t = "To the Moon: " + score;
  scoreText.Draw();

  if (score > highscore) {
    highscore = score;
    highscoreText.t = "En yüksek skor: " + highscore;
  }

  highscoreText.Draw();
  dicemText.Draw();
  dicemText1.Draw();
  gameSpeed += 0.003;

  requestAnimationFrame(Update);
}

Start();
Update();
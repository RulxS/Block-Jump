var speed;
var y;
var yVel;
var onGround;

var score;

var horizon;
var obstacles = [];

function setup()
{
  createCanvas(1450,600);

  textAlign(CENTER);

  horizon = height - 40;
  y = 20;
  score = yVel = 0;
  speed = 5;
  onGround = false;
}

function draw()
{
  background(51);

  //draw horizon
  stroke(255);
  line(0, horizon, width, horizon);

  fill('#999999');
  ellipse(40, y, 40);

  if (frameCount % 120 === 0)
  {
    speed *= 1.1;
  }

  if (frameCount % 35 === 0)
  {
    if (random(0,4) > 0.5 )
    {
      newObstacle();
    }
  }


  score++;
  textSize(20);
  text("Score: " + score, width/2, 30);

  //newObstacle();
  updateObstacles();
  handleTRex();
}

function updateObstacles()
{
  for (var i = obstacles.length - 1; i >= 0; i--)
  {
    obstacles[i].x -= speed;
    var x = obstacles[i].x
    var size = obstacles[i].size;

    if (x > -30)
    {
      //if it's onscreen
      fill(obstacles[i].color)
      rect(x, horizon - size, size, size);
      var x1 = x + size / 2;
      var y1 = horizon - size / 2
      if (dist(x1, y1, 40, y) < (size / 2) + 20)
      {
        //collision
        noStroke();
        fill(255);
        textSize(40);
        text("GAME OVER", width / 2, height / 2);
        textSize(20);
        text("press f5 to restart",  width / 2, height / 2 + 40);
        noLoop();
      }
    }
    else
    {
      //delete from array
      obstacles.splice(i, 1);
    }
  }
}

function newObstacle()
{
  var obs = new Obstacle(random(20, 40), color(random(255), random(255), random(255)));
  obstacles.push(obs);
}

function handleTRex()
{
  if (y + 20 + yVel < horizon)
  {
    yVel += .8;
    onGround = false;
  }
  else
  {
    yVel = 0;
    onGround = true;
  }



  if (mouseIsPressed || keyIsDown(UP_ARROW) || keyIsDown(32) )
  {
    if (onGround)
    {
      yVel -= 10;
      onGround = false;
    }
  }
  //movement
  y += yVel;
}

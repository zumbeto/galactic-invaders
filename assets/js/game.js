const container = document.querySelector(".container");
const btn_start = document.querySelector(".startButton");
const myShip = document.querySelector(".myShip");
const fireme = document.querySelector(".fireme");
const scoreOutput = document.querySelector(".score");
const containerDim = container.getBoundingClientRect();
const instruction = document.querySelector(".instruction");
const message = document.querySelector(".message");

btn_start.addEventListener("click", startGame);

let player = {
  score: 0,
  speed: 5,
  gameOver: true,
  fire: false,
  alienSpeed: 5
};

let keyValue = {};

document.addEventListener("keydown", function (e) {
  let key = e.keyCode;
  if (key === 37) {
    keyValue.left = true;
  } else if (key === 39) {
    keyValue.right = true;
  } else if (key === 38 || key === 32) {
    if (!player.fire) {
      addShoot();
    }
  }
});

document.addEventListener("keyup", function (e) {
  let key = e.keyCode;
  if (key === 37) {
    keyValue.left = false;
  } else if (key === 39) {
    keyValue.right = false;
  }
});

function gameOver() {
  btn_start.style.display = "block";
  btn_start.innerHTML = "Restart New Game";
  player.fire = true;
  fireme.classList.add("hide");
}

function clearAliens() {
  let tempAliens = document.querySelectorAll(".alien");
  for (let x = 0; x < tempAliens.length; x++) {
    tempAliens[x].parentNode.removeChild(tempAliens[x]);
  }
}

function startGame() {
  if (player.gameOver) {
    clearAliens();
    player.gameOver = false;
    btn_start.style.display = "none";
    instruction.style.display = "none";
    player.score = 0;
    player.alienSpeed = 7;
    player.fire = false;
    setupAliens(20);
    scoreOutput.textContent = player.score;
    messageOutput("Good Luck!!!");
    player.animFrame = requestAnimationFrame(update);
  }
}

function setupAliens(num) {
  let tempWidth = 70;
  let lastCol = containerDim.width - tempWidth;
  let row = {
    x: containerDim.left + 50,
    y: 50
  };

  for (x = 0; x < num; x++) {
    if (row.x > lastCol - tempWidth) {
      row.y += 70;
      row.x = containerDim.left + 50;
    }

    alienMaker(row, tempWidth);
    row.x += tempWidth + 20;
  }
}

function alienMaker(row, tempWidth) {
  if (row.y > containerDim.height - 200) {
    return;
  }

  console.log(row);
  let div = document.createElement("div");
  div.classList.add("alien");
  div.style.backgroundColor = randomColor();

  let eye1 = document.createElement("span");
  eye1.classList.add("eye");
  eye1.style.left = "20px";
  div.appendChild(eye1);

  let eye2 = document.createElement("span");
  eye2.classList.add("eye");
  eye2.style.left = "20px";
  eye2.style.bottom = "5px";
  div.appendChild(eye2);

  let mouth = document.createElement("span");
  mouth.classList.add("mouth");
  div.appendChild(mouth);
  mouth.style.right = "10px";
  mouth.style.bottom = "35px";

  div.style.width = tempWidth + "px";
  div.xpos = Math.floor(row.x);
  div.ypos = Math.floor(row.y);

  div.style.left = div.xpos + "px";
  div.style.top = div.ypos + "px";
  div.directionMove = 1;

  container.appendChild(div);
  console.log(div);
}

function randomColor() {
  return "#" + Math.random().toString(16).substr(-6);
}

function addShoot() {
  player.fire = true;
  fireme.classList.remove("hide");
  fireme.xpos = myShip.offsetLeft + myShip.offsetWidth / 2;
  fireme.ypos = myShip.offsetTop - 10;
  fireme.style.left = fireme.xpos + "px";
  fireme.style.top = fireme.ypos + "px";
}
function isCollide(a, b) {
  let aRect = a.getBoundingClientRect();
  let bRect = b.getBoundingClientRect();
  return !(
    aRect.bottom < bRect.top ||
    aRect.top > bRect.bottom ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

function messageOutput(mes) {
  message.innerHTML = mes;
}

function update() {
  if (!player.gameOver) {
    let tempPos = myShip.offsetLeft;

    let tempAliens = document.querySelectorAll(".alien");

    if (tempAliens.length == 0) {
      player.gameOver = true;
      messageOutput("You Won");
      gameOver();
    }

    for (var x = tempAliens.length - 1; x > -1; x--) {
      let el = tempAliens[x];

      if (isCollide(el, fireme)) {
        messageOutput("HIT");
        player.alienSpeed++;
        player.score++;
        scoreOutput.textContent = player.score;
        player.fire = false;
        fireme.classList.add("hide");
        el.parentNode.removeChild(el);
        fireme.ypos = containerDim.height + 100;
      }

      if (
        el.xpos > containerDim.width - el.offsetWidth ||
        el.xpos < containerDim.left
      ) {
        el.directionMove *= -1;
        el.ypos += 40;

        if (el.ypos > myShip.offsetTop - 50) {
          messageOutput("Game Over");
          player.gameOver = true;
          gameOver();
        }
      }

      el.xpos += player.alienSpeed * el.directionMove;

      el.style.left = el.xpos + "px";
      el.style.top = el.ypos + "px";
    }

    if (player.fire) {
      if (fireme.ypos > 0) {
        fireme.ypos -= 15;
        fireme.style.top = fireme.ypos + "px";
      } else {
        player.fire = false;
        fireme.classList.add("hide");
        fireme.ypos = containerDim.height + 100;
      }
    }

    if (keyValue.left && tempPos > containerDim.left) {
      tempPos -= player.speed;
    }
    if (keyValue.right && tempPos + myShip.offsetWidth < containerDim.right) {
      tempPos += player.speed;
    }
    myShip.style.left = tempPos + "px";
    player.animFrame = requestAnimationFrame(update);
  }
}

function clearAliens() {
  let tempAliens = document.querySelectorAll(".alien");
  for (let x = 0; x < tempAliens.length; x++) {
    tempAliens[x].parentNode.removeChild(tempAliens[x]);
  }
}
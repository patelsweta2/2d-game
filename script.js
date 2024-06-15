document.addEventListener("DOMContentLoaded", (event) => {
  let statusCurrent;
  const WIDTH = 850;
  let frames = 0;
  let states = {
    play: 0,
    playing: 1,
    i_lost: 2,
  };
  let user = document.querySelector(".user");
  let ground = document.querySelector(".ground");
  let Box = document.querySelector(".game-box");
  let enemiesContainer = document.querySelector(".enemies");
  let playOverlay = document.querySelector(".overlay.play");
  let lostOverlay = document.querySelector(".overlay.lost");

  let player = {
    gravity: 1.2,
    speed: 0,
    jumpStrength: 23,
    maxJumps: 2,
    jumpCount: 0,
  };

  let enemies = []; // Array to store enemies
  let tempoInsere = 0;

  function userOnGround() {
    player.speed = player.speed + player.gravity;
    const newY = user.offsetTop + player.speed;
    const maxY = ground.offsetTop - user.offsetHeight;

    if (newY > maxY && statusCurrent !== states.i_lost) {
      user.style.top = `${maxY}px`;
      player.jumpCount = 0;
      player.speed = 0;
    } else {
      user.style.top = `${newY}px`;
    }
  }

  function jump() {
    if (player.jumpCount < player.maxJumps) {
      player.speed = -player.jumpStrength;
      player.jumpCount++;
    }
  }

  // Function to insert a new enemy
  function insertEnemy() {
    let colors = [
      "#D80000",
      "#BE00D8",
      "#2B00C9",
      "#0B9200",
      "#7E9200",
      "#926700",
      "#923600",
      "#920000",
    ];
    let newEnemy = document.createElement("div");
    newEnemy.classList.add("enemy");
    newEnemy.style.left = `${WIDTH}px`;
    newEnemy.style.width = `${30 + Math.floor(20 * Math.random())}px`;
    newEnemy.style.height = `${30 + Math.floor(120 * Math.random())}px`;
    newEnemy.style.backgroundColor = colors[Math.floor(8 * Math.random())];
    newEnemy.style.position = "absolute";
    newEnemy.style.bottom = `${ground.offsetHeight}px`;

    enemiesContainer.appendChild(newEnemy);
    enemies.push(newEnemy);

    tempoInsere = 120 + Math.floor(41 * Math.random());
  }

  // Function to animate enemies
  function animateEnemies() {
    if (tempoInsere === 0) {
      insertEnemy();
    } else {
      tempoInsere--;
    }

    for (let i = 0; i < enemies.length; i++) {
      let enemy = enemies[i];
      let enemyX = parseFloat(enemy.style.left);
      enemy.style.left = `${enemyX - 2}px`;

      // Check collision with the user
      let userX = user.offsetLeft;
      let userWidth = user.offsetWidth;
      let userTop = user.offsetTop;
      let userHeight = user.offsetHeight;
      let enemyWidth = parseFloat(enemy.style.width);
      let enemyHeight = parseFloat(enemy.style.height);

      if (
        userX < enemyX + enemyWidth &&
        userX + userWidth > enemyX &&
        userTop + userHeight > ground.offsetTop - enemyHeight
      ) {
        statusCurrent = states.i_lost;
        console.log("Game Over!");
      }

      // Remove enemies that are off-screen
      if (enemyX + enemyWidth <= 0) {
        enemies.splice(i, 1);
        enemy.length--;
        i--;
      }
    }
  }
  function clean() {
    enemies = [];
    while (enemiesContainer.firstChild) {
      enemiesContainer.removeChild(enemiesContainer.firstChild);
    }
    player.speed = 0;
    player.jumpCount = 0;
  }

  function click(e) {
    if (statusCurrent === states.playing) {
      jump();
    } else if (statusCurrent === states.play) {
      statusCurrent = states.playing;
    } else if (statusCurrent === states.i_lost) {
      statusCurrent = states.play;
      user.style.top = "0px";
      clean();
    }
  }

  function main() {
    Box.addEventListener("click", click);
    statusCurrent = states.play;
    gameLoop();
  }

  function update() {
    frames++;
    userOnGround();
    if (statusCurrent === states.playing) {
      animateEnemies();
    } else if (statusCurrent === states.i_lost) {
      clean();
    }
  }

  function draw() {
    if (statusCurrent === states.play) {
      playOverlay.style.display = "flex";
      lostOverlay.style.display = "none";
    } else if (statusCurrent === states.i_lost) {
      playOverlay.style.display = "none";
      lostOverlay.style.display = "flex";
    } else if (statusCurrent === states.playing) {
      playOverlay.style.display = "none";
      lostOverlay.style.display = "none";
      animateEnemies();
    }
    userOnGround();
  }

  function gameLoop() {
    update();
    draw();
    window.requestAnimationFrame(gameLoop);
  }

  main(); // Call main function to start the game
});

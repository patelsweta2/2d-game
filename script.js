document.addEventListener("DOMContentLoaded", (event) => {
  let statusCurrent;
  let frames = 0;
  let states = {
    play: 0,
    playing: 1,
    i_lost: 2,
  };
  let user = document.querySelector(".user");
  let ground = document.querySelector(".ground");
  let Box = document.querySelector(".game-box");
  const groundHeight = parseFloat(getComputedStyle(ground).height);
  console.log(user.offsetTop);
  console.log(user.offsetHeight);

  let player = {
    gravity: 1.2,
    speed: 0,
    jumpStrength: 20,
    maxJumps: 2,
    jumpCount: 0,
  };

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
      player.speed = player.speed - player.jumpStrength;
      player.jumpCount++;
    }
  }

  //make enemies

  function main() {
    Box.addEventListener("click", jump);
    statusCurrent = states.play;
    gameLoop();
  }

  function update() {
    frames++;
    userOnGround();
  }

  function gameLoop() {
    update();
    window.requestAnimationFrame(gameLoop);
  }

  main(); // Call main function to start the game
});

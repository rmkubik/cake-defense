import spritesheet from "./cake-pie.png";

const game = new Phaser.Game(800, 600, Phaser.AUTO, "", {
  preload,
  create,
  update
});

let pies;
let projectiles;
let cake;
let emitter;
let gameOver = false;

function preload() {
  game.load.spritesheet("sprites", spritesheet, 32, 32);
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  game.stage.backgroundColor = "#CCCCCC";

  cake = game.add.sprite(game.world.centerX, game.world.centerY, "sprites", 0);

  projectiles = game.add.group();
  pies = game.add.group();

  game.physics.arcade.enable(cake);

  emitter = game.add.emitter(game.world.centerX, game.world.centerY, 200);
  emitter.width = 8;
  emitter.height = 8;
  emitter.gravity = 0;
  emitter.minParticleScale = 0.1;
  emitter.maxParticleScale = 0.8;

  emitter.setYSpeed(-80, 80);
  emitter.setXSpeed(-80, 80);

  emitter.minRotation = 0;
  emitter.maxRotation = 100;
  emitter.makeParticles("sprites", 3);
}

let spawnCooldownPeriod = 1500;
let lastSpawnTimeStamp = Date.now();
let cooldownPeriod = 250;
let lastShotTimeStamp = Date.now();

const canShoot = () => {
  return Date.now() > lastShotTimeStamp + cooldownPeriod;
};

const canSpawn = () => {
  return Date.now() > lastSpawnTimeStamp + spawnCooldownPeriod;
};

const createProjectile = (x, y) => {
  const projectile = projectiles.create(x, y, "sprites", 4);
  game.physics.arcade.enable(projectile);

  return projectile;
};

const createPie = () => {
  const pie = pies.create(
    Phaser.Math.between(0, game.world.width),
    Phaser.Math.between(0, game.world.height),
    "sprites",
    1
  );
  game.physics.arcade.enable(pie);

  return pie;
};

function update() {
  if (gameOver) {
    cake.destroy();
    emitter.explode(0, 200);
  }

  if (game.input.activePointer.leftButton.isDown && canShoot() && !gameOver) {
    lastShotTimeStamp = Date.now();
    const projectile = createProjectile(game.world.centerX, game.world.centerY);
    game.physics.arcade.moveToXY(
      projectile,
      game.input.activePointer.x,
      game.input.activePointer.y,
      200
    );
  }

  if (canSpawn()) {
    lastSpawnTimeStamp = Date.now();
    const pie = createPie();
    game.physics.arcade.moveToXY(
      pie,
      game.world.centerX,
      game.world.centerY,
      100
    );
  }

  game.physics.arcade.collide(projectiles, pies);
  game.physics.arcade.collide(cake, pies, () => {
    gameOver = true;
  });
}

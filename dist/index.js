// src/modules/entities/base.ts
var BaseEntity = class {
  constructor(movementStrategy, position = createVector(
    window.innerWidth / 2,
    window.innerHeight / 2
  ), size = 50, inertia = 0.6, mass = 1) {
    this.movementStrategy = movementStrategy;
    this.position = position;
    this.size = size;
    this.inertia = inertia;
    this.mass = mass;
  }
  Global = GlobalState.instance;
  velocity = createVector(0, 0);
  update() {
    const acceleration = this.movementStrategy.calculateAcceleration();
    this.detectCollisions(acceleration);
    this.applyInertia(acceleration);
    this.clampToBounds();
    this.position.add(this.velocity);
  }
  applyInertia(acceleration) {
    this.velocity.mult(this.inertia);
    acceleration.mult(1 - this.inertia);
    this.velocity.add(acceleration);
  }
  clampToBounds() {
    const nextPosition = p5.Vector.add(this.position, this.velocity);
    if (nextPosition.x - this.size / 2 < 0) {
      this.velocity.x = 0;
      this.position.x = this.size / 2;
    } else if (nextPosition.x + this.size / 2 > window.innerWidth) {
      this.velocity.x = 0;
      this.position.x = window.innerWidth - this.size / 2;
    }
    if (nextPosition.y - this.size / 2 < 0) {
      this.velocity.y = 0;
      this.position.y = this.size / 2;
    } else if (nextPosition.y + this.size / 2 > window.innerHeight) {
      this.velocity.y = 0;
      this.position.y = window.innerHeight - this.size / 2;
    }
  }
  detectCollisions(target) {
    this.Global.entities.values().filter((e) => p5.Vector.dist(this.position, e.position) < this.size + 5).forEach((entity) => {
      if (entity !== this) {
        const distance = p5.Vector.dist(this.position, entity.position);
        const combinedRadii = this.size / 2 + entity.size / 2;
        if (distance < combinedRadii) {
          const collisionNormal = p5.Vector.sub(this.position, entity.position).normalize();
          const relativeVelocity = p5.Vector.sub(this.velocity, entity.velocity);
          const velocityAlongNormal = p5.Vector.dot(relativeVelocity, collisionNormal);
          if (velocityAlongNormal > 0)
            return;
          const restitution = 0.5;
          const impulseScalar = -(1 + restitution) * velocityAlongNormal / (1 / this.mass + 1 / entity.mass);
          const impulse = createVector(impulseScalar, impulseScalar);
          p5.Vector.mult(collisionNormal, impulseScalar, impulse);
          this.velocity.add(impulse.div(this.mass));
          entity.velocity.sub(impulse.div(this.mass));
        }
      }
    });
  }
};

// src/modules/entities/player.ts
var CtrlMode = /* @__PURE__ */ ((CtrlMode2) => {
  CtrlMode2[CtrlMode2["WASD"] = 0] = "WASD";
  CtrlMode2[CtrlMode2["Arrow"] = 1] = "Arrow";
  return CtrlMode2;
})(CtrlMode || {});
var Player = class extends BaseEntity {
  lives;
  settings;
  kinematics;
  constructor(mode = 0 /* WASD */, position = createVector(window.innerWidth / 2, window.innerHeight / 2), size = 50, lives = 3, speed = 5) {
    super(new PlayerMovementStrategy(speed, mode));
    this.lives = lives;
    this.settings = {
      mode,
      size
    };
    this.kinematics = {
      speed,
      position
    };
  }
  draw() {
    fill("blue");
    circle(this.position.x, this.position.y, this.size);
  }
  damage(damage) {
    if (this.lives - damage < 0)
      return;
    this.lives -= damage;
  }
  heal(heal) {
    if (this.lives + heal > GlobalState.settings.maxLives)
      return;
    this.lives += heal;
  }
  update() {
    if (this.lives > 0)
      super.update();
    this.draw();
  }
};
var PlayerMovementStrategy = class {
  constructor(speed, mode) {
    this.speed = speed;
    this.mode = mode;
  }
  global = GlobalState.instance;
  get keys() {
    switch (this.mode) {
      case 1 /* Arrow */: {
        return {
          LEFT: this.global.pressedKeys.has("ArrowLeft"),
          RIGHT: this.global.pressedKeys.has("ArrowRight"),
          UP: this.global.pressedKeys.has("ArrowUp"),
          DOWN: this.global.pressedKeys.has("ArrowDown")
        };
      }
      case 0 /* WASD */:
      default: {
        return {
          LEFT: this.global.pressedKeys.has("a"),
          RIGHT: this.global.pressedKeys.has("d"),
          UP: this.global.pressedKeys.has("w"),
          DOWN: this.global.pressedKeys.has("s")
        };
      }
    }
  }
  calculateAcceleration() {
    const acceleration = createVector(0, 0);
    if (this.keys.LEFT) {
      acceleration.x = -this.speed;
    }
    if (this.keys.RIGHT) {
      acceleration.x = this.speed;
    }
    if (this.keys.UP) {
      acceleration.y = -this.speed;
    }
    if (this.keys.DOWN) {
      acceleration.y = this.speed;
    }
    return acceleration;
  }
};

// src/modules/global.ts
var GlobalState = class _GlobalState {
  static _instance;
  constructor() {
  }
  static get instance() {
    if (!_GlobalState._instance) {
      _GlobalState._instance = new _GlobalState();
    }
    return _GlobalState._instance;
  }
  static settings = {
    heart: {
      size: 50,
      offset: 10
    },
    maxLives: 5,
    defaultLives: 3
  };
  //! Keys
  pressedKeys = /* @__PURE__ */ new Set();
  addKey(key2) {
    this.pressedKeys.add(key2);
  }
  removeKey(key2) {
    this.pressedKeys.delete(key2);
  }
  //! Entities
  entities = /* @__PURE__ */ new Set();
  addEntity(entity) {
    this.entities.add(entity);
  }
  removeEntity(entity) {
    this.entities.delete(entity);
  }
  updateEntities() {
    this.entities.forEach((e) => e.update());
  }
  closetEntitiesTo(target) {
    return this.entities.values().toArray().sort((a, b) => {
      const aDistance = p5.Vector.dist(a.position, target.position);
      const bDistance = p5.Vector.dist(b.position, target.position);
      return aDistance - bDistance;
    });
  }
  //! Player
  player;
  createPlayer() {
    this.player = new Player();
    this.addEntity(this.player);
    return this.player;
  }
  get players() {
    return this.entities.entries().filter((e) => e instanceof Player);
  }
  //! Enemies
  get enemies() {
    return this.entities.entries().filter((e) => e instanceof Enemy);
  }
};

// src/modules/entities/enemy.ts
var Enemy = class extends BaseEntity {
  settings;
  kinematics;
  constructor(playerPosition = GlobalState.instance.player.position, position = createVector(random(0, windowWidth), random(0, windowHeight)), size = 50, speed = random(1, 3)) {
    super(
      new SeekPlayerMovementStrategy(
        speed,
        position,
        playerPosition
      ),
      position
    );
    this.settings = {
      size
    };
    this.kinematics = {
      speed,
      position
    };
  }
  draw() {
    fill("red");
    circle(this.position.x, this.position.y, this.size);
  }
  update() {
    super.update();
    this.draw();
  }
};
var SeekPlayerMovementStrategy = class {
  constructor(speed, pos, playerPos) {
    this.speed = speed;
    this.pos = pos;
    this.playerPos = playerPos;
  }
  calculateAcceleration() {
    const directionX = this.playerPos.x - this.pos.x;
    const directionY = this.playerPos.y - this.pos.y;
    const distance = Math.sqrt(directionX * directionX + directionY * directionY);
    const normalizedDirectionX = directionX / distance;
    const normalizedDirectionY = directionY / distance;
    this.pos.x += normalizedDirectionX * this.speed;
    this.pos.y += normalizedDirectionY * this.speed;
    return createVector(normalizedDirectionX, normalizedDirectionY);
  }
};

// src/utils/index.ts
var drawHeart = (x, y, size, color) => {
  fill(color || "red");
  beginShape();
  vertex(x, y);
  bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
  bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  endShape(CLOSE);
};
var drawHearts = (num = 3, size = GlobalState.settings.heart.size, vOffset = 4, color) => {
  Array.from({ length: num }, (_, i) => i).forEach((i) => {
    drawHeart(
      35 + i * (size + GlobalState.settings.heart.offset),
      10 + vOffset,
      size,
      color
    );
  });
};

// src/index.ts
var spawnRate;
var Global;
var player;
var enemies = [];
function preload() {
  Global = GlobalState.instance;
  player = Global.createPlayer();
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  spawnRate = Math.round(random(5, 15));
  smooth();
  noStroke();
}
function keyPressed() {
  switch (key) {
    case "-": {
      player.damage(1);
      break;
    }
    case "+": {
      player.heal(1);
      break;
    }
    case "1": {
      Global.addEntity(new Enemy());
    }
    default: {
      break;
    }
  }
  Global.addKey(key);
}
function keyReleased() {
  Global.removeKey(key);
}
function draw() {
  background(35, 80, 90);
  Global.updateEntities();
  drawHearts(player.lives);
}
//# sourceMappingURL=index.js.map

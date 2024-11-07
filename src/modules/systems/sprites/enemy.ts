import { MovementStrategy, MovementSystem } from "../movement";

export class RandomMovementStrategy implements MovementStrategy {
  private direction: p5.Vector;
  private changeInterval: number;
  private lastChangeTime: number;

  constructor(
    private speed: number,
    changeInterval: number = random(1000, 5000)
  ) {
    this.direction = p5.Vector.random2D();
    this.changeInterval = changeInterval;
    this.lastChangeTime = millis();
  }

  calculateAcceleration(): p5.Vector {
    const currentTime = millis();
    if (currentTime - this.lastChangeTime > this.changeInterval) {
      this.direction = p5.Vector.random2D();
      this.lastChangeTime = currentTime;
    }

    return this.direction.copy().mult(this.speed);
  }
}

export class SeekPlayerMovementStrategy {
  constructor(
    private speed: number,
    private enemyPosition: p5.Vector,
    private playerPosition: p5.Vector
  ) {}

  calculateAcceleration(): p5.Vector {
    const direction = p5.Vector.sub(this.playerPosition, this.enemyPosition);
    direction.normalize();
    return direction.mult(this.speed);
  }
}

export class Enemy {
  private movementSystem: MovementSystem;

  private velocity = createVector(0, 0);
  private inertia = 0.6;

  constructor(
    private playerPosition: p5.Vector,
    public position = createVector(
      random(0, window.innerWidth),
      random(0, window.innerHeight)
    ),
    public speed = 1,
    public size = 50
  ) {
    this.movementSystem = new MovementSystem(
      this.position,
      this.velocity,
      this.size,
      this.inertia,
      new SeekPlayerMovementStrategy(
        this.speed,
        this.position,
        this.playerPosition
      )
    );
  }

  public draw() {
    circle(this.position.x, this.position.y, this.size).fill("red");
  }

  public update() {
    this.movementSystem.update();
    this.draw();
  }
}

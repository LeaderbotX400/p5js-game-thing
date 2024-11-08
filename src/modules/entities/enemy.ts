import p5 from "p5";
import { Simulation } from "../simulation";
import { BaseEntity } from "./base";

export class Enemy extends BaseEntity {
  public settings: {
    size: number;
  };

  public kinematics: {
    speed: number;
    position: p5.Vector;
  };

  public constructor(
    playerPosition: p5.Vector = Simulation.instance.player.position,
    position = createVector(random(0, windowWidth), random(0, windowHeight)),
    size = 50,
    speed = random(1, 3)
  ) {
    super(
      new SeekPlayerMovementStrategy(speed, position, playerPosition),
      position
    );

    this.settings = {
      size,
    };

    this.kinematics = {
      speed,
      position,
    };
  }

  public draw() {
    fill("red");
    circle(this.position.x, this.position.y, this.size);
  }

  public update() {
    super.update();
    this.draw();
  }
}

export class SeekPlayerMovementStrategy {
  constructor(
    private speed: number,
    private pos: p5.Vector,
    private playerPos: p5.Vector
  ) {}

  calculateAcceleration(): p5.Vector {
    // Calculate the direction vector from the enemy to the player
    const directionX = this.playerPos.x - this.pos.x;
    const directionY = this.playerPos.y - this.pos.y;

    // Calculate the distance
    const distance = Math.sqrt(
      directionX * directionX + directionY * directionY
    );

    // Normalize the direction vector
    const normalizedDirectionX = directionX / distance;
    const normalizedDirectionY = directionY / distance;

    // Move the enemy towards the player
    this.pos.x += normalizedDirectionX * this.speed;
    this.pos.y += normalizedDirectionY * this.speed;

    return createVector(normalizedDirectionX, normalizedDirectionY);
  }
}

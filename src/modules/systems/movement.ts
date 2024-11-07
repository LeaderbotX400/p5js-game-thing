import p5 from "p5";
import { checkWallCollisions } from "../../utils/collision";

export interface MovementStrategy {
  calculateAcceleration(): p5.Vector;
}

export class MovementSystem {
  constructor(
    private position: p5.Vector,
    private velocity: p5.Vector,
    private size: number,
    private inertia: number,
    private movementStrategy: MovementStrategy
  ) {}

  public update() {
    const acceleration = this.movementStrategy.calculateAcceleration();
    this.applyInertia(acceleration);
    this.checkBounds();
    this.position.add(this.velocity);
  }

  private applyInertia(acceleration: p5.Vector) {
    this.velocity.mult(this.inertia);
    acceleration.mult(1 - this.inertia);
    this.velocity.add(acceleration);
  }

  private checkBounds() {
    const nextPosition = p5.Vector.add(this.position, this.velocity);

    checkWallCollisions(nextPosition, this.position, this.velocity, this.size);

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
}

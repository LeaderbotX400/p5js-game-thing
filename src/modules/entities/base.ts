import { GlobalState } from "../global";

export interface MovementStrategy {
  calculateAcceleration(): p5.Vector;
}

export interface BaseEntity {
  update(): void;
  draw(): void;
}

/**
 * Represents an entity in the game (e.g. player, enemy)
 */
export class BaseEntity {
  private Global = GlobalState.instance;
  private velocity = createVector(0, 0);
  constructor(
    public movementStrategy: MovementStrategy,
    public position = createVector(
      window.innerWidth / 2,
      window.innerHeight / 2
    ),
    public size = 50,
    public inertia = 0.6,
    public mass = 1
  ) {}

  public update() {
    const acceleration = this.movementStrategy.calculateAcceleration();
    this.detectCollisions(acceleration);
    this.applyInertia(acceleration);
    this.clampToBounds();
    this.position.add(this.velocity);
  }

  private applyInertia(acceleration: p5.Vector) {
    this.velocity.mult(this.inertia);
    acceleration.mult(1 - this.inertia);
    this.velocity.add(acceleration);
  }

  private clampToBounds() {
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

  private detectCollisions(target: p5.Vector) {
  this.Global.entities.values().filter((e) => p5.Vector.dist(this.position, e.position) < (this.size + 5)).forEach((entity) => {
    if (entity !== this) {
      const distance = p5.Vector.dist(this.position, entity.position);
      const combinedRadii = (this.size / 2) + (entity.size / 2);

      if (distance < combinedRadii) {
        // Calculate the collision normal
        const collisionNormal = p5.Vector.sub(this.position, entity.position).normalize();

        // Calculate the relative velocity
        const relativeVelocity = p5.Vector.sub(this.velocity, entity.velocity);

        // Calculate the velocity along the normal
        const velocityAlongNormal = p5.Vector.dot(relativeVelocity, collisionNormal);

        // If the objects are moving apart, do nothing
        if (velocityAlongNormal > 0) return;

        // Calculate the restitution (bounciness)
        const restitution = 0.5; // Adjust this value to control the bounciness

        // Calculate the impulse scalar
        const impulseScalar = -(1 + restitution) * velocityAlongNormal / (1 / this.mass + 1 / entity.mass);

        // Apply the impulse to the entities
        const impulse = createVector(impulseScalar, impulseScalar);
        p5.Vector.mult(collisionNormal, impulseScalar, impulse);
        this.velocity.add(impulse.div(this.mass));
        entity.velocity.sub(impulse.div(this.mass));
      }
    }
  });
}
}

import { Simulation } from "../simulation";
import { BaseEntity, EntityType } from "./base";

export class Weapon {
  private Sim = Simulation.instance;

  constructor(
    public damage: number,
    public range: number,
    public fireRate: number
  ) {}

  public fire(position: p5.Vector, target: p5.Vector): Projectile {
    const velocity = p5.Vector.sub(target, position).normalize().mult(5);

    const proj = new Projectile(position.copy(), velocity, 10, this.damage);

    this.Sim.addEntity(proj);

    return proj;
  }
}

export class Projectile extends BaseEntity {
  constructor(
    public position: p5.Vector,
    public velocity: p5.Vector,
    public size: number,
    public damage: number
  ) {
    super(
      EntityType.PROJECTILE,
      new ProjectileMovementStrategy(velocity),
      position,
      velocity,
      size,
      300
    );
  }

  public autoDestruct() {
    const nextPosition = p5.Vector.add(this.position, this.velocity);

    if (
      nextPosition.x - this.size / 2 < 0 ||
      nextPosition.x + this.size / 2 > window.innerWidth ||
      nextPosition.y - this.size / 2 < 0 ||
      nextPosition.y + this.size / 2 > window.innerHeight
    ) {
      this.Sim.removeEntity(this);
    }
  }

  public update() {
    this.autoDestruct();
    this.position.add(this.velocity);
    this.draw();
  }

  public draw() {
    fill("red");
    circle(this.position.x, this.position.y, this.size);
  }
}

export class ProjectileMovementStrategy {
  constructor(public velocity: p5.Vector) {}

  public calculateAcceleration() {
    return this.velocity;
  }
}

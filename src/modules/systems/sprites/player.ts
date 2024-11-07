import { pressedKeys } from "../../../state";
import { GlobalState } from "../../global";
import { MovementStrategy, MovementSystem } from "../movement";

export class PlayerMovementStrategy implements MovementStrategy {
  constructor(private speed: number, private mode: "WASD" | "Arrow") {}

  get keys() {
    if (this.mode === "WASD") {
      return {
        LEFT: pressedKeys.has("a"),
        RIGHT: pressedKeys.has("d"),
        UP: pressedKeys.has("w"),
        DOWN: pressedKeys.has("s"),
      };
    } else {
      return {
        LEFT: pressedKeys.has("ArrowLeft"),
        RIGHT: pressedKeys.has("ArrowRight"),
        UP: pressedKeys.has("ArrowUp"),
        DOWN: pressedKeys.has("ArrowDown"),
      };
    }
  }

  calculateAcceleration(): p5.Vector {
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
}

// A singleton class that represents the player
export class Player {
  private movementSystem: MovementSystem;

  private velocity = createVector(0, 0);
  private inertia = 0.6;

  constructor(
    public mode: "WASD" | "Arrow" = "WASD",
    public position = createVector(
      window.innerWidth / 2,
      window.innerHeight / 2
    ),
    public size = 50,
    public lives: number = GlobalState.settings.defaultLives,
    public speed: number = 5
  ) {
    this.movementSystem = new MovementSystem(
      this.position,
      this.velocity,
      this.size,
      this.inertia,
      new PlayerMovementStrategy(this.speed, this.mode)
    );
  }

  public draw() {
    fill("blue");
    circle(this.position.x, this.position.y, this.size);
  }

  public damage(damage: number) {
    this.lives -= damage;
  }

  public heal(heal: number) {
    this.lives += heal;
  }

  public update() {
    this.movementSystem.update();
    this.draw();
  }
}

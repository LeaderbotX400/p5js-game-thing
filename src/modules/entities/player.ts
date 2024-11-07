import p5 from "p5";
import { GlobalState } from "../global";
import { BaseEntity, MovementStrategy } from "./base";

export enum CtrlMode {
  WASD,
  Arrow,
}

export class Player extends BaseEntity {
  public lives: number;

  public settings: {
    mode: CtrlMode;
    size: number;
  };

  public kinematics: {
    speed: number;
    position: p5.Vector;
  };

  public constructor(
    mode: CtrlMode = CtrlMode.WASD,
    position = createVector(window.innerWidth / 2, window.innerHeight / 2),
    size = 50,
    lives: number = 3,
    speed: number = 5
  ) {
    super(new PlayerMovementStrategy(speed, mode));

    this.lives = lives;

    this.settings = {
      mode,
      size,
    };

    this.kinematics = {
      speed,
      position,
    };
  }

  public draw() {
    fill("blue");
    circle(this.position.x, this.position.y, this.size);
  }

  public damage(damage: number) {
    if (this.lives - damage < 0) return;
    this.lives -= damage;
  }

  public heal(heal: number) {
    if (this.lives + heal > GlobalState.settings.maxLives) return;
    this.lives += heal;
  }

  public update() {
    if (this.lives > 0) super.update();
    this.draw();
  }
}

export class PlayerMovementStrategy implements MovementStrategy {
  private global = GlobalState.instance;

  constructor(private speed: number, private mode: CtrlMode) {}

  get keys() {
    switch (this.mode) {
      case CtrlMode.Arrow: {
        return {
          LEFT: this.global.pressedKeys.has("ArrowLeft"),
          RIGHT: this.global.pressedKeys.has("ArrowRight"),
          UP: this.global.pressedKeys.has("ArrowUp"),
          DOWN: this.global.pressedKeys.has("ArrowDown"),
        };
      }
      case CtrlMode.WASD:
      default: {
        return {
          LEFT: this.global.pressedKeys.has("a"),
          RIGHT: this.global.pressedKeys.has("d"),
          UP: this.global.pressedKeys.has("w"),
          DOWN: this.global.pressedKeys.has("s"),
        };
      }
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

import p5 from "p5";
import { GlobalState } from "../global";
import { BaseEntity, EntityType, MovementStrategy } from "./base";
import { Weapon } from "./weapon";

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
    lives: number = GlobalState.settings.lives.default,
    speed: number = 5
  ) {
    super(EntityType.PLAYER, new PlayerMovementStrategy(speed, mode));

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
  private weapon = new Weapon(10, 100, 1);

  public fireWeapon() {
    return this.weapon.fire(this.position, createVector(mouseX, mouseY));
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
    if (this.lives + heal > GlobalState.settings.lives.max) return;
    this.lives += heal;
  }

  public update() {
    if (this.lives > 0) super.update();
    this.draw();

    this.telemetry.addData("Player Position", [
      this.position.x.toFixed(2),
      this.position.y.toFixed(2),
    ]);

    this.telemetry.addData("Player Lives", [this.lives]);
    this.telemetry.addData("Player Speed", [this.kinematics.speed]);
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

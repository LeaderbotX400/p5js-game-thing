import { BaseEntity } from "./entities/base";
import { Enemy } from "./entities/enemy";
import { Player } from "./entities/player";
import { Projectile } from "./entities/weapon";
import { TelemetrySystem } from "./telemetry/service";

/**
 * Used for entity tracking, updating, and drawing.
 */
export class Simulation {
  private telemetry: TelemetrySystem = TelemetrySystem.instance;
  public entities: BaseEntity[] = [];

  public settings = {
    hazard: {
      enemy: {
        size: 50,
        speed: 1,

        spawnRate: random(5, 10), // seconds
      },
    },
  };

  private static _instance: Simulation;

  private constructor() {}

  public static get instance() {
    if (!Simulation._instance) {
      Simulation._instance = new Simulation();
    }

    return Simulation._instance;
  }

  public addEntity(entity: BaseEntity | Projectile) {
    this.entities.push(entity);
  }

  public removeEntity(entity: BaseEntity) {
    this.entities.splice(this.entities.indexOf(entity), 1);
  }

  public update() {
    this.telemetry.addData("\n######## SIMULATION ########");
    this.telemetry.addData("Entities", [this.entities.length]);
    this.telemetry.addData("Enemies", [this.enemies.length]);
    this.telemetry.addData("Frame Rate", Math.round(frameRate()));
    this.telemetry.addData("Frame Count", frameCount);
    this.telemetry.addData("############################\n");
    this.entities.forEach((entity) => entity.update());

    // if (frameCount % Math.round(this.settings.hazard.enemy.spawnRate * (frameRate() * 0.8)) === 0) {
    //   this.spawnEnemy();
    // }
  }

  public draw() {
    this.entities.forEach((entity) => entity.draw());
  }

  private drawLine(positionA: p5.Vector, positionB: p5.Vector) {
    fill("green");
    line(positionA.x, positionA.y, positionB.x, positionB.y);
  }

  public drawLinesBetweenEntities() {
    for (let i = 0; i < this.entities.length; i++) {
      this.drawLinesFromEntity(this.entities[i]);
    }
  }

  public drawLinesFromEntity(entity: BaseEntity) {
    const entities = this.closetEntitiesTo(entity).filter(
      (e) =>
        e !== entity &&
        e.position.dist(entity.position) <= (entity.size + e.size) / 2 + 5
    );

    for (let i = 0; i < entities.length; i++) {
      const entityA = entity;
      const entityB = entities[i];
      this.drawLine(entityA.position, entityB.position);
    }
  }

  public closetEntitiesTo(target: BaseEntity) {
    return this.entities.sort((a, b) => {
      const aDistance = p5.Vector.dist(a.position, target.position);
      const bDistance = p5.Vector.dist(b.position, target.position);

      return aDistance - bDistance;
    });
  }

  //! Player
  public get player() {
    return this.entities.find((e) => e instanceof Player);
  }

  //! Enemies
  public get enemies() {
    return this.entities.filter((e) => e instanceof Enemy);
  }

  public randomizeEnemySpawnRate() {
    this.settings.hazard.enemy.spawnRate = random(5, 15);
  }

  public spawnEnemy() {
    console.log("Spawning enemy");

    this.addEntity(new Enemy());
    this.randomizeEnemySpawnRate();
  }

  public killAllEnemies() {
    this.enemies.forEach((e) =>
      this.enemies.splice(this.enemies.indexOf(e), 1)
    );
  }
}

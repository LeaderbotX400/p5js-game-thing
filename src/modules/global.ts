import { BaseEntity } from "./entities/base";
import { Enemy } from "./entities/enemy";
import { Player } from "./entities/player";

export enum GameStates {
  START,
  PLAYING,
  PAUSED,
  GAME_OVER,
}

export class GlobalState {
  private static _instance: GlobalState;

  private constructor() {}

  public static get instance() {
    if (!GlobalState._instance) {
      GlobalState._instance = new GlobalState();
    }

    return GlobalState._instance;
  }

  public static settings = {
    heart: {
      size: 50,
      offset: 10,
    },
    lives: {
      max: 5,
      default: 3,
    },
  };

  public gameState = GameStates.PLAYING;

  public gameIs(targetState: GameStates) {
    return this.gameState === targetState;
  }

  //! Keys
  public pressedKeys = new Set<string>();

  public addKey(key: string) {
    this.pressedKeys.add(key);
  }

  public removeKey(key: string) {
    this.pressedKeys.delete(key);
  }

  //! Entities
  public entities = new Set<BaseEntity>();

  public addEntity(entity: BaseEntity) {
    this.entities.add(entity);
  }

  public removeEntity(entity: BaseEntity) {
    this.entities.delete(entity);
  }

  public updateEntities() {
    // this.drawLinesBetweenEntities();
    this.entities.forEach((e) => e.update());
  }

  public closetEntitiesTo(target: BaseEntity) {
    return this.entities
      .values()
      .toArray()
      .sort((a, b) => {
        const aDistance = p5.Vector.dist(a.position, target.position);
        const bDistance = p5.Vector.dist(b.position, target.position);

        return aDistance - bDistance;
      });
  }

  //! Player
  public player: Player;

  public createPlayer() {
    this.player = new Player();

    this.addEntity(this.player);

    return this.player;
  }

  public get players() {
    return this.entities.entries().filter((e) => e instanceof Player);
  }

  private drawLinesBetweenEntities() {
    const entities = Array.from(this.entities.values());
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const entityA = entities[i];
        const entityB = entities[j];
        this.drawLine(entityA.position, entityB.position);
      }
    }
  }

  private drawLine(positionA: p5.Vector, positionB: p5.Vector) {
    // Assuming you have a p5.js environment
    fill("green");
    line(positionA.x, positionA.y, positionB.x, positionB.y);
  }

  //! Enemies
  public get enemies() {
    return this.entities.entries().filter((e) => e instanceof Enemy);
  }

  public killAllEnemies() {
    this.enemies.forEach((e) => this.removeEntity(e));
  }
}

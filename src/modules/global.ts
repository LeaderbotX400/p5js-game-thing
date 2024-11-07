import { BaseEntity } from "./entities/base";
import { Enemy } from "./entities/enemy";
import { Player } from "./entities/player";

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

  //! Enemies
  public get enemies() {
    return this.entities.entries().filter((e) => e instanceof Enemy);
  }

  public killAllEnemies() {
    this.enemies.forEach((e) => this.removeEntity(e));
  }
}


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
}

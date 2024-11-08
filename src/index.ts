import { Enemy } from "./modules/entities/enemy";
import { GlobalState as _GlobalState, GameStates } from "./modules/global";
import { Simulation as _Simulation } from "./modules/simulation";
import { startScreen } from "./screens/start";

let spawnRate: number;

let Global: _GlobalState;
let Sim: _Simulation;

// let player: Player;
let enemies: Enemy[] = [];

function preload() {
  Global = _GlobalState.instance;
  Sim = _Simulation.instance;
  // player = Sim.createPlayer();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  spawnRate = Math.round(random(5, 15));

  smooth();
  // noStroke();
}

function keyPressed() {
  switch (key) {
    case "-": {
      // player.damage(1);
      return;
    }

    case "+": {
      // player.heal(1);
      break;
    }

    case "1": {
      Sim.addEntity(new Enemy());
      break;
    }

    case "2": {
      Array.from({ length: 5 }).forEach(() => {
        Sim.addEntity(new Enemy());
      });
      break;
    }

    case "Escape": {
      window.location.reload();
      break;
    }

    case "Enter": {
      if (Global.gameIs(GameStates.START)) {
        Global.gameState = GameStates.PLAYING;
        return;
      }

      break;
    }

    default: {
      break;
    }
  }

  Global.addKey(key);
}

function keyReleased() {
  Global.removeKey(key);
}

function draw() {
  switch (Global.gameState) {
    case GameStates.START: {
      startScreen();
      break;
    }

    case GameStates.PLAYING: {
      background(35, 80, 90);
      Sim.update();
      // drawHearts(player.lives);
      break;
    }

    case GameStates.PAUSED: {
      break;
    }

    case GameStates.GAME_OVER: {
      break;
    }

    default: {
      break;
    }
  }
}

// Expose p5.js functions to the global scope
Object.defineProperty(window, "preload", preload);
Object.defineProperty(window, "setup", setup);
Object.defineProperty(window, "draw", draw);
Object.defineProperty(window, "keyPressed", keyPressed);
Object.defineProperty(window, "keyReleased", keyReleased);
Object.defineProperty(window, "windowResized", windowResized);

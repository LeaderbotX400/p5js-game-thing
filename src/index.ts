import { Enemy } from "./modules/entities/enemy";
import { Player } from "./modules/entities/player";
import { GlobalState as _GlobalState } from "./modules/global";
import { drawHearts } from "./utils";

let spawnRate: number;

let Global: _GlobalState;

let player: Player;
let enemies: Enemy[] = [];

function preload() {
  Global = _GlobalState.instance;
  player = Global.createPlayer();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  spawnRate = Math.round(random(5, 15));

  smooth();
  noStroke();
}

function keyPressed() {
  console.log(key);
  switch (key) {
    case "-": {
      player.damage(1);
      break;
    }

    case "+": {
      player.heal(1);
      break;
    }

    case "1": {
      Global.addEntity(new Enemy());
    }

    case "2": {
      Array.from({ length: 5 }).forEach(() => {
        Global.addEntity(new Enemy());
      });
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
  background(35, 80, 90);
  Global.updateEntities();
  drawHearts(player.lives);

  // console.table(Global.closetEntitiesTo(player).map((e) => ({x: e.position.x , y: e.position.y})));
}

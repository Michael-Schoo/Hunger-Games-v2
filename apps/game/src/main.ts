import Game from "./game.js";

console.time("Init game")
const game = new Game();
console.timeEnd("Init game")
game.start();

// export data
const data = game.export();
// save it as data.json
import { resolve } from "path";
const path = resolve(import.meta.path, "../../../visualization/public/data.json");
await Bun.write(path, JSON.stringify(data))

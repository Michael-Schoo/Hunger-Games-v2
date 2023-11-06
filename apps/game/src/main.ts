import Game from "./game.js";

console.time("Init game")
const game = new Game();
console.timeEnd("Init game")
game.start();

// export data and save it as data.json (in public fonder of website)
const data = game.export();
import { resolve } from "path";
const path = resolve(import.meta.path, "../../../visualization/public/data.json");
await Bun.write(path, JSON.stringify(data))

// import { chooseAge, range } from "./utils.js";
// import { INITIAL_PEOPLE_PER_DISTRICT, map, mapConfig } from "./constants.js";
// import { convertStrMapToActual, convertMapToStr } from "./map/map-utils.js";
// import assert from "assert/strict";
//
// console.log(chooseAge(10))
// console.log(chooseAge(100))
// console.log(chooseAge(123))
//
// // for (const i of range(INITIAL_PEOPLE_PER_DISTRICT)) {
// //     console.log(chooseAge(i))
// // }
//
// // console.log([...range(INITIAL_PEOPLE_PER_DISTRICT)].map(chooseAge))
//
// // const myArray = new Uint32Array(13940);
//
// // const a = crypto.getRandomValues(myArray);
// // console.log(a)
//
//
// const mapy = convertStrMapToActual(map, mapConfig)
// // console.log([...mapy.entries()])
// console.log(convertMapToStr(mapy, mapConfig))
//

// // https://stackoverflow.com/questions/68163308/how-to-log-a-circle-in-the-console-with-a-given-radius
import {convertMapToStr, makeCircleCords, makeMap} from "./map/map-utils.js";
import {
    MAP_SIZE,
    MAP_SPAWN_GROUPS,
    MAP_SPAWN_GROUPS_OFFSET,
    MAP_SPAWN_SIZE,
    mapConfig,
    RANDOM_PEOPLE_CHOSEN
} from "./constants.js";
import {MapBiome, MapCord, MapTile, tileBiomeList} from "./map/map-types.js";
import {range} from "./utils.js";
import {getBestDirection, pathfindingToClosestPlayer} from "./map/pathfinding.js";
import {howAdjacent} from "./map/find-moves.js";
import {GameMap} from "./map/map.js";
//
// const drawCircle = (radius: number) => {
//     const thickness = 0.1;
//     const symbol = 'x';
//     const rin = radius - thickness
//     const rout = radius + thickness;
//     for (let y = radius; y >= -radius; --y) {
//         let string = '';
//         for (let x = -radius; x < rout; x += 0.4) {
//             const value = x * x + y * y;
//             // if (value >= rin * rin && value <= rout * rout) {
//             if (value <= rout * rout) {
//                 string += symbol;
//             } else {
//                 string += "-";
//             }
//         }
//         console.log(string);
//
//     }
// }
// drawCircle(100);
//
// const xSize = 100;
// const ySize = 100;
// const R = 50;
// let output = "";
// for(let x = 0; x < xSize + 1; x ++) {
//     for(let y = 0; y < ySize + 1; y ++) {
//         if(Math.sqrt(Math.pow(x - xSize / 2, 2) + Math.pow(y - ySize / 2, 2)) <= R+1)
//             output += "XX";
//         else
//             output += "--";
//     }
//     output += "\n";
// }
//
// console.log(output);


// export function makeMapa() {
//     // TODO: not just random
//     const map = new Map<MapCord, MapTile>()
//
//     // make a circle map
//     for (const [x, y] of makeCircleCords(MAP_SIZE, 3, false,  [7, 50])) {
//         const randomIndex = Math.floor(Math.random() * tileBiomeList.length);
//         const tileType = tileBiomeList[randomIndex];
//         map.set(`${x}-${y}`, { type: tileType })
//     }
//
//     console.log(convertMapToStr(map, mapConfig))
//     return map
//
// }
// makeMapa()

const map = makeMap()
const mapp = new GameMap([], {} as any)

console.log(howAdjacent([50,50], [55,45]))
console.log(getBestDirection(mapp, [55,50], [76,50]))
// console.log(convertMapToStr(makeMap(), mapConfig))
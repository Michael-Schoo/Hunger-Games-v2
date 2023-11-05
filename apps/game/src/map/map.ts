import Person from "../people.js"
import Player from "./player.js"
import Game from "../game.js"
import {convertMapToStr, makeCircleCords, makeMap} from "./map-utils.js"
import assert from "assert/strict";
import {MapBiomeConfig, MapCord, MapBiome, MapTile} from "./map-types.js";
import findValidMoves, {getPathfindedMove, getRandomMove, TurnAction} from "./find-moves.js";
import {MAP_SIZE, mapConfig} from "../constants.js";

export class GameMap {
    readonly map: Map<MapCord, MapTile>
    readonly players: Player[] = []
    readonly game: Game
    turn = 0
    gameOver = false

    constructor(players: Person[], game: Game) {
        this.game = game
        // this.map = convertStrMapToActual(mapStr, mapConfig)
        this.map = makeMap()

        const mapEntries = [...this.map.entries()]
        const spawnPoints = mapEntries
            .filter(([location, content]) => content.type === MapBiome.SpawnPoint)
            .sort(() => Math.random() - 0.5);

        for (const person of players) {
            if (!person) {
                // console.info("No person")
                continue
            }
            const spawnPoint = spawnPoints.pop()
            assert(spawnPoint, "Should have spawn point to use")

            const location = spawnPoint[0].split('-').map(n => parseInt(n)) as [number, number]
            // console.log(location, spawnPoint)
            // console.log(players)
            // console.log(person.export())
            const player = new Player(person, this, location)
            this.players.push(player)
        }

        // console.log(this.players.length)

        // if (this.players.length !== districts.length * 2) {
        //     throw new Error("Not enough spawn points")
        // }
    }

    start() {
        while (!this.gameOver) {
            this.newTurn()
        }
    }

    newTurn() {

        // kill those who are in read zone
        for (const tile of this.map.values()) {
            if (tile.redZone && tile.redZone <= this.turn && tile.player) {
                if (!tile.player.person.alive) continue
                tile.player.hp = 0
                tile.player.kill()
            }
        }

        // make border smaller by 5 every 15th turn (starting from 100)
        if (this.turn > 100 && (this.turn % 15) === 0) {
            const size = (MAP_SIZE - (this.turn - 95))

            const goodTiles = [...makeCircleCords(MAP_SIZE, (size / 2))]
            for (const location of this.map.keys()) {
                const [x, y] = location.split('-').map(Number)

                const tile = this.getTile(x, y)
                if (!tile) continue

                if (goodTiles.find(([goodX, goodY]) => goodX === x && goodY === y)) continue
                this.setTile(x, y, {redZone: Math.min((tile.redZone ?? Infinity), this.turn + 10)})
            }
        }



        for (const player of this.players) {
            if (player.person.diedAt !== null) {
                // console.log(`Turn ${this.turn} (${this.game.year}): Ignoring ${player.person.name} at turn ${this.turn}`)
                continue
            }

            //? check valid moves
            // const move = getRandomMove(this, player)
            const move = getPathfindedMove(this, player)

            if (!move) {
                continue
            } else {
            }

            // choose a move
            if (move.action === TurnAction.Fight) {
                player.fight(move.location.tile.player!, 10)
            } else {
                player.move(...move.location.cords)
            }

        }

        console.clear()
        console.log(`Year: ${this.game.year}, Turn: ${this.turn}`)
        if (process.argv.includes('--print-map')) {
            console.log(convertMapToStr(this, mapConfig, [this.game.year, this.turn  % MAP_SIZE]))
            // Bun.sleepSync(100)
        }

        this.turn += 1;
        if (!this.players.some(p=> p.person.alive)) {
            console.log("\nA game over in "+this.turn)
            this.gameOver = true
        }

    }

    getTile(x: number, y: number, required?: true): MapTile
    getTile(x: number, y: number, required: false): MapTile | undefined
    getTile(x: number, y: number, required = true) {
        const tile = this.map.get(`${x}-${y}`)
        if (!tile && required) {
            console.log(convertMapToStr(this, mapConfig, [x, y]))
        }

        if (required) assert(tile, `Tile (${x}, ${y}) is not a valid tile`)
        return tile
    }

    setTile(x: number, y: number, data: Partial<MapTile>) {
        const d = this.getTile(x, y)

        this.map.set(`${x}-${y}`, {...d, ...data})
    }

}


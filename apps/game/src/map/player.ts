import {GameMap} from "./map.js";
import Game from "../game.js";
import Person from "../people.js";
import {round} from "../utils.js";
import assert from "assert/strict";
import {howAdjacent, isValidFight} from "./find-moves.js";
import {MapBiome, MapTile} from "./map-types.js";

export default class Player {
    readonly person: Person;
    readonly game: Game;
    readonly map: GameMap
    location: [number, number]
    hp = 99

    constructor(person: Person, map: GameMap, spawnLocation: [number, number]) {
        this.person = person;
        this.game = person.game;
        this.map = map
        this.location = structuredClone(spawnLocation)

        // add to map
        const key = `${this.location[0]}-${this.location[1]}` as `${number}-${number}`
        const tile = this.map.map.get(key)
        assert(tile, 'tile needs to exist to set player')
        assert(!tile.player, 'tile can\'t already have player')
        tile.player = this
        this.map.map.set(key, tile)
    }

    get currentTile() {
        const tile = this.map.getTile(...this.location)
        assert(tile, "Tile doesn't exist")
        return tile
    }

    private set currentTile(value: MapTile) {
        this.map.map.set(`${this.location[0]}-${this.location[1]}`, value)
    }

    move(x: number, y: number) {
        const tile = this.map.map.get(`${x}-${y}`)
        assert(tile, "Tile doesn't exist")
        assert(!tile.player, "Already occupied with a player")

        assert.equal(howAdjacent(this.location, [x,y]), 1, "The player must be only one degree of adjacency")

        // this.currentTile.player = undefined
        // tile.player = this
        // this.currentTile = {...this.currentTile, player: undefined}
        this.map.setTile(...this.location, {player: undefined})
        this.map.setTile(x, y, {player: this})
        this.location = [x, y]
        // this.currentTile = {...this.currentTile, player: this}
        // todo: check if valid move (ie not too long + also check from player/district abilities


    }

    fight(opponent: Player, damage: number) {
        // check if opponent is adjacent

        const validFight = isValidFight(this, opponent)
        assert(validFight.valid, "player not adjacent, and can't fight")

        // check if same district
        assert.notEqual(
            this.person.district.type,
            opponent.person.district.type,
            "Players in the same district can't fight each other"
        )

        assert.notEqual(opponent.hp, 0, "Can't fight an already dead person")
        assert(opponent.person.alive, "Can't fight an already dead person")

        const newHealth = round(opponent.hp - damage, 2)

        opponent.hp = (newHealth > 0) ? newHealth : 0
        if (opponent.hp === 0) {
            opponent.kill()
            this.move(...opponent.location)
        }

        // TODO: player fights back

    }

    kill() {
        assert.equal(this.hp, 0, 'Player needs to have 0 HP to kill')
        this.person.kill(this.game.year)
        this.map.setTile(...this.location, {player: undefined})

    }


}


import {GameMap} from "./map.js";
import Player from "./player.js";
import {MapTile} from "./map-types.js";
import {pathfindingToClosestPlayer} from "./pathfinding.js";

export enum MovementChoice {
    Up,
    Down,
    Left,
    Right,
}

export enum TurnAction {
    Move,
    Fight,
    Pass,
    Hide
}

export function getRandomMove(map: GameMap, player: Player) {
    const validMoves = findValidMoves(map, player)
    return validMoves[Math.floor(Math.random() * validMoves.length)]
}

export function getPathfindedMove(map: GameMap, player: Player) {
    const bestMove = pathfindingToClosestPlayer(map, player)
    if (!bestMove) return getRandomMove(map, player)

    const cord = getCordAfterMove(player, bestMove)
    const tile = map.getTile(...cord, false)
    if (!tile) return getRandomMove(map, player)

    // todo edge case when it somehow bypasses from pathfinder
    if (tile.player?.person.district === player.person.district) return getRandomMove(map, player)
    // todo, somehow the tile is still there even if dead?
    if (tile.player?.hp !== 0 && !tile.player?.person.alive) return getRandomMove(map, player)


    return {
        choice: bestMove,
        action: tile.player ? TurnAction.Fight : TurnAction.Move,
        fight: tile.player,
        location: {
            cords: cord,
            tile
        }
    }

}

export default function findValidMoves(map: GameMap, player: Player) {
    const [playerX, playerY] = player.location
    const moves = [
        MovementChoice.Up,
        MovementChoice.Down,
        MovementChoice.Left,
        MovementChoice.Right
    ]

    const validMoves: {
        choice: MovementChoice,
        action: TurnAction,
        fight?: Player,
        location: {
            cords: [number, number],
            tile: MapTile
        }
    }[] = []

    // see if any player is already there
    for (const move of moves) {
        const tileCord = getCordAfterMove(player, move)
        const tile = map.map.get(`${tileCord[0]}-${tileCord[1]}`)

        if (!tile) {
            // console.log("tile does not exist", tileCord)
            continue
        }

        if (tile.player) {
            if (tile.player.person.district === player.person.district) {
                // console.log("same district")
                continue
            }

            const testValid = isValidFight(player, tile.player)
            if (!testValid.valid) {
                console.log("not valid location to actually fight")
                continue
            }

            if (tile.player.hp === 0 || !tile.player.person.alive) {
                continue
            }

            validMoves.push({
                choice: move,
                action: TurnAction.Fight,
                fight: tile.player,
                location: {
                    cords: tileCord,
                    tile
                }
            })
        } else {
            validMoves.push({
                choice: move,
                action: TurnAction.Move,
                location: {
                    cords: tileCord,
                    tile
                }
            })
        }

    }

    return validMoves

}

export function getCordAfterMove(player: Player, choice: MovementChoice) {
    const newCords = structuredClone(player.location)
    switch (choice) {
        case MovementChoice.Up:
            newCords[0] -= 1
            break;
        case MovementChoice.Down:
            newCords[0] += 1
            break;
        case MovementChoice.Left:
            newCords[1] -= 1
            break;
        case MovementChoice.Right:
            newCords[1] += 1
            break;
        default:
        // move satisfies never
        // throw new Error("not a move")
    }
    return newCords
}


export function howAdjacent(coordinateA: [number, number], coordinateB: [number, number]): number {
    let xDistance = Math.abs(coordinateA[0] - coordinateB[0]);
    let yDistance = Math.abs(coordinateA[1] - coordinateB[1]);

    // Check if coordinates are the same
    if (coordinateA[0] === coordinateB[0] && coordinateA[1] === coordinateB[1]) {
        return 0;
    }
    // Check if coordinates are adjacent (up/down/left/right)
    else if (xDistance === 1 && yDistance === 0 || xDistance === 0 && yDistance === 1) {
        return 1;
    }
    // Check if coordinates are diagonal
    else if (xDistance === 1 && yDistance === 1) {
        return 2;
    }
    // If more distance, return the length
    else {
        return Math.sqrt(xDistance ** 2 + yDistance ** 2);
    }
}

export function isValidFight(fighter: Player, opponent: Player) {

    const [thisX, thisY] = fighter.location
    const [fightX, fightY] = opponent.location

    const isUp = (thisX - 1 === fightX) && (thisY === fightY)
    const isDown = (thisX + 1 === fightX) && (thisY === fightY)
    const isLeft = (thisX === fightX) && (thisY - 1 === fightY)
    const isRight = (thisX === fightX) && (thisY + 1 === fightY)

    return {isUp, isDown, isLeft, isRight, valid: isUp || isDown || isLeft || isRight}

}
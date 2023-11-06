import type District from "./districts.js"

export type Sex = "male" | "female"

export interface Learboard {
    district: District
    // the top position of the leaderboard
    position: number
}

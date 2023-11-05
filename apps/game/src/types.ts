import type District from "./districts.js"

export type Sex = "male" | "female"

export interface Learboard {
    district: District
    malePosition: number
    femalePosition: number
    // aggregated from malePosition and femalePosition
    position: number

    maleLasted: number
    femaleLasted: number
}

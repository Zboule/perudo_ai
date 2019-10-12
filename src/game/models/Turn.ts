import { Action } from "./Action";
import { Bucket } from "./Bucket";

export interface Turn {
    readonly buckets: { [playerId: string]: Bucket }
    readonly availableActions: { [playerId: string]: Action[] }
    readonly diceCount: number[]
    readonly numberOfDice: number
    readonly isSpecialTurn: boolean
    readonly actions: Action[]
    readonly result?: {
        targetId: string
        modifier: number
    }
}
import { Bucket } from "./Bucket";
import { Turn } from "./Turn";
import { Action } from "./Action";

export interface GameState {
    readonly playersIds: string[]
    readonly curentTurn?: Turn
    readonly previousTurn: Turn[]
    readonly winnerId?: string
}

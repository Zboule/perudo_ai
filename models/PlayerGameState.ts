import { Action } from './Action'
import { Bucket } from './Bucket'
import { Turn } from './Turn'

export interface PlayerGameState {
    readonly bucketsSize: { [playerId: string]: number }
    readonly numberOfDice: number
    readonly availableActions: Action[]
    readonly bucket: Bucket
    readonly curentTurn: Turn
    readonly previousTurn: Turn[]
}

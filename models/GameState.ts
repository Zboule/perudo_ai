import { Turn } from './Turn'

export interface GameState {
    readonly playersIds: string[]
    readonly curentTurn?: Turn
    readonly previousTurn: Turn[]
    readonly winnerId?: string
}

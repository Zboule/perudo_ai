import { Player } from "./Player";
import { GameState } from "./GameState";

export interface Game {
    gameId: string
    players: { [playerId: string]: Player }
    gameState: GameState | undefined
}
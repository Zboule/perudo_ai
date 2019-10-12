import { PlayerGameState } from "./PlayerGameState";

export interface Player {
    playerId: string
    choseAction: (gameState: PlayerGameState) => Promise<number>
}
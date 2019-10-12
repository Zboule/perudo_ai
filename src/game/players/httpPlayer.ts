import { PlayerGameState } from "game/models/PlayerGameState";
import { Player } from "game/models/Player";
import fetch from "node-fetch"


export const HttpPlayer = (playerId: string, AiURL: string) => {
    let player: Player = {
        playerId,
        choseAction: (gameState: PlayerGameState, ) => {
            return fetch(
                AiURL,
                {
                    method: 'POST',
                    body: JSON.stringify(gameState),
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(response => response.json())
                .then(response => response.action)
        }
    }
    return player
}


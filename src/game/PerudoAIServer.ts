import { GameState } from "./GameEngine";


export interface Player {
    playerId: string
}


export class PerudoAIServer {

    private games: { [gameId: string]: GameState } = {}

    public addPlayerToGame(player: Player, gameId: string) {
        // If la game existe pas, ajouter le joueur
    }

    public removePlayerFromGame(playerId: string, gameId: string) {

    }

    public startGame(gameId: string) {

    }

    public stopGame(gameId: string) {

    }

    public listGames() {

    }
}
import { GameServer } from "game/GameServer";
import { Player } from "game/models/Player";
import { HttpPlayer } from "game/players/httpPlayer";
const fs = require('fs');

let players: { [playerId: string]: Player } = {
    "playerA": HttpPlayer("playerA", "http://localhost:3001/selectAction"),
    "playerB": HttpPlayer("playerB", "http://localhost:3001/selectAction"),
}

let server = new GameServer()


const startNewGame = async () => {
    let gameId = "test_game"
    let game = server.createGame(gameId)

    Object.keys(players).forEach((playerId) => {
        server.addPlayerToGame(players[playerId], gameId)
    })

    let lastGameState: string
    game.subscribe(
        (game) => {
            if (game.gameState !== undefined) {
                lastGameState = JSON.stringify(game.gameState, null, 4)
                fs.writeFileSync('results.json', lastGameState);
            }
        },
        (error) => {
            console.log("Hum we had a mystérious error !")
        },
        () => {

            console.log('Game finished')
        }
    )

    server.startGame(gameId, 'full')

}


startNewGame()





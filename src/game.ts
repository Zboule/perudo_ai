import { GameEngine, GameState } from "./game/GameEngine"



function displayGameState(gameState: GameState) {
    let buckets = gameState.buckets

    let lastActiveTurn =
        gameState.curentTurn.actions.length > 0 ?
            gameState.curentTurn :
            gameState.previousTurn.length > 0 ?
                gameState.previousTurn[gameState.previousTurn.length - 1] :
                gameState.curentTurn

    let lastAction = lastActiveTurn.actions[lastActiveTurn.actions.length - 1]

    

    if (lastAction.type === "bait") {
        console.log(lastAction.playerId, "say", "[", lastAction.bait[0], lastAction.bait[1], "]", " to", lastAction.toPlayerId, "(it's ", lastAction.isTrue, ")")
    }
    else {
        console.log(lastAction.playerId, "say", lastAction.type, "to", lastAction.toPlayerId, "bait", "[", lastAction.bait[0], lastAction.bait[1], "]", "(it's ", lastAction.isTrue, ")")
    }

    gameState.playersIds.forEach(
        (playersId) => {
            console.log(playersId, JSON.stringify(gameState.buckets[playersId]))
        }
    )
}


let gameEngine = new GameEngine()
let gameState: GameState = gameEngine.createGame(["jean", "pierre", "michel"])

while (gameState.winnerId === undefined) {

    console.log("")
    console.log("")
    console.log("")
    let action = gameState.availableActions[0];
    gameState = gameEngine.doAction(gameState, action)

  
    console.log("")
    displayGameState(gameState)
    console.log("")
}


console.log("!!! GAME WINERS !!!")
displayGameState(gameState)



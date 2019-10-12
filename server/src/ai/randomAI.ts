import express from 'express'
import { GameServer } from 'game/GameServer'
import { PlayerGameState } from 'game/models/PlayerGameState'

let perudo = new GameServer()

const server = express()
server.use(express.json())

server.post('/selectAction', (req, res, next) => {
    console.log("Receive call", req.body.cpt)
    let gameState: PlayerGameState = req.body
    let actionIndex = Math.floor(Math.random() * gameState.availableActions.length)
    res.send({ action: actionIndex })
    console.log("Send reply", req.body.cpt)
})

const port = process.env.PORT || 3001
server.listen(port, () => {
    return console.log(`Random AI is listening on ${port}`)
});


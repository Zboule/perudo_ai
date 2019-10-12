import express from 'express'
import { GameServer } from 'game/GameServer'
import { PlayerGameState } from 'game/models/PlayerGameState'

let perudo = new GameServer()

const server = express()
server.use(express.json())

server.post('/selectAction', (req, res, next) => {
    let gameState: PlayerGameState = req.body
    let actionIndex = 0
    res.send({ action: actionIndex })

})

const port = process.env.PORT || 3002
server.listen(port, () => {
    return console.log(`Dumb AI is listening on ${port}`)
});


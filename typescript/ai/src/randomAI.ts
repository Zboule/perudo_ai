import express from 'express'
import { PlayerGameState } from '../../models/PlayerGameState'
const fs = require('fs')

const server = express()
server.use(express.json())

let i = 0
server.post('/selectAction', (req, res, next) => {
    i++
    const gameState: PlayerGameState = req.body
    const actionIndex = Math.floor(Math.random() * gameState.availableActions.length)
    fs.writeFileSync('../../results/info_state_' + i + '.json', JSON.stringify(gameState, null, 4))

    res.send({ action: actionIndex })
})

const port = process.env.PORT || 3001
server.listen(port, () => {
    return console.log(`Random AI is listening on ${port}`)
})


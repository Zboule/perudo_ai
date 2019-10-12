import express from 'express'
import { PlayerGameState } from '../../models/PlayerGameState'


const server = express()
server.use(express.json())

server.post('/selectAction', (req, res, next) => {
    const gameState: PlayerGameState = req.body
    const actionIndex = Math.floor(Math.random() * gameState.availableActions.length)
    res.send({ action: actionIndex })
})

const port = process.env.PORT || 3001
server.listen(port, () => {
    return console.log(`Random AI is listening on ${port}`)
})


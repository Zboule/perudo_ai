import express from 'express'
import { PlayerGameState } from '../../models/PlayerGameState'

const server = express()
server.use(express.json())

server.post('/selectAction', (req, res, next) => {
    const gameState: PlayerGameState = req.body
    const actionIndex = 0
    res.send({ action: actionIndex })

})

const port = process.env.PORT || 3002
server.listen(port, () => {
    return console.log(`Dumb AI is listening on ${port}`)
})


import express from 'express'
import { GameServer } from 'GameServer'
import { HttpPlayer } from 'players/httpPlayer'
const cors = require('cors')

const perudo = new GameServer()

const server = express()
server.use(cors())
server.use(express.json())

server.post('/createGame', (req, res, next) => {
    const gameId = req.body.gameId
    try {
        perudo.createGame(gameId)
        res.send({ status: 'Game created' })
    } catch (e) {
        res.status(500)
        res.send({ error: e })
    }
})

server.post('/deleteGame', (req, res, next) => {
    const gameId = req.body.gameId
    try {
        perudo.deleteGame(gameId)
        res.send({ status: 'Game delted' })
    } catch (e) {
        console.log('error:', e)
        res.status(500)
        res.send({ error: e })
    }
})


server.post('/addPlayerToGame', (req, res, next) => {
    const gameId = req.body.gameId
    const playerId = req.body.playerId
    const playerURL = req.body.playerURL
    try {
        perudo.addPlayerToGame(HttpPlayer(playerId, playerURL), gameId)
        res.send({ status: 'Player added' })
    } catch (e) {
        next(e)
    }
})

server.post('/doGame', async (req, res, next) => {
    const gameId = req.body.gameId
    const action = req.body.action !== undefined ? req.body.action : 'full'
    try {
        await perudo.startGame(gameId, action)
        const gameState = perudo.getGameState(gameId)
        if (gameState!.winnerId !== undefined) {
            perudo.deleteGame(gameId)
        }
        res.send(gameState)
    } catch (e) {
        next(e)
    }
})

server.get('/games', async (req, res, next) => {
    res.send({ games: perudo.listGames() })
})


const port = process.env.PORT || 3000
server.listen(port, () => {
    return console.log(`Server is listening on ${port}`)
})

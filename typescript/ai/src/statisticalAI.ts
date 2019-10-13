import express from 'express'
import { PlayerGameState } from '../../models/PlayerGameState'

const server = express()
server.use(express.json())


const cumputeRatio = (gameState: PlayerGameState) => {
    const otherNumberOfDice = gameState.numberOfDice - gameState.bucket.length

    const actionRatio = gameState.availableActions.map(
        (action) => {
            let unknowNumberOfDice = action.bait[0]
            gameState.bucket.map((value) => {
                if (value === 1 || value === action.bait[1]) {
                    unknowNumberOfDice--
                }
            })

            const ratio = 1 - Math.pow((4 / 6), otherNumberOfDice)

        }
    )

}

server.post('/selectAction', (req, res, next) => {
    const gameState: PlayerGameState = req.body

    gameState.availableActions

    const actionIndex = 0
    res.send({ action: actionIndex })

})

const port = process.env.PORT || 3003
server.listen(port, () => {
    return console.log(`Statistical AI is listening on ${port}`)
})


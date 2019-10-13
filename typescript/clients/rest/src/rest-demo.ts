import fetch from 'node-fetch'
import { Response } from 'node-fetch'
import { GameState } from '../../../models/GameState'

const fs = require('fs')

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})
const gameURL = 'http://localhost:3000'

const createGame = async () => {

    let response: Response

    response = await fetch(gameURL + '/createGame', {
        method: 'POST',
        body: JSON.stringify({
            gameId: 'demo_game'
        }),
        headers: { 'Content-Type': 'application/json' },
    })

    response = await fetch(gameURL + '/addPlayerToGame', {
        method: 'POST',
        body: JSON.stringify({
            gameId: 'demo_game',
            playerId: 'randomAI_1',
            playerURL: 'http://localhost:3001/selectAction'
        }),
        headers: { 'Content-Type': 'application/json' },
    })


    response = await fetch(gameURL + '/addPlayerToGame', {
        method: 'POST',
        body: JSON.stringify({
            gameId: 'demo_game',
            playerId: 'randomAI_2',
            playerURL: 'http://localhost:3001/selectAction'
        }),
        headers: { 'Content-Type': 'application/json' },
    })

    response = await fetch(gameURL + '/addPlayerToGame', {
        method: 'POST',
        body: JSON.stringify({
            gameId: 'demo_game',
            playerId: 'randomAI_3',
            playerURL: 'http://localhost:3001/selectAction'
        }),
        headers: { 'Content-Type': 'application/json' },
    })


    response = await fetch(gameURL + '/addPlayerToGame', {
        method: 'POST',
        body: JSON.stringify({
            gameId: 'demo_game',
            playerId: 'randomAI_4',
            playerURL: 'http://localhost:3001/selectAction'
        }),
        headers: { 'Content-Type': 'application/json' },
    })

    response = await fetch(gameURL + '/addPlayerToGame', {
        method: 'POST',
        body: JSON.stringify({
            gameId: 'demo_game',
            playerId: 'randomAI_5',
            playerURL: 'http://localhost:3001/selectAction'
        }),
        headers: { 'Content-Type': 'application/json' },
    })


    response = await fetch(gameURL + '/addPlayerToGame', {
        method: 'POST',
        body: JSON.stringify({
            gameId: 'demo_game',
            playerId: 'randomAI_6',
            playerURL: 'http://localhost:3001/selectAction'
        }),
        headers: { 'Content-Type': 'application/json' },
    })

}



const doAction = async () => {
    let response
    response = await fetch(gameURL + '/doGame', {
        method: 'POST',
        body: JSON.stringify({
            gameId: 'demo_game',
            action: 'full' // 'turn' || 'action'
        }),
        headers: { 'Content-Type': 'application/json' },
    })

    return response.json()
}


const askContinue = () => {
    return new Promise((resolve, reject) => {
        readline.question(`Continue ?`, () => {
            resolve()
        })
    })
}

const main = async () => {

    const numberOfGames = 1
    console.log('Start ' + numberOfGames + ' games')

    const winners: any = {}

    await createGame()

    let gameState: GameState
    do {
        console.log('Do action')
        gameState = await doAction()
        fs.writeFileSync('../../../results/results_game.json', JSON.stringify(gameState, null, 4))

        await askContinue()

    } while (gameState.winnerId === undefined)

    console.log(gameState.winnerId)
}


main().then(() => console.log('End'))






// const main = async () => {

//     const numberOfGames = 1
//     console.log('Start ' + numberOfGames + ' games')

//     const winners: any = {}

//     await createGame()

//     for (let i = 0; i < numberOfGames; i++) {


//         const data = await doAction()

//         winners[data.winnerId] = winners[data.winnerId] === undefined ? 1 : winners[data.winnerId] + 1
//         fs.writeFileSync('../../../results/results_game_' + i + '.json', JSON.stringify(data, null, 4))

//         readline.question(`Continue`, (name: string) => {
//             console.log(`Hi ${name}!`)
//             readline.close()
//         })

//     }
//     console.log(winners)
// }

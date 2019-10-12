import fetch from 'node-fetch'
import { Response } from 'node-fetch'
const fs = require('fs')

const demo = async () => {
    const gameURL = 'http://localhost:3000'

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


const main = async () => {

    const numberOfGames = 10
    console.log('Start ' + numberOfGames + ' games')

    const winners: any = {}

    for (let i = 0; i < numberOfGames; i++) {

        const time = Date.now()
        console.log('')
        console.log('Start game')
        const data = await demo()

        winners[data.winnerId] = winners[data.winnerId] === undefined ? 1 : winners[data.winnerId] + 1
        console.log('/End game: winner ', data.winnerId, ' in ', Date.now() - time, 'ms')
        console.log('')
        fs.writeFileSync('../../../results/results_game_' + i + '.json', JSON.stringify(data, null, 4))

    }
    console.log(winners)
}

main().then(() => console.log('.'))





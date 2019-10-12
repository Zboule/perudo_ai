import fetch from "node-fetch"
import { Response } from "node-fetch"
const fs = require('fs');

let demo = async () => {
    const gameURL = "http://localhost:3000"

    let response: Response

    response = await fetch(gameURL + "/createGame", {
        method: 'POST',
        body: JSON.stringify({
            gameId: 'demo_game'
        }),
        headers: { 'Content-Type': 'application/json' },
    })

    response = await fetch(gameURL + "/addPlayerToGame", {
        method: 'POST',
        body: JSON.stringify({
            gameId: 'demo_game',
            playerId: 'randomAI_1',
            playerURL: 'http://localhost:3001/selectAction'
        }),
        headers: { 'Content-Type': 'application/json' },
    })


    response = await fetch(gameURL + "/addPlayerToGame", {
        method: 'POST',
        body: JSON.stringify({
            gameId: 'demo_game',
            playerId: 'randomAI_2',
            playerURL: 'http://localhost:3001/selectAction'
        }),
        headers: { 'Content-Type': 'application/json' },
    })

    response = await fetch(gameURL + "/addPlayerToGame", {
        method: 'POST',
        body: JSON.stringify({
            gameId: 'demo_game',
            playerId: 'randomAI_3',
            playerURL: 'http://localhost:3001/selectAction'
        }),
        headers: { 'Content-Type': 'application/json' },
    })


    response = await fetch(gameURL + "/addPlayerToGame", {
        method: 'POST',
        body: JSON.stringify({
            gameId: 'demo_game',
            playerId: 'randomAI_4',
            playerURL: 'http://localhost:3001/selectAction'
        }),
        headers: { 'Content-Type': 'application/json' },
    })

    response = await fetch(gameURL + "/addPlayerToGame", {
        method: 'POST',
        body: JSON.stringify({
            gameId: 'demo_game',
            playerId: 'randomAI_5',
            playerURL: 'http://localhost:3001/selectAction'
        }),
        headers: { 'Content-Type': 'application/json' },
    })


    response = await fetch(gameURL + "/addPlayerToGame", {
        method: 'POST',
        body: JSON.stringify({
            gameId: 'demo_game',
            playerId: 'randomAI_6',
            playerURL: 'http://localhost:3001/selectAction'
        }),
        headers: { 'Content-Type': 'application/json' },
    })

    response = await fetch(gameURL + "/doGame", {
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
    let winners: any = {}
    for (let i = 0; i < 2; i++) {
        console.time('perudogame' + i)
        let data = await demo()
        fs.writeFileSync('results.json', JSON.stringify(data, null, 4));
        winners[data.winnerId] = winners[data.winnerId] === undefined ? 1 : winners[data.winnerId] + 1
        console.log(data.winnerId)
        console.timeEnd('perudogame' + i)
    }
    console.log(winners)
}

main().then(() => console.log("."))





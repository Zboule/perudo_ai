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
    // console.log(await response.json())

    response = await fetch(gameURL + "/addPlayerToGame", {
        method: 'POST',
        body: JSON.stringify({
            gameId: 'demo_game',
            playerId: 'randomAI_1',
            playerURL: 'http://localhost:3001/selectAction'
        }),
        headers: { 'Content-Type': 'application/json' },
    })
    // console.log(await response.json())


    response = await fetch(gameURL + "/addPlayerToGame", {
        method: 'POST',
        body: JSON.stringify({
            gameId: 'demo_game',
            playerId: 'randomAI_2',
            playerURL: 'http://localhost:3001/selectAction'
        }),
        headers: { 'Content-Type': 'application/json' },
    })
    // console.log(await response.json())


    response = await fetch(gameURL + "/addPlayerToGame", {
        method: 'POST',
        body: JSON.stringify({
            gameId: 'demo_game',
            playerId: 'randomAI_3',
            playerURL: 'http://localhost:3001/selectAction'
        }),
        headers: { 'Content-Type': 'application/json' },
    })
    // console.log(await response.json())

    response = await fetch(gameURL + "/doGame", {
        method: 'POST',
        body: JSON.stringify({
            gameId: 'demo_game',
            action: 'full' // 'turn' || 'action' 
        }),
        headers: { 'Content-Type': 'application/json' },
    })

    let data = JSON.stringify(await response.json(), null, 2);

    fs.writeFileSync('results.json', data);
}


console.time("perudo_game")
demo().then(() => {
    console.timeEnd("perudo_game")
})


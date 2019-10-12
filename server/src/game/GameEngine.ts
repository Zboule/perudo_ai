import { range } from "rxjs"
import { GameState } from "./models/GameState"
import { Bucket } from "./models/Bucket"
import { PlayerGameState } from "./models/PlayerGameState"
import { Action } from "./models/Action"

export class GameEngine {

    constructor() {
    }

    public createGame(playersIds: string[]): GameState {

        let buckets: { [playerId: string]: Bucket } = {}
        playersIds.forEach((playerId) => {
            buckets[playerId] = this.makeNewBucket(5)
        })

        let diceCount = this.getDiceRepartition(buckets)
        let numberOfDice = this.countDice(buckets)

        let gameState: GameState = {
            playersIds: [...playersIds],
            curentTurn: {
                buckets: buckets,
                availableActions: {},
                diceCount,
                numberOfDice,
                isSpecialTurn: false,
                actions: [],
                result: undefined
            },
            previousTurn: [],
        }

        gameState = this.generateAvailableActions(gameState)

        return gameState
    }

    public doAction(gameState: GameState, action: Action): GameState {

        gameState = {
            ...gameState,
            curentTurn: {
                ...gameState.curentTurn!,
                actions: [...gameState.curentTurn!.actions, action]
            }
        }

        if (action.type === "callBluff" || action.type === "calza") {

            let targetId
            let modifier

            if (action.type === "callBluff") {
                targetId = action.isTrue ? action.toPlayerId : action.playerId
                modifier = -1

            } else {
                targetId = action.playerId
                modifier = action.isTrue ? +1 : -1
            }

            gameState = this.startNewTurn(gameState, targetId, modifier)
        }


        gameState = this.generateAvailableActions(gameState)



        return gameState
    }

    public generatePlayerGameState(gameState: GameState, playerId: string): PlayerGameState {



        let bucketsSize: { [playerId: string]: number } = {}
        gameState.playersIds.forEach(playerId => {
            bucketsSize[playerId] = gameState.curentTurn!.buckets[playerId].length
        })

        let cleanCurrentTurn = { ...gameState.curentTurn! }
        cleanCurrentTurn.actions = cleanCurrentTurn.actions.map(
            (action) => {
                return {
                    type: action.type,
                    playerId: action.playerId,
                    toPlayerId: action.toPlayerId,
                    bait: action.bait
                }
            }
        )

        return {
            numberOfDice: gameState.curentTurn!.numberOfDice,
            bucketsSize: bucketsSize,
            availableActions: gameState.curentTurn!.availableActions[playerId],
            bucket: gameState.curentTurn!.buckets[playerId],
            curentTurn: cleanCurrentTurn,
            previousTurn: { ...gameState.previousTurn }
        }
    }

    private getWinnerId(buckets: { [playerId: string]: number[] }): string | undefined {

        let alivePlayerIDs: string[] = []

        Object.keys(buckets).forEach((playerId) => {
            if (buckets[playerId].length > 0) {
                alivePlayerIDs.push(playerId)
            }
        })

        return alivePlayerIDs.length === 1 ? alivePlayerIDs[0] : undefined

    }

    private startNewTurn(gameState: GameState, targetId: string, modifier: number): GameState {

        let newBuckets: { [playerId: string]: Bucket } = {}
        gameState.playersIds.forEach((playerId) => {
            let nbOfDice = 5
            if (gameState.curentTurn) {
                nbOfDice = gameState.curentTurn!.buckets[playerId].length
            }
            if (playerId === targetId) {
                nbOfDice += modifier
            }
            if (nbOfDice > 5) {
                nbOfDice === 5
            }
            newBuckets[playerId] = this.makeNewBucket(nbOfDice)
        })

        let winnerId = this.getWinnerId(newBuckets)

        return {
            ...gameState,
            curentTurn: winnerId !== undefined ? undefined : {
                buckets: newBuckets,
                diceCount: this.getDiceRepartition(newBuckets),
                numberOfDice: this.countDice(newBuckets),
                isSpecialTurn: newBuckets[targetId].length === 1 ? true : false,
                availableActions: {},
                actions: []
            },
            previousTurn: [
                ...gameState.previousTurn,
                {
                    ...gameState.curentTurn!,
                    availableActions: {},
                    result: {
                        targetId,
                        modifier,
                    }
                }
            ],
            winnerId
        }
    }

    private countDice(buckets: { [playerId: string]: Bucket }): number {
        let numberOfDice = 0;
        Object.keys(buckets).forEach((playerId) => numberOfDice += buckets[playerId].length)
        return numberOfDice
    }

    private generateAvailableActions(gameState: GameState): GameState {

        let availableActions: { [playerId: string]: Action[] } = {}
        gameState.playersIds.forEach((playerId) => {
            availableActions[playerId] = []
        })

        if (gameState.winnerId) {
            return gameState
        }

        let lastActiveTurn =
            gameState.curentTurn!.actions.length > 0 ?
                gameState.curentTurn :
                gameState.previousTurn.length > 0 ?
                    gameState.previousTurn[gameState.previousTurn.length - 1] :
                    gameState.curentTurn

        let lastAction: Action | undefined = lastActiveTurn!.actions.length > 0 ? lastActiveTurn!.actions[lastActiveTurn!.actions.length - 1] : undefined
        let playOrder = this.getPlayerOrder(lastAction, gameState.playersIds, gameState.curentTurn!.buckets)


        if (lastAction && lastAction.type === "bait") {

            availableActions[playOrder.current].push({
                type: 'calza',
                playerId: playOrder.current,
                toPlayerId: playOrder.previous as string,
                bait: lastAction.bait,
                isTrue: lastAction.bait[0] === gameState.curentTurn!.diceCount[lastAction.bait[1]],
            })

            availableActions[playOrder.current].push({
                type: 'callBluff',
                playerId: playOrder.current,
                toPlayerId: playOrder.previous as string,
                bait: lastAction.bait,
                isTrue: lastAction.bait[0] < gameState.curentTurn!.diceCount[lastAction.bait[1]],
            })


        }

        let availableBaits = this.generateAvailableBaits(gameState, lastAction)

        availableActions[playOrder.current].push(
            ...availableBaits.map(
                (bait) => {
                    let baitAction: Action = {
                        type: 'bait',
                        playerId: playOrder.current,
                        toPlayerId: playOrder.next,
                        bait,
                        isTrue: bait[0] < gameState.curentTurn!.diceCount[bait[1] - 1]
                    }
                    return baitAction
                }
            )

        )

        return {
            ...gameState,
            curentTurn: {
                ...gameState.curentTurn!,
                availableActions
            }
        }
    }

    private getDiceRepartition(buckets: { [playerId: string]: Bucket }, countJocker: boolean = true): number[] {

        let numberOfDice = [0, 0, 0, 0, 0, 0]

        Object.keys(buckets).forEach((bucketId) => {
            let bucket = buckets[bucketId]
            bucket.forEach((dice) => {
                if (dice === 1 && countJocker) {
                    numberOfDice[0] += 1
                    numberOfDice[1] += 1
                    numberOfDice[2] += 1
                    numberOfDice[3] += 1
                    numberOfDice[4] += 1
                    numberOfDice[5] += 1
                }
                else {
                    numberOfDice[dice - 1] += 1
                }
            })
        })


        return numberOfDice
    }

    private generateAvailableBaits(gameState: GameState, lastAction: Action | undefined): [number, number][] {

        let availableBaits: [number, number][] = []

        if (!lastAction || lastAction.type !== "bait") {
            for (let diceValue = 2; diceValue <= 6; diceValue++) {
                for (let nbOfDice = 1; nbOfDice <= gameState.curentTurn!.numberOfDice; nbOfDice++) {
                    availableBaits.push([nbOfDice, diceValue])
                }
            }
        }

        else if (lastAction.type === "bait") {
            if (lastAction.bait[1] === 1) {
                for (let nbOfDice = lastAction.bait[1] + 1; nbOfDice <= gameState.curentTurn!.numberOfDice; nbOfDice++) {
                    availableBaits.push([nbOfDice, 1])
                }

                for (let diceValue = 2; diceValue <= 6; diceValue++) {
                    for (let nbOfDice = (lastAction.bait[0] * 2 + 1); nbOfDice <= gameState.curentTurn!.numberOfDice; nbOfDice++) {
                        availableBaits.push([nbOfDice, diceValue])
                    }
                }
            } else {
                for (let diceValue = lastAction.bait[1] + 1; diceValue <= 6; diceValue++) {
                    availableBaits.push([lastAction.bait[0], diceValue])
                }

                for (let nbOfDice = lastAction.bait[0] + 1; nbOfDice <= gameState.curentTurn!.numberOfDice; nbOfDice++) {
                    availableBaits.push([nbOfDice, lastAction.bait[1]])
                }

                for (let nbOfDice = Math.round(lastAction.bait[0] / 2); nbOfDice <= gameState.curentTurn!.numberOfDice; nbOfDice++) {
                    availableBaits.push([nbOfDice, 1])

                }

            }
        }

        return availableBaits
    }

    private getPlayerOrder(lastAction: Action | undefined, playersIds: string[], buckets: { [playerId: string]: Bucket }): { previous: string | undefined, current: string, next: string } {

        if (lastAction === undefined) {
            return {
                previous: undefined,
                current: playersIds[0],
                next: playersIds[1]
            }
        }
        else {

            if (lastAction.type === "bait") {



                return {
                    previous: lastAction.playerId,
                    current: lastAction.toPlayerId,
                    next: this.getNextPlayerId(lastAction.toPlayerId, playersIds, buckets)
                }
            }
            else if (lastAction.type === "calza") {
                return {
                    previous: lastAction.playerId,
                    current: lastAction.playerId,
                    next: this.getNextPlayerId(lastAction.playerId, playersIds, buckets)
                }
            }
            else { //lastAction.type === "callBluff"

                let current = lastAction.isTrue ? lastAction.toPlayerId : lastAction.playerId
                return {
                    previous: lastAction.playerId,
                    current: current,
                    next: this.getNextPlayerId(current, playersIds, buckets)
                }
            }


        }

    }

    private getNextPlayerId(currentPlayerId: string, playersIds: string[], buckets: { [playerId: string]: Bucket }): string {

        let currentPlayerIndex = playersIds.indexOf(currentPlayerId)

        let nextPlayerIndex!: number
        let potentialNextPlayerIndex = currentPlayerIndex

        while (nextPlayerIndex === undefined) {

            potentialNextPlayerIndex += 1
            if (potentialNextPlayerIndex >= playersIds.length) {
                potentialNextPlayerIndex = 0
            }

            if (buckets[playersIds[potentialNextPlayerIndex]].length > 0) {
                nextPlayerIndex = potentialNextPlayerIndex
            }
        }

        return playersIds[nextPlayerIndex]


    }

    private makeNewBucket(bucketsSize: number): number[] {
        let bucket = []
        for (let i = 0; i < bucketsSize; i++) {
            bucket.push(this.getRamdomDice())
        }
        return bucket
    }

    private getRamdomDice(): number {
        return (Math.floor(Math.random() * 6)) + 1
    }

}
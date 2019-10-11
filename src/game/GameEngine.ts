import { range } from "rxjs"


export type Action = {
    readonly type: 'bait' | 'calza' | 'callBluff'
    readonly playerId: string
    readonly toPlayerId: string
    readonly bait: Readonly<[number, number]>
    readonly isTrue: boolean
}

export type Bucket = number[]


export interface Turn {
    readonly isSpecialTurn: boolean
    readonly actions: Action[]
    readonly result?: {
        targetId: string
        modifier: number
    }
}

export interface GameState {
    readonly playersIds: string[]
    readonly buckets: { [playerId: string]: Bucket }
    readonly diceCount: number[]
    readonly numberOfDice: number
    readonly availableActions: Action[]
    readonly curentTurn: Turn
    readonly previousTurn: Turn[]
    readonly winnerId?: string
}

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
            buckets,
            diceCount,
            numberOfDice,
            availableActions: [],
            curentTurn: {
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
                ...gameState.curentTurn,
                actions: [...gameState.curentTurn.actions, action]
            }
        }

        if (action.type === "callBluff") {
            let targetId = action.isTrue ? action.toPlayerId : action.playerId
            gameState = this.passTurn(gameState, targetId, -1)
            gameState = this.modifyBucketSize(gameState, targetId, -1)
            gameState = this.throwDiece(gameState)
        }

        if (action.type === "calza") {
            let targetId = action.playerId
            let modifier = action.isTrue ? +1 : -1
            gameState = this.passTurn(gameState, targetId, modifier)
            gameState = this.modifyBucketSize(gameState, targetId, modifier)
            gameState = this.throwDiece(gameState)
        }

        gameState = this.generateAvailableActions(gameState)
        gameState = this.lookForWinner(gameState)

        return gameState
    }

    private lookForWinner(gameState: GameState): GameState {

        let alivePlayerIDs: string[] = []

        gameState.playersIds.forEach((playerId) => {
            if (gameState.buckets[playerId].length > 0) {
                alivePlayerIDs.push(playerId)
            }
        })

        return {
            ...gameState,
            winnerId: alivePlayerIDs.length === 1 ? alivePlayerIDs[0] : undefined
        }
    }

    private passTurn(gameState: GameState, targetId: string, modifier: number): GameState {
        return {
            ...gameState,
            curentTurn: {
                isSpecialTurn: gameState.buckets[targetId].length === 1 ? true : false,
                actions: []
            },
            previousTurn: [
                ...gameState.previousTurn,
                {
                    ...gameState.curentTurn,
                    result: {
                        targetId,
                        modifier
                    }
                }
            ]
        }
    }

    private throwDiece(gameState: GameState): GameState {
        let newBuckets: { [playerId: string]: Bucket } = {}
        gameState.playersIds.forEach((playerId) => {
            newBuckets[playerId] = this.makeNewBucket(gameState.buckets[playerId].length)
        })

        // TODO: Dice count doit etre différent en tours calza
        let diceCount = this.getDiceRepartition(newBuckets)
        let numberOfDice = this.countDice(newBuckets)
        return {
            ...gameState,
            buckets: newBuckets,
            diceCount,
            numberOfDice,
        }
    }

    private modifyBucketSize(gameState: GameState, targetId: string, modifier: number): GameState {
        let newBucketSize = gameState.buckets[targetId].length + modifier
        if (newBucketSize > 5) {
            newBucketSize === 5
        }

        let buckets: { [playerId: string]: Bucket } = { ...gameState.buckets }
        buckets[targetId] = this.makeNewBucket(newBucketSize)

        return {
            ...gameState,
            buckets
        }
    }

    private countDice(buckets: { [playerId: string]: Bucket }): number {
        let numberOfDice = 0;
        Object.keys(buckets).forEach((playerId) => numberOfDice += buckets[playerId].length)
        return numberOfDice
    }

    private generateAvailableActions(gameState: GameState): GameState {

        if (gameState.winnerId) {
            return {
                ...gameState,
                availableActions: []
            }
        }

        let lastActiveTurn =
            gameState.curentTurn.actions.length > 0 ?
                gameState.curentTurn :
                gameState.previousTurn.length > 0 ?
                    gameState.previousTurn[gameState.previousTurn.length - 1] :
                    gameState.curentTurn

        let lastAction: Action | undefined = lastActiveTurn.actions.length > 0 ? lastActiveTurn.actions[lastActiveTurn.actions.length - 1] : undefined
        let playOrder = this.getPlayerOrder(lastAction, gameState.playersIds, gameState.buckets)

        let availableActions: Action[] = []

        if (lastAction && lastAction.type === "bait") {

            availableActions.push({
                type: 'calza',
                playerId: playOrder.current,
                toPlayerId: playOrder.previous as string,
                bait: lastAction.bait,
                isTrue: lastAction.bait[0] === gameState.diceCount[lastAction.bait[1]],
            })

            availableActions.push({
                type: 'callBluff',
                playerId: playOrder.current,
                toPlayerId: playOrder.previous as string,
                bait: lastAction.bait,
                isTrue: lastAction.bait[0] < gameState.diceCount[lastAction.bait[1]],
            })


        }

        let availableBaits = this.generateAvailableBaits(gameState, lastAction)

        availableActions.push(
            ...availableBaits.map(
                (bait) => {
                    let baitAction: Action = {
                        type: 'bait',
                        playerId: playOrder.current,
                        toPlayerId: playOrder.next,
                        bait,
                        isTrue: bait[0] < gameState.diceCount[bait[1] - 1]
                    }
                    return baitAction
                }
            )

        )



        return {
            ...gameState,
            availableActions
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
                for (let nbOfDice = 1; nbOfDice <= gameState.numberOfDice; nbOfDice++) {
                    availableBaits.push([nbOfDice, diceValue])
                }
            }
        }

        else if (lastAction.type === "bait") {
            if (lastAction.bait[1] === 1) {
                for (let nbOfDice = lastAction.bait[1] + 1; nbOfDice <= gameState.numberOfDice; nbOfDice++) {
                    availableBaits.push([nbOfDice, 1])
                }

                for (let diceValue = 2; diceValue <= 6; diceValue++) {
                    for (let nbOfDice = (lastAction.bait[1] * 2 + 1); nbOfDice <= gameState.numberOfDice; nbOfDice++) {
                        availableBaits.push([nbOfDice, diceValue])
                    }
                }
            } else {
                for (let diceValue = lastAction.bait[1] + 1; diceValue <= 6; diceValue++) {
                    availableBaits.push([lastAction.bait[0], diceValue])
                }

                for (let nbOfDice = lastAction.bait[0] + 1; nbOfDice <= gameState.numberOfDice; nbOfDice++) {
                    availableBaits.push([nbOfDice, lastAction.bait[1]])
                }

                for (let nbOfDice = Math.round(lastAction.bait[0] / 2); nbOfDice <= gameState.numberOfDice; nbOfDice++) {
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
import { BehaviorSubject } from 'rxjs'
import { Game } from '../../models/Game'
import { GameEngine } from 'GameEngine'
import { Player } from '../../models/Player'
import { GameState } from '../../models/GameState'
import { Action } from '../../models/Action'


export class GameServer {

    private cpt = 0

    private games: {
        [gameId: string]: BehaviorSubject<Game>
    } = {}

    private gameEngine = new GameEngine()


    public createGame(gameId: string): BehaviorSubject<Game> {

        if (this.games[gameId] === undefined) {
            this.games[gameId] = new BehaviorSubject<Game>({
                gameId,
                players: {},
                gameState: undefined
            })
            return this.games[gameId]
        } else {
            throw Error('Game ' + gameId + ' already exist')
        }


    }

    public addPlayerToGame(player: Player, gameId: string) {

        if (this.games[gameId] === undefined) {
            throw Error('Can\'t add player because the game doesn\'t exist')
        }
        if (this.games[gameId].value.gameState !== undefined) {
            throw Error('Can\'t add player to a started game')
        }
        const newPlayers = { ...this.games[gameId].value.players }
        newPlayers[player.playerId] = player

        this.games[gameId].next({
            ...this.games[gameId].value,
            players: newPlayers
        })

    }

    public removePlayerFromGame(playerId: string, gameId: string) {
        if (this.games[gameId] === undefined) {
            throw Error('Can\'t remove player because the game doesn\'t exist')
        }
        if (this.games[gameId].value.gameState !== undefined) {
            throw Error('Can\'t remove player from a started game')
        }

        const newPlayers = { ...this.games[gameId].value.players }
        delete newPlayers[playerId]

        this.games[gameId].next({
            ...this.games[gameId].value,
            players: newPlayers
        })

    }

    public async startGame(gameId: string, action: 'full' | 'turn' | 'action' = 'full') {

        const game = this.games[gameId]

        if (game === undefined) {
            throw Error('Game doesn\'t exist')
        }
        if (Object.keys(game.value.players).length < 2) {
            throw Error('Not enougth players')
        }

        if (game.value.gameState === undefined) {
            game.next({
                ...game.value,
                gameState: this.gameEngine.createGame(Object.keys(game.value.players).map(playerId => playerId))
            })
        }

        if (action === 'full') {
            while (game.value.gameState !== undefined && game.value.gameState!.winnerId === undefined) {
                await this.doGameAction(game)
            }
        } else if (action === 'turn') {
            do {
                await this.doGameAction(game)

            } while (game.value.gameState!.curentTurn!.actions.length > 0)
        } else if (action === 'action') {
            await this.doGameAction(game)
        }

        if (game.value.gameState!.winnerId !== undefined) {
            game.complete()
        }

    }

    private async doGameAction(game: BehaviorSubject<Game>) {
        const actionProposition: Promise<{ playerId: string, actionIndex: number }>[] = []
        this.cpt++
        game.value.gameState!.playersIds.forEach((playerId) => {
            if (game.value.gameState!.curentTurn!.availableActions[playerId].length > 0) {

                const playerGameState = this.gameEngine.generatePlayerGameState(game.value.gameState!, playerId);
                (playerGameState as any).cpt = this.cpt
                const playerAction = game.value.players[playerId].choseAction(playerGameState)
                    .then((actionIndex) => ({
                        playerId,
                        actionIndex
                    }))
                actionProposition.push(playerAction)
            }
        })
        console.log('Ask for propositions start :', this.cpt)
        const selectedAction = await Promise.race<{ playerId: string, actionIndex: number }>(actionProposition)
        console.log('Ask for propositions end :', this.cpt)
        const action: Action = game.value.gameState!.curentTurn!.availableActions[selectedAction.playerId][selectedAction.actionIndex]

        game.next({
            ...game.value,
            gameState: this.gameEngine.doAction(game.value.gameState!, action)
        })
    }

    public getGameState(gameId: string): GameState | undefined {
        return this.games[gameId] && this.games[gameId].value.gameState
    }

    public deleteGame(gameId: string) {
        if (this.games[gameId]) {
            this.games[gameId].complete()
            delete this.games[gameId]
        }
    }

    public listGames() {
        return Object.keys(this.games)
    }
}

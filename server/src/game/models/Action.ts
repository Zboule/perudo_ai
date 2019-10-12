export type Action = {
    readonly type: 'bait' | 'calza' | 'callBluff'
    readonly playerId: string
    readonly toPlayerId: string
    readonly bait: Readonly<[number, number]>
    readonly isTrue?: boolean
}


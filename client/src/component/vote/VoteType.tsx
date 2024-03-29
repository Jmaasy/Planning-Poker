export type Vote = {
    userId: string | null,
    amount: number | string,
    voted: boolean,
    hidden: boolean,
    updated: boolean
}

export type VoteHistoryWrapper = {
    latest: Vote[],
    history: VoteHistoryEntry[]
}

export type VoteHistoryEntry = {
    entry: Vote[]
}
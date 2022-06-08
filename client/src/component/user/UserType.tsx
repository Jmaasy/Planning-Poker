export type User = {
    id: string,
    connected: boolean,
    userDetails: UserDetails | null
}

export type UserDetails = {
    name: string,
    spectator: boolean,
    inLobby: boolean,
    lobbyId: number
}

export type EventUser = {
    clientId: string,
    name: string,
    spectator: boolean,
    inLobby: boolean,
    lobbyId: number
}

export type EventUserWrapper = {
    user: EventUser,
    votedStatus: boolean,
    votedNumber: number | string | null
}
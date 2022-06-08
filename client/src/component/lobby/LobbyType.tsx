import { User } from "../user/UserType"

export type Lobby = {
    id: string | null,
    users: User[],
    state: LobbyState,
    revealIn: number
}

export enum LobbyState {
    STARTED,
    VOTED,
    COUNTDOWN,
    REVEALED,
    RESET,
    ERROR,
    STARTUP
}
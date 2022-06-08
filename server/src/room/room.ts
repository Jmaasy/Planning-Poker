enum RoomState {
    STARTED,
    VOTED,
    COUNTDOWN,
    REVEALED,
    RESET,
    ERROR
};

type Vote = {
    number: string,
    clientId: string
};

type Room = {
    name: string,
    userIds: string[]
    votes: Map<string, Vote>,
    voteHistory: Map<string, number>[]
    state: RoomState
};

export { Room, RoomState, Vote };
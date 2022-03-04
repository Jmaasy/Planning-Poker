enum RoomState {
    STARTING,
    VOTED,
    RESET
};

type Vote = {
    number: string,
    clientId: string
};

type Room = {
    name: string,
    userIds: string[]
    votes: Map<string, Vote>,
    state: RoomState
};

export { Room, RoomState, Vote };
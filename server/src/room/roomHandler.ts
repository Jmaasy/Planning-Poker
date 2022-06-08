import { Room, RoomState, Vote }  from './room';
import { v4 as uuidv4 } from 'uuid';
import Logger from '../logger';

class RoomHandler {  
    rooms: Map<string, Room> = new Map();

    createRoom(name: string, userId: string): string {
        const id = uuidv4();
        this.rooms.set(id, {
            name: name,
            userIds: [userId],
            votes: new Map(),
            voteHistory: [],
            state: RoomState.STARTED
        });

        return id;
    }

    // vote number can be a string since there is a ? option
    handleVote(roomId: string, clientId: string, number: string): Vote {
        if(this.hasVoted(roomId, clientId)) {
            this.rooms.get(roomId).votes.delete(clientId);
        }

        const vote = {
            number: number,
            clientId: clientId
        };

        this.setState(roomId, RoomState.VOTED);
        this.rooms.get(roomId).votes.set(clientId, vote);

        return vote;
    }

    getConnectedUserIds(roomId: string): string[]{
        if(this.checkIfRoomExists(roomId)) {
            return this.rooms.get(roomId).userIds;
        }

        return [];
    }

    getVotes(roomId: string): Vote[] {
        if(this.checkIfRoomExists(roomId)) {
            const voteValues = this.rooms.get(roomId).votes.values();
            const votedDistribution: Map<string, number> = new Map();

            Array.from(voteValues).forEach((vote, _) => {
                let number = (votedDistribution.get(vote.number) == undefined) ? 0 : votedDistribution.get(vote.number);
                    number++
                votedDistribution.set(vote.number, number);
            });
            
            if(this.rooms.get(roomId).voteHistory.length == 4) this.rooms.get(roomId).voteHistory.pop();
            this.rooms.get(roomId).voteHistory.unshift(votedDistribution);

            return [...this.rooms.get(roomId).votes.values()];
        } else return [];
    }
        
    getVote(roomId: string, clientId: string): Vote {
        if(this.checkIfRoomExists(roomId)) {
            return this.rooms.get(roomId).votes.get(clientId);
        } else {
            Logger.WARN(`Trying to get vote from non existing room (${roomId}, ${clientId})`)
        }
    }

    hasVoted(roomId: string, clientId: string): boolean {
        return (this.getVote(roomId, clientId) != undefined)
    }

    setState(roomid: string, state: RoomState) {
        if(this.checkIfRoomExists(roomid)) {
            this.rooms.get(roomid).state = state;
        }
    }

    getState(roomId: string): RoomState {
        if(this.checkIfRoomExists(roomId)) {
            return this.rooms.get(roomId).state;
        } else return RoomState.ERROR
    }

    joinRoom(roomId: string, userId: string): boolean {
        if(this.checkIfRoomExists(roomId)) {
            this.rooms.get(roomId).userIds.push(userId);
            return true;
        } else return false;
    }

    resetVotes(roomId: string) {
        if(this.checkIfRoomExists(roomId)) {
            if(this.rooms.get(roomId).state == RoomState.REVEALED) {
                this.rooms.get(roomId).votes.clear();
                this.setState(roomId, RoomState.RESET);
            } else {
                Logger.WARN(`Cannot reset votes of room ${roomId} due to incorrect state`);
            }
        } else {
            Logger.WARN(`Trying to reset votes from non existing room`);
        }
    }

    getVoteHistory(roomId: string): Map<string, number>[] {
        if(this.checkIfRoomExists(roomId)) {
            return this.rooms.get(roomId).voteHistory;
        }
    }

    removeUserFromRoom(userId: string, roomId: string) {
        if(this.checkIfRoomExists(roomId)) {
            const index = this.rooms.get(roomId).userIds.indexOf(userId);
            if (index > -1) this.rooms.get(roomId).userIds.splice(index, 1);

            if(this.rooms.get(roomId).userIds.length == 0) {
                Logger.INFO(`Room is empty, room ${roomId} will also be deleted`);
                this.rooms.delete(roomId);
            }
        } else {
            Logger.WARN(`Trying to remove user from non existing room`);
        }
    }

    private checkIfRoomExists(roomId: string): boolean {
        if(this.rooms.get(roomId) == undefined) {
            Logger.WARN(`Someone attempted to perform an action on a room that does not exist`);
            return false;
        } else return true;
    }
}

export default RoomHandler;
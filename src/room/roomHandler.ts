import { Room, RoomState, Vote }  from './room';
import { v4 as uuidv4 } from 'uuid';

class RoomHandler {  
    rooms: Map<string, Room> = new Map();

    createRoom(name: string, userId: string): string {
        const id = uuidv4();
        this.rooms.set(id, {
            name: name,
            userIds: [userId],
            votes: new Map(),
            state: RoomState.STARTING
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
            return [...this.rooms.get(roomId).votes.values()];
        } else return [];
    }
        
    getVote(roomId: string, clientId: string): Vote {
        return this.rooms.get(roomId).votes.get(clientId);
    }

    hasVoted(roomId: string, clientId: string): boolean {
        return (this.getVote(roomId, clientId) != undefined)
    }

    setState(roomid: string, state: RoomState) {
        if(this.checkIfRoomExists(roomid)) {
            this.rooms.get(roomid).state = state;
        }
    }

    joinRoom(roomId: string, userId: string): boolean {
        if(this.checkIfRoomExists(roomId)) {
            this.rooms.get(roomId).userIds.push(userId);
            return true;
        } else return false;
    }

    resetVotes(roomId: string) {
        if(this.checkIfRoomExists(roomId)) {
            if(this.rooms.get(roomId).state == RoomState.VOTED) {
                this.rooms.get(roomId).votes.clear();
                this.setState(roomId, RoomState.RESET);
            } else {
                console.log(`[WARN] Cannot reset votes of room ${roomId} due to incorrect state`);
            }
        } else {
            console.log(`[WARN] Trying to reset votes from non existing room`);
        }
    }

    removeUserFromRoom(userId: string, roomId: string) {
        if(this.checkIfRoomExists(roomId)) {
            const index = this.rooms.get(roomId).userIds.indexOf(userId);
            if (index > -1) this.rooms.get(roomId).userIds.splice(index, 1);

            if(this.rooms.get(roomId).userIds.length == 0) {
                console.log(`[INFO] Room is empty, room ${roomId} will also be deleted`);
                this.rooms.delete(roomId);
            }
        } else {
            console.log(`[WARN] Trying to remove user from non existing room`);
        }
    }

    private checkIfRoomExists(roomId: string): boolean {
        if(this.rooms.get(roomId) == undefined) {
            console.log(`[WARN] Someone attempted to perform an action on a room that does not exist`);
            return false;
        } else return true;
    }
}

export default RoomHandler;
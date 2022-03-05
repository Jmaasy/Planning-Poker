import { Socket } from 'socket.io';
import { buildResponse, emitToSelf, emitToUsers } from './response';
import { RoomState } from './room/room';
import RoomHandler from './room/roomHandler';
import UserHandler from './user/userHandler';

class PlanningPoker {
    roomHandler = new RoomHandler()
    userHandler = new UserHandler()

    createRoom(socket: Socket, clientId: string, roomName: string) {
        if(this.userHandler.validateUser(clientId, socket)) {
            const userId = this.userHandler.getIdentifier(clientId);
            const roomId = this.roomHandler.createRoom(roomName, userId);

            this.userHandler.setRoomId(userId, roomId);
            const user = this.userHandler.getUserWithoutSocket(userId);

            const resp = buildResponse(user);
            emitToSelf(socket, "create-room-processed", resp)
        
            console.log(`[ROOM] user ${user.name} has created room ${roomId}`);
        } else {
            console.log(`[ERROR] Invalid user action! User ${clientId} is not validated and therefore cannot create a room.`);
        }
    }

    removeUser(socket: Socket, clientId: string) {
        if(this.userHandler.validateUser(clientId, socket)) {
            const userId = this.userHandler.getIdentifier(clientId);
            const user = this.userHandler.getUserWithoutSocket(userId);
            if(user.roomId != null) {
                this.roomHandler.removeUserFromRoom(userId, user.roomId);
                if(this.roomHandler.getConnectedUserIds(user.roomId).length > 0) {
                    const sockets = this.getSocketsFromRoomId(user.roomId, [userId]);
                    const resp = buildResponse(user, false);
                    emitToUsers(sockets, "disconnect-room-processed", resp);
                }
            }

            this.userHandler.removeUser(clientId);
        }
    }

    vote(socket: Socket, clientId: string, number: string) {
        if(this.userHandler.validateUser(clientId, socket)) {
            const userId = this.userHandler.getIdentifier(clientId);
            const user = this.userHandler.getUserWithoutSocket(userId);
            this.roomHandler.handleVote(user.roomId, clientId, number);
            
            const connectedIds = this.roomHandler.getConnectedUserIds(user.roomId);
            const sockets = this.userHandler.getSockets(connectedIds, [userId]);

            const resp = buildResponse(user);
            emitToUsers(sockets, "vote-processed", resp);
            emitToSelf(socket, "vote-processed", resp);

            console.log(`[VOTE] user ${user.name} has voted ${number}`);
        } else {
            console.log(`[ERROR] Invalid user action! User ${clientId} is not validated and therefore cannot vote on a room.`);
        }
    }

    resetVotes(socket: Socket, clientId: string) {
        if(this.userHandler.validateUser(clientId, socket)) {

            const userId = this.userHandler.getIdentifier(clientId);
            const user = this.userHandler.getUserWithoutSocket(userId);
            
            console.log(`[VOTE] user ${user.name} has requested to reset votes for room: ${user.roomId}`);

            this.roomHandler.resetVotes(user.roomId);

            const sockets = this.getSocketsFromRoomId(user.roomId, [userId]);
            const resp = buildResponse("");
            emitToUsers(sockets, "vote-reset-processed", resp);
            emitToSelf(socket, "vote-reset-processed", resp);
        }
    }

    revealVotes(socket: Socket, clientId: string) {
        if(this.userHandler.validateUser(clientId, socket)) {

            const userId = this.userHandler.getIdentifier(clientId);
            const user = this.userHandler.getUserWithoutSocket(userId);
            
            console.log(`[VOTE] user ${user.name} has requested to reveal votes for room: ${user.roomId}`);

            const sockets = this.getSocketsFromRoomId(user.roomId, [userId]);
            this.roomHandler.setState(user.roomId, RoomState.VOTED);
        
            setTimeout(_ => {
                const resp = buildResponse(3);
                emitToUsers(sockets, "vote-reveal-countdown", resp);
                emitToSelf(socket, "vote-reveal-countdown", resp);
            }, 1000);

            setTimeout(_ => {
                const resp = buildResponse(2);
                emitToUsers(sockets, "vote-reveal-countdown", resp);
                emitToSelf(socket, "vote-reveal-countdown", resp);
            }, 2000);

            setTimeout(_ => {
                const resp = buildResponse(1);
                emitToUsers(sockets, "vote-reveal-countdown", resp);
                emitToSelf(socket, "vote-reveal-countdown", resp);
            }, 3000);

            setTimeout(_ => {
                const votes = this.roomHandler.getVotes(user.roomId);
                const resp = buildResponse(votes);
                emitToUsers(sockets, "vote-reveal-now", resp);
                emitToSelf(socket, "vote-reveal-now", resp);
            }, 4000);
        }
    }

    joinRoom(socket: Socket, clientId: string, roomId: string) {
        if(this.userHandler.validateUser(clientId, socket)) {
            const userId = this.userHandler.getIdentifier(clientId);
            if(this.roomHandler.joinRoom(roomId, userId)) {
                this.userHandler.setRoomId(userId, roomId);

                const user = this.userHandler.getUserWithoutSocket(userId);

                const connectedIds = this.roomHandler.getConnectedUserIds(roomId);
                const sockets = this.userHandler.getSockets(connectedIds, [userId]);

                const resp = buildResponse(user, false);
                const resp2 = buildResponse({
                    self: user,
                    connected: connectedIds.map(x => {
                        const user = this.userHandler.getUserWithoutSocket(x);
                        return {
                            user: user,
                            voteStatus: this.roomHandler.hasVoted(user.roomId, x)
                        }
                    })
                }, false);
                emitToUsers(sockets, "join-room-processed", resp);
                emitToSelf(socket, "join-room-emit-processed", resp2);

                console.log(`[ROOM] user ${user.name} has entered room ${roomId}`);
            } else {
                const user = this.userHandler.getUserWithoutSocket(userId);
                const resp = buildResponse(user, false);
                emitToSelf(socket, "join-room-emit-not-processed", resp);
            }
        } else {
            console.log(`[ERROR] Invalid user action! User ${clientId} is not validated and therefore cannot join a room.`);
        }
    }

    private getSocketsFromRoomId(roomId: string, filter: string[]): Socket[] {
        const connectedIds = this.roomHandler.getConnectedUserIds(roomId);
        return this.userHandler.getSockets(connectedIds, filter);
    }
}

export default PlanningPoker;
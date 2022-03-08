import { Socket } from 'socket.io';
import Logger from './logger';
import { buildResponse, emitToAll, emitToSelf, emitToUsers } from './response';
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
        
            Logger.LOG("ROOM", `User ${user.name} has created room ${roomId}`);
        } else {
            Logger.ERROR(`Invalid user action! User ${clientId} is not validated and therefore cannot vote on a room.`);
        }
    }

    removeUser(socket: Socket, clientId: string) {
        if(this.userHandler.validateUser(clientId, socket)) {
            const userId = this.userHandler.getIdentifier(clientId);
            const user = this.userHandler.getUserWithoutSocket(userId);
            if(user.roomId != null) {
                this.roomHandler.removeUserFromRoom(userId, user.roomId);

                Logger.LOG("ROOM", `Removed user(${user.name}) from room ${user.roomId}`);
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
            emitToAll(sockets, socket, resp, "vote-processed");

            Logger.LOG("VOTE", `User ${user.name} has voted ${number}`);
        } else {
            Logger.ERROR(`Invalid user action! User ${clientId} is not validated and therefore cannot vote on a room.`);
        }
    }

    resetVotes(socket: Socket, clientId: string) {
        if(this.userHandler.validateUser(clientId, socket)) {
            const userId = this.userHandler.getIdentifier(clientId);
            const user = this.userHandler.getUserWithoutSocket(userId);

            Logger.LOG("VOTE", `User ${user.name} has requested to reset votes for room: ${user.roomId}`);

            this.roomHandler.resetVotes(user.roomId);
            if(this.roomHandler.getState(user.roomId) == RoomState.VOTED) {
                this.roomHandler.setState(user.roomId, RoomState.RESET);
                return;
            }

            const sockets = this.getSocketsFromRoomId(user.roomId, [userId]);
            const resp = buildResponse("");
            emitToAll(sockets, socket, resp, "vote-reset-processed");
        }
    }

    revealVotes(socket: Socket, clientId: string) {
        if(this.userHandler.validateUser(clientId, socket)) {
            const userId = this.userHandler.getIdentifier(clientId);
            const user = this.userHandler.getUserWithoutSocket(userId);
            
            Logger.LOG("VOTE", `User ${user.name} has requested to reveal votes for room: ${user.roomId}`);

            if(this.roomHandler.getState(user.roomId) != RoomState.REVEAL) {
                this.roomHandler.setState(user.roomId, RoomState.REVEAL);
                const sockets = this.getSocketsFromRoomId(user.roomId, [userId]);
            
                setTimeout(_ => {
                    const resp = buildResponse(3);
                    emitToAll(sockets, socket, resp, "vote-reveal-countdown");
                }, 1000);

                setTimeout(_ => {
                    const resp = buildResponse(2);
                    emitToAll(sockets, socket, resp, "vote-reveal-countdown");

                }, 2000);

                setTimeout(_ => {
                    const resp = buildResponse(1);
                    emitToAll(sockets, socket, resp, "vote-reveal-countdown");
                }, 3000);

                setTimeout(_ => {
                    const votes = this.roomHandler.getVotes(user.roomId);
                    const resp = buildResponse(votes);
                    emitToAll(sockets, socket, resp, "vote-reveal-now");

                    Logger.LOG("VOTE", `Sending updated vote history for room: ${user.roomId}`);

                    const voteHistory = this.roomHandler.getVoteHistory(user.roomId);
                    const voteHistoryResponse = buildResponse(
                        voteHistory.map(x => Array.from(x.entries()))
                    );
                    emitToAll(sockets, socket, voteHistoryResponse, "update-vote-history");

                    this.roomHandler.setState(user.roomId, RoomState.VOTED);
                }, 4000);
            }
        }
    }

    joinRoom(socket: Socket, clientId: string, roomId: string) {
        if(this.userHandler.validateUser(clientId, socket)) {
            const userId = this.userHandler.getIdentifier(clientId);
            if(this.roomHandler.joinRoom(roomId, userId)) {
                this.userHandler.setRoomId(userId, roomId);

                const user = this.userHandler.getUserWithoutSocket(userId);

                const connectedUserIds = this.roomHandler.getConnectedUserIds(roomId);
                const sockets = this.userHandler.getSockets(connectedUserIds, [userId]);

                const resp = buildResponse(user, false);
                const resp2 = buildResponse({
                    self: user,
                    connected: connectedUserIds.map(x => {
                        const connectedUser = this.userHandler.getUserWithoutSocket(x);
                        return {
                            user: connectedUser,
                            voteStatus: this.roomHandler.hasVoted(connectedUser.roomId, connectedUser.clientId)
                        }
                    })
                }, false);
                emitToUsers(sockets, "join-room-processed", resp);
                emitToSelf(socket, "join-room-emit-processed", resp2);

                Logger.LOG("ROOM", `User ${user.name} has entered room ${roomId}`);
            } else {
                const user = this.userHandler.getUserWithoutSocket(userId);
                const resp = buildResponse(user, false);
                emitToSelf(socket, "join-room-emit-not-processed", resp);
            }
        } else {
            Logger.ERROR(`Invalid user action! User ${clientId} is not validated and therefore cannot vote on a room.`);
        }
    }

    private getSocketsFromRoomId(roomId: string, filter: string[]): Socket[] {
        const connectedIds = this.roomHandler.getConnectedUserIds(roomId);
        return this.userHandler.getSockets(connectedIds, filter);
    }
}

export default PlanningPoker;
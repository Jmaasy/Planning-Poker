import User from "./user";
import UserValidator from "./userValidator";
import { Socket, Server } from 'socket.io';
import { buildResponse, emitToSelf } from "../messaging";

class UserHandler {
    private userValidator = new UserValidator();
    // private usersConnected: { [id: string] : User } = {};
    private usersConnected: Map<string, User> = new Map();

    createUser(socket: Socket, clientId: string, name: string) {
        const internalIdentifier = this.userValidator.getIdentifier(clientId);
        this.usersConnected.set(
            internalIdentifier, 
            {
                clientId: clientId,
                name: name,
                roomId: null,
                socket: socket
            }
        );

        console.log(`[USER] created user ${name}(${clientId})`);

        const resp = buildResponse(this.getUserWithoutSocket(internalIdentifier));
        emitToSelf(socket, "registered-successfull", resp);
    }

    validateUser(clientId: string, socket: Socket): Boolean {
        const identifier = this.userValidator.getIdentifier(clientId);
        const user = this.getUserById(identifier);
        if(user == undefined) return false;
        return (user.clientId == clientId && user.socket.handshake.time == socket.handshake.time);
    }

    getSockets(userIds: string[], filter: string[]): Socket[] {
        return userIds
            .filter(id => !filter.includes(id))
            .map(userId => this.getUserById(userId).socket)
    }

    getIdentifier(clientId: string) {
        return this.userValidator.getIdentifier(clientId);
    }

    getUserById(userId: string): User {
        return this.usersConnected.get(userId);
    }

    getUser(clientId: string): User {
        const internalIdentifier = this.userValidator.getIdentifier(clientId);
        return this.getUserById(internalIdentifier);
    }

    getUserWithoutSocket(userId: string): User {
        const user = { ...this.getUserById(userId) };
        user.socket = undefined;
        return user;
    }

    setRoomId(userId: string, roomId: string) {
        this.getUserById(userId).roomId = roomId;
    }

    removeUser(clientId: string) {
        const internalIdentifier = this.userValidator.getIdentifier(clientId);
        this.usersConnected.delete(internalIdentifier);
    }
}

export default UserHandler;
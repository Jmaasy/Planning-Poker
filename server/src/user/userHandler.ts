import UserValidator from "./userValidator";
import { User, RegisterUserData } from "./user";
import { Socket } from 'socket.io';
import { buildResponse, emitToSelf } from "../response";
import Logger from "../logger";

class UserHandler {
    private userValidator = new UserValidator();
    private usersConnected: Map<string, User> = new Map();

    createUser(socket: Socket, clientId: string, userData: RegisterUserData) {
        const internalIdentifier = this.userValidator.getIdentifier(clientId);
        this.usersConnected.set(
            internalIdentifier, 
            {
                clientId: clientId,
                name: userData.name,
                roomId: null,
                spectator: userData.spectator,
                socket: socket
            }
        );
            
        Logger.LOG("USER", `Created ${(userData.spectator) ? "spectator" : "user"} ${userData.name}(${clientId})`);

        const resp = buildResponse(this.getUserWithoutSocket(internalIdentifier));
        emitToSelf(socket, "registration-processed", resp);
    }

    validateUser(clientId: string, socket: Socket): Boolean {
        const identifier = this.userValidator.getIdentifier(clientId);
        const user = this.getUserById(identifier);
        if(user == undefined) return false;
        return (user.clientId == clientId && user.socket.handshake.time == socket.handshake.time);
    }

    getSockets(userIds: string[], filter: string[]): Socket[] {
        return userIds
            .filter(id => {
                const user = this.getUserById(id);
                if(user == undefined) return false
                return !filter.includes(id)
            })
            .map(userId => this.getUserById(userId).socket);
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
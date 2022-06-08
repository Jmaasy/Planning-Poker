import { Socket } from "socket.io";

type User = {
    clientId: string,
    name: string,
    roomId: string | null,
    spectator: boolean,
    socket: Socket
};

type RegisterUserData = {
    name: string,
    spectator: boolean
}

export { User, RegisterUserData};
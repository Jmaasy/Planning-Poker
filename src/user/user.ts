import { Socket } from "socket.io";

type User = {
    clientId: string,
    name: string,
    roomId: string | null,
    socket: Socket
};

export default User;
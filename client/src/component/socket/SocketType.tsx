import { Socket } from "socket.io-client"

export type SocketType = {
    socket: Socket,
    lastUpdatedTimestamp: Number
}
import { Socket } from "socket.io"
import Logger from "./logger";

interface Response {
    error: boolean,
    content: Object,
    message: string | null
}

function emitToUsers(sockets: Socket[], event: string, response: Response) {
    Logger.LOG("EMIT", "Emitting to all connected users besides self");
    sockets.forEach((socket: Socket) => {
        socket.emit(event, response);
    });
}

function emitToAll(sockets: Socket[], socket: Socket, response: Response, event: string) {
    emitToUsers(sockets, event, response);
    emitToSelf(socket, event, response);
}

function emitToSelf(socket: Socket, event: string, response: Response) {
    Logger.LOG("EMIT", "Emitting to self");
    socket.emit(event, response);
}

function buildResponse(content: Object, error: boolean = false, message: string | null = null): Response {
    return {
        error: error,
        content: content,
        message: message
    };
}


export { buildResponse, emitToUsers, emitToSelf, emitToAll, Response }
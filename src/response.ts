import { Socket } from "socket.io"

interface Response {
    error: boolean,
    content: Object,
    message: string | null
}

function emitToUsers(sockets: Socket[], event: string, response: Response) {
    sockets.forEach((socket: Socket) => {
        socket.emit(event, response);
    });
}

function emitToAll(sockets: Socket[], socket: Socket, response: Response, event: string) {
    emitToUsers(sockets, event, response);
    emitToSelf(socket, event, response);
}

function emitToSelf(socket: Socket, event: string, response: Response) {
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
import React, { ReactElement, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SocketType } from '../component/socket/SocketType';

export type SocketProviderProperties = {
    children: ReactElement,
    value: SocketType | null
}

export type SocketStateHandler = {
    socket: Socket | null
}

export const SocketContext = React.createContext<SocketStateHandler | null>(null);

export const SocketProvider = (props: SocketProviderProperties) => {
    const [socket, setSocketState] = useState(props.value);

    const state: SocketStateHandler = {
        socket: socket?.socket ?? null
    }

    socket?.socket?.on('disconnect', () => {
        setSocketState({...socket, lastUpdatedTimestamp: Date.now()});
    });

    socket?.socket?.on('connect', () => {
        setSocketState({...socket, lastUpdatedTimestamp: Date.now()});
    });

    return (
        <SocketContext.Provider value={state}>
            {props.children}
        </SocketContext.Provider>
    );
};

export const startupSocketState = (): SocketType => {
    const socket = io(`https://jeffreymaas.dev:443`, {secure: true, timeout: 100, reconnectionDelay: 500, reconnectionDelayMax:500, transports: ["websocket"]});
    // const socket = io(`http://localhost:443`, {secure: true, timeout: 100, reconnectionDelay: 500, reconnectionDelayMax:500, transports: ["websocket"]});
    return {
        socket: socket,
        lastUpdatedTimestamp: Date.now()
    }
}
import React, { ReactElement, useState } from 'react';
import { Socket} from 'socket.io-client';

export type SocketProviderProperties = {
    children: ReactElement,
    value: Socket | null
}

export type SocketStateHandler = {
    socket: Socket | null
}

export const SocketContext = React.createContext<SocketStateHandler | null>(null);

export const SocketProvider = (props: SocketProviderProperties) => {
    const [socket] = useState(props.value);

    const state: SocketStateHandler = {
        socket: socket    
    }

    return (
        <SocketContext.Provider value={state}>
            {props.children}
        </SocketContext.Provider>
    );
};
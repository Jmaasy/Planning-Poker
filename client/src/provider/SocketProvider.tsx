import React, { ReactElement, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SocketType } from '../component/socket/SocketType';
import { toast } from 'react-toastify';
import { Analytics } from '../common/Analytics';

export type SocketProviderProperties = {
    children: ReactElement,
    value: SocketType | null
}

export type SocketStateHandler = {
    socket: Socket | null,
    socketConnectionWasLost: Number
}

export const SocketContext = React.createContext<SocketStateHandler | null>(null);

export const SocketProvider = (props: SocketProviderProperties) => {
    const [socket, setSocketState] = useState(props.value);

    const state: SocketStateHandler = {
        socket: socket?.socket ?? null,
        socketConnectionWasLost: socket?.connectionWasLost ?? 0
    }

    socket?.socket?.on('disconnect', () => {
        Analytics.trackConnectionLost();
        
        toast.error('Connection to the server has been lost.');
        setSocketState({...socket, lastUpdatedTimestamp: Date.now(), connectionWasLost: 1});
        toast.clearWaitingQueue();
    });

    socket?.socket?.on('connect', () => {

        if(socket.connectionWasLost) {
            Analytics.trackConnectionRegained();

            toast.success('Connection to the server has been regained.', {
                onOpen: () => {
                    setSocketState({...socket, lastUpdatedTimestamp: Date.now(), connectionWasLost: -1});
                } 
            });
            toast.clearWaitingQueue();
        } else {
            Analytics.trackConnectionSuccess();

            setSocketState({...socket, lastUpdatedTimestamp: Date.now(), connectionWasLost: 0});
        }
    });

    return (
        <SocketContext.Provider value={state}>
            {props.children}
        </SocketContext.Provider>
    );
};

export const startupSocketState = (): SocketType => {
    const socket = io(`https://storypoker.dev:443`, {secure: true, timeout: 1000, reconnectionDelay: 500, reconnectionDelayMax:500, transports: ["websocket"]});
    // const socket = io(`http://localhost:443`, {secure: true, timeout: 100, reconnectionDelay: 500, reconnectionDelayMax:500, transports: ["websocket"]});
    return {
        socket: socket,
        lastUpdatedTimestamp: Date.now(),
        connectionWasLost: 0
    }
}
import React, { ReactElement, useState } from 'react';
import { Lobby, LobbyState } from '../component/lobby/LobbyType';
import { User } from '../component/user/UserType';

export type LobbyProviderProperties = {
    children: ReactElement,
    value: Lobby | null
}

export type LobbyStateHandler = {
    lobby: Lobby | null,
    setLobbyState: React.Dispatch<React.SetStateAction<Lobby | null>>,
    addUserToLobby: (u: User) => void,
    removeUserFromLobby: (uId: string) => void,
    getOddUsers: (users: User[]) => User[],
    getEvenUsers: (users: User[]) => User[]
}

export const LobbyContext = React.createContext<LobbyStateHandler | null>(null);

export const LobbyProvider = (props: LobbyProviderProperties) => {
    const [lobby, setLobby] = useState(props.value);

    const addUserToLobby = (u: User) => {
        if(lobby !== null && !(lobby.users.filter(x => x.id === u.id).length !== 0) ) {
            const connectedUsers = lobby.users;
            connectedUsers.push(u);            
            setLobby({...lobby, users: connectedUsers});
        }
    }

    const removeUserFromLobby = (uId: string) => {
        if(lobby !== null && (lobby.users.filter(x => x.id === uId).length !== 0)) {
            const connectedUsers = lobby.users.filter(x => x.id !== uId);
            setLobby({...lobby, users: connectedUsers});
        }
    }

    const getOddUsers = (users: User[]) => users.filter((_, index: number) =>  index % 2 === 0);
    const getEvenUsers = (users: User[]) => users.filter((_, index: number) =>  index % 2 !== 0);

    const state: LobbyStateHandler = {
        lobby: lobby,
        setLobbyState: setLobby,
        addUserToLobby: addUserToLobby,
        removeUserFromLobby: removeUserFromLobby,
        getOddUsers: getOddUsers,
        getEvenUsers: getEvenUsers
    }

    return (
        <LobbyContext.Provider value={state}>
            {props.children}
        </LobbyContext.Provider>
    );
};

export const startupLobbyState = (): Lobby => {
    return {id: null, users: [], state: LobbyState.STARTUP, revealIn: 3 }
}
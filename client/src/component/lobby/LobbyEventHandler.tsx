import { Navigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { User, EventUserWrapper } from "../user/UserType";
import { Lobby, LobbyState } from "./LobbyType";

export const setupEventHandlers = (
    socket: Socket | null,
    user: User,
    lobby: Lobby | null,
    id: string | undefined,
    setUserDetails: (name: string | null, spectator: boolean, inLobby: boolean | null, lobbyId: number | null) => void,
    setLobbyState: React.Dispatch<React.SetStateAction<Lobby | null>>,
    addUserToLobby: (user: User) => void,
    removeUserFromLobby: (uId: string) => void,
    updateVoteFromUser: (uId: string, number: number | string, hidden: boolean) => void
) => {
    if(socket != null) {
        if(user.connected && user.userDetails?.lobbyId === undefined && id === undefined) {
            // Creating a room
            socket.emit("create-room");
            socket.off("create-room-processed").on("create-room-processed", event => {
                setUserDetails(null, event.content.spectator, true, event.content.roomId);
                addUserToLobby(user);  
                if(lobby !== null) {      
                    setLobbyState({...lobby, id: event.content.roomId, state: LobbyState.STARTED});      
                }
            });
        } else if(user.connected && user.userDetails?.lobbyId === undefined && id !== undefined) {
            // Joining a room
            socket.emit("join-room", id);
            socket.off("join-room-emit-processed").on("join-room-emit-processed", event => {
                setUserDetails(null, event.content.self.spectator, true, event.content.self.roomId);
                event.content.connected.map((connectedUserWrapper: EventUserWrapper) => {
                    if(connectedUserWrapper.votedStatus && connectedUserWrapper.votedNumber !== null) {
                        updateVoteFromUser(connectedUserWrapper.user.clientId, connectedUserWrapper.votedNumber, true)
                    }

                    addUserToLobby({
                        id: connectedUserWrapper.user.clientId,
                        connected: true,
                        userDetails: {
                            name: connectedUserWrapper.user.name,
                            spectator: connectedUserWrapper.user.spectator,
                            inLobby: connectedUserWrapper.user.inLobby,
                            lobbyId: connectedUserWrapper.user.lobbyId
                        }
                    } as User)
                });
                
                if(lobby !== null) { 
                    socket.emit("get-room-state", id);           
                    setLobbyState({...lobby, id: event.content.self.roomId});
                }          
            });
        } else if(!user.connected && user.userDetails?.lobbyId === undefined) {
            Navigate({to: "/register"});
        }

        socket.off("retrieve-room-state").on("retrieve-room-state", event => {
            if(lobby !== null) { 
                setLobbyState({...lobby, state: event.content});
            }
        });

        socket.off("join-room-processed").on("join-room-processed", event => {
            const user: User = {
                id: event.content.clientId,
                connected: true,
                userDetails: {
                    name: event.content.name,
                    spectator: event.content.spectator,
                    inLobby: true,
                    lobbyId: event.content.roomId
                }
            };
            
            addUserToLobby(user);
        });

        socket.off("disconnect-room-processed").on("disconnect-room-processed", event => {
            removeUserFromLobby(event.content.clientId);
        });
    }
};
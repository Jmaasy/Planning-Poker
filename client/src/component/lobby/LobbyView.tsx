import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LobbyContext } from '../../provider/LobbyProvider';
import { SocketContext } from '../../provider/SocketProvider';
import { ThemeContext } from '../../provider/ThemeProvider';
import { UserContext } from '../../provider/UserProvider';
import { VoteContext } from '../../provider/VoteProvider';
import { resetVotes, revealVotes } from '../vote/VoteEventHandler';
import { VoteHistoryView } from '../vote/VoteHistoryView';
import { VoteView } from '../vote/VoteView';
import { generateCards, getPycCenter } from './LobbyBuilder';
import { setupEventHandlers } from './LobbyEventHandler';
import { toast } from 'react-toastify';
import './LobbyView.css';

export const LobbyView: React.FC = () => {   
    const { user, setUserDetails } = useContext(UserContext)!!;
    const { lobby, getEvenUsers, getOddUsers, setLobbyState, addUserToLobby, removeUserFromLobby } = useContext(LobbyContext)!!;
    const { id } = useParams();
    const { socket, socketConnectionWasLost } = useContext(SocketContext)!!;
    const { theme, getFestiveCenterImage } = useContext(ThemeContext)!!;
    const { votes, updateVoteFromUser } = useContext(VoteContext)!!;
    const navigate = useNavigate();
    
    setupEventHandlers(socket, user, lobby, id, setUserDetails, setLobbyState, addUserToLobby, removeUserFromLobby, updateVoteFromUser, navigate);

    // -1 means connection was lost and is restored which requires an lobby check to verify the lobby still exists
    if(socketConnectionWasLost == -1 && user.userDetails?.lobbyId != undefined) {
        socket?.emit("validate-room", user.userDetails?.lobbyId)
    }

    const mobileModeClass = (theme.buttonMode) ? "mobile-mode" : "";
    
    if(user.userDetails?.spectator) {
        toast.info('Connected as a spectator.');
        toast.clearWaitingQueue();
    }

    return (
        <div className="room-scene">
            <div className={`scene_wrapper ${mobileModeClass}`}>
                <div className="upper-users">
                    { generateCards(getOddUsers(lobby?.users ?? []), lobby, votes, user, true) }
                </div>
                <div className="pyc-center">
                    { getPycCenter(user, lobby, socket, resetVotes, revealVotes) }
                    { getFestiveCenterImage() }
                </div>
                <div className="lower-users">
                    { generateCards(getEvenUsers(lobby?.users ?? []), lobby, votes, user) }
                </div>
            </div>
            <div className={`bottom-row ${mobileModeClass}`}>
                <span className="room-identifier">Room id<span className="room-id">{ lobby?.id }</span></span>
                <VoteView></VoteView>
            </div>
            <VoteHistoryView></VoteHistoryView>
        </div>
    );
};
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
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
import './LobbyView.css';

export const LobbyView: React.FC = () => {   
    const { user, setUserDetails } = useContext(UserContext)!!;
    const { lobby, getEvenUsers, getOddUsers, setLobbyState, addUserToLobby, removeUserFromLobby } = useContext(LobbyContext)!!;
    const { id } = useParams();
    const { socket } = useContext(SocketContext)!!;
    const { theme, getFestiveCenterImage } = useContext(ThemeContext)!!;
    const { votes, updateVoteFromUser } = useContext(VoteContext)!!;
    setupEventHandlers(socket, user, lobby, id, setUserDetails, setLobbyState, addUserToLobby, removeUserFromLobby, updateVoteFromUser);

    const mobileModeClass = (theme.buttonMode) ? "mobile-mode" : "";
    const spectatorClass = (user.userDetails?.spectator)? "specator" : "no-spectator";
    
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
                <span className={`${spectatorClass} ${mobileModeClass}`}>You joined in spectator mode.</span>
                <span className="room-identifier">Room id<span className="room-id">{ lobby?.id }</span></span>
                <VoteView></VoteView>
            </div>
            <VoteHistoryView></VoteHistoryView>
        </div>
    );
};
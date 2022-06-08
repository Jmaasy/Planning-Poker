import React, { useContext, useState } from 'react' 
import { LobbyContext } from '../../provider/LobbyProvider';
import { SocketContext } from '../../provider/SocketProvider';
import { ThemeContext } from '../../provider/ThemeProvider';
import { VoteHistoryContext } from '../../provider/VoteHistoryProvider';
import { VoteContext } from '../../provider/VoteProvider';
import { User } from '../user/UserType';
import { setupEventHandlers } from './VoteEventHandler';
import { buildVoteHistoryTile } from './VoteHistoryBuilder';

export type Lobby = {
  connectedUsers: User[],
  state: string
}

export const VoteHistoryView: React.FC = () => {   
    const [ hidden, setHidden ] = useState((localStorage.getItem("hidden") != null) ? localStorage.getItem("hidden") == "true": true);
    const [ overrideHidden, setOverrideHidden ] = useState(false);
    const { socket } = useContext(SocketContext)!!;
    const { votes, updateVoteFromUser, setVoteState } = useContext(VoteContext)!!;
    const { voteHistory, updateVoteHistory } = useContext(VoteHistoryContext)!!;
    const { lobby, setLobbyState } = useContext(LobbyContext)!!;
    const { theme, setTheme } = useContext(ThemeContext)!!;
    setupEventHandlers(socket, lobby, theme, votes, updateVoteHistory, updateVoteFromUser, setVoteState, setLobbyState, setTheme);

    const latest = Array.from(voteHistory.values()).pop();
    const history = Array.from(voteHistory.values()).slice(0, Array.from(voteHistory.values()).length - 1).reverse();

    const toggleHidden = () => {
        localStorage.setItem("hidden", (!(hidden) as boolean).toString());
        setHidden(!(hidden) as boolean);
        setOverrideHidden(true);
    }

    const hiddenClass = (
        hidden && overrideHidden ||
        latest !== undefined && hidden && !overrideHidden && (localStorage.getItem("hidden") == null || localStorage.getItem("hidden") == "true")
    ) ? "show": "hidden";

    const chevronButtonVisibility = (
        latest === undefined && history.length == 0
    ) ? "button-hidden" : "" ;

    return (
        <div className="previous-votes-wrapper">
            <span className={`chevron close-history-button chevron-${hiddenClass} ${chevronButtonVisibility}`} onClick={_ => toggleHidden()}>&gt;</span>
            <div className={`vote-list-${hiddenClass}`}>
                {
                    (latest == undefined) ? "" : <div className="latest-votes">
                        Latest
                    </div>
                }
                { (latest != undefined) ? buildVoteHistoryTile(latest, lobby?.users): "" }
                {
                    (history.length == 0) ? "" : <div className="history-votes">
                        History
                    </div>
                }
                { history?.map(votes => buildVoteHistoryTile(votes, lobby?.users)) }
            </div>
        </div>
    );
}
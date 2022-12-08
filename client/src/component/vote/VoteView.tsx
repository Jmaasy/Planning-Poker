import React, { useContext } from 'react' 
import useEventListener from '../../common/EventListener';
import { LobbyContext } from '../../provider/LobbyProvider';
import { SocketContext } from '../../provider/SocketProvider';
import { ConfettiState, ThemeContext } from '../../provider/ThemeProvider';
import { UserContext } from '../../provider/UserProvider';
import { VoteHistoryContext } from '../../provider/VoteHistoryProvider';
import { VoteContext } from '../../provider/VoteProvider';
import { LobbyState } from '../lobby/LobbyType';
import { User } from '../user/UserType';
import { processVote, setupEventHandlers } from './VoteEventHandler';

export type Lobby = {
  connectedUsers: User[],
  state: string
}

export const VoteView: React.FC = () => {
    const { socket } = useContext(SocketContext)!!;
    const { votes, updateVoteFromUser, setVoteState } = useContext(VoteContext)!!;
    const { voteHistory, updateVoteHistory } = useContext(VoteHistoryContext)!!;
    const { lobby, setLobbyState } = useContext(LobbyContext)!!;
    const { user } = useContext(UserContext)!!;
    const { theme, setTheme } = useContext(ThemeContext)!!;
    setupEventHandlers(socket, lobby, theme, votes, updateVoteHistory, updateVoteFromUser, setVoteState, setLobbyState, setTheme);
    
    if(!user.userDetails?.spectator) {
        useEventListener("keydown", handleKeyVote)
    }

    function isActiveVote(vote: number | string): string {
        const selectedVote = votes?.filter(vote => vote.userId == user.id)[0];
        if(vote == undefined) return "";
        if(vote == selectedVote?.amount) return "selected";
        return "";
    }

    function isVoteDisabled(): boolean {
        if(lobby?.revealIn == 1 || lobby?.state == LobbyState.REVEALED) return true;
        return false
    }

    function getButtons() {
        return (user.userDetails?.spectator) ? [] : [1,2,3,5,8,13,21,34,55,89,"?"] ;
    }

    const latestVotes = Array.from(voteHistory.values()).reverse()[0]
    const votedNumbers = (latestVotes == undefined) ? undefined : latestVotes.map(x => x.amount);

    if(
        lobby?.state == LobbyState.REVEALED &&
        votedNumbers != undefined &&
        (new Set(votedNumbers).size == 1) 
    ) {
        if(theme.confettiActive == ConfettiState.OFF) {
            setTheme({...theme, confettiActive: ConfettiState.ON});
            setTimeout(() => {
                setTheme({...theme, confettiActive: ConfettiState.FADEOUT});
            }, 7500);
            setTimeout(() => {
                setTheme({...theme, confettiActive: ConfettiState.STANDBY});
            }, 10000);
        }
    }

    function handleKeyVote(e: KeyboardEvent) {
        const possibilities = ["?",1,2,3,5,8,13,21,34,55,89];
        const selectedVote = votes?.filter(vote => vote.userId == user.id)[0];
        let index = possibilities.findIndex(x => x == selectedVote?.amount);
        let voteNumber = null;

        if((e.key == "=" || e.key == "+" || e.key == "ArrowRight") && index != undefined) { 
            if(possibilities[index++] == null || index == 11) voteNumber = possibilities[0];
            else voteNumber = possibilities[index++];
        }

        if((e.key == "-" || e.key == "_" || e.key == "ArrowLeft") && index != undefined) {
            if(possibilities[index--] == null || index == -1) voteNumber = possibilities[possibilities.length -1];
            else voteNumber = possibilities[index--];
        }

        if(voteNumber == null) {
            voteNumber = possibilities[parseInt(e.key)];
        }

        processVote(socket, user.id, voteNumber, updateVoteFromUser);
	}

    return (
        <div className="voting-buttons">
            {
                getButtons().map(number => {
                    return (
                        <button 
                            className={isActiveVote(number)} 
                            onClick={_ => processVote(socket, user.id, number, updateVoteFromUser)} 
                            disabled={isVoteDisabled()}
                        >{number}</button>
                    )
                })
            }
        </div>
    );
}
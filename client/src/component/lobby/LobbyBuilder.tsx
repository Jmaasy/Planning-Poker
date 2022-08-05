import { Socket } from "socket.io-client";
import { User } from "../user/UserType";
import { Vote } from "../vote/VoteType";
import { Lobby, LobbyState } from "./LobbyType";

export const getPycCenter = (
    user: User | null, 
    lobby: Lobby | null,
    socket: Socket | null,
    resetVotes: (socket: Socket | null) => void,
    revealVotes: (socket: Socket | null) => void
) => {
    if(lobby?.state === LobbyState.STARTED && user?.userDetails?.spectator) {
        return (<span className="title">Wait for cards to be picked.</span>);
    } else if(lobby?.state === LobbyState.STARTED && !user?.userDetails?.spectator) {
        return (<span className="title">Pick your cards</span>);
    } else if(lobby?.state === LobbyState.REVEALED) {
        return (<button className="reset-cards" onClick={_ => resetVotes(socket)}>Reset cards</button>);
    } else if(lobby?.state === LobbyState.COUNTDOWN) {
        return (<span className="reveal">Reveal in <span className="seconds">{lobby.revealIn}</span></span>);
    } else if(lobby?.state === LobbyState.VOTED) {
        return (<button className="reveal-cards" onClick={_ => revealVotes(socket)}>Reveal cards</button>);
    } else {
        return null;
    }
}

export const generateCards = (users: User[] = [], lobby: Lobby | null, votes: Vote[] | null, selfUser: User | null, upper: boolean = false) => {
    return users.map(user => {
        const vote = (votes !== null) ? votes.find(vote => vote.userId === user.id): null;
        const pulseClass = (vote?.updated)? "number pulse-primary-color" : "number";
        const classes = (vote == null || !vote.voted) ? "card" : "card selected";
        
        const renderNumber = (vote?.userId === selfUser?.id || !vote?.hidden || (lobby != null && lobby.state == LobbyState.REVEALED)) ? vote?.amount: "";
        return (
            <div className={classes} data-id={user.id}>
                {(upper) ? (<span>{user.userDetails?.name}</span>): ("")}
                <span className={pulseClass}>{(user.userDetails?.spectator) ? (<img src="/public/images/spectator.svg" alt=""/>): renderNumber}</span>
                {(!upper) ? (<span>{user.userDetails?.name}</span>): ("")}
            </div>
        )
    });
}
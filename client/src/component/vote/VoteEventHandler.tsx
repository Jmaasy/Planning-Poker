import React from "react";
import { Socket } from "socket.io-client";
import { Analytics } from "../../common/Analytics";
import { ConfettiState, Theme } from "../../provider/ThemeProvider";
import { Lobby, LobbyState } from "../lobby/LobbyType";
import { Vote } from "./VoteType";

export const processVote = (
    socket: Socket | null,
    userId: string,
    vote: number | string,
    updateVoteFromUser: (uId: string, number: number | string, hidden: boolean) => void
) => {
    if(socket != null && userId != "") {
        Analytics.trackVoting(vote);
        updateVoteFromUser(userId, vote, false);
        socket.emit("vote", vote);
    }
}

export const setupEventHandlers = (
    socket: Socket | null,
    lobby: Lobby | null,
    theme: Theme | null,
    votes: Vote[] | null,
    updateVoteHistory: (votes: Vote[], voteHistory: Vote[][]) => void,
    updateVoteFromUser: (uId: string, number: number | string, hidden: boolean) => void,    
    setVoteState: React.Dispatch<React.SetStateAction<Vote[]>>,
    setLobbyState: React.Dispatch<React.SetStateAction<Lobby | null>>,
    setTheme: React.Dispatch<React.SetStateAction<Theme>>
) => {
    if(socket != null) {
        socket.off("vote-processed").on("vote-processed", event => {
            if(lobby != null && lobby.state != LobbyState.COUNTDOWN) {
                setLobbyState({...lobby, state: LobbyState.VOTED});
            }
            updateVoteFromUser(event.content.clientId, event.content.vote, true);
        });

        socket.off("vote-reveal-countdown").on("vote-reveal-countdown", event => {
            if(lobby != null) {
                setLobbyState({...lobby, revealIn: event.content, state: LobbyState.COUNTDOWN});
            }
        });
        
        socket.off("vote-reveal-now").on("vote-reveal-now", event => {
            if(lobby != null) {
                if(votes != null) {
                    votes?.forEach(vote => {
                        updateVoteFromUser(vote.userId!!, vote.amount, false);
                    });
                    updateVoteHistory(votes, []);
                }
                setLobbyState({...lobby, state: LobbyState.REVEALED})
            }
        });

        socket.off("vote-reset-processed").on("vote-reset-processed", _ => {
            setVoteState([]);
            if(lobby != null) {
                setLobbyState({...lobby, state: LobbyState.STARTED, revealIn: 3});
            }
            if(theme != null) {
                setTheme({...theme, confettiActive: ConfettiState.OFF});
            }
        });
    }
};

export const revealVotes = (
    socket: Socket | null,
    lobbyId: string
) => {
    if(socket != null) {
        Analytics.trackVotesReveal(lobbyId);
        socket.emit("reveal-votes");
    }
}

export const resetVotes = (
    socket: Socket | null
) => {
    if(socket != null) socket.emit("reset-votes");
}
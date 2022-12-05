import ReactGA from 'react-ga4';
import { UaEventOptions } from 'react-ga4/types/ga4';
import { ThemeType } from '../provider/ThemeProvider';

const sendEvent = (args: UaEventOptions) => ReactGA.event(args);

export const Analytics = {
    trackVotesReveal: (lobbyId: string) => {
        const args = {category: "VotesReveal", action: "Revealing Votes", label: `RevealingVotes${lobbyId}`};
        sendEvent(args);
    },
    trackVoting: (vote: number | string) => {
        const args = {category: "VoteUpdate", action: "Updating Vote", label: `VoteNumber${vote}`};
        sendEvent(args);
    },
    trackRegistering: () => {
        const args = {category: "UserRegistered", action: "User Registered", label: `User Registered`};
        sendEvent(args);
    },
    trackCreatedLobby: () => {
        const args = {category: "UserCreatedLobby", action: "User Created A Lobby", label: `User Created A Lobby`};
        sendEvent(args);
    },
    trackJoinedLobby: () => {
        const args = {category: "UserJoinedLobby", action: "User Joined A Lobby", label: `User Joined A Lobby`};
        sendEvent(args);
    },
    trackLeftLobby: () => {
        const args = {category: "UserLeftLobby", action: "User Left A Lobby", label: `User Left A Lobby`};
        sendEvent(args);
    },
    trackConnectionLost: () => {
        const args = {category: "ConnectionLost", action: "Connection Lost", label: `Connection to server was lost`};
        sendEvent(args);
    },
    trackConnectionSuccess: () => {
        const args = {category: "ConnectionSuccess", action: "Connection Success", label: `Connection to server was successful`};
        sendEvent(args);
    },
    trackConnectionRegained: () => {
        const args = {category: "ConnectionRegained", action: "Connection Regained", label: `Connection to server has restored`};
        sendEvent(args);
    },
    initializeTracking: () => {
        ReactGA.initialize("G-CCVCFQYZ2F");
        ReactGA.pageview(window.location.pathname + window.location.search);
    }
}


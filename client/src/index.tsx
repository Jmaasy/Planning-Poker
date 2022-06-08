import { render } from "react-dom";
import { io } from "socket.io-client";
import { App } from './App';
import { Lobby, LobbyState } from "./component/lobby/LobbyType";
import { User } from "./component/user/UserType";
import './index.css';
import { LobbyProvider } from "./provider/LobbyProvider";
import { SocketProvider } from "./provider/SocketProvider";
import { ThemeType, Theme, ThemeProvider, randomBackground, getFestiveType, getFestiveLogo, getFestiveCenter, ConfettiState } from "./provider/ThemeProvider";
import { UserProvider } from "./provider/UserProvider";
import { VoteHistoryProvider } from "./provider/VoteHistoryProvider";
import { VoteProvider } from "./provider/VoteProvider";

const host: string = process.env.REACT_APP_HOST ? process.env.REACT_APP_HOST : "localhost";
const socket = io(`ws://${host}:443`, {timeout: 10, autoConnect: true, reconnectionAttempts: 100, reconnectionDelay: 10, reconnection: true});
const themeType = (localStorage.getItem("theme-type") ?? "0") as ThemeType
const hidden = (localStorage.getItem("hidden") == null || localStorage.getItem("hidden") == "true") ? true : false;
const hiddenLocked = (localStorage.getItem("hidden") == null) ? false: true;
const lobby: Lobby = {id: null, users: [], state: LobbyState.STARTUP, revealIn: 3 }
const themeValue: Theme = {type: themeType, confettiActive: ConfettiState.OFF, background: randomBackground(), festive: getFestiveType(), festiveLogo: getFestiveLogo(), festiveCenter: getFestiveCenter(), hiddenProperties: {hidden: hidden, locked: hiddenLocked}}
const user: User = {id: "", connected: false, userDetails: null}

render(
    <SocketProvider value={socket}>
    <ThemeProvider value={themeValue}>
    <LobbyProvider value={lobby}>
    <UserProvider value={user}>
    <VoteProvider>
    <VoteHistoryProvider>
        <App />
    </VoteHistoryProvider>
    </VoteProvider>
    </UserProvider>
    </LobbyProvider>
    </ThemeProvider>
    </SocketProvider>,
    document.getElementById("root")
);
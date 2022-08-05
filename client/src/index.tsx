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

const socket = io(`https://jeffreymaas.dev:443`, {secure: true, timeout: 100, reconnectionDelay: 500, reconnectionDelayMax:500, transports: ["websocket"]});
const themeType = (localStorage.getItem("theme-type") ?? "0") as ThemeType
const hidden = (localStorage.getItem("hidden") == null || localStorage.getItem("hidden") == "true") ? true : false;
const hiddenLocked = (localStorage.getItem("hidden") == null) ? false: true;
const mobileButtonMode = (localStorage.getItem("mobile-button-mode") == null || localStorage.getItem("mobile-button-mode") == "false") ? false: true;
const lobby: Lobby = {id: null, users: [], state: LobbyState.STARTUP, revealIn: 3 }
const themeValue: Theme = {type: themeType, confettiActive: ConfettiState.OFF, background: randomBackground(), festive: getFestiveType(), festiveLogo: getFestiveLogo(), festiveCenter: getFestiveCenter(), hiddenProperties: {hidden: hidden, locked: hiddenLocked}, buttonMode: mobileButtonMode}
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

import { render } from "react-dom";
import { App } from './App';
import { LobbyProvider, startupLobbyState } from "./provider/LobbyProvider";
import { SocketProvider, startupSocketState } from "./provider/SocketProvider";
import { ThemeProvider, startupThemeState } from "./provider/ThemeProvider";
import { startupUserState, UserProvider } from "./provider/UserProvider";
import { VoteHistoryProvider } from "./provider/VoteHistoryProvider";
import { VoteProvider } from "./provider/VoteProvider";

render(
    <SocketProvider value={startupSocketState()}>
    <ThemeProvider value={startupThemeState()}>
    <LobbyProvider value={startupLobbyState()}>
    <UserProvider value={startupUserState()}>
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
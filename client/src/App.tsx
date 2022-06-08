import React, { useContext } from 'react' 
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from './common/Header';
import { RegisterView } from './component/user/RegisterView';
import { LobbyView } from './component/lobby/LobbyView';
import { ConfettiState, ThemeContext, ThemeType } from './provider/ThemeProvider';
import Confetti from 'react-confetti'
import './App.css';
import { ErrorView } from './component/error/ErrorView';

export const App: React.FC = _ => {  
    const { theme } = useContext(ThemeContext)!!
    const themeImageMode = (theme.type == ThemeType.DARK) ? "b" : "w" ;
    const confettiCount = (theme.confettiActive == ConfettiState.FADEOUT) ? 0 : 200 ;

    return (
        <div id="main" data-theme={ (theme.type == ThemeType.DARK) ? "dark" : "light" }>
            {(theme.confettiActive == ConfettiState.FADEOUT || theme.confettiActive == ConfettiState.ON) ? <Confetti gravity={0.05} numberOfPieces={confettiCount}/> : null }
            <div className='backdrop' style={{background: `url("../public/images/${theme.background}_${themeImageMode}.png")`}}></div>
            <Header></Header>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<RegisterView />} />
                    <Route path="/register" element={<RegisterView />} />
                    <Route path="/register/:id" element={<RegisterView />} />
                    <Route path="/lobby/:id" element={<LobbyView />} />
                    <Route path="/lobby" element={<LobbyView />} />
                    <Route path="/error/:message" element={<ErrorView />}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}
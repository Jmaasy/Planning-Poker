import React, { useContext, useState } from 'react' 
import { Navigate } from 'react-router-dom';
import { Lobby } from '../component/lobby/LobbyType';
import { LobbyContext } from '../provider/LobbyProvider';
import { ThemeContext, ThemeType } from '../provider/ThemeProvider';
import { SocketContext } from "../provider/SocketProvider";

export const Header: React.FC = () => {   
    const { lobby } = useContext(LobbyContext)!!;
    const { socket } = useContext(SocketContext)!!;
    const { theme, toggleThemeTypeState, getFestiveLogoImage, toggleMobileMode } = useContext(ThemeContext)!!;
    const [ copyClicked, setCopyClicked ] = useState<boolean>(false);
    const selected = (copyClicked) ? "tooltip": "fadeout tooltip"; 
    const checked = (theme.type == ThemeType.DARK) ? false : true ;
    const headerClasses = (theme.buttonMode) ? "mobile-mode" : "";

    return (
        <header className={headerClasses}>
            <img src="/public/images/pp_logo.svg" onClick={_ => Navigate({to: "/register"})} alt=""/>
            <div className="top-header__container">
                <div>
                    <h2>Planning<span>Poker</span></h2>
                    <span className={(socket?.connected) ? "socket-connected" : "socket-disconnected"}></span>
                </div>
                <div>
                    <div className="theme-toggle">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 25"><path d="M23.9524 17.5172C22.8559 17.8316 21.6976 18 20.5 18C13.5964 18 8 12.4036 8 5.5C8 3.71558 8.3739 2.01849 9.04761 0.482849C3.82315 1.98102 0 6.79401 0 12.5C0 19.4036 5.59644 25 12.5 25C17.6192 25 22.0196 21.9227 23.9524 17.5172Z"></path></svg>
                        <label className="switch">
                            <input type="checkbox" name="theme-toggle" className="theme-toggle-input" onChange={_ => toggleThemeTypeState()} checked={checked}/>
                            <span className="slider round"></span>
                        </label>
                        <svg viewBox="0 0 16 16" version="1.1" id="Layer_1_1_" xmlns="http://www.w3.org/2000/svg"><circle cx="8.5" cy="7.5" r="4.5"></circle><rect height="2" width="1" x="8"></rect><rect height="2" width="1" x="8" y="13"></rect><rect height="1" width="2" x="14" y="7"></rect><rect height="1" width="2" x="1" y="7"></rect><rect height="2" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -4.7175 12.8033)" width="1" x="12.596" y="11.096"></rect><rect height="2" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -0.9099 3.6109)" width="1" x="3.404" y="1.904"></rect><rect height="1" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -7.4099 6.3033)" width="2" x="2.904" y="11.596"></rect><rect height="1" transform="matrix(0.7071 -0.7071 0.7071 0.7071 1.7823 10.1107)" width="2" x="12.096" y="2.404"></rect></svg>
                    </div>
                    <div className="mobile-mode-toggle theme-toggle">
                        <svg width="512" height="450" viewBox="0 0 512 450" xmlns="http://www.w3.org/2000/svg"><rect width="512" height="331"/><rect x="121" y="420" width="271" height="30"/><path d="M203.5 359H304L314 403L336.5 450H176L198.5 403L203.5 359Z"/></svg>
                        <label className="switch">
                            <input type="checkbox" name="mobile-mode-toggle" className="mobile-toggle-input" onChange={_ => toggleMobileMode()} checked={theme.buttonMode}/>
                            <span className="slider round"></span>
                        </label>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 25"><rect x="16" y="25" width="16" height="25" rx="2" transform="rotate(180 16 25)" fill="white"></rect><rect x="15" y="24" width="14" height="23" rx="2" transform="rotate(180 15 24)" fill="#101010"></rect><path d="M9 3.5C9 3.77614 8.77614 4 8.5 4L7.5 4C7.22386 4 7 3.77614 7 3.5V3.5C7 3.22386 7.22386 3 7.5 3L8.5 3C8.77614 3 9 3.22386 9 3.5V3.5Z" fill="white"></path></svg>
                    </div>
                    {(lobby?.id == null || lobby.id == undefined) ? null : 
                        <div className="share-link" onClick={_ => copyRoomId(lobby, setCopyClicked)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19">
                                <path d="M18.6917 5.9893L12.1603 0.222021C11.5886 -0.282856 10.6875 0.127003 10.6875 0.911279V3.949C4.72666 4.01878 0 5.24039 0 11.0168C0 13.3483 1.46883 15.658 3.09244 16.8656C3.59909 17.2424 4.32117 16.7694 4.13436 16.1586C2.45167 10.6559 4.93247 9.19501 10.6875 9.11035V12.4464C10.6875 13.2319 11.5893 13.6399 12.1603 13.1357L18.6917 7.36782C19.1025 7.00497 19.1031 6.35264 18.6917 5.9893Z" fill="white"></path>
                            </svg>
                            <span>share room</span>
                        </div>
                    }
                </div>
            </div>
            { getFestiveLogoImage() }
            <div className={selected}>
                PlanningPoker link has been copied to your clipboard.
            </div>
        </header>
    );
}

const copyRoomId = (
    lobby: Lobby | null,
    setCopyClicked: React.Dispatch<React.SetStateAction<boolean>>
) => {
    if(lobby != null && lobby.id !== undefined && lobby.id != null) {
        const registerUrl = `${window.location.origin}/register`;
        navigator.clipboard.writeText(`${registerUrl}/${lobby?.id}`);
        setCopyClicked(true);
        setTimeout(() => {
            setCopyClicked(false);
        }, 2500);            
    }
}

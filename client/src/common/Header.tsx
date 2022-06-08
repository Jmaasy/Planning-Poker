import React, { useContext, useState } from 'react' 
import { Navigate } from 'react-router-dom';
import { Lobby } from '../component/lobby/LobbyType';
import { LobbyContext } from '../provider/LobbyProvider';
import { ThemeContext, ThemeType } from '../provider/ThemeProvider';

export const Header: React.FC = () => {   
    const { lobby } = useContext(LobbyContext)!!;
    const { theme, toggleThemeTypeState, getFestiveLogoImage } = useContext(ThemeContext)!!;
    const [ copyClicked, setCopyClicked ] = useState<boolean>(false);
    const selected = (copyClicked) ? "tooltip": "fadeout tooltip"; 
    const checked = (theme.type == ThemeType.DARK) ? false : true ;

    return (
        <header>
            <img src="/public/images/pp_logo.svg" onClick={_ => Navigate({to: "/register"})} alt=""/>
            <div className="top-header__container">
                <div>
                    <h2>Planning<span>Poker</span></h2>
                </div>
                <div>
                    <div className="theme-toggle">
                        <svg width="512px" viewBox="0 0 512 512" version="1.1" id="Layer_1" height="512px" enable-background="new 0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M248.082,263.932c-31.52-31.542-39.979-77.104-26.02-116.542c-15.25,5.395-29.668,13.833-41.854,26.02  c-43.751,43.75-43.751,114.667,0,158.395c43.729,43.73,114.625,43.752,158.374,0c12.229-12.186,20.646-26.604,26.021-41.854  C325.188,303.91,279.604,295.451,248.082,263.932z"></path></svg>        
                        <label className="switch">
                            <input type="checkbox" name="theme-toggle" className="theme-toggle-input" onChange={_ => toggleThemeTypeState()} checked={checked}/>
                            <span className="slider round"></span>
                        </label>
                        <svg viewBox="0 0 16 16" version="1.1" id="Layer_1_1_" xmlns="http://www.w3.org/2000/svg"><circle cx="8.5" cy="7.5" r="4.5"></circle><rect height="2" width="1" x="8"></rect><rect height="2" width="1" x="8" y="13"></rect><rect height="1" width="2" x="14" y="7"></rect><rect height="1" width="2" x="1" y="7"></rect><rect height="2" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -4.7175 12.8033)" width="1" x="12.596" y="11.096"></rect><rect height="2" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -0.9099 3.6109)" width="1" x="3.404" y="1.904"></rect><rect height="1" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -7.4099 6.3033)" width="2" x="2.904" y="11.596"></rect><rect height="1" transform="matrix(0.7071 -0.7071 0.7071 0.7071 1.7823 10.1107)" width="2" x="12.096" y="2.404"></rect></svg>
                    </div>
                    <div className="share-link" onClick={_ => copyRoomId(lobby, setCopyClicked)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19">
                            <path d="M18.6917 5.9893L12.1603 0.222021C11.5886 -0.282856 10.6875 0.127003 10.6875 0.911279V3.949C4.72666 4.01878 0 5.24039 0 11.0168C0 13.3483 1.46883 15.658 3.09244 16.8656C3.59909 17.2424 4.32117 16.7694 4.13436 16.1586C2.45167 10.6559 4.93247 9.19501 10.6875 9.11035V12.4464C10.6875 13.2319 11.5893 13.6399 12.1603 13.1357L18.6917 7.36782C19.1025 7.00497 19.1031 6.35264 18.6917 5.9893Z" fill="white"></path>
                        </svg>
                        <span>share room</span>
                    </div>
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
        setTimeout(_ => {
            setCopyClicked(false);
        }, 2500);            
    }
}
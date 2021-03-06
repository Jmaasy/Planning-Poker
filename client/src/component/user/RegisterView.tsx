import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SocketContext } from "../../provider/SocketProvider";
import { UserContext } from "../../provider/UserProvider";
import { setupEventHandlers, registerUser } from "./UserEventHandler";
import { ThemeContext } from "../../provider/ThemeProvider";
import "./RegisterView.css";

export const RegisterView: React.FC = () => {  
    const {user, setUserState, setUserDetails} = useContext(UserContext)!!;
    const {socket} = useContext(SocketContext)!!;
    const { getFestiveCenterImage } = useContext(ThemeContext)!!;
    const { id } = useParams();
    const navigate = useNavigate();
    setupEventHandlers(socket, user, id, setUserState, navigate);

    return (
        <div className="scene_wrapper register_scene_wrapper">
            <input type="text" id="user-name-input" maxLength={12} value={user.userDetails?.name || ""} placeholder="name" onChange={e => setUserDetails(e.target.value.trim())} autoFocus/>
                <label className="checkcontainer">
                    spectator mode
                <input type="checkbox" checked={user.userDetails?.spectator || false} onChange={e => setUserDetails(null, e.target.checked)}/>
                <span className="checkmark"></span>
            </label>
            { getFestiveCenterImage() }
            <button onClick={_ => registerUser(socket, user, setUserState)} id="user-name-continue">continue</button>
        </div>
    );
}
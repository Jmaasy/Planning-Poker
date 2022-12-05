import { NavigateFunction } from "react-router-dom";
import { Socket } from "socket.io-client";
import { Analytics } from "../../common/Analytics";
import { RandomUserName } from "../../provider/UserProvider";
import { User, UserDetails } from "./UserType";

export const registerUser = (
    socket: Socket | null, 
    user: User, 
    setUserState: React.Dispatch<React.SetStateAction<User>>
) => {
    if(socket != null) {
        Analytics.trackRegistering();

        if(user.userDetails?.name == null || user.userDetails.name.trim() == "") {
            const details = {...user.userDetails, name: RandomUserName()} as UserDetails;
            setUserState({...user, userDetails: details, connected: true});
            socket.emit("create-user", details);
        } else {
            setUserState({...user, connected: true});
            socket.emit("create-user", user.userDetails);
        }
    }
};

export const setupEventHandlers = (
    socket: Socket | null, 
    user: User, 
    id: string | undefined, 
    setUserState: React.Dispatch<React.SetStateAction<User>>,
    navigate: NavigateFunction
) => {
    if(socket != null) {
        socket.off("registration-processed").on("registration-processed", event => {
            if(user != null && !event.error) {
                setUserState({...user, id: event.content.clientId});
                if(id === undefined) navigate("/lobby");
                else navigate(`/lobby/${id}`);
            } else if (event.error) {
                navigate(`/error/${event.message}`)
            }
        });
    }
};

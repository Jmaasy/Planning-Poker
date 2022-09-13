import React, { ReactElement, useState } from 'react';
import { User, UserDetails } from '../component/user/UserType';

export type UserProviderProperties = {
    children: ReactElement,
    value: User
}

export type UserStateHandler = {
    user: User,
    setUserState: React.Dispatch<React.SetStateAction<User>>
    setUserDetails: (name?: string | null, spectator?: boolean, inLobby?: boolean | null, lobbyId?: number | null) => void
}

export const UserContext = React.createContext<UserStateHandler | null>(null);

export const RandomUserName = () => randomUserNames[Math.floor(Math.random() * randomUserNames.length)];

export const UserProvider = (props: UserProviderProperties) => {
    const [user, setUser] = useState(props.value);

    const setUserDetails = (
        name: string | null = null,
        spectator: boolean = false,
        inLobby: boolean | null = null,
        lobbyId: number | null = null
    ) => {
        const currentUserDetails = user.userDetails;

        if(name != null && !randomUserNames.includes(name)) {
            localStorage.setItem("user-name", name);
        }

        const userDetails = {
            name: name ?? currentUserDetails?.name,
            spectator: spectator ?? currentUserDetails?.spectator,
            inLobby: inLobby ?? currentUserDetails?.inLobby,
            lobbyId: lobbyId ?? currentUserDetails?.lobbyId
        } as UserDetails
        setUser({ ...user, userDetails: userDetails });
    }

    const state: UserStateHandler = {
        user: user,
        setUserState: setUser,
        setUserDetails: setUserDetails
    }

    return (
        <UserContext.Provider value={state}>
            {props.children}
        </UserContext.Provider>
    );
};

export const startupUserState = (): User => {
    const userName = (localStorage.getItem("user-name") == null) ? null : localStorage.getItem("user-name");
    return {
        id: "", 
        connected: false, 
        userDetails: {
            name: userName
        } as UserDetails
    }
}

const randomUserNames = [
    "Adhara",
    "Alpha",
    "Alula",
    "Amalthea",
    "Andromeda",
    "Ascella",
    "Asterope",
    "Astra",
    "Aurora",
    "Capella",
    "Cassiopeia",
    "Celestial",
    "Halley",
    "Libra",
    "Luna",
    "Lyra",
    "Nashira",
    "Norma",
    "Polaris",
    "Stella",
    "Apollo",
    "Aster",
    "Archer",
    "Aries",
    "Atlas",
    "Castor",
    "Columba",
    "Danica",
    "Hercules",
    "Hunter",
    "Nash",
    "Nova",
    "Orion",
    "Perseus",
    "Rigel",
    "Sirius",
    "Taurus",
    "Arpina",
    "Belinda",
    "Bellatrix",
    "Carina",
    "Cassini",
    "Celeste",
    "Chara",
    "Cressida",
    "Despina",
    "Elara",
    "Eris",
    "Gaia",
    "Helia",
    "Juliet",
    "Larissa",
    "Leda",
    "Miranda",
    "Rhea",
    "Thebe",
    "Titania",
    "Aten",
    "Cosmo",
    "Deimos",
    "Eos",
    "Holmes",
    "Janus",
    "Jericho",
    "Jupiter",
    "Leo",
    "Mars",
    "Mercury",
    "Oberon",
    "Pallas",
    "Phoenix",
    "Pluto",
    "Themis",
    "Sky",
    "Starr",
    "Thule"
]
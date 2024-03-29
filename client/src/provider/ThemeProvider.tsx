import React, { ReactElement, useState } from 'react';

export type ThemeProviderProperties = {
    children: ReactElement,
    value: Theme
}

export type ThemeStateHandler = {
    theme: Theme,
    toggleThemeTypeState: () => void,
    toggleMobileMode: () => void,
    getFestiveCenterImage: () => JSX.Element,
    getFestiveLogoImage: () => JSX.Element,
    setTheme: React.Dispatch<React.SetStateAction<Theme>>
}

export type HiddenProperties = {
    hidden: boolean,
    locked: boolean
}

export type Theme = {
    type: ThemeType,
    confettiActive: ConfettiState,
    festive: FestiveType | null,
    festiveLogo: FestiveLogo | null,
    festiveCenter: FestiveCenter | null,
    background: ThemeBackground,
    hiddenProperties: HiddenProperties,
    buttonMode: boolean
}

export enum ThemeType {
    DARK = "0",
    LIGHT = "1"
}

export enum FestiveType {
    EASTER = "EASTER",
    CHRISTMAS = "CHRISTMAS"
}

export enum FestiveLogo {
    EASTER = "bunny",
    CHRISTMAS = ""
}

export enum FestiveCenter {
    EASTER = "bunny_ears",
    CHRISTMAS = "christmas_footer"
}

export enum ThemeBackground {
    GOAT = "goat",
    ZEBRA = "zebra",
    EIFFEL = "eiffel",
    HARRY = "harry",
    ANIMAL = "animal"
}

export enum ConfettiState {
    OFF,
    ON,
    FADEOUT,
    STANDBY
}

const festiveDurations = {
    "EASTER": {month: 4, day:17}, 
    "CHRISTMAS": {month: 12, day:25} 
}

export const ThemeContext = React.createContext<ThemeStateHandler | null>(null);

export const ThemeProvider = (props: ThemeProviderProperties) => {
    const [theme, setTheme] = useState(props.value);

    const toggleThemeTypeState = () => {
        const newThemeType = (theme.type === ThemeType.DARK) ? ThemeType.LIGHT : ThemeType.DARK ;
        localStorage.setItem("theme-type", newThemeType.toString());
        setTheme({...theme, type: newThemeType})
    }

    const toggleMobileMode = () => {
        const newButtonMode = !theme.buttonMode;
        localStorage.setItem("mobile-button-mode", newButtonMode.toString());
        setTheme({...theme, buttonMode: newButtonMode})
    }

    const getFestiveCenterImage = () => {
        return (
            <div>
                <img src={`/public/images/${theme.festiveCenter}_1700.png`} alt={theme.festive?.toLowerCase()?? ""} className={"festive-center-1700 " + theme.festiveCenter?? ""}></img>
                <img src={`/public/images/${theme.festiveCenter}_2600.png`} alt={theme.festive?.toLowerCase()?? ""} className={"festive-center-2600 " + theme.festiveCenter?? ""}></img>
            </div>
        )
    }

    const getFestiveLogoImage = () => {
        return (
            <img src={`/public/images/${theme.festiveLogo}.png`} alt={theme.festive?.toLowerCase()?? ""} className={`${theme.festiveLogo}-logo`}></img>
        )
    }

    const state: ThemeStateHandler = {
        theme: theme,
        toggleThemeTypeState: toggleThemeTypeState,
        toggleMobileMode: toggleMobileMode,
        getFestiveCenterImage: getFestiveCenterImage,
        getFestiveLogoImage: getFestiveLogoImage,
        setTheme: setTheme
    }

    return (
        <ThemeContext.Provider value={state}>
            {props.children}
        </ThemeContext.Provider>
    );
};

export const randomBackground = () => {
    const values = Object.values(ThemeBackground);
    return values[Math.floor(Math.random() * values.length)];
}

export const getFestiveLogo = () => {
    const festiveType = getFestiveType();
    if(festiveType == null) return null
    return FestiveLogo[festiveType];
}

export const getFestiveCenter = () => {
    const festiveType = getFestiveType();
    if(festiveType == null) return null
    return FestiveCenter[festiveType];
}

export const getFestiveType = () => {
    const date = new Date();
    const month = date.getMonth();
    const day = date.getDate();
    const values = Object.values(FestiveType);
    const festiveBackgrounds = values.filter(x => {
        const duration = festiveDurations[x];
        if(month == (duration.month - 1) && (duration.day - day) > 0 && (duration.day - day) < 7) {
            return true;
        }
    });

    if(festiveBackgrounds.length == 0) return null
    return festiveBackgrounds[0];
}

export const startupThemeState = (): Theme => {
    const themeType = (localStorage.getItem("theme-type") ?? "0") as ThemeType
    const hidden = (localStorage.getItem("hidden") == null || localStorage.getItem("hidden") == "true") ? true : false;
    const hiddenLocked = (localStorage.getItem("hidden") == null) ? false: true;
    const mobileButtonMode = (localStorage.getItem("mobile-button-mode") == null || localStorage.getItem("mobile-button-mode") == "false") ? false: true;

    return {
        type: themeType, 
        confettiActive: ConfettiState.OFF, 
        background: randomBackground(), 
        festive: getFestiveType(), 
        festiveLogo: getFestiveLogo(), 
        festiveCenter: getFestiveCenter(), 
        hiddenProperties: {
            hidden: hidden, 
            locked: hiddenLocked
        }, 
        buttonMode: mobileButtonMode
    }

}
// const url = "localhost:443/";
const url = "https://jeffreymaas.dev/";

const backgrounds = ["goat", "zebra", "eiffel", "harry", "animal"];
const festiveBackgrounds = [
    {month: 04, day:17, type: "easter", logo: "bunny"}, 
    {month: 12, day:25, type: "christmas", logo: "mistletoe"}
];

const completeUrl = new URL(window.location.href);
let overrideBg = undefined;
let festiveAdded = false;
let socket = undefined;
let votedValue = 1;
let countDown = false;
let oldVotedValue = 1;
let id = null;

if(completeUrl.searchParams.get("bg") != null) {
    overrideBg = completeUrl.searchParams.get("bg");
}

if(completeUrl.searchParams.get("username") != null) {
    document.querySelector(".username-wrapper").removeAttribute("hidden");
    document.querySelector(".username-wrapper").innerHTML = "Welcome " + completeUrl.searchParams.get("username");
    connect(completeUrl.searchParams.get("username"));
} else if(window.location.pathname.replace("/", "") != '') {
    document.querySelector(".register-scene").removeAttribute("hidden");
} else if(completeUrl.searchParams.get("username") == null) {
    document.querySelector(".register-scene").removeAttribute("hidden");
}

function copyRoomLink() {
    document.querySelector(".tooltip").removeAttribute("hidden");
    const el = document.querySelector(".room-identifier .room-id");
    navigator.clipboard.writeText(`${url}${el.innerHTML}`);

    setTimeout(_ => {
        document.querySelector(".tooltip").classList += " fadeout";

        setTimeout(_ => {
            document.querySelector(".tooltip").setAttribute("hidden", true);
        }, 2000);
    }, 1000);
}

function revealCards() {
    socket.emit("reveal-votes");
}

function resetCards() {
    socket.emit("reset-votes");
}

function vote(number) {
    oldVotedValue = votedValue;
    votedValue = number;
    socket.emit("vote", number);
}
  
function joinRoom(roomId) {
    socket.emit("join-room", roomId);
}

function getBackground(theme) {
    const date = new Date();
    const month = date.getMonth();
    const day = date.getDate();

    const filteredBackground = festiveBackgrounds.filter(filterBackground => {
        if(month == (filterBackground.month - 1) && (filterBackground.day - day) > 0 && (filterBackground.day - day) < 7 || overrideBg == filterBackground.type) {
            return true;
        }
    })[0];

    const selected = (filteredBackground != undefined) ? filteredBackground.type : backgrounds[Math.floor(Math.random() * backgrounds.length)];
    const suffix = (theme == "dark") ? "b" : "w";

    if(filteredBackground != undefined && filteredBackground.logo != undefined && !festiveAdded) {
        festiveAdded = !festiveAdded;
        document.querySelector(".top-header").innerHTML += `<img src='images/${filteredBackground.logo}.png' class='${filteredBackground.logo}-logo'>`;
    }

    return `../images/${selected}_${suffix}.png`;
}

function setTheme() {
    const checked = document.querySelector("input.theme-toggle-input").checked;
    const value = (!checked) ? "dark" : "light" ;
    const imageUrl = getBackground(value);

    document.querySelector(".backdrop").style.background = `url(${imageUrl})`;

    window.localStorage.setItem("theme", value);
    document.querySelector("body").setAttribute("data-theme", value);
}

document.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();

        // Scenario where registering
        if(document.querySelector(".register-scene").getAttribute("hidden") == null) {
            document.querySelector(".register-scene button").click();
        }
    }
});

const theme = window.localStorage.getItem("theme");
let checked = null;

if(checked == null || checked == undefined) {
    if(theme == null) {
        window.localStorage.setItem("theme", "dark");
        theme = "dark";
    }
    checked = (theme == "dark") ? true: false;
}

const backgroundUrl = getBackground(theme);

document.querySelector("body").setAttribute("data-theme", theme);
document.querySelector(".backdrop").style.background = `url(${backgroundUrl})`;
if(!checked) document.querySelector(".theme-toggle-input").setAttribute("checked", true);
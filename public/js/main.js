// const url = "localhost:443/";
const url = "https://jeffreymaas.dev/";

let socket = undefined;
let votedValue = 1;
let countDown = false;
let oldVotedValue = 1;
let id = null;

if(window.location.search.replace("?username=", '') != '') {
    document.querySelector(".username-wrapper").removeAttribute("hidden");
    document.querySelector(".username-wrapper").innerHTML = "Welcome " + window.location.search.replace("?username=", '');
    connect(window.location.search.replace("?username=", ''));
} else if(window.location.pathname.replace("/", "") != '') {
    document.querySelector(".register-scene").removeAttribute("hidden");
} else if(window.location.search.replace("?username=", '') == '') {
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

function setTheme() {
    const checked = document.querySelector("input.theme-toggle-input").checked;
    const value = (!checked) ? "dark" : "light" ;

    const backgrounds = ["goat", "zebra", "eiffel"];
    const selected = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    const suffix = (value == "dark") ? "b" : "w";

    document.querySelector(".backdrop").style.background = `url(../images/${selected}_${suffix}.png)`;

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

document.querySelector("body").setAttribute("data-theme", theme);

const backgrounds = ["goat", "zebra", "eiffel"];
const selected = backgrounds[Math.floor(Math.random() * backgrounds.length)];
const suffix = (theme == "dark") ? "b" : "w";

document.querySelector(".backdrop").style.background = `url(../images/${selected}_${suffix}.png)`;
if(!checked) document.querySelector(".theme-toggle-input").setAttribute("checked", true);
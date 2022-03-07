const url = "localhost:443/";
// const url = "https://jeffreymaas.dev/";

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
    const el = document.querySelector(".room-identifier .room-id");
    navigator.clipboard.writeText(`${url}${el.innerHTML}`);
}

function revealCards() {
    socket.emit("reveal-votes");
}

function resetCards() {
    socket.emit("reset-votes");
}

function createRoom() {
    socket.emit("create-room");
}

function vote(number) {
    oldVotedValue = votedValue;
    votedValue = number;
    socket.emit("vote", number);
}
  
function joinRoom(roomId) {
    socket.emit("join-room", roomId);
}
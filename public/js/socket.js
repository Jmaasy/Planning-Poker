function connect(queryName = undefined) {
    const name = (queryName == undefined) ? document.querySelector("#user-name-input").value : queryName;

    document.querySelector(".lower-users").innerHTML = `
      <div class="card" data-id="tbs">
        <span class="number"></span>
        <span>${name}</span>
      </div>
    `;

    socket = io(url);
    
    socket.emit("create-user", name);

    socket.on("vote-processed", event => voted(event));
    socket.on("vote-reveal-countdown", event => voteRevealCountdown(event));
    socket.on("vote-reveal-now", event => voteReveal(event));
    socket.on("vote-reset-processed", _ => voteReset());
    socket.on("create-room-processed", event => roomCreated(event))
    socket.on("join-room-emit-not-processed", event => joinRoomNotSuccessful(event));
    socket.on("join-room-emit-processed", event => processRoomJoinedEmit(event));
    socket.on("join-room-processed", event => processRoomJoined(event));
    socket.on("disconnect-room-processed", event => processDisconnectedFromRoom(event));
    socket.on("registered-successfull", event => joinRoomSuccessful(event));
    socket.on("update-vote-history", event => processVoteHistoryUpdate(event));

    if(window.location.pathname.replace("/", "") == '') {
        document.querySelector(".create-scene").removeAttribute("hidden");
    } else {
        document.querySelector(".join-scene").removeAttribute("hidden");
        joinRoom(window.location.pathname.replace("/", ""));
    }
  }
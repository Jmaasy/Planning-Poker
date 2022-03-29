function connect(queryName = undefined) {
    const name = (queryName == undefined) ? document.querySelector("#user-name-input").value : queryName;

    if(name == '') {
      const spectator = document.querySelector(".checkcontainer input").checked;
      const positioning = document.querySelector("#user-name-input").getBoundingClientRect();
      document.querySelector("body").innerHTML += `
          <div class="tooltip" style='top: calc(${positioning.top}px + 40px); left: calc(${positioning.left}px); opacity: 1;'>
              Please fill in a username!
          </div>
      `;

      setTimeout(_ => {
        if(spectator) document.querySelector(".checkcontainer input").setAttribute("checked", "");
        document.querySelector(".tooltip").classList += " fadeout";

        setTimeout(_ => {
            document.querySelector(".tooltip").remove();
        }, 2000);
      }, 1000);
    } else {
      const spectator = document.querySelector(".checkcontainer input").checked;

      document.querySelector(".lower-users").innerHTML = `
        <div class="card" data-id="tbs">
          <span class="number"></span>
          <span>${name}</span>
        </div>
      `;

      socket = io(url);
      
      socket.emit("create-user", {name: name, spectator: spectator});

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
      } else {
          joinRoom(window.location.pathname.replace("/", ""));
      }
    }
  }
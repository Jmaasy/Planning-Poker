function processRoomJoinedEmit(event) {
    document.querySelector(".room-scene").removeAttribute("hidden");
    document.querySelector(".create-scene").setAttribute("hidden", true);
    document.querySelector(".join-scene").setAttribute("hidden", true);
    document.querySelector(".register-scene").setAttribute("hidden", true);
    document.querySelector(".voting-buttons").removeAttribute("hidden");

    // event.content.connected.forEach(connectedUserData => {
    //     const voted = (connectedUserData.voteStatus) ? "selected": "";
    //     if(connectedUserData.voteStatus) {
    //       document.querySelector(".pyc-center span.title").setAttribute("hidden", true);
    //       document.querySelector(".pyc-center button").removeAttribute("hidden");
    //     }
    //     if(connectedUserData.user.clientId != event.content.self.clientId) {
    //       const direction = (document.querySelectorAll(".lower-users .card").length > document.querySelectorAll(".upper-users .card").length) ? "upper" : "lower";
    //       const order = (direction == "upper") ?  `
    //           <span>${connectedUserData.user.name}</span>
    //           <span class="number"></span>
    //         ` : `
    //           <span class="number"></span>
    //           <span>${connectedUserData.user.name}</span>
    //       `;
    //       const card = `<div class="card ${voted}" data-id="${connectedUserData.user.clientId}">
    //         ${order}
    //       </div>`;
    //       document.querySelector(`.${direction}-users`).innerHTML = `${document.querySelector(`.${direction}-users`).innerHTML} ${card}`;
    //     }
    // });


    event.content.connected.forEach(connectedUserData => {
        const voted = (connectedUserData.voteStatus) ? "selected": "";

        if(connectedUserData.voteStatus) {
            document.querySelector(".pyc-center span.title").setAttribute("hidden", true);
            document.querySelector(".pyc-center button").removeAttribute("hidden");
        }

        if(connectedUserData.user.clientId != event.content.self.clientId) {
            console.log(connectedUserData);
            const direction = (document.querySelectorAll(".lower-users .card").length > document.querySelectorAll(".upper-users .card").length) ? "upper" : "lower";
            const order = (direction == "upper") ?  `
                <span>${connectedUserData.user.name}</span>
                <span class="number"></span>
            ` : `
                <span class="number"></span>
                <span>${connectedUserData.user.name}</span>
            `;

            const card = `<div class="card ${voted}" data-id="${connectedUserData.user.clientId}">
            ${order}
            </div>`;

            document.querySelector(`.${direction}-users`).innerHTML = `${document.querySelector(`.${direction}-users`).innerHTML} ${card}`;
        }
    });

    document.querySelector(".room-id").innerHTML = event.content.self.roomId;
}

function processRoomJoined(event) {
    const direction = (document.querySelectorAll(".lower-users .card").length > document.querySelectorAll(".upper-users .card").length) ? "upper" : "lower";
    const order = (direction == "upper") ?  `
        <span>${event.content.name}</span>
        <span class="number"></span>
      ` : `
        <span class="number"></span>
        <span>${event.content.name}</span>
    `;


    document.querySelector(`.${direction}-users`).innerHTML = `${document.querySelector(`.${direction}-users`).innerHTML}
      <div class="card" data-id="${event.content.clientId}">
        ${order}
      </div>
    `;
}

function processDisconnectedFromRoom(event) {
    document.querySelector(`.card[data-id='${event.content.clientId}']`).remove();
}

function joinRoomNotSuccessful(event) {
    window.location.replace(`${window.location.origin}?username=${event.content.name}`);
}

function joinRoomSuccessful(event) {
    id = event.content.clientId;

    document.querySelector(".register-scene").setAttribute("hidden", true);
    document.querySelector(".username-wrapper").removeAttribute("hidden");
    document.querySelector(".username-wrapper").innerHTML = "Welcome " + event.content.name;
    document.querySelector(".card[data-id='tbs']").setAttribute("data-id", event.content.clientId)
}

function roomCreated(event) {
    document.querySelector(".room-scene").removeAttribute("hidden");
    document.querySelector(".voting-buttons").removeAttribute("hidden");
    document.querySelector(".create-scene").setAttribute("hidden", true);
    document.querySelector(".register-scene").setAttribute("hidden", true);

    document.querySelector(".room-id").innerHTML = event.content.roomId;
}
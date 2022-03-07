function voteReset() {
    countDown = false;
    document.querySelectorAll(".card.selected").forEach(x => {
        x.querySelector(".number").innerHTML = "";
        x.classList = "card";
    });

    document.querySelectorAll(".voting-buttons button").forEach(element => {
        element.removeAttribute("disabled");
    });

    document.querySelector(".voting-buttons .selected").classList = "";

    document.querySelector(".pyc-center span.title").removeAttribute("hidden");
    document.querySelector(".pyc-center button.reset-cards").setAttribute("hidden", true);
}

function voteReveal(event) {
    document.querySelector(".pyc-center span.reveal").setAttribute("hidden", true);
    document.querySelector(".pyc-center button.reset-cards").removeAttribute("hidden");

    event.content.forEach(vote => {
        document.querySelector(`.card[data-id='${vote.clientId}'] .number`).innerHTML = vote.number;
    });
}

function voteRevealCountdown(event) {
    countDown = true;

    if(event.content == 1) {
        document.querySelectorAll(".voting-buttons button").forEach(element => {
            element.setAttribute("disabled", true);
        });
    }

    document.querySelector(".pyc-center span.title").setAttribute("hidden", true);
    document.querySelector(".pyc-center button").setAttribute("hidden", true);
    document.querySelector(".pyc-center span.reveal").removeAttribute("hidden");
    document.querySelector(".pyc-center span.reveal .seconds").innerHTML = event.content;
}

function voted(event) {
    const el = document.querySelector(`.card[data-id='${event.content.clientId}']`);
    el.classList = "card selected";

    document.querySelector(".pyc-center span.title").setAttribute("hidden", true);

    if(!countDown) document.querySelector(".pyc-center button.reveal-cards").removeAttribute("hidden");
    
    if(event.content.clientId == id) {
        document.querySelector(`button[data-vote='${oldVotedValue}']`).classList = "";
        document.querySelector(`button[data-vote='${votedValue}']`).classList = "selected";
    }
}

function processVoteHistoryUpdate(event) {
    const historyWrapper = document.querySelector(".previous-votes-wrapper ul");
          historyWrapper.innerHTML = "";

    event.content.forEach(voteDistribution => {
        const entriesDeserialized = [...voteDistribution.entries()].map(x => {
            return {
                [x[1][0]]: x[1][1]
            }
        });

        const entries = new Map([...entriesDeserialized.entries()]);
        const maxVoted = [...entriesDeserialized.entries()].map(x => Object.values(x[1])[0]).sort(function(a,b) { return b-a })[0];

        historyWrapper.innerHTML += "<li>";
        entries.forEach((v,k) => {
                const number = Object.keys(v)[0];
                const amountVoted = Object.values(v)[0];

                const height = (50 * (amountVoted / maxVoted));
                const percentage = 100 * (amountVoted / maxVoted);

                historyWrapper.innerHTML += `
                    <div class="block-entry">
                        <span class="vote-number-top">${number}</span>
                        <span class="vote-bar" style="height:${height}px"></span>
                        <span class="vote-percentage-bottom">${percentage}%</span>
                    </div>
                `;
        });

        historyWrapper.innerHTML += "</li>";
    });
}
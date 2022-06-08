import ReactTooltip from "react-tooltip";
import { User } from "../user/UserType";
import { Vote } from "../vote/VoteType";
import { v4 as uuidv4 } from 'uuid';

export const buildVoteHistoryTile = (
    votes: Vote[],
    users: User[] | undefined
) => {
    const voteDistribution = new Map<number | string, number>();
    const voteUsers = new Map<number | string, string[]>();

    votes.forEach(vote => {
        const currentNumber = voteDistribution.get(vote.amount) ?? 0;
        const user = users?.find(user => user.id == vote.userId);
        if(user != undefined && user.userDetails != null) {
            const existingUsers = voteUsers.get(vote.amount)?? [];
                  existingUsers.push(user.userDetails.name);
            voteUsers.set(vote.amount, existingUsers);
        }

        voteDistribution.set(vote.amount, currentNumber + 1);
    });

    let filteredVotes = votes.map(vote => vote.amount).filter(x => x != "?");
    let averageVote = (filteredVotes.length != 0) ? Number(filteredVotes.reduce((x, y) => Number((x == "?")? 0 : x) + Number((y == "?")? 0 : y))) / filteredVotes.length: -1;
    let maxVote = Math.max(...Array.from(voteDistribution.values()));

    return (
        <div className="vote-history-tile">
            {
                Array.from(voteDistribution.entries()).map((v, k) => {
                    const percentage = (v[1] / maxVote) * 100;
                    const usersVoted = voteUsers.get(v[0]);
                    const id = uuidv4();

                    return (
                        <span style={{height : `${percentage}%`}} data-tip data-for={id}>
                            <ReactTooltip id={id}>
                                <div className="voted-persons">
                                    <span className="amount-of-votes">{voteUsers.get(v[0])?.length} vote{((voteUsers.get(v[0])?.length ?? 0) > 1) ? "s" : null }</span>
                                    {
                                        usersVoted?.slice(0, 4).map(userName => {
                                            return (
                                                <span className="person">{userName}</span>
                                            )
                                        })
                                    }
                                    {(usersVoted != null && usersVoted?.length > 4) ? (<span className="more-persons-voted">{(usersVoted.length ?? 0) - 4} more</span>) : null}
                                </div>
                            </ReactTooltip>
                            <span>{v[0]}</span>
                        </span>
                    )
                })
            }
            { (averageVote == -1) ? null : <div className="average">Average vote {Math.round(averageVote)}</div> }
        </div>
    )
}
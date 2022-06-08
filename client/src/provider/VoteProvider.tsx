import React, { ReactElement, useContext, useState } from 'react';
import { Vote } from '../component/vote/VoteType';
import { UserContext } from './UserProvider';

export type VoteProviderProperties = {
    children: ReactElement
}

export type VoteStateHandler = {
    votes: Vote[] | null,
    setVoteState: React.Dispatch<React.SetStateAction<Vote[]>>,
    updateVoteFromUser: (uId: string, number: number | string, hidden: boolean) => void,
    resetVotes: () => void,
    showVotes: () => void
}

export const VoteContext = React.createContext<VoteStateHandler | null>(null);

export const VoteProvider = (props: VoteProviderProperties) => {
    const [ votes, setVote ] = useState<Vote[]>([]);
    const { user } = useContext(UserContext)!!;

    const isHidden = (hidden: boolean, uId: string): boolean => {
        if(hidden) return true
        else if(user?.id === uId) return false
        else return false
    }

    const updateVoteFromUser = (uId: string, number: number | string, hidden: boolean = true) => {
        const voted = votes.find(vote => vote.userId === uId);
        if(voted === undefined) {
            votes.push({
                userId: uId,
                hidden: isHidden(hidden, uId),
                voted: true,
                amount: number
            })
        } else {
            const index = votes.indexOf(voted);
            votes[index] = {
                ...voted,
                hidden: isHidden(hidden, uId),
                amount: number
            }
        }
        setVote([...votes]);
    }

    const showVotes = () => {
        const updatedVotes = votes.map(vote => {
            const updatedVote = {
                ...vote, 
                hidden: false
            };
            return updatedVote;
        });
        setVote(updatedVotes);
    }

    const resetVotes = () => {
        const updatedVotes = votes.map(vote => {
            const updatedVote = {
                ...vote, 
                voted: false,
                amount: 0
            };
            return updatedVote;
        });
        setVote(updatedVotes);
    }

    const state: VoteStateHandler = {
        votes: votes,
        setVoteState: setVote,
        updateVoteFromUser: updateVoteFromUser,
        resetVotes: resetVotes,
        showVotes: showVotes,
    }

    return (
        <VoteContext.Provider value={state}>
            {props.children}
        </VoteContext.Provider>
    );
};
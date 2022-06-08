import React, { ReactElement, useState } from 'react';
import { Vote } from '../component/vote/VoteType';
import { v4 as uuidv4 } from 'uuid';

export type VoteHistoryProviderProperties = {
    children: ReactElement
}

export type VoteHistoryStateHandler = {
    voteHistory: Map<string, Array<Vote>>,
    updateVoteHistory: (votes: Vote[], voteHistory: Vote[][]) => void
}

export const VoteHistoryContext = React.createContext<VoteHistoryStateHandler | null>(null);

export const VoteHistoryProvider = (props: VoteHistoryProviderProperties) => {
    const [ voteHistory, setVoteHistory ] = useState<Map<string, Array<Vote>>>(new Map());
    const [ lastSet, setLastSet ] = useState(Date.now());

    const updateVoteHistory = (votes: Vote[]) => {
        // Ugly solution for the issue where the istory is being set twice once in a while.
        if(Date.now() - lastSet > 3000) {
            voteHistory.set(uuidv4(), votes)
            setVoteHistory(voteHistory);
            setLastSet(Date.now());
        }
    }

    const state: VoteHistoryStateHandler = {
        voteHistory: voteHistory,
        updateVoteHistory: updateVoteHistory
    }

    return (
        <VoteHistoryContext.Provider value={state}>
            {props.children}
        </VoteHistoryContext.Provider>
    );
};
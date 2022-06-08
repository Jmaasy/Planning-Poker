import React from 'react';
import { useParams } from 'react-router-dom';

export const ErrorView: React.FC = () => {   
    const { message } = useParams();
    return (
        <div className="error-scene">
            {message?.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')}
        </div>
    );
};
import React, {createContext} from 'react';

interface User {
    id: string;
    setId?: any;
}

export const UserContext = createContext<User>({
    id: ''
});
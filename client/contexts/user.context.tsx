import { createContext, FC, useContext, useState } from 'react';

import { IBasicUser } from '@shared';

export interface UserContext {
    user?: IBasicUser;
    setUser: (user?: IBasicUser) => void;
}

export const UserContextImpl = createContext<UserContext>(null!);

export function useUser() {
    return useContext(UserContextImpl);
}

interface Props {
    initialUser?: IBasicUser;
}

export const UserProvider: FC<Props> = ({ children, initialUser }) => {
    const [user, setUser] = useState(initialUser);

    return (
        <UserContextImpl.Provider value={{ user, setUser }}>{children}</UserContextImpl.Provider>
    );
};

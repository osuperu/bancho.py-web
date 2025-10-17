import React from 'react';

import type { UserPrivileges } from '../privileges';

const IDENTITY_CACHE_KEY = 'identity';

export interface Identity {
  userId: number;
  username: string;
  privileges: UserPrivileges;
}

export type IdentityContextType = {
  identity: Identity | null;
  setIdentity: (identity: Identity | null) => void;
};

export const IdentityContext = React.createContext<IdentityContextType | null>(
  null,
);

export const useIdentityContext = () => {
  const identityContext = React.useContext(IdentityContext);
  if (identityContext === null) {
    throw new Error(
      'useIdentityContext must be inside a IdentityContextProvider',
    );
  }
  return identityContext;
};

const setIdentityInLocalStorage = (identity: Identity) => {
  localStorage.setItem(IDENTITY_CACHE_KEY, JSON.stringify(identity));
};

const getIdentityFromLocalStorage = (): Identity | null => {
  const cached = localStorage.getItem(IDENTITY_CACHE_KEY);
  return cached ? JSON.parse(cached) : null;
};

const removeIdentityFromLocalStorage = () => {
  localStorage.removeItem(IDENTITY_CACHE_KEY);
};

export const IdentityContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [identity, setIdentity] = React.useState<Identity | null>(
    getIdentityFromLocalStorage(),
  );
  return (
    <IdentityContext.Provider
      value={{
        identity,
        setIdentity: (value: React.SetStateAction<Identity | null>) => {
          if (value) {
            setIdentityInLocalStorage(value as Identity);
          } else {
            removeIdentityFromLocalStorage();
          }
          setIdentity(value);
        },
      }}
    >
      {children}
    </IdentityContext.Provider>
  );
};

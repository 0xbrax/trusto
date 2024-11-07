// @ts-nocheck

'use client'

import { createContext, useContext } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {

    return (
        <GlobalContext.Provider
            value={{}}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobal = () => {
    return useContext(GlobalContext);
};

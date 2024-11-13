// @ts-nocheck

'use client'

import {createContext, useContext, useState} from 'react';
import {getSolBalance} from "@/lib/solanaUtils";

const GlobalContext = createContext();

export const GlobalProvider = ({children}) => {
    const walletAddress = process.env.NEXT_PUBLIC_SOLANA_WALLET_ADDRESS;
    const [walletBalance, setWalletBalance] = useState(0);

    const updateBalance = async () => {
        try {
            const balance = await getSolBalance(walletAddress);
            setWalletBalance(balance);
        } catch (error) {
            throw new Error(error);
        }
    };

    return (
        <GlobalContext.Provider
            value={{
                walletAddress,
                walletBalance,
                updateBalance
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobal = () => {
    return useContext(GlobalContext);
};

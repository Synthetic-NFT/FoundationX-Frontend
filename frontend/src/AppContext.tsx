import {BigNumber} from "bignumber.js";
import React, {useEffect} from "react";


export type AppData = {
  userName: string;
};
export type WalletData = {
  address: string;
};

// Provides data related to the current user such as wallet.
export const AppContext = React.createContext<{
  appData: AppData | null;
  setAppData: (_: AppData | null) => void;
  walletAddress: string;
  setWallet: (_: string) => void;
  unit: BigNumber;
  wrongNetwork: boolean;
  setWrongNetwork: (_: boolean) => void;
}>({
  appData: null,
  setAppData: () => {},
  walletAddress: "",
  setWallet: () => {},
  unit: new BigNumber("1e18"),
  wrongNetwork: false,
  setWrongNetwork: () => {},
});

export function AppContextProvider({
  children = null,
}: {
  children: React.ReactElement | null;
}) {
  const [appData, setAppData] = React.useState<AppData | null>(null);
  const [walletAddress, setWallet] = React.useState<string>("");
  const [unit] = React.useState<BigNumber>(new BigNumber("1e18"));
  const [wrongNetwork, setWrongNetwork ] = React.useState<boolean>(false);
  return (
    <AppContext.Provider
      value={{ appData, setAppData, walletAddress, setWallet, unit, wrongNetwork, setWrongNetwork}}
    >
      {children}
    </AppContext.Provider>
  );
}

// Notice that you should NEVER use this to communicate with the blockchain!
export function convertWeiToString(a: any, digit: number|undefined = undefined) {
  if (digit) {
    return new BigNumber(a).div('1e18').toFixed(digit)
  }
  return new BigNumber(a).div('1e18').toString();
}
export function convertStringToWei(a: any) {
  return new BigNumber(a).times('1e18');
}
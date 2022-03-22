import {BigNumber} from "ethers";
import React from "react";

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
}>({
  appData: null,
  setAppData: () => {},
  walletAddress: "",
  setWallet: () => {},
  unit: BigNumber.from(10).pow(18),
});

export function AppContextProvider({
  children = null,
}: {
  children: React.ReactElement | null;
}) {
  const [appData, setAppData] = React.useState<AppData | null>(null);
  const [walletAddress, setWallet] = React.useState<string>("");
  const [unit] = React.useState<BigNumber>(BigNumber.from(10).pow(18));
  return (
    <AppContext.Provider value={{ appData, setAppData, walletAddress, setWallet, unit}}>
      {children}
    </AppContext.Provider>
  );
}

// Notice that you should NEVER use this to communicate with the blockchain!
export function convertWeiToFloat() {

}
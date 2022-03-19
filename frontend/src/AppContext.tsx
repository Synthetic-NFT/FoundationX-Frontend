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
}>({
  appData: null,
  setAppData: () => {},
  walletAddress: "",
  setWallet: () => {},
});

export function AppContextProvider({
  children = null,
}: {
  children: React.ReactElement | null;
}) {
  const [appData, setAppData] = React.useState<AppData | null>(null);
  const [walletAddress, setWallet] = React.useState<string>("");
  return (
    <AppContext.Provider value={{ appData, setAppData, walletAddress, setWallet}}>
      {children}
    </AppContext.Provider>
  );
}

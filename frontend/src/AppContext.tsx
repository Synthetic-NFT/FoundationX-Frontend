import React from "react";

export type AppData = {
  userName: string;
};

export const AppContext = React.createContext<{
  appData: AppData | null;
  setAppData: (_: AppData | null) => void;
}>({
  appData: null,
  setAppData: () => {},
});

export function AppContextProvider({
  children = null,
}: {
  children: React.ReactElement | null;
}) {
  const [appData, setAppData] = React.useState<AppData | null>(null);

  return (
    <AppContext.Provider value={{ appData, setAppData }}>
      {children}
    </AppContext.Provider>
  );
}

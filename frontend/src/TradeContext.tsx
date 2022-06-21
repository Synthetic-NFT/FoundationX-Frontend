import React, {useEffect} from "react";

import {blockchainAPI, defaultInstrument, TradeData} from "./api";

export const defaultTradeData: TradeData = {
  instruments: [defaultInstrument]
};
export const TradeContext = React.createContext<{
  tradeData: TradeData;
  setTradeData: (_: TradeData) => void;
}>({
  tradeData: defaultTradeData,
  setTradeData: () => { },
});

export type TokenAddress = {
  address: string;
  vaultAddress: string;
  reserveAddress: string;
};

export const OnChainAddressContext = React.createContext<{
  tokenAddresses: Map<string, TokenAddress> | null;
  setTokenAddresses: (_: Map<string, TokenAddress> | null) => void;
}>({
  tokenAddresses: null,
  setTokenAddresses: () => { },
});

// Provides the data of the instruments available for trade.
export function TradeContextProvider({
  children = null,
}: {
  children: React.ReactElement | null;
}) {
  const [tradeData, setTradeData] = React.useState<TradeData>(defaultTradeData);
  const [tradeDataLoading, setIsTradeDataLoading] = React.useState(false);
  useEffect(() => {
    if (!tradeDataLoading && tradeData === defaultTradeData) {
      setIsTradeDataLoading(true);
      blockchainAPI.loadInstruments().then((tradeData) => {
        setTradeData(tradeData);
        setIsTradeDataLoading(false);
      });
    }
  }, [tradeDataLoading, setIsTradeDataLoading, tradeData, setTradeData]);

  return (
    <TradeContext.Provider value={{ tradeData, setTradeData }}>
      {children}
    </TradeContext.Provider>
  );
}

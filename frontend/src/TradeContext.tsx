import React, { useEffect } from "react";

import type { TradeData } from "./api";
import api, {Instrument, blockchainAPI} from "./api";

export const TradeContext = React.createContext<{
  tradeData: TradeData | null;
  setTradeData: (_: TradeData | null) => void;
}>({
  tradeData: null,
  setTradeData: () => {},
});

export type TokenAddress = {
  address: string;
  vaultAddress: string;
  reserveAddress: string;
};

export const OnChainAddressContext = React.createContext<{
  tokenAddresses: Map<string, TokenAddress> | null;
  setTokenAddresses: (_: Map<string, TokenAddress>  | null) => void;
}>({
  tokenAddresses: null,
  setTokenAddresses: () => {},
});

// Provides the data of the instruments available for trade.
export function TradeContextProvider({
  children = null,
}: {
  children: React.ReactElement | null;
}) {
  const [tradeData, setTradeData] = React.useState<TradeData | null>(null);
  const [tradeDataLoading, setIsTradeDataLoading] = React.useState(false);
  // Automatically kicks off the tradeDataLoading upon rendering since we don't need to wait for
  // an user action (such as connecting wallet).
  useEffect(() => {
    if (!tradeDataLoading && tradeData == null) {
      setIsTradeDataLoading(true);
      // api.loadInstruments().then((tradeData) => {
      //   setTradeData(tradeData);
      //   setIsTradeDataLoading(false);
      // });
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

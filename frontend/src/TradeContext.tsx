import React, { useEffect } from "react";

import api from "@/api";

export type Instrument = {
  ticker: string;
  fullName: string;
  id: string;
  price: string;
  fee: string;
};

export type TradeData = {
  instruments: Instrument[];
};

export const TradeContext = React.createContext<{
  tradeData: TradeData | null;
  setTradeData: (_: TradeData | null) => void;
}>({
  tradeData: null,
  setTradeData: () => {},
});

export function TradeContextProvider({
  children = null,
}: {
  children: React.ReactElement | null;
}) {
  const [tradeData, setTradeData] = React.useState<TradeData | null>(null);
  const [loading, setIsLoading] = React.useState(false);
  useEffect(() => {
    if (!loading && tradeData == null) {
      setIsLoading(true);
      api.loadInstruments().then((tradeData) => {
        setTradeData(tradeData);
        setIsLoading(false);
      });
    }
  }, [loading, setIsLoading, tradeData, setTradeData]);

  return (
    <TradeContext.Provider value={{ tradeData, setTradeData }}>
      {children}
    </TradeContext.Provider>
  );
}

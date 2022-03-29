import {BigNumber} from 'bignumber.js'
import { AppData } from "./AppContext";
import { fakeAppData, fakeTradeData } from "./fakeData";

export type Instrument = {
  ticker: string;
  fullName: string;
  id: string;
  price: string,
  fee: number;
};

export type TradeData = {
  instruments: Instrument[];
};

// Simulates real API calls which are likely returning the response as a Promise.
const fakeAPI = {
  async connect(): Promise<AppData> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(fakeAppData), 1000);
    });
  },
  async disconnect(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 1000);
    });
  },
  async loadInstruments(): Promise<TradeData> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(fakeTradeData), 100);
    });
  },
};

export default fakeAPI;

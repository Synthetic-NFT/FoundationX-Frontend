import { AppData } from "./AppContext";
import { fakeAppData, fakeTradeData } from "./fakeData";

export type Instrument = {
  ticker: string;
  fullName: string;
  id: string;
  price: string;
  fee: number;
  long: number;
  short: number;
  premium: number;
  address: string;
};

export const defaultInstrument: Instrument = {
  ticker: "",
  fullName: "",
  id: "",
  price: "",
  fee: 0,
  long: 0,
  short: 0,
  premium: 0,
  address: "",
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

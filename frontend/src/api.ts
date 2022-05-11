import { AppData } from "./AppContext";
import { fakeAppData, fakeTradeData, fakeMyPageData } from "./fakeData";
import {loadActiveTokens} from "./util/interact";

export type Instrument = {
  ticker: string;
  fullName: string;
  id: string;
  price: string;
  fee: number;
  long: number;
  short: number;
  premium: number;
  vaultAddress: string;
  address: string;
  reserveAddress: string;
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
  vaultAddress: "",
  address: "",
  reserveAddress: "",
};

export type MyPageData = {
  total: string;
  ust: string;
  holding: string;
  borrowing: string;
  totalClaimableRewards: {
    mir: string;
    ust: string;
    mriPrice: string;
  };
  data: {
    holding: HoldingData[],
    borrowing: BorrowingData[],
  };
}

export type HoldingData = {
  ticker: string;
  poolPrice: string;
  balance: string;
  value: string;
}

export type BorrowingData = {
  ticker: string;
  oraclePrice: string;
  borrowed: {
    meth: string;
    ust: string;
  },
  collateral: string;
  collateralRatio: string;
}

export type MyPageTableData = {
  ticker: string;
  oraclePrice: string;
  borrowed: {
    meth: string;
    ust: string;
  },
  collateral: string;
  collateralRatio: string;
  poolPrice: string;
  balance: string;
  value: string;
}

export type TradeData = {
  instruments: Instrument[];
};

export const blockchainAPI = {
  async loadInstruments(): Promise<TradeData> {
    const activeTokens = await loadActiveTokens();

    return new Promise((resolve) => {
      resolve(activeTokens);
    });
  },
}

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
  async loadMyPageData(): Promise<MyPageData> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(fakeMyPageData), 100);
    });
  },
};

export default fakeAPI;

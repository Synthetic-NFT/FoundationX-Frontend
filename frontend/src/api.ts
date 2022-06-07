import { AppData } from "./AppContext";
import { BigNumber } from "bignumber.js";
import { fakeAppData, fakeTradeData, fakeMyPageData } from "./fakeData";
import {loadActiveTokens, loadPoolSythPrice, loadSynthPrice} from "./util/interact";

export type Instrument = {
  ticker: string;
  fullName: string;
  symbol: string;
  id: string;
  price: string;
  poolPrice: string,
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
  symbol: "",
  id: "",
  price: "",
  poolPrice: "",
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
    const {tokenNames, tokenSymbols, reserveAddresses, synthAddresses, vaultAddresses} = activeTokens;
    const oraclePricePromises = []
    const poolPricePromises = []
    await loadPoolSythPrice(tokenNames[0])
    for(let i = 0; i < tokenNames.length; i += 1) {
      oraclePricePromises.push(loadSynthPrice(tokenNames[i]));
      poolPricePromises.push(loadPoolSythPrice(tokenNames[i]));
    }

    const allOracePrices = await Promise.all(oraclePricePromises);
    const allPoolPrices = await Promise.all(poolPricePromises);

    const tradeData: TradeData = {
      instruments: []
    };

    for(let i = 0; i < tokenNames.length; i += 1) {
      const currInstrument: Instrument = {
        ticker: tokenNames[i],
        fullName: tokenNames[i],
        symbol: tokenSymbols[i],
        id: i.toString(),
        price: new BigNumber(allOracePrices[i]).div('1e18').toString(),
        poolPrice: allPoolPrices[i],
        fee: 0,
        long: 0,
        short: 0,
        premium: 0,
        vaultAddress: vaultAddresses[i],
        address: synthAddresses[i],
        reserveAddress: reserveAddresses[i],
      }
      tradeData.instruments.push(currInstrument);
    }

    return new Promise((resolve) => {
      resolve(tradeData);
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

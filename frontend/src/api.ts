import { BigNumber } from "bignumber.js";

import { AppData, convertWeiToNumber, convertWeiToString } from "./AppContext";
import { fakeAppData, fakeTradeData, fakeMyPageData } from "./fakeData";
import ContractAddress from "./util/ContractAddress";
import {
  loadActiveTokens,
  loadPoolSynthPrice,
  loadSynthPrice, loadUserDebtDeposit, loadUserHoldingInfo,
  readWalletLpBalance,
  readWalletTokenBalance
} from "./util/interact";
import {
  loadUserAllNFT,
  loadUserGivenNFT
} from "./util/nft_interact";

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
    // const a = await loadUserAllNFT("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "BoredApeYachtClub");
    // console.log("aaaaa", a)
    console.log("aaaa", await this.loadUserAllTokenPosition('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'));
    console.log("aaaaa", await loadUserGivenNFT('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', "BoredApeYachtClub"));
    console.log("aa", await this.loadUserAllLpBalance('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'));
    console.log("a", await loadUserAllNFT('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'), await this.checkUserCanMintWithNFT('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'));

    const activeTokens = await loadActiveTokens();
    const {tokenNames, tokenSymbols, reserveAddresses, synthAddresses, vaultAddresses} = activeTokens;
    const oraclePricePromises = []
    const poolPricePromises = []
    await loadPoolSynthPrice(tokenNames[0])
    for(let i = 0; i < tokenNames.length; i += 1) {
      oraclePricePromises.push(loadSynthPrice(tokenNames[i]));
      poolPricePromises.push(loadPoolSynthPrice(tokenNames[i]));
    }

    const allOraclePrices = await Promise.all(oraclePricePromises);
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
        price: new BigNumber(allOraclePrices[i]).div('1e18').toString(),
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

  async checkUserCanMintWithNFT(walletAddress: string): Promise<Boolean> {
    const userNFT = await loadUserAllNFT('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    let totalBalance = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const [ key, value ] of Object.entries(userNFT)) {
      // do something with `key` and `value`
      totalBalance += Object.keys(value).length;
    }
    const result = totalBalance > 0;

    return new Promise((resolve) => {
      resolve(result);
    });
  },

  async loadUserGivenTokenBalance(walletAddress: string, tickerIDs: string[]): Promise<{ [key: string]: string }> {
    const tokenBalancePromises = []
    for(let i = 0; i < tickerIDs.length; i += 1) {
      tokenBalancePromises.push(readWalletTokenBalance(walletAddress, tickerIDs[i]));
    }

    const allTokenBalances = await Promise.all(tokenBalancePromises);
    const result : { [key: string]: string } = {};
    for(let i = 0; i < tickerIDs.length; i += 1) {
      result[tickerIDs[i]] = allTokenBalances[i].toString();
    }
    return new Promise((resolve) => {
      resolve(result);
    });
  },

  async loadUserAllTokenBalance(walletAddress: string): Promise<{ [key: string]: string }> {
    const activeTokens = await loadActiveTokens();
    const {tokenNames, tokenSymbols, reserveAddresses, synthAddresses, vaultAddresses} = activeTokens;
    return this.loadUserGivenTokenBalance(walletAddress, tokenNames);
  },

  async loadUserGivenLpBalance(walletAddress: string, tickerIDs: string[]): Promise<{ [key: string]: string }> {
    const tokenBalancePromises:  Promise<BigNumber>[] = [];
    for (let i = 0; i < tickerIDs.length; i += 1) {
      tokenBalancePromises.push(readWalletLpBalance(walletAddress, tickerIDs[i]));
    }
    const bnAllTokenBalances = await Promise.all(tokenBalancePromises);
    const allTokenBalances : { [key: string]: string } = {};
    for(let i = 0; i < tickerIDs.length; i += 1) {
      allTokenBalances[tickerIDs[i]] = bnAllTokenBalances[i].toString();
    }
    return new Promise((resolve) => {
      resolve(allTokenBalances);
    });
  },

  async loadUserAllLpBalance(walletAddress: string): Promise<{ [key: string]: string }> {
    const activeTokens = await loadActiveTokens();
    const {tokenNames, tokenSymbols, reserveAddresses, synthAddresses, vaultAddresses} = activeTokens;
    return this.loadUserGivenLpBalance(walletAddress, tokenNames);
  },

  async loadUserGivenTokenPosition(walletAddress: string, tickerIDs: string[]): Promise<{ [key: string]: any[]}> {
    const tokenBalances = await this.loadUserGivenTokenBalance(walletAddress, tickerIDs);
    const userDebtDeposit = await loadUserHoldingInfo(walletAddress, tickerIDs);
    const result: { [key: string]: any[]} = {}
    for (let i = 0; i < tickerIDs.length; i += 1) {
      const tickerID = tickerIDs[i];
      result[tickerID] = [
        tokenBalances[tickerID],
        convertWeiToString(userDebtDeposit[0][i]),
        convertWeiToString(userDebtDeposit[1][i]),
        convertWeiToString(userDebtDeposit[2][i])
      ];
    }
    return new Promise((resolve) => {
      resolve(result);
    });
  },
  async loadUserAllTokenPosition(walletAddress: string): Promise<{ [key: string]: any[]}> {
    const activeTokens = await loadActiveTokens();
    const {tokenNames, tokenSymbols, reserveAddresses, synthAddresses, vaultAddresses} = activeTokens;
    return this.loadUserGivenTokenPosition(walletAddress, tokenNames);
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

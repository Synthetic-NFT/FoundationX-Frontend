import {BigNumber} from "bignumber.js";

import {AppData, convertWeiToString} from "./AppContext";
import {fakeAppData, fakeMyPageData} from "./fakeData";
import {loadPoolSynthPrice} from "./util/farm_interact";
import {
  loadActiveTokens,
  loadSynthPrice,
  loadUserHoldingInfo,
  readWalletLpBalance,
  readWalletTokenBalance
} from "./util/interact";
import {loadUserAllNFT} from "./util/nft_interact";
import {
  CoinInterface,
  defaultInstrument,
  defaultNFTCollection,
  ethCoin,
  Instrument,
  MyPageData,
  NFTCollection,
  TradeData
} from "./util/dataStructures";

export function getTradableCoinInfo(tradeData: TradeData, includeETH: boolean = true): CoinInterface[] {
  const availableCoins = includeETH? [ethCoin] : [];
  for (let i = 0; i < tradeData.instruments.length; i += 1) {
    const instrument = tradeData.instruments[i];
    if (instrument === defaultInstrument) {
      // eslint-disable-next-line no-continue
      continue;
    }
    const currCoin: CoinInterface = {
      address: instrument.address,
      name: instrument.ticker,
      symbol: instrument.symbol,
      balance: undefined,
    }
    availableCoins.push(currCoin);
  }
  return availableCoins;
}

export function getSupportedNFTCollections(tradeData: TradeData): NFTCollection[] {
  const nftCollections = [];
  if (!tradeData || tradeData.instruments.length === 0) {
    return [defaultNFTCollection];
  }
  for (let i = 0; i < tradeData.instruments.length; i += 1) {
    const instrument = tradeData.instruments[i];
    if (instrument === defaultInstrument) {
      // eslint-disable-next-line no-continue
      continue;
    }
    const currNFTCollection: NFTCollection = {
      ticker: instrument.ticker,
      symbol: instrument.symbol,
      id: instrument.id,
      price: instrument.price,
      nftAddress: instrument.nftAddress,
      img: "",
      limit: 1,
    }
    nftCollections.push(currNFTCollection);
  }
  return nftCollections;
}

export function getCoinFromInstrument(instrument: Instrument): CoinInterface {
  const currCoin: CoinInterface = {
    address: instrument?.address||undefined,
    name: instrument?.ticker||undefined,
    symbol: instrument?.symbol||undefined,
    balance: undefined,
  }
  return currCoin;
}

export const blockchainAPI = {
  async loadInstruments(): Promise<TradeData> {
    // const a = await loadUserAllNFT("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "BoredApeYachtClub");
    // console.log("aaaaa", a)
    // console.log("aaaa", await this.loadUserAllTokenPosition('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'));
    // console.log("aaaa", await loadUnclaimedGivenNFT('BoredApeYachtClub', 1));

    // console.log("aaaaa", await loadUserGivenNFT('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', "BoredApeYachtClub"));
    // console.log("aa", await this.loadUserAllLpBalance('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'));
    // console.log("a", await loadUserAllNFT('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'), await this.checkUserCanMintWithNFT('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'));
    // console.log("a", await getFarmDesiredETH("BoredApeYachtClub", "100"));
    const activeTokens = await loadActiveTokens();
    const {tokenNames, tokenSymbols, reserveAddresses, synthAddresses, vaultAddresses, nftAddresses} = activeTokens;
    // console.log(nftAddresses, "aaaa")
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
        id: tokenNames[i],
        price: new BigNumber(allOraclePrices[i]).div('1e18').toString(),
        poolPrice: allPoolPrices[i],
        fee: 0,
        long: 0,
        short: 0,
        premium: 0,
        vaultAddress: vaultAddresses[i],
        address: synthAddresses[i],
        reserveAddress: reserveAddresses[i],
        nftAddress: nftAddresses[i]
      }
      tradeData.instruments.push(currInstrument);
    }

    return new Promise((resolve) => {
      resolve(tradeData);
    });
  },

  async checkUserCanMintWithNFT(walletAddress: string): Promise<boolean> {
    const userNFT = await loadUserAllNFT(walletAddress);
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
    const tokenBalancePromises: Promise<BigNumber>[] = []
    for(let i = 0; i < tickerIDs.length; i += 1) {
      tokenBalancePromises.push(readWalletTokenBalance(walletAddress, tickerIDs[i]));
    }
    return new Promise((resolve) => {
      Promise.all(tokenBalancePromises).then(allTokenBalances => {
        const result : { [key: string]: string } = {};
        for(let i = 0; i < allTokenBalances.length; i += 1) {
          result[tickerIDs[i]] = allTokenBalances[i].toString();
        }
        resolve(result);
      }).catch(error => console.error(error));
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
  // async loadInstruments(): Promise<TradeData> {
  //   return new Promise((resolve) => {
  //     setTimeout(() => resolve(fakeTradeData), 100);
  //   });
  // },
  async loadMyPageData(): Promise<MyPageData> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(fakeMyPageData), 100);
    });
  },
};

export default fakeAPI;

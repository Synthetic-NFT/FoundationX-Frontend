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
    nftAddress: string;
};
export type NFTCollection = {
    ticker: string;
    symbol: string;
    id: string;
    price: string;
    nftAddress: string;
    img: string;
    limit: number;
};
export const defaultNFTCollection = {
    ticker: "BoredApeYachtClub",
    symbol: "BAYC",
    id: "BoredApeYachtClub",
    price: "",
    nftAddress: "",
    img: "",
    limit: 1,
}
export const ethCollection = {
    ticker: "Ethereum",
    symbol: "ETH",
    id: "Etherem",
    price: "",
    nftAddress: "",
    img: "",
    limit: 100,
}
export type OneNFT = {
    ticker: string;
    tokenID: string;
    tokenURI: string;
    nftAddress: string;
};
export const defaultOneNFT = {
    ticker: "",
    tokenID: "",
    tokenURI: "",
    nftAddress: "",
}
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
    nftAddress: "",
};
export const ethInstrument: Instrument = {
    ticker: "Ethereum",
    fullName: "Ethereum",
    symbol: "ETH",
    id: "Ethereum",
    price: "",
    poolPrice: "",
    fee: 0,
    long: 0,
    short: 0,
    premium: 0,
    vaultAddress: "",
    address: "",
    reserveAddress: "",
    nftAddress: "",
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
    instrument: Instrument;
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

export interface CoinInterface {
    address: string | undefined;
    name: string | undefined;
    symbol: string | undefined;
    balance: number | undefined;
}

export const ethCoin: CoinInterface = {
    address: "Ethereum",
    name: "Ethereum",
    symbol: "ETH",
    balance: undefined,
}
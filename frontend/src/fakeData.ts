import Azuki from "./styles/images/Azuki.jpeg";
import BoredApeYachtClub from "./styles/images/BoredApeYachtClub.png";
import CryptoPunks from "./styles/images/CryptoPunks.png";

const tickerAzuki = "Azuki";
// const tickerBoredApeYachtClub = "BoredApeYachtClub";
const tickerBoredApeYachtClub = "SynthTest1";

const tickerCryptoPunks = "CryptoPunks";

const NFTIcons = new Map<string, string>([
  [tickerAzuki, Azuki],
  [tickerBoredApeYachtClub, BoredApeYachtClub],
  [tickerCryptoPunks, CryptoPunks],
]);

const fakeSynthAddresses = new Map<string, string>([
  [tickerAzuki, "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"],
  [tickerBoredApeYachtClub, "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc"],
  [tickerCryptoPunks, "0x90f79bf6eb2c4f870365e785982e1f101e93b906"],
]);

const fakeTradeData = {
  instruments: [
    {
      ticker: tickerBoredApeYachtClub,
      fullName: tickerBoredApeYachtClub,
      id: "1",
      price: "2.0",
      fee: 1.15,
      long: 10,
      short: 0.9,
      premium: 0.8,
    },
    {
      ticker: tickerCryptoPunks,
      fullName: tickerCryptoPunks,
      id: "2",
      price: "172.41",
      fee: 32.1,
      long: 11,
      short: 0.19,
      premium: 1.8,
    },
    {
      ticker: tickerAzuki,
      fullName: tickerAzuki,
      id: "3",
      price: "11.4",
      fee: 0.4,
      long: 21,
      short: 1.19,
      premium: 2.8,
    },
  ],
};

const fakeMyPageData = {
  total: "88.00",
  ust: "62.67",
  holding: "17.02",
  borrowing: "8.30",
  totalClaimableRewards: {
    mir: "0.000000",
    ust: "0.00",
    mriPrice: "1.05"
  },
  data: {
    holding: [
      {
        ticker: tickerBoredApeYachtClub,
        poolPrice: "3266.33",
        balance: "0.005213",
        value: "17.02",
      }
    ],
    borrowing: [
      {
        ticker: tickerBoredApeYachtClub,
        oraclePrice: "2845.01",
        borrowed: {
          meth: "0.002000",
          ust: "5.69",
        },
        collateral: "14.00",
        collateralRatio: "246.04",
      }
    ],
  }
};

const fakeAppData = {
  userName: "Test User",
};

export { NFTIcons, fakeTradeData, fakeAppData, fakeSynthAddresses, fakeMyPageData };

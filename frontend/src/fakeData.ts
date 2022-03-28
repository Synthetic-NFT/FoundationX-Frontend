import Azuki from "./styles/images/Azuki.jpeg";
import BoredApeYachtClub from "./styles/images/BoredApeYachtClub.png";
import CryptoPunks from "./styles/images/CryptoPunks.png";

const tickerAzuki = "Azuki";
const tickerBoredApeYachtClub = "BoredApeYachtClub";
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
      price: 2.0,
      fee: 1.15,
    },
    {
      ticker: tickerCryptoPunks,
      fullName: tickerCryptoPunks,
      id: "2",
      price: 172.41,
      fee: 32.10,
    },
    {
      ticker: tickerAzuki,
      fullName: tickerAzuki,
      id: "3",
      price: 11.4,
      fee: 0.4,
    },
  ],
};

const fakeAppData = {
  userName: "Test User",
};

export { NFTIcons, fakeTradeData, fakeAppData, fakeSynthAddresses };

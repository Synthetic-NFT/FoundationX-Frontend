import { BigNumber } from "bignumber.js";

import {convertWeiToString} from "../AppContext";
import ContractAddress from "./ContractAddress";
import {loadActiveTokens} from "./interact";

BigNumber.config({ DECIMAL_PLACES: 19 });

require("dotenv").config();
// const { BigNumber } = require("@ethersproject");

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
// eslint-disable-next-line import/order
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
// const BN = require('bn.js');

// console.trace(alchemyKey);
// const web3 = createAlchemyWeb3(alchemyKey);
const Web3 = require("web3");

const web3 = new Web3("http://localhost:8545");

const IERC721EnumerableABI = require("../abi/@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol/ERC721EnumerableUpgradeable.json");
const SwapFactoryABI = require("../abi/contracts/core/UniswapV2Factory.sol/UniswapV2Factory.json");
const LpPairABI = require("../abi/contracts/core/UniswapV2Pair.sol/UniswapV2Pair.json");
const FactoryABI = require("../abi/contracts/Factory.sol/Factory.json");
const LiquidationABI = require("../abi/contracts/Liquidation.sol/Liquidation.json");
const OracleABI = require("../abi/contracts/mocks/MockOracle.sol/MockOracle.json");
const RouterABI = require("../abi/contracts/periphery/UniswapV2Router02.sol/UniswapV2Router02.json");
const ReserveABI = require("../abi/contracts/Reserve.sol/Reserve.json");
const SynthABI = require("../abi/contracts/Synth.sol/Synth.json");
const VaultABI = require("../abi/contracts/Vault.sol/Vault.json");

const WETHAddress = ContractAddress.weth;
const FactoryAddress = ContractAddress.factory;
const OracleAddress = ContractAddress.oracle;
const SwapFactoryAddress = ContractAddress.swapFactory;
const RouterAddress = ContractAddress.router;

const ReserveAddress: { [key: string]: any } = {};
const SynthAddress: { [key: string]: any } = {};
const VaultAddress: { [key: string]: any } = {};
const NFTAddress: { [key: string]: any } = {};

const ReserveContract: { [key: string]: any } = {};
const SynthContract: { [key: string]: any } = {};
const VaultContract: { [key: string]: any } = {};
const LpPairContract: { [key: string]: any } = {};
const NFTContract: { [key: string]: any } = {};


for (let i = 0; i < ContractAddress.tokens.length; i += 1) {
  const { name } = ContractAddress.tokens[i];
  ReserveAddress[name] = ContractAddress.tokens[i].reserve;
  SynthAddress[name] = ContractAddress.tokens[i].synth;
  VaultAddress[name] = ContractAddress.tokens[i].vault;
  NFTAddress[name] = ContractAddress.tokens[i].NFT;

  ReserveContract[name] = new web3.eth.Contract(ReserveABI, ContractAddress.tokens[i].reserve);
  SynthContract[name] = new web3.eth.Contract(SynthABI, ContractAddress.tokens[i].synth);
  VaultContract[name] = new web3.eth.Contract(VaultABI, ContractAddress.tokens[i].vault);
  LpPairContract[name] = new web3.eth.Contract(LpPairABI, ContractAddress.tokens[i].lp);
  NFTContract[name] = new web3.eth.Contract(IERC721EnumerableABI, ContractAddress.tokens[i].NFT);

}

export const FactoryContract = new web3.eth.Contract(
  FactoryABI,
  FactoryAddress,
);
const OracleContract = new web3.eth.Contract(
    OracleABI,
    ContractAddress.oracle,
);
const RouterContract = new web3.eth.Contract(RouterABI, RouterAddress);
const SwapFactoryContract = new web3.eth.Contract(SwapFactoryABI, SwapFactoryAddress);

export const getFarmDesiredETH = async (tickerID: string, amountADesired: string) => {
  const bnAmountADesired = new BigNumber(amountADesired).times('1e18');
  const lpReserve = await LpPairContract[tickerID].methods.getReserves().call();
  // eslint-disable-next-line no-underscore-dangle
  const amountETHOptimal = await RouterContract.methods.quote(bnAmountADesired, lpReserve._reserve0, lpReserve._reserve1).call();
  return convertWeiToString(amountETHOptimal);
}

export const addLiquidityETH = async (walletAddress: string, tickerID: string, humanAmountADesired: string, humanAmountETHDesired: string) => {
  const amountADesired = new BigNumber(humanAmountADesired).times('1e18')
  const amountETHDesired = new BigNumber(humanAmountETHDesired).times('1e18')
  const amountAMin = amountADesired.times('0.95');
  const amountETHMin = amountETHDesired.times('0.95');

  const farmParameters = {
    to: RouterAddress, // Required except during contract publications.
    from: walletAddress, // must match user's active address.
    value: web3.utils.toHex(amountETHDesired), // how much the user is depositing
    data: RouterContract.methods
        .addLiquidityETH(
          SynthAddress[tickerID],
          amountADesired,
          amountAMin,
          amountETHMin,
          walletAddress,
          Date.now() + 60,
        )
        .encodeABI(),
  };
  // sign the transaction
  try {
    const farmHash = await (window as any).ethereum.request({
      method: "eth_sendTransaction",
      params: [farmParameters],
    });
    console.log(farmHash);
    return {
      status: "success",
      // depositHash,
      farmHash,
    };
  } catch (error) {
    return {
      status: (error as any).message,
    };
  }
}


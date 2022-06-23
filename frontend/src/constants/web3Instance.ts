import ContractAddress from "./ContractAddress";


require("dotenv").config();

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
const MockWETHABI = require("../abi/contracts/mocks/MockWETH.sol/MockWETH.json");

export const WETHAddress = ContractAddress.weth;
export const FactoryAddress = ContractAddress.factory;
export const OracleAddress = ContractAddress.oracle;
export const SwapFactoryAddress = ContractAddress.swapFactory;
export const RouterAddress = ContractAddress.router;

export const ReserveAddress: { [key: string]: any } = {};
export const SynthAddress: { [key: string]: any } = {};
export const VaultAddress: { [key: string]: any } = {};
export const NFTAddress: { [key: string]: any } = {};

export const ReserveContract: { [key: string]: any } = {};
export const SynthContract: { [key: string]: any } = {};
export const VaultContract: { [key: string]: any } = {};
export const LpPairContract: { [key: string]: any } = {};
export const NFTContract: { [key: string]: any } = {};


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
export const OracleContract = new web3.eth.Contract(
    OracleABI,
    ContractAddress.oracle,
);
export const WETHContract = new web3.eth.Contract(
    MockWETHABI,
    WETHAddress,
);
export const RouterContract = new web3.eth.Contract(RouterABI, RouterAddress);
export const SwapFactoryContract = new web3.eth.Contract(SwapFactoryABI, SwapFactoryAddress);

export default web3;
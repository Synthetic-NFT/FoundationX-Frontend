

// @ts-ignore
// eslint-disable-next-line import/order


require("dotenv").config();

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
// eslint-disable-next-line import/order
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
// const BN = require('bn.js');

// console.trace(alchemyKey);
// const web3 = createAlchemyWeb3(alchemyKey);
const Web3 = require("web3");

const web3 = new Web3("http://localhost:8545");

const SwapFactoryABI = require("../abi/contracts/core/UniswapV2Factory.sol/UniswapV2Factory.json");
const LpPairABI = require("../abi/contracts/core/UniswapV2Pair.sol/UniswapV2Pair.json");
const RouterABI = require("../abi/contracts/periphery/UniswapV2Router02.sol/UniswapV2Router02.json");

// const SwapFactoryContract = new web3.eth.Contract(SwapFactoryABI, ContractAddress.swapFactory);
// const LpPairContract = new web3.eth.Contract(LpPairABI, ContractAddress.tokens[0].lp);
const SwapFactoryContract = new web3.eth.Contract(SwapFactoryABI, "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE");
const LpPairContract = new web3.eth.Contract(LpPairABI, "0x7F67010D2542BC2D8DBe418D6c874bCe5a1aeCDD");
const RouterContract = new web3.eth.Contract(RouterABI, "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c");

// interact.js

// ...

const getLpReserve = async(tokenA: string, tokenB: string) => {
    const lpPairAddress = await SwapFactoryContract.methods.getPair(tokenA, tokenB).call();
    const lpReserve = await LpPairContract.methods.getReserves().call();
    console.log(lpPairAddress, lpReserve);
    console.log(lpReserve._reserve0);
}

async function main() {
    await getLpReserve("0x5FC8d32690cc91D4c39d9d3abcBD16989F875707", "0x68B1D87F95878fE05B998F19b66F4baba5De1aed")
    const res = await RouterContract.methods.getAmountsOut("1", ["0x5FC8d32690cc91D4c39d9d3abcBD16989F875707", "0x68B1D87F95878fE05B998F19b66F4baba5De1aed"]).call();
    console.log(res[0], res[-1]);
}
main();
import {BigNumber} from "bignumber.js";

import {convertStringToWei} from "../AppContext";
import ContractAddress from "../constants/ContractAddress";
import web3, {
    LpPairContract,
    RouterAddress,
    RouterContract, SynthAddress,
    WETHAddress
} from "../constants/web3Instance";
import {approveToken} from "./interact";

// const {ReserveAddress, SynthAddress, VaultAddress, NFTAddress, ReserveContract, SynthContract, VaultContract, LpPairContract, NFTContract} = initContractAndAddress()

export const swapExactETHForTokens = async (amountIn: BigNumber, amountOutMin: string, tickerID: string, addressFrom: string, addressTo: string, deadline: number) => {
    const swapParameters = {
        to: RouterAddress, // Required except during contract publications.
        from: addressFrom, // must match user's active address.
        value: web3.utils.toHex(amountIn), // how much the user is depositing
        data: RouterContract.methods
            .swapExactETHForTokens(amountOutMin, [WETHAddress, SynthAddress[tickerID]], addressTo, deadline)
            .encodeABI(),
    };
    try {
        const swapHash = await (window as any).ethereum.request({
            method: "eth_sendTransaction",
            params: [swapParameters],
        });
        return {
            status: "success",
            swapHash,
        };
    } catch (error) {
        return {
            status: (error as any).message,
        };
    }
}
export const simpleSwapExactETHForTokens = async (walletAddress: string, amountIn: string, tickerID: string) => {
    const lpReserve = await LpPairContract[tickerID].methods.getReserves().call();
    // eslint-disable-next-line no-underscore-dangle
    const [reserveA, reserveB] = SynthAddress[tickerID] < WETHAddress? [lpReserve._reserve0, lpReserve._reserve1] : [lpReserve._reserve1, lpReserve._reserve0]

    const amountOutOptimal = await RouterContract.methods.quote(convertStringToWei(amountIn), reserveB, reserveA).call();
    const amountOutMin = new BigNumber(amountOutOptimal).times('0.9').toFixed(0);

    await swapExactETHForTokens(convertStringToWei(amountIn), amountOutMin, tickerID, walletAddress, walletAddress, Date.now() + 60)
}
export const swapExactTokensForETH = async (amountIn: BigNumber, amountOutMin: string, tickerID: string, addressFrom: string, addressTo: string, deadline: number) => {
    const swapParameters = {
        to: RouterAddress, // Required except during contract publications.
        from: addressFrom, // must match user's active address.
        data: RouterContract.methods
            .swapExactTokensForETH(amountIn, amountOutMin, [SynthAddress[tickerID], WETHAddress], addressTo, deadline)
            .encodeABI(),
    };
    try {
        const approveStatus = approveToken(amountIn, tickerID, addressFrom, ContractAddress.router);
        const swapHash = await (window as any).ethereum.request({
            method: "eth_sendTransaction",
            params: [swapParameters],
        });
        return {
            status: "success",
            swapHash,
        };
    } catch (error) {
        return {
            status: (error as any).message,
        };
    }
}
export const simpleSwapExactTokensForETH = async (walletAddress: string, amountIn: string, tickerID: string) => {
    const lpReserve = await LpPairContract[tickerID].methods.getReserves().call();
    // eslint-disable-next-line no-underscore-dangle
    const [reserveA, reserveB] = SynthAddress[tickerID] < WETHAddress? [lpReserve._reserve0, lpReserve._reserve1] : [lpReserve._reserve1, lpReserve._reserve0]
    //
    // let amountETHOptimal = 0;
    // if (SynthAddress[tickerID] < WETHAddress) {
    //     const reserveA = lpReserve._reserve0
    //     const reserveB = lpReserve._reserve1
    //     amountETHOptimal = await RouterContract.methods.quote(convertStringToWei(amountIn), reserveA, reserveB).call();
    // }
    // else {
    //     const reserveA = lpReserve._reserve1
    //     const reserveB = lpReserve._reserve0
    //     amountETHOptimal = await RouterContract.methods.quote(convertStringToWei(amountIn), reserveB, reserveA).call();
    // }

    const amountETHOptimal = await RouterContract.methods.quote(convertStringToWei(amountIn), reserveA, reserveB).call();
    const amountOutMin = new BigNumber(amountETHOptimal).times('0.9').toFixed(0);
    await swapExactTokensForETH(convertStringToWei(amountIn), amountOutMin, tickerID, walletAddress, walletAddress, Date.now() + 60)
}
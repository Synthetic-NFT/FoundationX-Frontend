import {BigNumber} from "bignumber.js";

import {convertWeiToString} from "../AppContext";
import web3, {
  LpPairContract,
  RouterAddress,
  RouterContract, SynthAddress,
  WETHAddress
} from "../constants/web3Instance";
import {approveToken, getLpReserve} from "./interact";

BigNumber.config({ DECIMAL_PLACES: 19 });

// const { BigNumber } = require("@ethersproject");


// const {ReserveAddress, SynthAddress, VaultAddress, NFTAddress, ReserveContract, SynthContract, VaultContract, LpPairContract, NFTContract} = initContractAndAddress()



export function getFarmDesiredETH(tickerID: string, amountADesired: string): Promise<string> {
  return new Promise(resolve => {
    const bnAmountADesired = new BigNumber(amountADesired).times('1e18');
    LpPairContract[tickerID].methods.getReserves().call()
        .then((lpReserve: { _reserve0: any; _reserve1: any; }) => {
          console.log(lpReserve)
          // eslint-disable-next-line no-underscore-dangle
          const [reserveA, reserveB] = SynthAddress[tickerID] < WETHAddress? [lpReserve._reserve0, lpReserve._reserve1] : [lpReserve._reserve1, lpReserve._reserve0]

          RouterContract.methods.quote(bnAmountADesired, reserveA, reserveB).call()
              .then((amountETHOptimal: any) => {
                resolve(convertWeiToString(amountETHOptimal));
              })
              // eslint-disable-next-line no-console
              .catch((error: any) => console.error(error));
        })
        // eslint-disable-next-line no-console
        .catch((error: any) => { console.error(error)} );

  });

}

export const addLiquidityETH = async (walletAddress: string, tickerID: string, humanAmountADesired: string, humanAmountETHDesired: string) => {
  const amountADesired = new BigNumber(humanAmountADesired).times('1e18')
  const amountETHDesired = new BigNumber(humanAmountETHDesired).times('1e18')
  const amountAMin = amountADesired.times('0.95').toFixed(0) ;
  const amountETHMin = amountETHDesired.times('0.95').toFixed(0) ;

  await approveToken(amountADesired, tickerID, walletAddress, RouterAddress);

  const farmParameters = {
    to: RouterAddress, // Required except during contract publications.
    from: walletAddress, // must match user's active address.
    value: web3.utils.toHex(amountETHDesired.toFixed(0) ), // how much the user is depositing
    data: RouterContract.methods
        .addLiquidityETH(
          SynthAddress[tickerID],
          amountADesired.toFixed(),
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

export function loadPoolSynthPrice(tickerID: string): Promise<string> {
  return new Promise(resolve => {
    getLpReserve((tickerID)).then( lpReserve=> {
      // eslint-disable-next-line no-underscore-dangle
      const [synthReserve, ethReserve] = SynthAddress[tickerID] < WETHAddress? [lpReserve._reserve0, lpReserve._reserve1] : [lpReserve._reserve1, lpReserve._reserve0]
      const poolSynthPriceInETH = new BigNumber(ethReserve).div(synthReserve).toString();
      resolve(poolSynthPriceInETH);
    }).catch(error => {
      console.error(error);
    });
  });
};
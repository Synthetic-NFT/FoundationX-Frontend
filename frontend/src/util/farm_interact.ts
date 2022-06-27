import {BigNumber} from "bignumber.js";

import {convertStringToWei, convertWeiToString} from "../AppContext";
import web3, {
  LpPairAddress,
  LpPairContract,
  RouterAddress,
  RouterContract, SynthAddress, SynthContract,
  WETHAddress, WETHContract
} from "../constants/web3Instance";
import {approveLpToken, approveToken, getLpReserve} from "./interact";

BigNumber.config({ DECIMAL_PLACES: 19 });

export function getFarmDesiredETH(tickerID: string, amountADesired: string): Promise<string> {
  return new Promise(resolve => {
    const bnAmountADesired = new BigNumber(amountADesired).times('1e18').toString();
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


export async function getETHLpWithdrawValue(tickerID: string, liquidity: string): Promise<{[key: string]: BigNumber} > {
  const lpAddress = LpPairAddress[tickerID]
  const balance0Promise = SynthContract[tickerID].methods.balanceOf(lpAddress).call()
  const balance1Promise = WETHContract.methods.balanceOf(lpAddress).call()
  const totalSupplyPromise = LpPairContract[tickerID].methods.totalSupply().call()
  return new Promise(resolve => {
    Promise.all([balance0Promise, balance1Promise, totalSupplyPromise]).then(res => {
      const [balance0, balance1] = SynthAddress[tickerID] < WETHAddress? [res[0], res[1]]: [res[1], res[0]]
      const totalSupply = res[2]
      const amount0 = convertStringToWei(liquidity).times(balance0).div(totalSupply); // using balances ensures pro-rata distribution
      const amount1 = convertStringToWei(liquidity).times(balance1).div(totalSupply); // using balances ensures pro-rata distribution
      const [key0, key1] = SynthAddress[tickerID] < WETHAddress? [tickerID, "Ethereum"]: ["Ethereum", tickerID]
      const result: {[key: string]: BigNumber} = {};
      result[key0] = amount0
      result[key1] = amount1
      resolve(result)
    })
  })
}

export const removeLiquidityETH = async (walletAddress: string, tickerID: string, liquidity: string) => {
  await approveLpToken(convertStringToWei(liquidity), tickerID, walletAddress, RouterAddress);

  getETHLpWithdrawValue(tickerID, liquidity).then((res: {[key: string]: BigNumber}) => {
    const amountSynth = res[tickerID]
    const amountETH = res.Ethereum

    const amountSynthMin = amountSynth.times('99').div('100')
    const amountETHMin = amountETH.times('99').div('100')

    const farmParameters = {
      to: RouterAddress, // Required except during contract publications.
      from: walletAddress, // must match user's active address.
      data: RouterContract.methods
          .removeLiquidityETH(
            SynthAddress[tickerID],
            convertStringToWei(liquidity).toFixed(0),
            amountSynthMin.toFixed(0),
            amountETHMin.toFixed(0),
            walletAddress,
            Date.now() + 60,
          ).encodeABI(),
    };
    // sign the transaction
    (window as any).ethereum.request({
      method: "eth_sendTransaction",
      params: [farmParameters],
    }).then((farmHash: any) => ({
        status: "success",
        // depositHash,
        farmHash,
      })).catch ((error: any) => ({
      status: (error as any).message,
    }))
  })


}

export function loadPoolSynthPrice(tickerID: string): Promise<string> {
  return new Promise(resolve => {
    getLpReserve((tickerID)).then( lpReserve=> {
      // eslint-disable-next-line no-underscore-dangle
      const [synthReserve, ethReserve] = SynthAddress[tickerID] < WETHAddress? [lpReserve._reserve0, lpReserve._reserve1] : [lpReserve._reserve1, lpReserve._reserve0]
      const poolSynthPriceInETH = new BigNumber(ethReserve).div(synthReserve).toString();
      // const poolSynthPriceInETH = web3.utils.toBN(ethReserve).div(synthReserve).toString();
      resolve(poolSynthPriceInETH);
    }).catch(error => {
      console.error(error);
    });
  });
};
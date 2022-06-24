import {BigNumber} from "bignumber.js";

import ContractAddress from "../constants/ContractAddress";
import web3Instance, {
  FactoryAddress, FactoryContract, LpPairContract, NFTAddress, NFTContract, ReserveContract,
  RouterContract, SynthAddress, SynthContract, VaultAddress, VaultContract,
  WETHAddress, WETHContract
} from "../constants/web3Instance";
import web3 from "../constants/web3Instance";

BigNumber.config({ DECIMAL_PLACES: 19 });


// const {ReserveAddress, SynthAddress, VaultAddress, NFTAddress, ReserveContract, SynthContract, VaultContract, LpPairContract, NFTContract} = initContractAndAddress()

export const loadActiveTokens = async () => {
  const res = await FactoryContract.methods.listTokenAddressInfo().call();
  return res;
}

export const getLpReserve = async(tickerID: string) => {
  const lpReserve = await LpPairContract[tickerID].methods.getReserves().call();
  return lpReserve;
}

export const getAmountSynthOut = async(tickerID: string, amountETH: string) => {
  const bnAmountETH = new BigNumber(amountETH).times("1e18");
  const amountsOut = await RouterContract.methods.getAmountsOut(bnAmountETH, [WETHAddress, SynthAddress[tickerID]]).call();
  const res = new BigNumber( amountsOut[1]).div("1e18");
  return res;
}

export const getAmountETHOut = async(tickerID: string, amountSynth: string) => {
  const bnAmountSynth = new BigNumber(amountSynth).times("1e18");
  const amountsOut = await RouterContract.methods.getAmountsOut(bnAmountSynth, [SynthAddress[tickerID], WETHAddress]).call();
  const res = new BigNumber( amountsOut[1]).div("1e18");
  return res;
}

export const approveToken = async(amount: BigNumber, tickerID: string, userAddress: string, callerAddress: string) => {
  const approveParameters = {
    to: SynthAddress[tickerID], // Required except during contract publications.
    from: userAddress, // must match user's active address.
    data: SynthContract[tickerID].methods.approve(callerAddress, amount).encodeABI(),
  };

  // sign the transaction
  try {
    const approveHash = await (window as any).ethereum.request({
      method: "eth_sendTransaction",
      params: [approveParameters],
    });
    return {
      status: "success",
      approveHash,
    };
  } catch (error) {
    return {
      status: (error as any).message,
    };
  }
}



export const mintSynth = async (
  address: string | null,
  tickerID: string,
  amount: string,
  ratio: string,
) => {
  // input error handling
  if (!(window as any).ethereum || address === null) {
    return {
      status:
        "💡 Connect your Metamask wallet to update the message on the blockchain.",
    };
  }
  // eslint-disable-next-line

  const bnCRatio = new BigNumber(ratio).times("1e18").div('100');

  const mintParameters = {
    to: VaultAddress[tickerID], // Required except during contract publications.
    from: address, // must match user's active address.
    value: web3.utils.toHex(web3.utils.toWei(amount, "ether")), // how much the user is depositing
    data: VaultContract[tickerID].methods
      .userMintSynthETH(bnCRatio.toString())
      .encodeABI(),
  };

  // sign the transaction
  try {
    const mintHash = await (window as any).ethereum.request({
      method: "eth_sendTransaction",
      params: [mintParameters],
    });
    console.log(mintHash);
    return {
      status: "success",
      // depositHash,
      mintHash,
    };
  } catch (error) {
    return {
      status: (error as any).message,
    };
  }
};

export const burnSynth = async (
  address: string | null,
  amount: BigNumber,
  tickerID: string,
  synthAddress: string,
) => {
  // input error handling
  if (!(window as any).ethereum || address === null) {
    return {
      status:
        "💡 Connect your Metamask wallet to update the message on the blockchain.",
    };
  }
  const burnParameters = {
    to: FactoryAddress, // Required except during contract publications.
    from: address, // must match user's active address.
    data: VaultContract[tickerID].methods.userBurnSynthETH().encodeABI(),
  };
  const approveParameters = {
    to: synthAddress, // Required except during contract publications.
    from: address, // must match user's active address.
    data: SynthContract[tickerID].methods.approve(FactoryAddress, amount).encodeABI(),
  };

  // sign the transaction
  try {
    const approveHash = await (window as any).ethereum.request({
      method: "eth_sendTransaction",
      params: [approveParameters],
    });
    console.log(approveHash);
    const burnHash = await (window as any).ethereum.request({
      method: "eth_sendTransaction",
      params: [burnParameters],
    });
    console.log(burnHash);
    return {
      status: "success",
      approveHash,
      burnHash,
    };
  } catch (error) {
    return {
      status: (error as any).message,
    };
  }
};

export const manageSynth = async (
    address: string | null,
    tickerID: string,
    targetCRatio: string,
    targetDeposit: string,
    originalDebt: string,
    targetDebt: string,
) => {
  // input error handling
  if (!(window as any).ethereum || address === null) {
    return {
      status:
          "💡 Connect your Metamask wallet to update the message on the blockchain.",
    };
  }
  const bnTargetCRatio = new BigNumber(targetCRatio).times('1e18').div('100').toFixed(0).toString();
  const bnTargetDeposit = new BigNumber(targetDeposit).times('1e18').toFixed(0).toString();
  const bnTargetDebt = new BigNumber(targetDebt).times('1e18').toFixed(0).toString();
  // const bnApproveAmount = new BigNumber(originalDebt).times('1e18').minus(new BigNumber(targetDebt).times('1e18'))
  const bnApproveAmount = new BigNumber(originalDebt).times('1e18')
  const a = await VaultContract[tickerID].methods.WETHAddress().call();
  const b = await WETHContract.methods.balanceOf(VaultAddress[tickerID]).call();
  const c = await ReserveContract[tickerID].methods.getMinterDepositETH(address).call();

  const d = await ReserveContract[tickerID].methods.getMinterDebtETH(address).call();
  const manageParameters = {
    to: VaultAddress[tickerID], // Required except during contract publications.
    from: address, // must match user's active address.
    data: VaultContract[tickerID].methods.userManageSynthETH(bnTargetCRatio, bnTargetDeposit).encodeABI(),
  };


  // userManageSynth(string memory synthName, uint targetCollateralRatio, uint targetDeposit)
  // sign the transaction
  try {
    if (bnApproveAmount.gte(0)) {
      const approveParameters = {
        to: SynthAddress[tickerID], // Required except during contract publications.
        from: address, // must match user's active address.
        data: SynthContract[tickerID].methods.approve(VaultAddress[tickerID], bnApproveAmount.toString()).encodeABI(),
      };
      const approveHash = await (window as any).ethereum.request({
        method: "eth_sendTransaction",
        params: [approveParameters],
      });
      console.log(approveHash);

    }
    const manageHash = await (window as any).ethereum.request({
      method: "eth_sendTransaction",
      params: [manageParameters],
    });
    console.log(manageHash);
    return {
      status: "success",
      // approveHash,
      manageHash,
    };
  } catch (error) {
    return {
      status: (error as any).message,
    };
  }
};

export const loadSynthPrice = async (tickerID: string) => {
  const synthPrice = await SynthContract[tickerID].methods
    .getSynthPriceToEth()
    .call();
  return synthPrice;
};


export const loadUserOrderStat = async (address: string, tickerID: string) => {
  const synthPrice = await loadSynthPrice(tickerID);
  const bnSynthPrice = new BigNumber(synthPrice);
  const res = await FactoryContract.methods.listUserDebtDeposit(address, [tickerID]).call();
  const debt = res.debts[0];
  const collateral = res.deposits[0];
  const bnCollateral = new BigNumber(collateral);
  const bnDebt = new BigNumber(debt);
  const bnSynthPriceBase10 = bnSynthPrice.div(new BigNumber("1e18"));
  let cRatio = new BigNumber(0);
  if (!bnCollateral.eq("0")) {
    cRatio = bnCollateral.div(bnDebt.times(bnSynthPriceBase10));
  }
  const bnCRatio = cRatio.times(new BigNumber("1e18"));
  return [bnCollateral, bnCRatio, bnDebt, bnSynthPrice];
};

export const claimWETH = async(walletAddress: string, amount: string) => {
  const claimParameters = {
    to: WETHAddress, // Required except during contract publications.
    from: walletAddress, // must match user's active address.
    data: WETHContract.methods.mintFree(walletAddress, new BigNumber(amount).times("1e18")).encodeABI(),
  }

  try {
    const claimHash = await (window as any).ethereum.request({
      method: "eth_sendTransaction",
      params: [claimParameters],
    });
    console.log(claimHash);
    return {
      status: "success",
      // depositHash,
      claimHash,
    };
  } catch (error) {
    return {
      status: (error as any).message,
    };
  }

};

export const loadUserDebtDeposit = async (walletAddress: string, tickerIDs: string[]) => {
  const res = await FactoryContract.methods.listUserDebtDeposit(walletAddress, tickerIDs).call();
  return [res.debts, res.deposits, res.depositNFTs];
};

export const loadUserHoldingInfo = async (walletAddress: string, tickerIDs: string[]) => {
  const res = await FactoryContract.methods.listUserHoldingInfo(walletAddress, tickerIDs).call();
  return [res.debtETH, res.debtNFT, res.tokenPrices];
};

export function readWalletTokenBalance(walletAddress: string, tickerID: (string | undefined)): Promise<BigNumber> {
  if (walletAddress === "") {
    return new Promise(resolve => {resolve(new BigNumber("0"))});
  }

  if(tickerID === "Ethereum") {
    return new Promise((resolve) => {
      web3.eth.getBalance(walletAddress).then((balance: string) => {
        resolve(new BigNumber(balance).div('1e18'))
      }).catch((error: any) => {
        console.error(error);
      })
    });
  }
  if(tickerID == null) {
    return new Promise((resolve) => {
      resolve(new BigNumber("0"))
    })
  }
  return new Promise((resolve) => {
    SynthContract[tickerID].methods.balanceOf(walletAddress).call().then((balance: string) => {
      resolve(new BigNumber(balance).div('1e18'));
    }).catch((error: any) => {
      console.error(error);
    })
  })
};


export const readWalletLpBalance = async (walletAddress: string, tickerID: string|undefined) => {
  if(tickerID == null) {
    return new BigNumber('0');
  }
  const balance = await LpPairContract[tickerID].methods.balanceOf(walletAddress).call();
  return new BigNumber(balance).div('1e18');
};

export const connectWallet = async () => {
  if ((window as any).ethereum) {
    try {
      const addressArray = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "👆🏽 Write a message in the text-field above.",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: `😥 ${(err as any).message}`,
      };
    }
  } else {
    return {
      address: "",
      status: "Not installed",
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if ((window as any).ethereum) {
    try {
      const addressArray = await (window as any).ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆🏽 Write a message in the text-field above.",
        };
      }
      return {
        address: "",
        status: "🦊 Connect to Metamask using the top right button.",
      };
    } catch (err) {
      return {
        address: "",
        status: `😥 ${(err as any).message}`,
      };
    }
  } else {
    return {
      address: "",
      status: "Not installed",
    };
  }
};


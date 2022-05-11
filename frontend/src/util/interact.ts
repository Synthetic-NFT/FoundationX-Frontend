import { BigNumber } from "bignumber.js";

import ContractAddress from "./ContractAddress";

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

const FactoryABI = require("../abi/contracts/Factory.sol/Factory.json");
const LiquidationABI = require("../abi/contracts/Liquidation.sol/Liquidation.json");
const ReserveABI = require("../abi/contracts/Reserve.sol/Reserve.json");
const OracleABI = require("../abi/contracts/mocks/MockOracle.sol/MockOracle.json");
const SynthABI = require("../abi/contracts/Synth.sol/Synth.json");
const VaultABI = require("../abi/contracts/Vault.sol/Vault.json");

const FactoryAddress = ContractAddress.factory;
const OracleAddress = ContractAddress.oracle;
const ReserveAddress: { [key: string]: any } = {};
const SynthAddress: { [key: string]: any } = {};
const VaultAddress: { [key: string]: any } = {};

const ReserveContract: { [key: string]: any } = {};
const SynthContract: { [key: string]: any } = {};
const VaultContract: { [key: string]: any } = {};

for (let i = 0; i < ContractAddress.tokens.length; i += 1) {
  const { name } = ContractAddress.tokens[i];
  ReserveAddress[name] = ContractAddress.tokens[i].reserve;
  SynthAddress[name] = ContractAddress.tokens[i].synth;
  VaultAddress[name] = ContractAddress.tokens[i].vault;

  ReserveContract[name] = new web3.eth.Contract(ReserveABI, ContractAddress.tokens[i].reserve);
  SynthContract[name] = new web3.eth.Contract(SynthABI, ContractAddress.tokens[i].synth);
  VaultContract[name] = new web3.eth.Contract(VaultABI, ContractAddress.tokens[i].vault);
}

export const FactoryContract = new web3.eth.Contract(
  FactoryABI,
  FactoryAddress,
);
const OracleContract = new web3.eth.Contract(
    OracleABI,
    ContractAddress.oracle,
);

export const loadActiveTokens = async () => {
  const res = await FactoryContract.methods.getAllActiveTokens().call();
  console.log(res)
  return res;
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
    // const depositHash = await (window as any).ethereum.request({
    //   method: "eth_sendTransaction",
    //   params: [depositParameters],
    // });
    // console.log(depositHash);
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
  const bnApproveAmount = new BigNumber(originalDebt).times('1e18').minus(new BigNumber(targetDebt).times('1e18'))

  const manageParameters = {
    to: FactoryAddress, // Required except during contract publications.
    from: address, // must match user's active address.
    data: VaultContract[tickerID].methods.userManageSynth(bnTargetCRatio, bnTargetDeposit).encodeABI(),
  };


  // userManageSynth(string memory synthName, uint targetCollateralRatio, uint targetDeposit)
  // sign the transaction
  try {
    if (bnApproveAmount.gte(0)) {
      const approveParameters = {
        to: SynthAddress[tickerID], // Required except during contract publications.
        from: address, // must match user's active address.
        data: SynthContract[tickerID].methods.approve(FactoryAddress, bnApproveAmount.toString()).encodeABI(),
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
  const synthPrice = await OracleContract.methods
    .getAssetPrice(tickerID)
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

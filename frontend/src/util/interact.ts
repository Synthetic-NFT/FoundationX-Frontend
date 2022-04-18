import { BigNumber } from "bignumber.js";

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
// const messageABI = require("../abi/contracts/message.json");
const ReserveABI = require("../abi/contracts/Reserve.sol/Reserve.json");
const SynthABI = require("../abi/contracts/Synth.sol/Synth.json");

const FactoryAddress = "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE";
const ReserveAddress = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
// const messageAddress = "0x36C02dA8a0983159322a80FFE9F24b1acfF8B570";
const synthAddress = "0x0B306BF915C4d645ff596e518fAf3F9669b97016";

//
export const FactoryContract = new web3.eth.Contract(
  FactoryABI,
  FactoryAddress,
);

export const ReserveContract = new web3.eth.Contract(
  ReserveABI,
  ReserveAddress,
);

// export const messageContract = new web3.eth.Contract(
//     messageABI,
//     messageAddress
// );

export const synthContract = new web3.eth.Contract(SynthABI, synthAddress);
export const mintSynth = async (
  address: string | null,
  synthName: string,
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
  const unit = new BigNumber(10).pow(18);

  // amount is in eth
  const amountWei = new BigNumber(amount).times(unit);
  // eslint-disable-next-line
  console.log(web3.utils.toWei(amount, "ether").toString());

  // set up transaction parameters
  const depositParameters = {
    to: FactoryAddress, // Required except during contract publications.
    from: address, // must match user's active address.
    value: web3.utils.toHex(web3.utils.toWei(amount, "ether")),
    data: FactoryContract.methods.userDepositEther(synthName).encodeABI(),
  };
  const synthPrice = await FactoryContract.methods
    .getSynthPriceToEth("0xa513E6E4b8f2a923D98304ec87F64353C4D5C853")
    .call();
  const bnSynthPrice = new BigNumber(synthPrice).div(new BigNumber("1e18"));
  const bnrRatio = new BigNumber(ratio);

  const amountSynthInWei = new BigNumber(amountWei.toString())
    .div(bnrRatio)
    .times(new BigNumber(100))
    .div(bnSynthPrice);
  const amountSynth = new BigNumber(amount)
      .div(bnrRatio)
      .times(new BigNumber(100))
      .div(bnSynthPrice);

  const mintParameters = {
    to: FactoryAddress, // Required except during contract publications.
    from: address, // must match user's active address.
    data: FactoryContract.methods
      .userMintSynth(synthName, web3.utils.toWei(amountSynth.toString(), "ether"))
      .encodeABI(),
  };

  // sign the transaction
  try {
    const depositHash = await (window as any).ethereum.request({
      method: "eth_sendTransaction",
      params: [depositParameters],
    });
    console.log(depositHash);
    const mintHash = await (window as any).ethereum.request({
      method: "eth_sendTransaction",
      params: [mintParameters],
    });
    console.log(mintHash);
    return {
      status: "success",
      depositHash,
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
  synthName: string,
  amount: BigNumber,
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
    data: FactoryContract.methods.userBurnSynth(synthName, amount).encodeABI(),
  };
  const approveParameters = {
    to: synthAddress, // Required except during contract publications.
    from: address, // must match user's active address.
    data: synthContract.methods.approve(FactoryAddress, amount).encodeABI(),
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

export const loadSynthPrice = async (synthName: string) => {
  const synthPrice = FactoryContract.methods
    .getSynthPriceToEth("0xa513E6E4b8f2a923D98304ec87F64353C4D5C853")
    .call();
  return synthPrice;
};

export const loadUserOrderStat = async (address: string) => {
  const synthPrice = await FactoryContract.methods
    .getSynthPriceToEth("0xa513E6E4b8f2a923D98304ec87F64353C4D5C853")
    .call();
  const bnSynthPrice = new BigNumber(synthPrice);
  const [collateral, debt] = await Promise.all([
    ReserveContract.methods.getMinterDeposit(address).call(),
    // ReserveContract.methods.getMinterCollateralRatio(address, bnSynthPrice).call(),
    ReserveContract.methods.getMinterDebt(address).call(),
  ]);
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

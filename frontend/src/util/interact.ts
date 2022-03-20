import { BigNumber } from "ethers";

require("dotenv").config();
// const { BigNumber } = require("@ethersproject");

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");

// console.trace(alchemyKey);
const web3 = createAlchemyWeb3(alchemyKey);

const FactoryABI = require("../abi/contracts/Factory.sol/Factory.json");
const LiquidationABI = require("../abi/contracts/Liquidation.sol/Liquidation.json");
const ReserveABI = require("../abi/contracts/Reserve.sol/Reserve.json");
const SynthABI = require("../abi/contracts/Synth.sol/Synth.json");


const FactoryAddress = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";
const ReserveAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

//
export const FactoryContract = new web3.eth.Contract(
    FactoryABI,
    FactoryAddress
);

export const ReserveContract = new web3.eth.Contract(
    ReserveABI,
    ReserveAddress
);

export const mintSynth = async (address: string|null, synthName: string, amount: number, ratio: number) => {
    // input error handling
    if (!(window as any).ethereum || address === null) {
        return {
            status:
                "💡 Connect your Metamask wallet to update the message on the blockchain.",
        };
    }
    const unit = BigNumber.from(10).pow(18);

    // amount is in eth
    const amountWei = BigNumber.from(amount).mul(unit);
    // eslint-disable-next-line
    console.log(web3.utils.toWei(new web3.utils.BN(amount), 'ether').toString());

    // set up transaction parameters
    const depositParameters = {
        to: FactoryAddress, // Required except during contract publications.
        from: address, // must match user's active address.
        value: web3.utils.toHex(amountWei.toString()),
        data: FactoryContract.methods.userDepositEther(synthName).encodeABI(),
    };

    const bigNumberRatio = BigNumber.from(ratio);
    const amountSynthInWei = amountWei.mul(bigNumberRatio).div(BigNumber.from(100));
    const mintParameters = {
        to: FactoryAddress, // Required except during contract publications.
        from: address, // must match user's active address.
        data: FactoryContract.methods.userMintSynth(synthName, amountSynthInWei).encodeABI(),
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
            status: (error as any).message
        };
    }
};

export const loadUserCollateral = async (address:string) => {
    // const collateral = await ReserveContract.methods.getMinterDeposit(address).call();
    // const collateral = await FactoryContract.methods.getSynthPriceToEth("0xa513E6E4b8f2a923D98304ec87F64353C4D5C853").call()
    FactoryContract.methods.getSynthPriceToEth("0xa513E6E4b8f2a923D98304ec87F64353C4D5C853").call((err: any, result: any) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });
    // console.log(collateral);
    // return collateral;
};

// export const loadCurrentMessage = async () => {
//     const message = await helloWorldContract.methods.message().call();
//     return message;
// };

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
                status: `😥 ${  (err as any).message}`,
            };
        }
    } else {
        return {
            address: "",
            status: ("Not installed"),
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
                status: `😥 ${  (err as any).message}`,
            };
        }
    } else {
        return {
            address: "",
            status: ("Not installed"),
        };
    }
};


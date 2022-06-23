import { BigNumber } from "bignumber.js";

import ContractAddress from "./ContractAddress";
import {loadActiveTokens} from "./interact";
import {OneNFT} from "../api";

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
const MockNFTABI = require("../abi/contracts/mocks/MockNFT.sol/MockNFT.json");
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
  NFTContract[name] = new web3.eth.Contract(MockNFTABI, ContractAddress.tokens[i].NFT);

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

const getIPFSMetadataFromURL = (url: string) => fetch(url)
    .then((response) => {
      // const temp = response.json();
      return response.json()
    })
    .then((responseJson) => {
      // console.log("ppp", responseJson);
      // const temp = responseJson;
      return responseJson.image.replace("ipfs://", "https://ipfs.io/ipfs/")
    })
    .catch((error) => {
      console.error(error);
    })

// export const loadUnclaimedGivenNFT = async ( tickerID: string, pageIndex: number) => {
//   const {_tokenIds, _tokenURIs} = await NFTContract[tickerID].methods.remainingTokenURI(new BigNumber(pageIndex)).call();
//   const res = []
//   for (let i = 0; i < _tokenIds.length; i += 1) {
//     res.push({
//       tokenId: _tokenIds[i],
//       tokenURI: _tokenURIs[i]
//     })
//   }
//   console.log(await getIPFSMetadataFromURL(res[0].tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")))
//
//   return res;
// }

export function loadUnclaimedGivenNFT( tickerID: string, pageIndex: number): Promise<any[]> {
  return new Promise(resolve => {
    NFTContract[tickerID].methods.remainingTokenURI(new BigNumber(pageIndex)).call().then((result: any) => {
      const {_tokenIds, _tokenURIs} = result;
      const imgFromTokenURIPromises = []
      for (let i = 0; i < _tokenURIs.length; i += 1) {
        imgFromTokenURIPromises.push(getIPFSMetadataFromURL(_tokenURIs[i].replace("ipfs://", "https://ipfs.io/ipfs/")))
      }
      Promise.all(imgFromTokenURIPromises).then(listOfImgSrc => {
        const res = []
        for (let i = 0; i < _tokenIds.length; i += 1) {
          res.push({
            tokenId: _tokenIds[i],
            img: listOfImgSrc[i]
          })
        }
        resolve(res);
      })
    })
  })
}

export function loadUserGivenNFT(walletAddress: string, tickerID: string): Promise<OneNFT[]> {
  const balancePromise = NFTContract[tickerID].methods.balanceOf(walletAddress).call();
  return balancePromise.then((balance: any) => {
    if (balance === "0") {
      return []
    }
    const tokenIDPromises = Promise.all(Array.from({length:parseInt(balance)},(v,k)=>k).map(i => NFTContract[tickerID].methods.tokenOfOwnerByIndex(walletAddress, i).call()))
    return tokenIDPromises.then(tokenIDs => {
      const tokenURIPromises = Promise.all(tokenIDs.map(tokenId => NFTContract[tickerID].methods.tokenURI(tokenId).call()))
      return tokenURIPromises.then(tokenURIs => {
        const fetchJSONPromises = []
        for (let i = 0; i < tokenURIs.length; i += 1) {
          const tokenURI = tokenURIs[i].replace("ipfs://", "https://ipfs.io/ipfs/");
          fetchJSONPromises.push(getIPFSMetadataFromURL(tokenURI));
        }
        return Promise.all(fetchJSONPromises).then(tokenImages => {
          const oneNFTs = []
          for (let i = 0; i < tokenIDs.length; i += 1) {
            oneNFTs.push({
              ticker: tickerID,
              tokenID: tokenIDs[i],
              tokenURI: tokenImages[i],
              nftAddress: NFTAddress[i],
            })
          }
          return oneNFTs;
        })
      })
    })
  })
}

// export function loadUserGivenNFT(walletAddress: string, tickerID: string): Promise<OneNFT[]> {
//   return new Promise(resolve => {
//     const balancePromise = NFTContract[tickerID].methods.balanceOf(walletAddress).call();
//     balancePromise.then((balance: any)=>{
//       if (balance === "0") {
//         resolve([])
//       }
//       const tokenIDPromises = Promise.all(Array.from(balance, Number).map(i => NFTContract[tickerID].methods.tokenOfOwnerByIndex(walletAddress, i).call()))
//       tokenIDPromises.then(tokenIDs => {
//         const tokenURIPromises = Promise.all(Array.from(tokenIDs, Number).map(tokenId => NFTContract[tickerID].methods.tokenURI(tokenId).call()))
//         tokenURIPromises.then(tokenURIs => {
//           const fetchJSONPromises = []
//           for (let i = 0; i < tokenURIs.length; i += 1) {
//             const tokenURI = tokenURIs[i].replace("ipfs://", "https://ipfs.io/ipfs/");
//             fetchJSONPromises.push(getIPFSMetadataFromURL(tokenURI));
//           }
//           Promise.all(fetchJSONPromises).then(tokenImages => {
//             const oneNFTs = []
//             for (let i = 0; i < tokenIDs.length; i += 1) {
//               oneNFTs.push({
//                 ticker: tickerID,
//                 tokenID: tokenIDs[i],
//                 tokenURI: tokenImages[i],
//                 nftAddress: NFTAddress[i],
//               })
//             }
//             resolve(oneNFTs);
//           })
//         })
//       })
//     })
//   })
// }

//
// export const loadUserGivenNFT = async (walletAddress: string, tickerID: string) => {
//   const balance = await NFTContract[tickerID].methods.balanceOf(walletAddress).call();
//   const tokenIDAndURI: {[key: string]: string} = {};
//   const tokenIDPromises = []
//   for (let i = 0; i < balance; i += 1) {
//     tokenIDPromises.push(NFTContract[tickerID].methods.tokenOfOwnerByIndex(walletAddress, i).call());
//   }
//   const tokenIDs = await Promise.all(tokenIDPromises);
//
//   const tokenURIPromises = []
//   for (let i = 0; i < tokenIDs.length; i += 1) {
//     const tokenID = tokenIDs[i];
//     tokenURIPromises.push(NFTContract[tickerID].methods.tokenURI(tokenID).call());
//   }
//   const tokenURIs = await Promise.all(tokenURIPromises);
//
//   const fetchJSONPromises = []
//   for (let i = 0; i < tokenIDs.length; i += 1) {
//     const tokenID = tokenIDs[i];
//     const tokenURI = tokenURIs[i].replace("ipfs://", "https://ipfs.io/ipfs/");
//     fetchJSONPromises.push(getIPFSMetadataFromURL(tokenURI));
//   }
//   const tokenImages = await Promise.all(fetchJSONPromises);
//
//   for (let i = 0; i < tokenIDs.length; i += 1) {
//     const tokenID = tokenIDs[i];
//     tokenIDAndURI[tokenID] = tokenImages[i];
//   }
//
//   return tokenIDAndURI;
// }

export const loadUserAllNFT = async (walletAddress: string) => {
  const activeTokens = await loadActiveTokens();
  const {tokenNames, tokenSymbols, reserveAddresses, synthAddresses, vaultAddresses} = activeTokens;
  const allNFTPromises = []
  for (let i = 0; i < tokenNames.length; i += 1){
    allNFTPromises.push(loadUserGivenNFT(walletAddress, tokenNames[i]));
  }
  const allNFTIDAndURI = await Promise.all(allNFTPromises);
  const infoDict: {[key: string]: any} = {};
  for (let i = 0; i < tokenNames.length; i += 1) {
    const tickerID = tokenNames[i];
    infoDict[tickerID] = allNFTIDAndURI[i];
  }
  return infoDict;
}



export const userClaimNFT = async (walletAddress: string, tokenID: string, tickerID: string) => {
  const mintParameters = {
    to: NFTAddress[tickerID], // Required except during contract publications.
    from: walletAddress, // must match user's active address.
    data: NFTContract[tickerID].methods
        .safeMint(walletAddress, tokenID)
        .encodeABI(),
  };
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
}

export const userClaimBatchNFT = async (walletAddress: string, tokenIDs: string[], tickerID: string) => {
  const mintPromises = []
  for (let i = 0; i < tokenIDs.length; i += 1) {
    const tokenID = tokenIDs[i];
    mintPromises.push(userClaimNFT(walletAddress, tokenID, tickerID))
  }
  const batchMintResult = await Promise.all(mintPromises);
  return batchMintResult;
}

export const mintSynthWithNFT = async (walletAddress: string, tokenIDs: any[], tickerID: string) => {
  const mintParameters = {
    to: VaultAddress[tickerID], // Required except during contract publications.
    from: walletAddress, // must match user's active address.
    data: VaultContract[tickerID].methods
        .userMintSynthNFT(tokenIDs)
        .encodeABI(),
  };
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
}


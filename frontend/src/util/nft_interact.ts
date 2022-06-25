import { BigNumber } from "bignumber.js";

import ContractAddress from "../constants/ContractAddress";
import {
  FactoryAddress, FactoryContract,
  NFTAddress,
  NFTContract, SynthAddress,
  SynthContract,
  VaultAddress,
  VaultContract
} from "../constants/web3Instance";
import {OneNFT} from "./dataStructures";
import {loadActiveTokens} from "./interact";

BigNumber.config({ DECIMAL_PLACES: 19 });

// const {ReserveAddress, SynthAddress, VaultAddress, NFTAddress, ReserveContract, SynthContract, VaultContract, LpPairContract, NFTContract} = initContractAndAddress()

const getIPFSMetadataFromURL = (url: string) => fetch(url)
    .then((response) =>
      // const temp = response.json();
       response.json()
    )
    .then((responseJson) =>
      // console.log("ppp", responseJson);
      // const temp = responseJson;
       responseJson.image.replace("ipfs://", "https://ipfs.io/ipfs/")
    )
    .catch((error) => {
      console.error(error);
    })
const getIPFSMetadataFromURLWithTokenID = (url: string, tokenId: string) => fetch(url)
    .then((response) =>
        // const temp = response.json();
        response.json()
    )
    .then((responseJson) => ([tokenId, responseJson.image.replace("ipfs://", "https://ipfs.io/ipfs/")]))
    .catch((error) => {
      console.error(error);
    })

export function loadUnclaimedGivenNFT( tickerID: string, pageIndex: number): Promise<any[]> {
  return new Promise(resolve => {
    NFTContract[tickerID].methods.remainingTokenURI(new BigNumber(pageIndex || 0)).call().then((result: any) => {
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
    const tokenIDPromises = Promise.all(Array.from({length:parseInt(balance, 10)},(v,k)=>k).map(i => NFTContract[tickerID].methods.tokenOfOwnerByIndex(walletAddress, i).call()))
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
              nftAddress: NFTAddress[tickerID],
            })
          }
          return oneNFTs;
        })
      })
    })
  })
}

export function loadUserDepositedNFTs(walletAddress: string, tickerID: string): Promise<OneNFT[]> {
  const depositsPromise = FactoryContract.methods.listUserDebtDeposit(walletAddress, [tickerID]).call();
  return depositsPromise.then((result: any) => {

    const tokenIDs = result.depositNFTs[0];
    const tokenURIPromises = Promise.all(tokenIDs.map((tokenId: any) => NFTContract[tickerID].methods.tokenURI(tokenId).call()))
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
            nftAddress: NFTAddress[tickerID],
          })
        }
        return oneNFTs;
      })
    })
  })
}

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
  //
  // const approveParameters = []
  // for (let i = 0; i < tokenIDs.length; i += 1) {
  //   approveParameters.push({
  //     to: NFTAddress[tickerID], // Required except during contract publications.
  //     from: walletAddress, // must match user's active address.
  //     data: NFTAddress[tickerID].methods.approve(VaultAddress[tickerID], bnBurnAmount).encodeABI(),
  //   })
  // }
  const approveParameters = {
      to: NFTAddress[tickerID], // Required except during contract publications.
      from: walletAddress, // must match user's active address.
      data: NFTContract[tickerID].methods.setApprovalForAll(VaultAddress[tickerID], true).encodeABI(),
    }

  try {
    const approveHash = await (window as any).ethereum.request({
      method: "eth_sendTransaction",
      params: [approveParameters],
    });
    console.log(approveHash);
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



export const burnSynthWithNFT = async (walletAddress: string, tokenIDs: any[], tickerID: string) => {
  // input error handling
  if (!(window as any).ethereum || walletAddress === null) {
    return {
      status:
          "💡 Connect your Metamask wallet to update the message on the blockchain.",
    };
  }
  const burnParameters = {
    to: VaultAddress[tickerID], // Required except during contract publications.
    from: walletAddress, // must match user's active address.
    data: VaultContract[tickerID].methods.userBurnSynthNFT(tokenIDs).encodeABI(),
  };
  const bnBurnAmount = new BigNumber(tokenIDs.length).times("1e18")
  const approveParameters = {
    to: SynthAddress[tickerID], // Required except during contract publications.
    from: walletAddress, // must match user's active address.
    data: SynthContract[tickerID].methods.approve(VaultAddress[tickerID], bnBurnAmount).encodeABI(),
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

}
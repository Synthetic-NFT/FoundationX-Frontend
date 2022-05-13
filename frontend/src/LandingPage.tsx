/* eslint-disable react/jsx-props-no-spreading */

import React from "react";

import NFTMarketPlace from "./components/NFTMarketPlace";
import bayc12X from "./styles/images/bayc-1@2x.png";
import image462X from "./styles/images/image-46@2x.png";
import image472X from "./styles/images/image-47@2x.png";
import rectangle1841X from "./styles/images/rectangle-184@1x.png";

const nFTMarketPlaceData = {
    dappComingSoon: "dApp coming soon",
    docs: "Docs",
    twitter: "Twitter",
    democratizingInvest: "Democratizing investing in your favorite NFT collections",
    learnMore: "Learn More",
    nftsyIsAnInnovati: "NFTSy is an innovative synthetic NFT index derivatives, providing long & short exposure to the NFT asset collections.",
    rectangle184: rectangle1841X,
    bayc1: bayc12X,
    image46: image462X,
    image47: image472X,
    whatIsNftsy: "What is NFTSy",
    nftsyIssuesErc20T: <>NFTSy issues ERC20 tokens whose price tracks the floor price of different NFT collections. <br />These tokens give you exactly the same profit and loss as if you are hodling (a fraction of) an actual NFT.<br />Users can choose to deposit with either ETH or NFTs to issue these ERC20 tokens.</>,
    whyNftsy: "Why NFTSy",
    instantaneousLiquidityForNfts: "Instantaneous Liquidity for NFTs",
    nftHodlersHaveAcc: "NFT hodlers have access to instataneous liquidity by minting synthetic tokens with NFTs and selling synthetic tokens.",
    unparalleledAccessibility: "Unparalleled Accessibility",
    nonNftHodlersOnly: "Non-NFT hodlers only need ETH to open long and short positions",
    earnPassiveIncomeOnNfts: "Earn Passive Income on NFTs",
    nftHoldersCanEarn: "NFT holders can earn passive income from NFTSy protocol fees through yield farming by depositing NFTs",
    nftsy: "NFTSy",
    researchDocumentationLink: <>Research<br />Documentation link</>,
    communityTwitterDiscordTelegram: <>Community<br />Twitter<br />Discord<br />Telegram</>,
};

export default function LandingPage() {
  return (
    <NFTMarketPlace {...nFTMarketPlaceData} />
  );
}
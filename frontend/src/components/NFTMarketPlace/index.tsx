/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling

import React, { useCallback, useEffect }from "react";
import {
  Switch,
  Route,
  useRouteMatch,
  useHistory,
  useLocation,
} from "react-router-dom";
import styled from "styled-components";

import "./NFTMarketPlace.css";
import dot2X from "../../styles/images/dot@2x.svg";
import line101X from "../../styles/images/line-10@1x.svg";
import line112X from "../../styles/images/line-11@2x.svg";
import logo2X from "../../styles/images/logo@2x.svg";
import mobile11X from "../../styles/images/mobile-1@1x.svg";
import mobile1X from "../../styles/images/mobile@1x.svg";
import searchNormal112X from "../../styles/images/search-normal-1-1@2x.svg";
import {
  DmsansNormalGraniteGray14px,
  DmsansBoldKingfisherDaisy14px,
  DmsansMediumMasala14px,
  DmsansBoldBlack20px,
  Border3pxKingfisherDaisy,
  AnekkannadaBoldBlack40px,
} from "./styledMixins";


const OverlapGroup2 = styled.div`
  width: 1446px;
  height: 98px;
  position: relative;
  margin-top: 11px;
  margin-right: 6px;
`;

const TopMenu = styled.div`
  position: absolute;
  width: 1446px;
  top: 20px;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 78px;
`;

const FlexRow = styled.div`
  height: 50px;
  margin-left: 154.5px;
  display: flex;
  align-items: center;
  min-width: 1074px;
`;

const Line11 = styled.img`
  width: 1px;
  height: 47px;
  align-self: flex-end;
`;

const SearchNormal11 = styled.img`
  width: 24px;
  height: 24px;
  margin-left: 691px;
`;

const Frame4 = styled.div`
  display: flex;
  margin-left: 142px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 200px;
  height: 58px;
  background-color: var(--kingfisher-daisy);
  border-radius: 60px;
`;

const DAppComingSoon = styled.button`
  font-family: var(--font-family-dm_sans);
  width: 80%;
  height: 80%;
  background: none;
  border: none;
  font-weight: 700;
  color: var(--white);
  font-size: var(--font-size-m);
  letter-spacing: 0.56px;
  line-height: 14px;
  white-space: nowrap;
  cursor: pointer;
`;

const Line10 = styled.img`
  width: 1440px;
  height: 1px;
  margin-top: 28px;
`;

const Frame5 = styled.div`
  ${Border3pxKingfisherDaisy}
  display: flex;
  position: absolute;
  top: 20px;
  left: 972px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding-top: 18px;
  padding-right: 40px;
  padding-bottom: 18px;
  padding-left: 40px;
  background-color: var(--white);
  border-radius: 60px;
`;

const Docs = styled.a`
  ${DmsansBoldKingfisherDaisy14px}
  letter-spacing: 0.56px;
  line-height: 14px;
  white-space: nowrap;
`;

const Frame6 = styled.div`
  ${Border3pxKingfisherDaisy}
  display: flex;
  position: absolute;
  top: 20px;
  left: 812px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding-top: 18px;
  padding-right: 40px;
  padding-bottom: 18px;
  padding-left: 40px;
  border-radius: 60px;
`;

const Logo = styled.img`
  position: absolute;
  width: 217px;
  height: 92px;
  top: 0;
  left: 127px;
`;

const FlexRow1 = styled.div`
  height: 597px;
  margin-top: 27px;
  margin-right: 36.14px;
  display: flex;
  align-items: center;
  min-width: 1268px;
`;

const FlexCol = styled.div`
  width: 643px;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 409px;
`;

const DemocratizingInvest = styled.h1`
  width: 591px;
  min-height: 156px;
  align-self: flex-end;
  font-family: var(--font-family-anek_kannada);
  font-weight: 800;
  color: var(--black);
  font-size: var(--font-size-xxxxl);
  letter-spacing: 2.4px;
  line-height: 52px;
`;

const OverlapGroup1 = styled.div`
  width: 523px;
  height: 225px;
  position: relative;
  margin-top: 28px;
`;

const Dot = styled.img`
  position: absolute;
  width: 196px;
  height: 154px;
  top: 71px;
  left: 0;
`;

const Frame2 = styled.div`
  display: flex;
  position: absolute;
  top: 155px;
  left: 53px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding-top: 20px;
  padding-right: 40px;
  padding-bottom: 20px;
  padding-left: 40px;
  background-color: var(--kingfisher-daisy);
  border-radius: 60px;
`;

const LearnMore = styled.a`
  margin-left: -0.5px;
  font-family: var(--font-family-inter);
  font-weight: 400;
  color: var(--white);
  font-size: var(--font-size-xl);
  letter-spacing: 1.3px;
  -webkit-text-stroke: 0.5px var(--white);
`;

const NFTSyIsAnInnovati = styled.div`
  position: absolute;
  width: 471px;
  top: 0;
  left: 52px;
  font-family: var(--font-family-dm_sans);
  font-weight: 400;
  color: #565656;
  font-size: var(--font-size-xl);
  letter-spacing: 0;
  line-height: 32px;
`;

const Rectangle184 = styled.img`
  width: 1px;
  height: 1px;
  margin-left: 8px;
  margin-bottom: 104px;
`;

const MobileContainer = styled.div`
  width: 610px;
  height: 639px;
  position: relative;
  align-self: flex-start;
  margin-left: 25px;
  margin-top: -21.15px;
`;

const Mobile = styled.img`
  position: absolute;
  width: 318px;
  height: 639px;
  top: 0;
  left: 292px;
`;

const Mobile1 = styled.img`
  position: absolute;
  width: 318px;
  height: 639px;
  top: 0;
  left: 0;
`;

const OverlapGroup3 = styled.div`
  height: 742px;
  margin-top: 32px;
  display: flex;
  padding: 86.1px 110px;
  align-items: center;
  min-width: 1440px;
  background-color: var(--geyser);
  backdrop-filter: blur(50px) brightness(100%);
  -webkit-backdrop-filter: blur(50px) brightness(100%);
`;

const Group917 = styled.div`
  height: 569px;
  align-self: flex-end;
  display: flex;
  align-items: flex-start;
  min-width: 631px;
`;

const FlexCol1 = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-height: 569px;
`;

const BAYC1 = styled.img`
  width: 300px;
  height: 300px;
  object-fit: cover;
`;

const Image46 = styled.img`
  width: 213px;
  height: 220px;
  margin-top: 49px;
  margin-right: 2.91px;
  object-fit: cover;
`;

const Image47 = styled.img`
  width: 300px;
  height: 380px;
  align-self: center;
  margin-left: 31px;
  margin-top: 30.65px;
  object-fit: cover;
`;

const SignUpNFT = styled.div`
  width: 521px;
  margin-left: 59px;
  margin-bottom: 19px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 319px;
`;

const WhatIsNFTSy = styled.div`
  ${AnekkannadaBoldBlack40px}
  width: 320px;
  min-height: 67px;
  margin-left: 1px;
  letter-spacing: 0;
`;

const NFTSyIssuesERC20T = styled.div`
  width: 517px;
  min-height: 203px;
  margin-top: 49px;
  font-family: var(--font-family-dm_sans);
  font-weight: 400;
  color: #626262;
  font-size: var(--font-size-l);
  letter-spacing: 0;
  line-height: 28.8px;
`;

const WhyNFTSy = styled.div`
  ${AnekkannadaBoldBlack40px}
  width: 320px;
  min-height: 40px;
  margin-top: 112px;
  text-align: center;
  letter-spacing: 0;
  line-height: 40px;
  white-space: nowrap;
`;

const Group914 = styled.div`
  height: 130px;
  margin-top: 61px;
  margin-right: 1px;
  display: flex;
  align-items: flex-start;
  min-width: 1131px;
`;

const Group86 = styled.div`
  width: 332px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 130px;
`;

const InstantaneousLiquidityForNFTs = styled.div`
  ${DmsansBoldBlack20px}
  width: 328px;
  min-height: 26px;
  letter-spacing: 0;
`;

const NFTHodlersHaveAcc = styled.p`
  ${DmsansNormalGraniteGray14px}
  width: 249px;
  min-height: 88px;
  margin-top: 16px;
  letter-spacing: 0;
  line-height: 22.4px;
`;

const Group87 = styled.div`
  width: 257px;
  margin-left: 126px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 86px;
`;

const UnparalleledAccessibility = styled.div`
  ${DmsansBoldBlack20px}
  min-height: 26px;
  letter-spacing: 0;
`;

const NonNFTHodlersOnly = styled.p`
  ${DmsansNormalGraniteGray14px}
  width: 249px;
  min-height: 44px;
  margin-top: 16px;
  letter-spacing: 0;
  line-height: 22.4px;
`;

const Group88 = styled.div`
  width: 294px;
  margin-left: 126px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 108px;
`;

const NFTHoldersCanEarn = styled.p`
  ${DmsansNormalGraniteGray14px}
  width: 249px;
  min-height: 66px;
  margin-top: 16px;
  letter-spacing: 0;
  line-height: 22.4px;
`;

const OverlapGroup = styled.div`
  height: 297px;
  margin-top: 85px;
  display: flex;
  padding: 49px 192px;
  align-items: flex-start;
  min-width: 1440px;
  background-color: var(--geyser);
  backdrop-filter: blur(50px) brightness(100%);
  -webkit-backdrop-filter: blur(50px) brightness(100%);
`;

const NFTSy = styled.div`
  min-height: 40px;
  margin-top: 2px;
  min-width: 67px;
  font-family: var(--font-family-anek_kannada);
  font-weight: 700;
  color: var(--black);
  font-size: var(--font-size-xxl);
  letter-spacing: 0;
`;

const ResearchDocumentationLink = styled.div`
  ${DmsansMediumMasala14px}
  min-height: 56px;
  margin-left: 606px;
  min-width: 130px;
  letter-spacing: 0;
  line-height: 28px;
`;

const CommunityTwitterDiscordTelegram = styled.div`
  ${DmsansMediumMasala14px}
  min-height: 112px;
  margin-left: 75px;
  letter-spacing: 0;
  line-height: 28px;
`;

export default function NFTMarketPlace(props: any) {
  const {
    dappComingSoon,
    docs,
    twitter,
    democratizingInvest,
    learnMore,
    nftsyIsAnInnovati,
    rectangle184,
    bayc1,
    image46,
    image47,
    whatIsNftsy,
    nftsyIssuesErc20T,
    whyNftsy,
    instantaneousLiquidityForNfts,
    nftHodlersHaveAcc,
    unparalleledAccessibility,
    nonNftHodlersOnly,
    earnPassiveIncomeOnNfts,
    nftHoldersCanEarn,
    nftsy,
    researchDocumentationLink,
    communityTwitterDiscordTelegram,
  } = props;

  const history = useHistory();

  return (
    <div className="container-center-horizontal">
      <div className="nft-market-place screen">
        <OverlapGroup2>
          <TopMenu>
            <FlexRow>
              <Line11 src={line112X} />
              <SearchNormal11 src={searchNormal112X} />
              <Frame4>
                <DAppComingSoon onClick={() => history.push('/myPage')}>{dappComingSoon}</DAppComingSoon>
              </Frame4>
            </FlexRow>
            <Line10 src={line101X} />
          </TopMenu>
          <Frame5>

            <Docs href="https://docs.nftsyprotocol.io/protocol/overview">
              {docs}
            </Docs>
          </Frame5>
          <Frame6>
            <Docs href="https://twitter.com/NFTSyProtocol">{twitter}</Docs>
          </Frame6>
          <Logo src={logo2X} />
        </OverlapGroup2>
        <FlexRow1>
          <FlexCol>
            <DemocratizingInvest>{democratizingInvest}</DemocratizingInvest>
            <OverlapGroup1>
              <Dot src={dot2X} />
              <Frame2>
                <LearnMore href="https://docs.nftsyprotocol.io/protocol/overview">{learnMore}</LearnMore>
              </Frame2>
              <NFTSyIsAnInnovati>{nftsyIsAnInnovati}</NFTSyIsAnInnovati>
            </OverlapGroup1>
          </FlexCol>
          <Rectangle184 src={rectangle184} />
          <MobileContainer>
            <Mobile src={mobile1X} />
            <Mobile1 src={mobile11X} />
          </MobileContainer>
        </FlexRow1>
        <OverlapGroup3>
          <Group917>
            <FlexCol1>
              <BAYC1 src={bayc1} />
              <Image46 src={image46} />
            </FlexCol1>
            <Image47 src={image47} />
          </Group917>
          <SignUpNFT>
            <WhatIsNFTSy>{whatIsNftsy}</WhatIsNFTSy>
            <NFTSyIssuesERC20T>{nftsyIssuesErc20T}</NFTSyIssuesERC20T>
          </SignUpNFT>
        </OverlapGroup3>
        <WhyNFTSy>{whyNftsy}</WhyNFTSy>
        <Group914>
          <Group86>
            <InstantaneousLiquidityForNFTs>{instantaneousLiquidityForNfts}</InstantaneousLiquidityForNFTs>
            <NFTHodlersHaveAcc>{nftHodlersHaveAcc}</NFTHodlersHaveAcc>
          </Group86>
          <Group87>
            <UnparalleledAccessibility>{unparalleledAccessibility}</UnparalleledAccessibility>
            <NonNFTHodlersOnly>{nonNftHodlersOnly}</NonNFTHodlersOnly>
          </Group87>
          <Group88>
            <UnparalleledAccessibility>{earnPassiveIncomeOnNfts}</UnparalleledAccessibility>
            <NFTHoldersCanEarn>{nftHoldersCanEarn}</NFTHoldersCanEarn>
          </Group88>
        </Group914>
        <OverlapGroup>
          <NFTSy>{nftsy}</NFTSy>
          <ResearchDocumentationLink>
            <>
              <p>Research</p> <br />
              <a href="https://docs.nftsyprotocol.io/protocol/overview">Documentation</a>
            </>
          </ResearchDocumentationLink>
          <CommunityTwitterDiscordTelegram>
            <>
              Community<br />
              <a href="https://twitter.com/NFTSyProtocol">Twitter</a><br />
              Discord<br />
              Telegram
            </>
          </CommunityTwitterDiscordTelegram>
        </OverlapGroup>
      </div>
    </div>
  );
}

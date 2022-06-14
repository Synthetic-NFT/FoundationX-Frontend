
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import { OverridableComponent } from "@mui/material/OverridableComponent";
import React from "react";

import ClaimRouteContainer from "./pages/Claim/ClaimRouteContainer";
import FarmRouteContainer from "./pages/Farm/FarmRouteContainer";
import MyPageRouteContainer from "./pages/MyPage/MyPageRouteContainer";
import Claim from "./styles/images/claim.svg";
import Farm from "./styles/images/farm.png";
import Contact from "./styles/images/Huge Icon/Headphone.png";
import LegalDocs from "./styles/images/Huge Icon/Info 01.png";
import Logout from "./styles/images/logout-1 1.png";
import MyPage from "./styles/images/mypage.png";
import Swap from "./styles/images/swap.png";
import Trade from "./styles/images/trade.png";
import SwapRouteContainer from "./SwapRouteContainer";
import TradeRouteContainer from "./TradeRouteContainer";

type Route = {
  path: string;
  label: string;
  // icon: OverridableComponent<any>;
  icon: string;
  RouteContainer?: React.FunctionComponent;
};

const tradeRoute = "/trade";
const myPageRoute = "/myPage";

// automatically nav to defaultRoute when loading "/"
export const defaultRoute = myPageRoute;

// The available top level routes of this app. Each route may have secondary routes
// (e.g. the trade route has `/trade/buy` and `/trade/sell`). The RouteContainer is rendered
// if the route matches.
export const routes: Route[] = [
  // {
  //   path: "/wallet",
  //   label: "Wallet",
  //   icon: AccountBalanceWalletIcon,
  //   RouteContainer: WalletRouteContainer,
  // },
  {
    path: myPageRoute,
    label: "My Page",
    icon: MyPage,
    RouteContainer: MyPageRouteContainer,
  },
  {
    path: tradeRoute,
    label: "Mint",
    icon: Trade,
    RouteContainer: TradeRouteContainer,
  },
  {
    path: "/swap",
    label: "Swap",
    icon: Swap,
    RouteContainer: SwapRouteContainer,
  },  
  {
    path: "/farm",
    label: "Farm",
    icon: Farm,
    RouteContainer: FarmRouteContainer,
  }, 
  {
    path: "/claim",
    label: "Claim",
    icon: Claim,
    RouteContainer: ClaimRouteContainer,
  },
];


export const defaultRoutes: Route[] = [
  {
    path: "https://docs.nftsyprotocol.io/protocol/overview",
    label: "Legal Docs",
    icon: LegalDocs,
  },   
  {
    path: "https://docs.nftsyprotocol.io/protocol/overview",
    label: "Contact Support",
    icon: Contact,
  },   
  {
    icon: Logout,
    path: myPageRoute,
    label: "Log Out",
  },
];

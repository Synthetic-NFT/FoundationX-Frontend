
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import { OverridableComponent } from "@mui/material/OverridableComponent";
import React from "react";

import FarmRouteContainer from "./pages/Farm/FarmRouteContainer";
import MyPageRouteContainer from "./pages/MyPage/MyPageRouteContainer";
import SwapRouteContainer from "./SwapRouteContainer";
import TradeRouteContainer from "./TradeRouteContainer";

type Route = {
  path: string;
  label: string;
  icon: OverridableComponent<any>;
  RouteContainer: React.FunctionComponent;
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
    icon: ManageAccountsIcon,
    RouteContainer: MyPageRouteContainer,
  },
  {
    path: tradeRoute,
    label: "Trade",
    icon: MonetizationOnIcon,
    RouteContainer: TradeRouteContainer,
  },
  {
    path: "/swap",
    label: "Swap",
    icon: CurrencyExchangeIcon,
    RouteContainer: SwapRouteContainer,
  },  
  {
    path: "/farm",
    label: "Farm",
    icon: SwapHorizontalCircleIcon,
    RouteContainer: FarmRouteContainer,
  },
];

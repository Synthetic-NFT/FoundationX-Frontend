import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import React from "react";

import SwapRouteContainer from "./SwapRouteContainer";
import TradeRouteContainer from "./TradeRouteContainer";

type Route = {
  path: string;
  label: string;
  icon: OverridableComponent<any>;
  RouteContainer: React.FunctionComponent;
};

const tradeRoute = "/trade";

// automatically nav to defaultRoute when loading "/"
export const defaultRoute = tradeRoute;

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
];

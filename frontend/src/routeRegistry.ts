import React from "react";

import TradeRouteContainer from "@/TradeRouteContainer";
import WalletRouteContainer from "@/WalletRouteContainer";

type Route = {
  path: string;
  label: string;
  RouteContainer: React.FunctionComponent;
};

// automatically nav to defaultRoute when loading "/"
export const defaultRoute = "/wallet";

export const routes: Route[] = [
  {
    path: "/wallet",
    label: "Wallet",
    RouteContainer: WalletRouteContainer,
  },
  {
    path: "/trade",
    label: "Trade",
    RouteContainer: TradeRouteContainer,
  },
];

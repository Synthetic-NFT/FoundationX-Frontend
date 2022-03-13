import React from "react";
import { Switch, Route, useHistory } from "react-router-dom";

import InstrumentOrder from "@/InstrumentOrder";
import InstrumentTable from "@/InstrumentTable";

export default function TradeRouteContainer(): React.ReactElement {
  const history = useHistory();
  return (
    <Switch>
      <Route path="/trade" exact>
        <InstrumentTable
          onRowClick={(instrument) =>
            history.push(`/trade/order/buy?ticker=${instrument.ticker}`)
          }
        />
      </Route>
      <Route path="/trade/order">
        <InstrumentOrder />
      </Route>
    </Switch>
  );
}

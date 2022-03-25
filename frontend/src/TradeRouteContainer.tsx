import React from "react";
import { Switch, Route, useHistory } from "react-router-dom";

import InstrumentOrder from "./InstrumentOrder";
import {InstrumentTable} from "./InstrumentTable";

export default function TradeRouteContainer(): React.ReactElement {
  const history = useHistory();
  
  return (
    <Switch>
      {/* we need the exact here because we only want to match `/trade/`. Without it, this
       * will also match "/trade/order".
       */}
      <Route path="/trade" exact>
        <InstrumentTable
          onRowClick={(instrument) => {
            // We are at "/trade". When clicking an instrument in the table, we go to the
            // order page by navigating to "/trade/order/buy" and set the ticker of the
            // insturment being clicked.
            history.push(`/trade/order/buy?ticker=${instrument.ticker}`);
          }}
        />
      </Route>
      <Route path="/trade/order">
        <InstrumentOrder />
      </Route>
    </Switch>
  );
}

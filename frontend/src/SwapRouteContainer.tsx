import React from "react";
import { Route } from "react-router-dom";

import SwapInstrumentTable from "./SwapInstrumentTable";

export default function SwapRouteContainer(): React.ReactElement {
  return (
    <Route path="/swap" exact>
      <SwapInstrumentTable />
    </Route>
  );
}

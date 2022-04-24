import React from "react";
import { Switch, Route, useHistory } from "react-router-dom";

import FarmLongShort from "./components/FarmLongShort";
import { FarmTable } from "./components/FarmTable";

export default function FarmRouteContainer(): React.ReactElement {
  const history = useHistory();

  return (
    <Switch>
      <Route path="/farm" exact>
        <FarmTable />
      </Route>
      <Route path="/farm/long">
        <FarmLongShort />
      </Route>
      <Route path="/farm/short">
        <FarmLongShort />
      </Route>
    </Switch>
  );
}

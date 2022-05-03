import React from "react";
import { Switch, Route, useHistory } from "react-router-dom";

import ReturnButton from '../../components/ReturnButton';
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
        <ReturnButton onClick={() => history.push('/farm')} textValue="Back" />
        <FarmLongShort />
      </Route>
      <Route path="/farm/short">
        <ReturnButton onClick={() => history.push('/farm')} textValue="Back" />
        <FarmLongShort />
      </Route>
    </Switch>
  );
}

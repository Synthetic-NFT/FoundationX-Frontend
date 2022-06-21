import React from "react";
import {Route, Switch, useHistory} from "react-router-dom";

import { Instrument } from "./api";
import ReturnButton from './components/ReturnButton';
import InstrumentOrder from "./InstrumentOrder";
import {InstrumentTable} from "./InstrumentTable";
import SwapInstrumentTable from "./SwapInstrumentTable";
import CoinSwapper from "./swapper/CoinSwapper";

export default function SwapRouteContainer(): React.ReactElement {
  // return (
  //   <Route path="/swap" exact>
  //     <SwapInstrumentTable />
  //   </Route>
  // );


    const history = useHistory();
    const [selectedInstrument, setSelectedInstrument] = React.useState<Instrument|undefined>(undefined);

    return (
        <Switch>
            {/* we need the exact here because we only want to match `/trade/`. Without it, this
       * will also match "/trade/order".
       */}
            {/*<Route path="/swap" exact>*/}
            {/*    <SwapInstrumentTable*/}
            {/*        onRowClick={(instrument) => {*/}
            {/*            // We are at "/trade". When clicking an instrument in the table, we go to the*/}
            {/*            // order page by navigating to "/trade/order/buy" and set the ticker of the*/}
            {/*            // insturment being clicked.*/}
            {/*            // <CoinSwapper instrument={instrument} />*/}
            {/*            history.push("/swap/order", instrument);*/}
            {/*            setSelectedInstrument(instrument);*/}
            {/*            // history.push(`/trade/order/buy?ticker=${instrument.ticker}`);*/}
            {/*        }}*/}
            {/*    />*/}
            {/*</Route>*/}
              <Route path="/swap">
                {/*<ReturnButton onClick={() => {setSelectedInstrument(undefined); history.push('/swap');}} textValue="Back" />*/}
                <CoinSwapper instrument={selectedInstrument} />
              </Route>
        </Switch>
    );
}

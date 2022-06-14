import React from "react";
import {Route, Switch, useHistory} from "react-router-dom";

import { Instrument } from "../../api";
import ReturnButton from '../../components/ReturnButton';
import ClaimDetail from "./components/ClaimDetail";
import ClaimTable from "./components/ClaimTable";

export default function SwapRouteContainer(): React.ReactElement {

    const history = useHistory();
    const [selectedInstrument, setSelectedInstrument] = React.useState<Instrument|undefined>(undefined);

    return (
        <Switch>
            <Route path="/claim" exact>
                <ClaimTable
                    onRowClick={(instrument) => {
                        history.push("/claim/detail", instrument);
                        setSelectedInstrument(instrument);
                    }}
                />
            </Route>
              <Route path="/claim/detail">
                <ReturnButton onClick={() => {setSelectedInstrument(undefined); history.push('/claim');}} textValue="Back" />
                <ClaimDetail instrument={selectedInstrument} buttonName="claim"/>
              </Route>
        </Switch>
    );
}

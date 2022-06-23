import React from "react";
import {Route, Switch, useHistory} from "react-router-dom";

import {Instrument, NFTCollection} from "../../api";
import ReturnButton from '../../components/ReturnButton';
import ClaimPage from "./components/ClaimPage";
import ClaimDetail from "./components/ClaimDetail";
import ClaimTable from "./components/ClaimTable";

export default function ClaimRouteContainer(): React.ReactElement {

    const history = useHistory();
    const [selectedCollection, setSelectedCollection] = React.useState<NFTCollection|undefined>(undefined);

    return (
        <Switch>
            <Route path="/claim" exact>
                <ClaimDetail
                    onCollectionSelect={(collection: NFTCollection) => {
                        history.push("/claim/NFT", collection);
                        setSelectedCollection(collection);
                    }}
                    buttonName="Claim"
                />
            </Route>
            <Route path="/claim/NFT">
                <ReturnButton onClick={() => {setSelectedCollection(undefined); history.push('/claim');}} textValue="Back" />
                <ClaimPage collection={selectedCollection} buttonName="Claim"/>
            </Route>
        </Switch>
    );
}

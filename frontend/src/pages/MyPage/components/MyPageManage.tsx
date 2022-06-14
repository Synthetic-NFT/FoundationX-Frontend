import { makeStyles } from "@material-ui/core/styles";
import { tabUnstyledClasses } from "@mui/base/TabUnstyled";
import Box from "@mui/material/Box";
import TabUnstyled from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { styled } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import {
  Switch,
  Route,
  useRouteMatch,
  useHistory,
  useLocation,
} from "react-router-dom";

import ReturnButton from '../../../components/ReturnButton';
import InstrumentBuy from "../../../InstrumentBuy";
import InstrumentSell from "../../../InstrumentSell";
import theme from "../../../theme";
import { TradeContext } from "../../../TradeContext";
import { loadSynthPrice } from "../../../util/interact";
import ClaimDetail from "../../Claim/components/ClaimDetail";

const Tab = styled(TabUnstyled)`
  color: rgba(255, 255, 255, 0.52);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: bold;
  background-color: transparent;
  width: 48%;
  padding: 0.5rem 0.67rem;
  margin: 0.25rem 0.25rem;
  border: none;
  border-radius: 0.25rem;
  display: flex;
  justify-content: center;
  max-width: 30rem;
  &.${tabUnstyledClasses.selected} {
    background-color: #2B3342;
    color: #ffffff;
    border: 1px solid #B0B0B0;
    border-radius: 0.25rem;
  };
  height: 2rem;
`;

const useStyles = makeStyles({
  currentTicker: {
    color: theme.activeTextColor,
    fontSize: "32pt",
  },
});

const MYPAGE_URL = "/mypage";
const BASE_URL = `${MYPAGE_URL}/manage`;
const ETH_URL = `${BASE_URL}/eth`;
const NFT_URL = `${BASE_URL}/nft`;

export default function InstrumentOrder(): React.ReactElement {
  const match = useRouteMatch([ETH_URL, NFT_URL]);
  const location = useLocation();
  const history = useHistory();
  const ticker = new URLSearchParams(location.search).get("ticker");
  const styles = useStyles();
  const [synthPrice, setSynthPrice] = useState(0);

  const MINUTE_MS = 600000;

  useEffect(() => {
    if (ticker == null) {
      history.push(ETH_URL);
    }
    const interval = setInterval(async () => {
      const synthPrice = await loadSynthPrice("SynthTest1");
      setSynthPrice(synthPrice);
    }, MINUTE_MS);

    return () => clearInterval(interval);
  }, [ticker, history]);

  const { tradeData } = useContext(TradeContext);

  const instrument = tradeData?.instruments.find(
    (instrument) => instrument.ticker === ticker,
  );
  if (tradeData == null || instrument == null) {
    return <div />;
  }
  const onSwitch = (targetURL: string) => {
    if (targetURL === match?.url) {
      return;
    }
    history.push(`${targetURL}${location.search}`);
  };

  return (
    <>
      <ReturnButton onClick={() => history.push('/trade')} textValue="Back" />
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        {/* Since there are only 2 tabs, just hard code 0 or 1 as the selected tab */}
        <Tabs centered value={match?.url === ETH_URL ? 0 : 1}>
          <Tab label="Manage ETH Positions" onClick={() => onSwitch(ETH_URL)} />
          <Tab label="Manage NFT Positions" onClick={() => onSwitch(NFT_URL)} />
        </Tabs>
      </Box>
      <div
        style={{
          position: "relative",
          height: "max-content",
          paddingTop: "0.5rem",
          overflow: "auto",
          maxWidth: "47.67rem",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <Switch>
          <Route path="/mypage/manage/eth" exact>
            <InstrumentSell instrument={instrument} />
          </Route>
          <Route path="/mypage/manage/nft" exact>
            <ClaimDetail instrument={instrument} buttonName="reedem"/>
          </Route>
        </Switch>
      </div>
    </>
  );
}

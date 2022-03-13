import { makeStyles } from "@material-ui/core/styles";
import { tabUnstyledClasses } from "@mui/base/TabUnstyled";
import Box from "@mui/material/Box";
import TabUnstyled from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { styled } from "@mui/system";
import React, { useContext, useEffect } from "react";
import {
  Switch,
  Route,
  useRouteMatch,
  useHistory,
  useLocation,
} from "react-router-dom";

import theme from "./theme";
import InstrumentBuy from "@/InstrumentBuy";
import { TradeContext } from "@/TradeContext";

const Tab = styled(TabUnstyled)`
  color: white;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: bold;
  background-color: transparent;
  width: 100%;
  padding: 12px 16px;
  margin: 6px 6px;
  border: none;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  &.${tabUnstyledClasses.selected} {
    background-color: white;
    color: black;
  }
`;

const useStyles = makeStyles({
  currentTicker: {
    color: theme.activeTextColor,
    fontSize: "32pt",
  },
});

const TRADE_URL = "/trade";
const BASE_URL = `${TRADE_URL}/order`;
const BUY_URL = `${BASE_URL}/buy`;
const SELL_URL = `${BASE_URL}/sell`;

export default function InstrumentOrder(): React.ReactElement {
  const match = useRouteMatch([BUY_URL, SELL_URL]);
  const location = useLocation();
  const history = useHistory();
  const ticker = new URLSearchParams(location.search).get("ticker");
  const styles = useStyles();

  useEffect(() => {
    // Expect a ticker in the URL like "/trade/order/buy?ticker=NFT"
    // If no ticker found, route back to the "/trade"
    if (ticker == null) {
      history.push(TRADE_URL);
    }
  }, [ticker, history]);

  const { tradeData } = useContext(TradeContext);

  // We might need to change this when we have tons of instruments.
  // We might also want to better handle not found due to instruments loading or
  // not found due to the ticker does not exist.
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
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tabs centered value={match?.url === BUY_URL ? 0 : 1}>
          <Tab label="Buy" onClick={() => onSwitch(BUY_URL)} />
          <Tab label="Sell" onClick={() => onSwitch(SELL_URL)} />
        </Tabs>
      </Box>
      <div className={styles.currentTicker}>{ticker}</div>
      <Switch>
        <Route path="/trade/order/buy" exact>
          <InstrumentBuy instrument={instrument} />
        </Route>
        <Route path="/trade/order/sell">
          <div className={styles.currentTicker}>Sell</div>
        </Route>
      </Switch>
    </>
  );
}

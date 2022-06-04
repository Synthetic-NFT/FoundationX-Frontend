import { makeStyles } from "@material-ui/core/styles";
import { tabUnstyledClasses } from "@mui/base/TabUnstyled";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { Button, IconButton, Snackbar, Tooltip } from "@mui/material";
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

import theme from "../../../theme";
import { TradeContext } from "../../../TradeContext";
import { loadSynthPrice } from "../../../util/interact";
import FarmLong from "./FarmLong";
import FarmShort from "./FarmShort";

const Tab = styled(TabUnstyled)`
  color: white;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: bold;
  background-color: transparent;
  width: 100%;
  padding: 0.5rem 0.67rem;
  margin: 0.25rem 0.25rem;
  border: none;
  border-radius: 0.25rem;
  display: flex;
  justify-content: center;
  &.${tabUnstyledClasses.selected} {
    background-color: white;
    color: black;
  };
  height: 2rem;
`;

const useStyles = makeStyles({
  currentTicker: {
    color: theme.activeTextColor,
    fontSize: "32pt",
  },
});

const FARM_URL = "/farm";
const BASE_URL = `${FARM_URL}/order`;
const LONG_URL = `${FARM_URL}/long`;
const SHORT_URL = `${FARM_URL}/short`;

export default function InstrumentOrder(): React.ReactElement {
  const match = useRouteMatch([LONG_URL, SHORT_URL]);
  const location = useLocation();
  const history = useHistory();
  const ticker = new URLSearchParams(location.search).get("ticker");
  const styles = useStyles();
  const [synthPrice, setSynthPrice] = useState(0);

  const MINUTE_MS = 600000;

  useEffect(() => {
    if (ticker == null) {
      history.push(FARM_URL);
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
  
  const tabs = [
    {
      label: "Long",
      link: LONG_URL,
      tooltip: "Provide liquidity to receive LP tokens which are staked to earn MIR token rewards"
    },
    {
      label: "Short",
      link: SHORT_URL,
      tooltip: "Provide collateral to create short positions and earn MIR token rewards."
    },
  ];
  
  return (
    <>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tabs centered value={match?.url === LONG_URL ? 0 : 1}>
          {tabs.map((item, i) => {
                const tabDom = (
                <p>{item.label}
                  <Tooltip title={<h4>{item.tooltip}</h4>}>
                    <IconButton>
                      <HelpOutlineOutlinedIcon
                        sx={{ color: theme.tableHeaderTextColor }}
                      />
                    </IconButton>
                  </Tooltip>
                  </p>)
                return (
                  <Tab key={item.label} label={tabDom} onClick={()=>onSwitch(item.link)} />
                );
              })}
        </Tabs>
      </Box>
      <div
        style={{
          position: "relative",
          maxHeight: "100%",
          paddingTop: "0.5rem",
          overflow: "hidden",
          maxWidth: "47.67rem",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <Switch>
          <Route path="/farm/long" exact>
            <FarmLong instrument={instrument} />
          </Route>
          <Route path="/farm/short" exact>
            <FarmShort instrument={instrument} />
          </Route>
        </Switch>
      </div>
    </>
  );
}

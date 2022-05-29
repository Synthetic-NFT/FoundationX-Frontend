import { List } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import { Divider } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import React, { useCallback, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { routes, defaultRoute } from "./routeRegistry";
import logo from "./styles/images/logo.svg";
import theme from "./theme";

const useStyles = makeStyles({
  root: {
    background: "inherit",
    width: "17.5rem",
    display: "flex",
    flexDirection: "column",
  },
  active: {
    width: "10.83rem",
    height: "2.33rem",
    background: "linear-gradient(101.05deg, #951FBE -5.36%, #044695 29.46%, #440495 56.03%, #025FCD 81.92%)",
    borderRadius: "0.25rem",
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "1rem",
    lineHeight: "1.5rem",
    color: "#FFFFFF",
    padding: "0.67rem 1rem",
    margin: "0.33rem 0",
  },
  inactive: {
    maxWidth: "10.83rem",
    height: "1.5rem",
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "1rem",
    lineHeight: "1.5rem",
    color: "#FFFFFF",
    padding: "0.67rem 1rem",
    margin: "0.33rem 0",
  },
  logo: {
    cursor: "pointer",
    fontFamily: "Rubik",
    margin: "0.5rem",
    color: theme.activeTextColor,
  },
});

function Nav({
  path,
  label,
  icon: Icon,
}: {
  path: string;
  label: string;
  icon: string;
}): React.ReactElement {
  const styles = useStyles();

  const history = useHistory();
  const match = useRouteMatch(path);

  const onNav = useCallback(() => {
    // Note: click "Trade" when we are at `/trade/order` will route us to `/trade`
    history.push(path);
  }, [history, path]);

  // https://docs.nftsyprotocol.io/protocol/overview

  return (
    <ListItem 
      button 
      onClick={onNav} 
      className={match != null ? styles.active : styles.inactive}
      style={{marginTop: label === "Legal Docs" ? "4.17rem" : "0"}}
      >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <img src={Icon} alt={Icon} style={{height:"0.83rem", width:"0.83rem"}} />
        <div
          style={{
            marginRight: "1rem",
          }}
        />
        <div style={{
            width: "8.33rem",
          }}>{label}</div>
      </div>
    </ListItem>
  );
}

export default function LeftNav(): React.ReactElement {
  const styles = useStyles();
  const history = useHistory();
  const match = useRouteMatch({ path: "/", exact: true });
  useEffect(() => {
    if (match != null) {
      history.push(defaultRoute);
    }
  }, [history, match]);

  return (
    <div className={styles.root}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          paddingTop: "2.17rem",
          paddingLeft: "3.17rem",
        }}
      >
        <img src={logo} alt="Logo" style={{height:"2.75rem", width:"2.75rem"}}/>
        {/* <div className={styles.logo}>NFTSynth</div> */}
      </div>
      <List component="nav" aria-label="mailbox folders" style={{
          padding: "3rem 3.33rem",
        }}>
        {routes.map(({ path, label, icon }) => (
          <Nav key={path} path={path} label={label} icon={icon} />
        ))}
      </List>
    </div>
  );
}

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
    width: "420px",
    display: "flex",
    flexDirection: "column",
  },
  active: {
    width: "260px",
    height: "56px",
    background: "linear-gradient(101.05deg, #951FBE -5.36%, #044695 29.46%, #440495 56.03%, #025FCD 81.92%)",
    borderRadius: "6px",
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "24px",
    lineHeight: "36px",
    color: "#FFFFFF",
    padding: "16px 26px",
    margin: "8px 0px",
  },
  inactive: {
    maxWidth: "260px",
    height: "36px",
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "24px",
    lineHeight: "36px",
    color: "#FFFFFF",
    padding: "16px 26px",
    margin: "16px 0px",
  },
  logo: {
    cursor: "pointer",
    fontFamily: "Rubik",
    margin: "12px",
    fontSize: "16pt",
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

  return (
    <ListItem 
      button 
      onClick={onNav} 
      className={match != null ? styles.active : styles.inactive}
      style={{marginTop: label === "Legal Docs" ? "100px" : "0px"}}
      >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <img src={Icon} alt={Icon} height="20px" width="20px" />
        <div
          style={{
            marginRight: "26px",
          }}
        />
        <div>{label}</div>
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
          paddingTop: "52px",
          paddingLeft: "76px",
        }}
      >
        <img src={logo} alt="Logo" height="100px" width="100px" />
        {/* <div className={styles.logo}>NFTSynth</div> */}
      </div>
      <List component="nav" aria-label="mailbox folders" style={{
          padding: "72px 80px",
        }}>
        {routes.map(({ path, label, icon }) => (
          <Nav key={path} path={path} label={label} icon={icon} />
        ))}
      </List>
    </div>
  );
}

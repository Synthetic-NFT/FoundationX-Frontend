import { List } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import { Divider } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import React, { useCallback, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { routes, defaultRoute } from "./routeRegistry";
import logo from "./styles/images/logo.png";
import theme from "./theme";

const useStyles = makeStyles({
  root: {
    background: theme.leftNav,
    borderRight: `2px solid ${theme.boarder}`,
    width: "200px",
    display: "flex",
    flexDirection: "column",
  },
  active: {
    color: theme.activeTextColor,
    fontSize: "24pt",
  },
  inactive: {
    color: theme.inactiveTextColor,
    fontSize: "16pt",
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
  icon: OverridableComponent<any>;
}): React.ReactElement {
  const styles = useStyles();

  const history = useHistory();
  const match = useRouteMatch(path);

  const onNav = useCallback(() => {
    // Note: click "Trade" when we are at `/trade/order` will route us to `/trade`
    history.push(path);
  }, [history, path]);

  return (
    <ListItem button onClick={onNav}>
      <div className={match != null ? styles.active : styles.inactive}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon />
          <div
            style={{
              marginRight: "16px",
            }}
          />
          <div>{label}</div>
        </div>
      </div>
    </ListItem>
  );
}

export default function LeftNav(): React.ReactElement {
  const styles = useStyles();
  const history = useHistory();

  return (
    <div className={styles.root}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src={logo} alt="Logo" height="40px" width="40px" />
        <div className={styles.logo}>NFTSynth</div>
      </div>
      <Divider />
      <div
        style={{
          marginTop: "64px",
        }}
      />
      <List component="nav" aria-label="mailbox folders">
        {routes.map(({ path, label, icon }) => (
          <Nav key={path} path={path} label={label} icon={icon} />
        ))}
      </List>
    </div>
  );
}

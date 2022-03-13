import { List } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import { Divider } from "@mui/material";
import React, { useCallback, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { routes, defaultRoute } from "@/routeRegistry";
import theme from "@/theme";

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
    fontSize: "36pt",
  },
  inactive: {
    color: theme.inactiveTextColor,
    fontSize: "32pt",
  },
  logo: {
    cursor: "pointer",
    fontFamily: "Rubik",
    margin: "12px",
    fontSize: "25pt",
    color: theme.activeTextColor,
  },
});

function Nav({
  path,
  label,
}: {
  path: string;
  label: string;
}): React.ReactElement {
  const styles = useStyles();

  const history = useHistory();
  const match = useRouteMatch(path);

  const onNav = useCallback(() => {
    if (match == null) {
      history.push(path);
    }
  }, [history, match, path]);

  return (
    <ListItem button onClick={onNav}>
      <div className={match != null ? styles.active : styles.inactive}>
        {label}
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
      <div className={styles.logo}>Nftsynth</div>
      <Divider />
      <List component="nav" aria-label="mailbox folders">
        {routes.map(({ path, label }) => (
          <Nav key={path} path={path} label={label} />
        ))}
      </List>
    </div>
  );
}

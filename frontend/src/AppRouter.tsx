import { makeStyles } from "@material-ui/core";
import { Switch, Route } from "react-router-dom";

import { routes } from "./routeRegistry";
import theme from "./theme";

const useStyles = makeStyles({
  root: {
    display: "flex",
    overflowX: "hidden",
    alignItems: "center",
    flexDirection: "column",
    height: "fit-content",
    overflowY: "auto",
    marginBottom: "32px",
  },
  routeContainer: {
    width: "1024px",
    overflowY: "hidden",
  },
  title: {
    color: theme.activeTextColor,
    fontSize: "36pt",
    marginBottom: "32px",
  },
});

// This renders the container based on the current route.
// The routes are defined in routeRegistry.
function AppRouter() {
  const styles = useStyles();
  return (
    <Switch>
      {routes.map(({ path, RouteContainer, label }) => (
        <Route key={path} path={path}>
          <div className={styles.root}>
            <div className={styles.title}>{label}</div>
            <div className={styles.routeContainer}>
              <RouteContainer />
            </div>
          </div>
        </Route>
      ))}
    </Switch>
  );
}

export default AppRouter;

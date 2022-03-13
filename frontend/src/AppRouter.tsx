import { makeStyles } from "@material-ui/core";
import { Switch, Route } from "react-router-dom";

import { routes } from "@/routeRegistry";
import theme from "@/theme";

const useStyles = makeStyles({
  root: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    overflow: "hidden",
  },
  routeContainer: {
    width: "1024px",
    overflowY: "auto",
  },
  title: {
    color: theme.activeTextColor,
    fontSize: "36pt",
    marginBottom: "32px",
  },
});

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

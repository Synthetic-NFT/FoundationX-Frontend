import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { Switch, Route, BrowserRouter, HashRouter } from "react-router-dom";

import { AppContextProvider } from "./AppContext";
import AppRouter from "./AppRouter";
import LandingPage from "./LandingPage";
import LeftNav from "./LeftNav";
import theme from "./theme";
import TopBar from "./TopBar";
import { TradeContextProvider } from "./TradeContext";

const useStyles = makeStyles({
  featureRoot: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
    "& code": {
      fontFamily: "source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace"
    }
  },
  right: {
    display: "flex",
    height: "100%",
    flexGrow: 1,
    flexDirection: "column",
    overflow: "hidden",
  },
  router: {
    display: "flex",
    background: theme.routeContainer,
    justifyContent: "center",
    flexGrow: 1,
    width: "100%",
    padding: "24px 24px 0px 24px",
    overflowY: "scroll",
  },
});

// The top level component of the app
function AppDetails(): React.ReactElement {
  const styles = useStyles();

  return (
      <Switch>
        <Route path="/" exact>
          <LandingPage />
        </Route>
        <Route path="*">
          <AppContextProvider>
            <TradeContextProvider>
              <div className={styles.featureRoot}>
                <LeftNav />
                <div className={styles.right}>
                  <TopBar />
                  <div className={styles.router}>
                    <AppRouter />
                  </div>
                </div>
              </div>
            </TradeContextProvider>
          </AppContextProvider>
        </Route>
      </Switch>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppDetails />
    </BrowserRouter>
  );
}

export default App;

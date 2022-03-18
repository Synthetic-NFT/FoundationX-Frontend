import { makeStyles } from "@material-ui/core/styles";
import { HashRouter } from "react-router-dom";

import { AppContextProvider } from "./AppContext";
import AppRouter from "./AppRouter";
import LeftNav from "./LeftNav";
import theme from "./theme";
import TopBar from "./TopBar";
import { TradeContextProvider } from "./TradeContext";

const useStyles = makeStyles({
  root: {
    display: "flex",
    height: "100vh",
    width: "100vw",
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
    overflowY: "auto",
  },
});

// The top level component of the app
function App() {
  const styles = useStyles();

  return (
    <AppContextProvider>
      <TradeContextProvider>
        <HashRouter>
          <div className={styles.root}>
            <LeftNav />
            <div className={styles.right}>
              <TopBar />
              <div className={styles.router}>
                <AppRouter />
              </div>
            </div>
          </div>
        </HashRouter>
      </TradeContextProvider>
    </AppContextProvider>
  );
}

export default App;

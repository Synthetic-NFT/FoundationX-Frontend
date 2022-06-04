import { makeStyles } from "@material-ui/core/styles";
import { HashRouter } from "react-router-dom";

import { AppContextProvider } from "./AppContext";
import AppRouter from "./AppRouter";
import LeftNav from "./LeftNav";
import theme from "./theme";
import TopBar from "./TopBar";
import { TradeContextProvider } from "./TradeContext";

// background: "radial-gradient(50% 50% at 90% 10%, rgba(19, 104, 232, 0.43) 0%, rgba(0, 0, 0, 0) 100%), radial-gradient(50% 50% at 10% 90%, #1368E8 0%, rgba(0, 0, 0, 0) 100%)",
const useStyles = makeStyles({
  root: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    background: "radial-gradient(20% 40% at 10% 90%, #1368E8 0%, rgba(0, 0, 0, 0) 100%)",
  },
  right: {
    display: "flex",
    height: "100%",
    flexGrow: 1,
    flexDirection: "column",
    overflow: "hidden",
  },
  router: {
    // display: "flex",
    background: "inherit",
    justifyContent: "center",
    // flexGrow: 1,
    width: "100%",
    padding: "1rem 2.5rem 0 2.5rem",
    overflow: "auto",
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

import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useContext, useEffect, useState } from "react";

import api from "./api";
import { AppContext } from "./AppContext";
import theme from "./theme";
import { connectWallet, getCurrentWalletConnected } from "./util/interact";

const useStyles = makeStyles({
  root: {
    background: theme.topBar,
  },
  spacer: {
    flexGrow: 1,
  },
});

export default function TopBar(): React.ReactElement {
  const { appData, setAppData } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const { walletAddress, setWallet } = useContext(AppContext);
  const [status, setStatus] = useState("");

  const styles = useStyles();

  function addWalletListener() {
    if ((window as any).ethereum) {
      (window as any).ethereum.on(
        "accountsChanged",
        (accounts: string | any[]) => {
          if (accounts.length > 0) {
            setWallet(accounts[0]);
            setStatus("👆🏽 Write a message in the text-field above.");
          } else {
            setWallet("");
            setStatus("🦊 Connect to Metamask using the top right button.");
          }
        },
      );
    } else {
      setStatus("Not installed");
    }
  }

  useEffect(() => {
    const setWalletAndStatus = async () => {
      const { address, status } = await getCurrentWalletConnected();
      setWallet(address);
      setStatus(status);
    };
    setWalletAndStatus();
    addWalletListener();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  return (
    <AppBar position="static">
      <Toolbar className={styles.root}>
        <div className={styles.spacer} />
        {loading ? (
          <CircularProgress />
        ) : (
          // <Button
          //   color="inherit"
          //   onClick={() => {
          //     // we don't want to send duplicated request for connecting wallet.
          //     if (loading) {
          //       return;
          //     }
          //     setLoading(true);
          //
          //     // disconnect
          //     if (appData != null) {
          //       setAppData(null);
          //       api.disconnect().then(() => setLoading(false));
          //       return;
          //     }
          //
          //     // connect
          //     api.connect().then((newAppData) => {
          //       setLoading(false);
          //       setAppData(newAppData);
          //     });
          //   }}
          // >
          //   {appData?.userName ?? "Not Connected"}
          // </Button>
          <Button
            color="inherit"
            id="walletButton"
            onClick={connectWalletPressed}
          >
            {walletAddress.length > 0 ? (
              `Connected: ${String(walletAddress).substring(0, 6)}...${String(
                walletAddress,
              ).substring(38)}`
            ) : (
              <span>Connect Wallet</span>
            )}
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

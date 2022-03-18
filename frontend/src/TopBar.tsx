import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useContext, useState } from "react";

import api from "./api";
import { AppContext } from "./AppContext";
import theme from "./theme";

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
  const styles = useStyles();
  return (
    <AppBar position="static">
      <Toolbar className={styles.root}>
        <div className={styles.spacer} />
        {loading ? (
          <CircularProgress />
        ) : (
          <Button
            color="inherit"
            onClick={() => {
              // we don't want to send duplicated request for connecting wallet.
              if (loading) {
                return;
              }
              setLoading(true);

              // disconnect
              if (appData != null) {
                setAppData(null);
                api.disconnect().then(() => setLoading(false));
                return;
              }

              // connect
              api.connect().then((newAppData) => {
                setLoading(false);
                setAppData(newAppData);
              });
            }}
          >
            {appData?.userName ?? "Not Connected"}
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

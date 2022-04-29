import {
  Container,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import LoopIcon from "@material-ui/icons/Loop";
import SwapVerticalCircleIcon from "@material-ui/icons/SwapVerticalCircle";
import React, { useEffect } from "react";

import LoadingButton from "../components/LoadingButton";
import {AUTONITYCoins, GÖRLICoins} from "../constants/coins";
import CoinDialog from "./CoinDialog";
import CoinField from "./CoinField";

const styles = (theme: { spacing: (arg0: number) => any; }) => ({
  paperContainer: {
    borderRadius: theme.spacing(2),
    padding: theme.spacing(1),
    paddingBottom: theme.spacing(3),
  },
  switchButton: {
    zIndex: 1,
    margin: "-16px",
    padding: theme.spacing(0.5),
  },
  fullWidth: {
    width: "100%",
  },
  title: {
    textAlign: "center",
    padding: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
  },
  hr: {
    width: "100%",
  },
  balance: {
    padding: theme.spacing(1),
    overflow: "wrap",
    textAlign: "center",
  },
  footer: {
    marginTop: "285px",
  },
});

// @ts-ignore
const useStyles = makeStyles(styles);

function CoinSwapper(props: any) : React.ReactElement{
  const classes = useStyles();

  // Stores a record of whether their respective dialog window is open
  const [dialog1Open, setDialog1Open] = React.useState(false);
  const [dialog2Open, setDialog2Open] = React.useState(false);
  const [wrongNetworkOpen, setwrongNetworkOpen] = React.useState(false);

  interface CoinInterface {
    address: string|undefined;
    symbol: string|undefined;
    balance: number|undefined;
  }
  // Stores data about their respective coin
  const [coin1, setCoin1] = React.useState<CoinInterface>({
    address: undefined,
    symbol: undefined,
    balance: undefined,
  });
  const [coin2, setCoin2] = React.useState<CoinInterface>({
    address: undefined,
    symbol: undefined,
    balance: undefined,
  });

  // Stores the current reserves in the liquidity pool between coin1 and coin2
  const [reserves, setReserves] = React.useState(["0.0", "0.0"]);

  // Stores the current value of their respective text box
  const [field1Value, setField1Value] = React.useState("");
  const [field2Value, setField2Value] = React.useState("");

  // Controls the loading button
  const [loading, setLoading] = React.useState(false);

  // Switches the top and bottom coins, this is called when users hit the swap button or select the opposite
  // token in the dialog (e.g. if coin1 is TokenA and the user selects TokenB when choosing coin2)
  const switchFields = () => {
    setCoin1(coin2);
    setCoin2(coin1);
    setField1Value(field2Value);
    setReserves(reserves.reverse());
  };

  // These functions take an HTML event, pull the data out and puts it into a state variable.
  const handleChange = {
    field1: (e: any) => {
      setField1Value(e.target.value);
    },
  };

  // Turns the account's balance into something nice and readable
  const formatBalance = (balance: any, symbol: any) => {
    if (balance && symbol)
      return `${parseFloat(balance).toPrecision(8)  } ${  symbol}`;
    return "0.0";
  };

  // Turns the coin's reserves into something nice and readable
  const formatReserve = (reserve: any, symbol: any) => {
    if (reserve && symbol) return `${reserve  } ${  symbol}`;
    return "0.0";
  };

  // Determines whether the button should be enabled or not
  const isButtonEnabled = () => {

    // If both coins have been selected, and a valid float has been entered which is less than the user's balance, then return true
    const parsedInput1 = parseFloat(field1Value);
    const parsedInput2 = parseFloat(field2Value);

    return (
      coin1.address &&
      coin2.address &&
      !Number.isNaN(parsedInput1) &&
      !Number.isNaN(parsedInput2) &&
      parsedInput1 > 0 &&
      // @ts-ignore
      parsedInput1 <= coin1.balance
    );
  };


  // This hook creates a timeout that will run every ~10 seconds, it's role is to check if the user's balance has
  // updated has changed. This allows them to see when a transaction completes by looking at the balance output.
  useEffect(() => {
    const coinTimeout = setTimeout(() => {
      console.log('props: ', props);
      console.log("Checking balances...");

      return () => clearTimeout(coinTimeout);
    });
  })

  const onToken1Selected = (address: string, name: string) => {
    // Close the dialog window
    setDialog1Open(false);

    // If the user inputs the same token, we want to switch the data in the fields
    if (address === coin2.address) {
      switchFields();
    }
    // We only update the values if the user provides a token
    else if (address) {
      // Getting some token data is async, so we need to wait for the data to return, hence the promise
      setCoin1({
        address,
        symbol: name,
        balance: 1000,
      });
    }
  };

  const onToken2Selected = (address: string, name: string) => {
    // Close the dialog window
    setDialog2Open(false);

    // If the user inputs the same token, we want to switch the data in the fields
    if (address === coin1.address) {
      switchFields();
    }
    // We only update the values if the user provides a token
    else if (address) {
      // Getting some token data is async, so we need to wait for the data to return, hence the promise
      setCoin2({
        address,
        symbol: name,
        balance: 1000,
      });
    }
  };

  // @ts-ignore
  return (
    <div>
      {/* Dialog Windows */}
      <CoinDialog
        open={dialog1Open}
        onClose={onToken1Selected}
        coins={AUTONITYCoins}
        signer="placeholder"
      />
      <CoinDialog
        open={dialog2Open}
        onClose={onToken2Selected}
        coins={GÖRLICoins}
        signer="placeholder"
      />
      {/* Coin Swapper */}
      <Container maxWidth="xs">
        <Paper className={classes.paperContainer}>
          <Typography variant="h5" className={classes.title}>
            Swap Coins
          </Typography>

          <Grid container direction="column" alignItems="center" spacing={2}>
            <Grid item xs={12} className={classes.fullWidth}>
              <CoinField
                activeField
                value={field1Value}
                onClick={() => setDialog1Open(true)}
                onChange={handleChange.field1}
                symbol={coin1.symbol !== undefined ? coin1.symbol : "Select"}
              />
            </Grid>

            <IconButton onClick={switchFields} className={classes.switchButton}>
              <SwapVerticalCircleIcon fontSize="medium" />
            </IconButton>

            <Grid item xs={12} className={classes.fullWidth}>
              <CoinField
                activeField={false}
                value={field2Value}
                onClick={() => setDialog2Open(true)}
                symbol={coin2.symbol !== undefined ? coin2.symbol : "Select"}
              />
            </Grid>

            <hr className={classes.hr} />

            {/* Balance Display */}
            <Typography variant="h6">Your Balances</Typography>
            <Grid container direction="row" justifyContent="space-between">
              <Grid item xs={6}>
                <Typography variant="body1" className={classes.balance}>
                  {formatBalance(coin1.balance, coin1.symbol)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" className={classes.balance}>
                  {formatBalance(coin2.balance, coin2.symbol)}
                </Typography>
              </Grid>
            </Grid>

            <hr className={classes.hr} />

            {/* Reserves Display */}
            <Typography variant="h6">Reserves</Typography>
            <Grid container direction="row" justifyContent="space-between">
              <Grid item xs={6}>
                <Typography variant="body1" className={classes.balance}>
                  {formatReserve(reserves[0], coin1.symbol)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" className={classes.balance}>
                  {formatReserve(reserves[1], coin2.symbol)}
                </Typography>
              </Grid>
            </Grid>

            <hr className={classes.hr} />

            <LoadingButton
              loading={loading}
              valid={isButtonEnabled()}
              success={false}
              fail={false}
            >
              <LoopIcon />
              Swap
            </LoadingButton>
          </Grid>
        </Paper>
      </Container>

      <Grid
        container
        className={classes.footer}
        direction="row"
        justifyContent="center"
        alignItems="flex-end"
      >
        <p>
        Alternative Uniswap Interface | Get AUT for use in the bakerloo testnet{" "}
          <a href="https://faucet.bakerloo.autonity.network/">here</a>
        </p>
      </Grid>
    </div>
  );
};

export default CoinSwapper;
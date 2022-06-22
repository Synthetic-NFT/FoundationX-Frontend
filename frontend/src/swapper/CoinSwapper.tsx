import {
  Container,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Typography,
  Button, Select, MenuItem
} from "@material-ui/core";
import InputBase from '@material-ui/core/InputBase';
import { withStyles } from "@material-ui/core/styles";
import SwapVerticalCircleIcon from "@material-ui/icons/SwapVerticalCircle";
import React, { useEffect, useContext } from "react";

import {
  blockchainAPI,
  getTradableCoinInfo,
  CoinInterface,
  defaultInstrument,
  TradeData,
  ethCoin,
  getCoinFromInstrument
} from "../api";
import { AppContext } from "../AppContext";
import LoadingButton from "../components/LoadingButton";
import { SearchInput } from '../components/SearchInput'
import { AUTONITYCoins, GÖRLICoins, DummyCoins } from "../constants/coins";
import { fakeTradeData } from "../fakeData";
import { TradeContext } from "../TradeContext";
import { getAmountETHOut, getAmountSynthOut, readWalletTokenBalance, simpleSwapExactETHForTokens, simpleSwapExactTokensForETH } from "../util/interact";
import CoinDialog from "./CoinDialog";
import CoinField from "./CoinField";
import SwapperCard from "./SwapperCard";

const styles = (theme: { spacing: (arg0: number) => any; }) => ({
  paperContainer: {
    // padding: theme.spacing(1),
    paddingBottom: theme.spacing(3),
    background: "linear-gradient(160.35deg, rgba(31, 30, 35, 0.6) 13.15%, #25283C 93.23%)",
    borderRadius: "0.83rem",
    border: "1px solid #ffffff",
    padding: "1.67rem 2.17rem",
  },
  switchButton: {
    zIndex: 1,
    margin: "-0.67rem",
    padding: theme.spacing(0.5),
  },
  fullWidth: {
    width: "100%",
  },
  title: {
    textAlign: "center",
    // padding: theme.spacing(0.5),
    // marginBottom: theme.spacing(1),
    fontWeight: 600,
    fontSize: "1.25rem",
    lineHeight: "1.875rem",
    color: "#FFFFFF",
    marginBottom: "1.75rem",
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
    marginTop: "11.875rem",
  },
  from: {
    fontWeight: 400,
    fontSize: "0.58rem",
    lineHeight: "1rem",
    color: "#FFFFFF",
    marginLeft: "0.33rem",
  },
  formControl: {
    display: "flex !important",
    marginTop: "1.5rem !important",
    '& svg': {
      color: '#ffffff',
    },
  }
});

// @ts-ignore
const useStyles = makeStyles(styles);



function CoinSwapper(props: any): React.ReactElement {
  const classes = useStyles();

  const { instrument } = props;
  const { tradeData } = useContext(TradeContext);
  const [availableCoin, setAvailableCoin] = React.useState<CoinInterface[]>(getTradableCoinInfo(tradeData));
  const { walletAddress, setWallet } = useContext(AppContext);
  // const availbleCoinIn = DummyCoins;
  // const availbleCoinOut = DummyCoins;

  // Stores a record of whether their respective dialog window is open
  const [dialog1Open, setDialog1Open] = React.useState(false);
  const [dialog2Open, setDialog2Open] = React.useState(false);
  const [wrongNetworkOpen, setwrongNetworkOpen] = React.useState(false);


  // Stores data about their respective coin
  const [coin1, setCoin1] = React.useState<CoinInterface>(ethCoin);
  const [coin2, setCoin2] = React.useState<CoinInterface>(getCoinFromInstrument(instrument));

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
      return `${parseFloat(balance).toPrecision(8)} ${symbol}`;
    return "0.0";
  };

  // Turns the coin's reserves into something nice and readable
  const formatReserve = (reserve: any, symbol: any) => {
    if (reserve && symbol) return `${reserve} ${symbol}`;
    return "0.0";
  };

  // Determines whether the button should be enabled or not
  const isButtonEnabled = () => {

    // If both coins have been selected, and a valid float has been entered which is less than the user's balance, then return true
    const parsedInput1 = parseFloat(field1Value);
    const parsedInput2 = parseFloat(field2Value);

    return (
      (coin1.name === "Ethereum" ||
        coin2.name === "Ethereum") &&
      !Number.isNaN(parsedInput1) &&
      !Number.isNaN(parsedInput2) &&
      parsedInput1 > 0 &&
      // @ts-ignore
      parsedInput1 <= coin1.balance
    );
  };

  useEffect(() => {
    const availableCoins = getTradableCoinInfo(tradeData);
    setAvailableCoin(availableCoins);
    if(availableCoins[0]){
      readWalletTokenBalance(walletAddress, availableCoins[0].name).then((data) => {
        setCoin1({
          ...availableCoins[0],
          balance: data.toNumber(),
        });
      })    }
    if(availableCoins[1]){
      readWalletTokenBalance(walletAddress, availableCoins[1].name).then((data) => {
        setCoin2({
          ...availableCoins[1],
          balance: data.toNumber(),
        });
      });
    }
  }, [tradeData, walletAddress]);

  useEffect(() => {
    if (Number.isNaN(parseFloat(field1Value))) {
      setField2Value("");
    } else if (parseFloat(field1Value) && coin1.name === "Ethereum" && coin2.name) {
      getAmountSynthOut(coin2.name, field1Value).then(
        (amount) => setField2Value(amount.toFixed(7))
      ).catch((e: any) => {
        console.log(e);
        setField2Value("NA");
      })
    } else if (parseFloat(field1Value) && coin2.name === "Ethereum" && coin1.name) {
      getAmountETHOut(coin1.name, field1Value).then(
        (amount) => setField2Value(amount.toFixed(7))
      ).catch((e: any) => {
        console.log(e);
        setField2Value("NA");
      })
    } else {
      setField2Value("");
    }
  }, [field1Value, coin1, coin2]);


  // This hook creates a timeout that will run every ~10 seconds, it's role is to check if the user's balance has
  // updated has changed. This allows them to see when a transaction completes by looking at the balance output.
  useEffect(() => {
    const coinTimeout = setTimeout(() => {
      console.log('props: ', props);
      console.log("Checking balances...");

      return () => clearTimeout(coinTimeout);
    });
  });

  const onToken1Selected = (address: string, name: string, symbol: string) => {
    // Close the dialog window
    setDialog1Open(false);

    // If the user inputs the same token, we want to switch the data in the fields
    if (address === coin2.address) {
      switchFields();
    }
    // We only update the values if the user provides a token
    else if (address) {
      // Getting some token data is async, so we need to wait for the data to return, hence the promise
      readWalletTokenBalance(walletAddress, name).then((data) => {
        setCoin1({
          address,
          name,
          symbol,
          balance: data.toNumber(),
        });
      })
    }
    else if (name === "Ethereum") {
      readWalletTokenBalance(walletAddress, name).then((data) => {
        setCoin1({
          ... ethCoin,
          balance: data.toNumber(),
        });
      })
    }
  };

  const onToken2Selected = (address: string, name: string, symbol: string) => {
    // Close the dialog window
    setDialog2Open(false);

    // If the user inputs the same token, we want to switch the data in the fields
    if (address === coin1.address) {
      switchFields();
    }
    // We only update the values if the user provides a token
    else if (address) {
      // Getting some token data is async, so we need to wait for the data to return, hence the promise
      readWalletTokenBalance(walletAddress, name).then((data) => {
        setCoin2({
          address,
          name,
          symbol,
          balance: data.toNumber(),
        });
      })
    }
    else if (name === "Ethereum") {
      readWalletTokenBalance(walletAddress, name).then((data) => {
        setCoin1({
          ... ethCoin,
          balance: data.toNumber(),
        });
      })
    }
  };
  // const getCurrentInstrument = () => {
  //   let currInstrument;
  //   if (coin1.name !== "Ethereum") {
  //     currInstrument = tradeData?.instruments.find((instrument) => instrument.ticker === coin1.name) || defaultInstrument;
  //   } else {
  //     currInstrument = tradeData?.instruments.find((instrument) => instrument.ticker === coin2.name) || defaultInstrument;
  //   }
  //   return currInstrument;
  // }


  const swapNow = async () => {
    if (coin1.name !== "Ethereum") {
      if (coin1.symbol !== undefined) {
        const result = await simpleSwapExactTokensForETH(walletAddress, field1Value, coin1.symbol);
        console.log("simpleSwapExactTokensForETH", result)
      } else {
        console.log("[Error] coin1.symbol is undefined");
      }
    } else if (coin2.symbol !== undefined) {
      const result = await simpleSwapExactETHForTokens(walletAddress, field1Value, coin2.symbol);
      console.log("simpleSwapExactTokensForETH", result)
    } else {
      console.log("[Error] coin2.symbol is undefined");
    }
  }

  // @ts-ignore
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
    }}>
      {/* Dialog Windows */}
      <CoinDialog
        open={dialog1Open}
        onClose={onToken1Selected}
        coins={availableCoin}
        signer="placeholder"
      />
      <CoinDialog
        open={dialog2Open}
        onClose={onToken2Selected}
        coins={availableCoin}
        signer="placeholder"
      />
      <div style={{ display: "flex", flexDirection: "row", height: "max-content", width: "21.75rem" }}>
        <Container style={{ display: "flex", margin: 0, padding: 0 }}>
          <Paper style={{ flex: 1 }} className={classes.paperContainer}>
            <Typography variant="h5" className={classes.title}>
              Token Swap
            </Typography>

            <Grid container direction="column" spacing={2}>
              <div className={classes.from}>From</div>
              <Grid item xs={12} className={classes.fullWidth}>
                <CoinField
                  activeField
                  value={field1Value}
                  onClick={() => setDialog1Open(true)}
                  onChange={handleChange.field1}
                  symbol={coin1.symbol !== undefined ? coin1.symbol : "Select"}
                />
                {/* <div style={{ display: "flex" }}>
                  <SearchInput />
                </div> */}
              </Grid>

              <IconButton onClick={switchFields} className={classes.switchButton}>
                <SwapVerticalCircleIcon fontSize="medium" style={{ fill: "#ffffff" }} />
              </IconButton>
              <div className={classes.from}>To</div>
              <Grid item xs={12} className={classes.fullWidth}>
                <CoinField
                  activeField={false}
                  value={field2Value}
                  onClick={() => setDialog2Open(true)}
                  symbol={coin2.symbol !== undefined ? coin2.symbol : "Select"}
                />
                {/* <div style={{ display: "flex" }}>
                  <SearchInput />
                </div> */}
              </Grid>

              <div style={{
                marginLeft: "1rem",
              }}>
                {/*<div style={{*/}
                {/*  fontWeight: 600,*/}
                {/*  fontSize: "0.83rem",*/}
                {/*  lineHeight: "1.25rem",*/}
                {/*  color: "#FFFFFF",*/}
                {/*  marginTop: "2rem",*/}
                {/*}}>*/}
                {/*  Crypto Punks*/}
                {/*</div>*/}
                {/*<div style={{*/}
                {/*  fontWeight: 400,*/}
                {/*  fontSize: "0.58rem",*/}
                {/*  lineHeight: "0.875rem",*/}
                {/*  color: "#FFFFFF",*/}
                {/*  marginTop: "0.42rem",*/}
                {/*  marginBottom: "2rem",*/}
                {/*}}>*/}
                {/*  {getCurrentInstrument().address}*/}
                {/*</div>*/}
              </div>

              <Button
                size="large"
                variant="text"
                style={{
                  background: "linear-gradient(97.27deg, #2F038C 44.35%, #0837A5 70.76%)",
                  borderRadius: "0.42rem",
                  fontWeight: 600,
                  fontSize: "0.83rem",
                  lineHeight: "1rem",
                  color: "#FFFFFF",
                  height: "3rem",
                  marginLeft: "0.33rem",
                }}
                onClick={() => {
                  swapNow()
                }}
              >
                Swap Now
              </Button>
            </Grid>
          </Paper>

          {/* <Paper style={{ flex: 1 }} className={classes.paperContainer}>
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
          </Paper> */}
          {/* <SwapperCard cardWidth="1" instrument={getCurrentInstrument()} /> */}
        </Container>
      </div>

      {/* <Grid
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
      </Grid> */}
    </div>
  );
};

export default CoinSwapper;
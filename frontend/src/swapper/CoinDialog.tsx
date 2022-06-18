import {
  Button,
  Dialog,
  Grid,
  IconButton,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import * as COLORS from "@material-ui/core/colors";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import PropTypes from "prop-types";
import React from "react";

import { TradeData, Instrument } from "../api";
import CoinButton from "./CoinButton";

const styles = (theme: { spacing: (arg0: number) => any; }) => ({
  dialogContainer: {
    borderRadius: theme.spacing(2),
  },
  titleSection: {
    padding: theme.spacing(2),
  },
  titleText: {
    alignSelf: "center",
  },
  hr: {
    margin: 0,
  },
  address: {
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5),
    paddingBottom: theme.spacing(2),
  },
  coinList: {
    height: "12.5rem",
    overflow: "scroll",
  },
  coinContainer: {
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    paddingTop: theme.spacing(2),
    marginTop: theme.spacing(2),
    overflow: "hidden",
  },
  action: {
    margin: 0,
    padding: theme.spacing(1),
    backgroundColor: COLORS.grey[100],
  },
});

const useStyles = makeStyles(styles);

// This is a modified version of MaterialUI's DialogTitle component, I've added a close button in the top right corner
// const DialogTitle = withStyles(styles)((props) => 

// );

function DialogTitle(props: any) {
  const classes = useStyles();
  const { children, onClose } = props;
  return (
    <MuiDialogTitle
      disableTypography
      className={classes.titleSection}
    >
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignContent="center"
      >
        <Typography variant="h6" className={classes.titleText}>
          {children}
        </Typography>
        {onClose ? (
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </Grid>
    </MuiDialogTitle>
  );
}

DialogTitle.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.string,
};

DialogTitle.defaultProps = {
  children: '',
};

// This is a modified version of MaterialUI's DialogActions component, the color has been changed by modifying the CSS
// const DialogActions = withStyles((theme) => ({
//   root: {
//     margin: 0,
//     padding: theme.spacing(1),
//     backgroundColor: COLORS.grey[100],
//   },
// }))(MuiDialogActions);

function DialogActions(props: any) {
  const classes = useStyles();
  return (
    <MuiDialogActions className={classes.action} />
  );
}

function CoinDialog(props: any) {
  // The CoinDialog component will display a dialog window on top of the page, allowing a user to select a coin
  // from a list (list can be found in 'src/constants/coins.js') or enter an address into a search field. Any entered
  // addresses will first be validated to make sure they exist.
  // When the dialog closes, it will call the `onClose` prop with 1 argument which will either be undefined (if the
  // user closes the dialog without selecting anything), or will be a string containing the address of a coin.

  const classes = useStyles();
  const { onClose, open, coins, signer } = props;

  const [address, setAddress] = React.useState("");
  const [error, setError] = React.useState("");


  // Resets any fields in the dialog (in case it's opened in the future) and calls the `onClose` prop
  const exit = (value: string|undefined, name: string|undefined) => {
    setError("");
    setAddress("");
    onClose(value, name);
  };

  // Called when the user tries to input a custom address, this function will validate the address and will either
  // then close the dialog and return the validated address, or will display an error.
  const submit = () => {
    exit("placeholder", "placeholder");
  };

  return (
    <Dialog
      open={open}
      onClose={() => exit(undefined, undefined)}
      fullWidth
      maxWidth="sm"
      classes={{ paper: classes.dialogContainer }}
    >

      <DialogTitle onClose={() => exit(undefined, undefined)}>Select Coin</DialogTitle>
      <div className={classes.coinContainer}>
        <Grid container direction="column" spacing={1} alignContent="center">
          <Grid item className={classes.coinList}>
            <Grid container direction="column">
              {/* Maps all of the tokens in the constants file to buttons */}
              {coins.map((coin: {name:string, symbol:string, address:string}) => (
                <Grid item key={coin.name} xs={12}>
                  <CoinButton
                    coinName={coin.name}
                    coinAbbr={coin.symbol}
                    onClick={() => exit(coin.address, coin.name)}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Dialog>
  );
}

CoinDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  coins: PropTypes.array.isRequired,
  signer: PropTypes.string.isRequired,
};

export default CoinDialog;

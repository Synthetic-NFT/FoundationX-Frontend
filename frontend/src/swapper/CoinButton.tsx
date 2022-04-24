import { ButtonBase, Grid, makeStyles, Typography } from "@material-ui/core";
import * as COLORS from "@material-ui/core/colors";
import PropTypes from "prop-types";
import React from "react";

const useStyles = makeStyles((theme) => ({
  button: {
    width: "100%",
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    "&:hover, &$focusVisible": {
      backgroundColor: COLORS.grey[200],
    },
  },
  coinName: {
    opacity: 0.6,
  },
}));



export default function CoinButton(props: { [x: string]: any; coinName: any; coinAbbr: any; onClick: any; }) {
  const { coinName, coinAbbr, onClick, ...other } = props;
  const classes = useStyles();

  return (
    <ButtonBase focusRipple className={classes.button} onClick={onClick}>
      <Grid container direction="column">
        <Typography variant="h6">{coinAbbr}</Typography>
        <Typography variant="body2" className={classes.coinName}>
          {coinName}
        </Typography>
      </Grid>
    </ButtonBase>
  );
}
CoinButton.propTypes = {
  coinName: PropTypes.string.isRequired,
  coinAbbr: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
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

import Ethereum from "../styles/images/Ethereum.svg";
import Card from "./Card"

const styles = (theme: { spacing: (arg0: number) => any; }) => ({
  dialogContainer: {
    background: "linear-gradient(160.35deg, rgba(58, 56, 65, 1) 13.15%, #25283C 93.23%)",
    borderRadius: "1rem",
    width: "35rem",
    height: "20rem",
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
    paddingLeft: "3rem",
    paddingRight: "3rem",
    paddingBottom: "3rem",
    marginTop: theme.spacing(2),
    overflow: "hidden",
    display: "flex",
  },
  action: {
    margin: 0,
    padding: theme.spacing(1),
    backgroundColor: COLORS.grey[100],
  },
  name: {
    fontWeight: 600,
    fontSize: "1.67rem",
    lineHeight: "2.5rem",    
    color: "#FFFFFF",
    paddingBottom: "0.33rem",
  },
  id: {
    fontWeight: 400,
    fontSize: "0.83rem",
    lineHeight: "1.25rem",    
    color: "#FFFFFF",
    paddingBottom: "1.67rem",
  },
  price: {
    fontWeight: 600,
    fontSize: "1rem",
    lineHeight: "1.5rem",    
    color: "#FFFFFF",
    paddingBottom: "1rem",
  },
  button: {    
    padding: "10px 25px",
    width: "5.5rem",
    height: "1.5rem",
    background: "#3D4859",
    borderRadius: "0.125rem",
    fontWeight: 400,
    fontSize: "0.67rem",
    lineHeight: "1rem",    
    color: "#FFFFFF",
  },
  close: {
    backgroundColor: "#3F3F55",
    width: "2.25rem",
    height: "2.25rem",
    color: "#7B7B9A",
  }
});

const useStyles = makeStyles(styles);

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
          <IconButton aria-label="close" onClick={onClose} className={classes.close}>
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

function CardDialog(props: any) {

  const classes = useStyles();
  const { onClose, data } = props;

  const exit = (value: string|undefined, name: string|undefined) => {
    onClose(value, name);
  };

  return (
    <Dialog
      open={data.id}
      onClose={() => exit(undefined, undefined)}
      fullWidth
      maxWidth="sm"
      classes={{ paper: classes.dialogContainer }}
    >
      <DialogTitle onClose={() => exit(undefined, undefined)}> </DialogTitle>
      <div className={classes.coinContainer}>
        <Card>
          <img src={data.img} alt="Ethereum" style={{height:"10rem", width:"10rem"}} />
        </Card>
        <div style={{marginLeft: "1.5rem"}}>
          <div className={classes.name}>{data.name}</div>          
          <div className={classes.id}>#{data.id}</div>
          <div className={classes.price}>Floor Price: {data.price}</div>
          <Button
            className={classes.button}
            size="small"
            variant="contained"
          >
            Claim
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export default CardDialog;

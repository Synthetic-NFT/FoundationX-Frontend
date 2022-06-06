import { Button, CircularProgress, makeStyles } from "@material-ui/core";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";
import React from "react";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    margin: 0,
    position: "relative",
  },
  progress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function LoadingButton(props: any) {
  const classes = useStyles();
  const { children, loading, valid, success, fail, onClick, ...other } = props;
  return (
    <div className={classes.wrapper}>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading || !valid}
        type="submit"
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
        onClick={onClick}
        // {...other}
      >
        {children}
      </Button>
      {loading && <CircularProgress size={24} className={classes.progress} />}
    </div>
  );
}

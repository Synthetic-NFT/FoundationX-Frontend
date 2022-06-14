import { Button, CircularProgress, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
    root: {
        borderRadius: "0.83rem",
        clipPath: "inset(0 round 0.83rem)",
        backgroundClip: "padding-box, border-box",
        backgroundOrigin: "padding-box, border-box",
        backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0))",
    },
  }));

export default function Card(props: any) {
  const classes = useStyles();
  const { children, cardStyle } = props;
  return (
    <div className={classes.root} style={cardStyle}>
      {children}
    </div>
  );
}

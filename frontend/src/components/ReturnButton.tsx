import { Button, CircularProgress, makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";

const useStyles = makeStyles((theme) => ({}));

export default function ReturnButton(props: any) {
  const classes = useStyles();
  const { loading, valid, onClick, textValue } = props;
  return (
    <div>
      <Button
        disabled={loading || !valid}
        onClick={onClick}
      >
        {textValue}
      </Button>
    </div>
  );
}

ReturnButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  textValue: PropTypes.string,
  loading: PropTypes.bool,
  valid: PropTypes.bool,
};

ReturnButton.defaultProps = {
  loading: false,
  valid: true,
  textValue: '',
};
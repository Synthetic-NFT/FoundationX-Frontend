/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import { Button } from "@material-ui/core";
import Slider from "@material-ui/core/Slider";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { InputAdornment, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";

import { Instrument } from "./api";
import { AppContext } from "./AppContext";
import { NFTIcons } from "./fakeData";
import theme from "./theme";

function InstrumentCard({ instrument }: { instrument: Instrument }) {
  const data = [
    ["Price", instrument.price],
    ["Fee", instrument.fee],
  ];

  return (
    <div
      style={{
        color: theme.activeTextColor,
        borderRadius: "6px",
        display: "flex",
        fontSize: "14pt",
        padding: "16px",
        width: "336px",
        height: "224px",
        flexDirection: "column",
        marginLeft: "24px",
        backgroundColor: theme.instrumentCardBackgroundColor,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <img
            src={NFTIcons.get(instrument.ticker)}
            alt={instrument.ticker}
            width="48px"
            height="48px"
          />
          <div
            style={{
              marginRight: "16px",
            }}
          />
          <b style={{ marginTop: "8px" }}>{instrument.ticker}</b>
        </div>
        <div
          style={{
            color: theme.inactiveTextColor,
            display: "flex",
            flexDirection: "column",
            marginTop: "32px",
            fontSize: "12pt",
          }}
        >
          {data.map(([label, value]) => (
            <div
              style={{
                display: "flex",
                flex: "1 0 100%",
                justifyContent: "space-between",
              }}
              key={label}
            >
              <div>{label}</div>
              <div>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type BuySpecConfig = {
  minRatio: number;
  safeRatio: number;
};

type BuySpec = {
  count: number;
  setCount: (newCount: number) => void;
  ratio: number;
  setRatio: (newRatio: number) => void;
  isValid: boolean;
};

// Wraps the business logic in a single hook
function useBuySpec(config: BuySpecConfig): BuySpec {
  const [count, setCount] = useState(0);
  const [ratio, setRatio] = useState(
    config.minRatio + (config.safeRatio - config.minRatio) / 2,
  );
  const [isValid, setIsValid] = useState(false);

  useEffect(
    () =>
      setIsValid(
        count >= 0 && config.minRatio <= ratio && ratio <= config.safeRatio,
      ),
    [count, ratio, config, setIsValid],
  );

  return {
    count,
    setCount,
    ratio,
    setRatio,
    isValid,
  };
}

// @See https://v4.mui.com/components/text-fields/#customized-inputs
const StyledTextField = withStyles({
  root: {
    "& label": {
      color: theme.tradeFormOutline,
    },
    "& .MuiOutlinedInput-input": {
      color: theme.activeTextColor,
      fontWeight: "bold",
    },
    "& label.Mui-focused": {
      color: theme.tradeFormOutline,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: theme.tradeFormOutline,
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: theme.tradeFormOutline,
      },
      "&:hover fieldset": {
        borderColor: theme.tradeFormOutline,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.tradeFormOutline,
      },
    },
    // https://stackoverflow.com/questions/50823182/material-ui-remove-up-down-arrow-dials-from-textview
    "& input[type=number]": {
      "-moz-appearance": "textfield",
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "& input": {
      textAlign: "right",
    },
  },
})(TextField);

function FieldLabel({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        marginTop: "16px",
        marginLeft: "24px",
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
      }}
    >
      <div style={{ fontSize: "16pt", color: theme.activeTextColor }}>
        <b>{title}</b>
      </div>
      <div style={{ fontSize: "8pt", color: theme.inactiveTextColor }}>
        <b>{description}</b>
      </div>
    </div>
  );
}

function CountField({ count, setCount }: BuySpec) {
  return (
    <StyledTextField
      value={count}
      style={{ margin: "24px" }}
      label="Count"
      type="number"
      // We probably should do some validation on this
      onChange={(e) => setCount(Number(e.target.value))}
    />
  );
}

const StyledSlider = withStyles({
  root: {
    "& .MuiSlider-markLabel": {
      color: theme.inactiveTextColor,
      fontWeight: "bold",
    },
  },
})(Slider);

function RatioField({
  minRatio,
  safeRatio,
  ratio,
  setRatio,
}: BuySpecConfig & BuySpec) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <StyledSlider
        style={{ width: "364px" }}
        value={ratio}
        step={5}
        min={100}
        max={250}
        color={ratio > minRatio ? "primary" : "secondary"}
        valueLabelDisplay="on"
        marks={[
          {
            value: minRatio,
            label: `Min ${String(minRatio)} %`,
          },
          {
            value: safeRatio,
            label: `Safe ${String(safeRatio)} %`,
          },
        ]}
        onChange={(_, v) => {
          if (typeof v !== "number") {
            throw Error("expect number");
          }
          setRatio(v);
        }}
      />
      <StyledTextField
        value={ratio}
        inputProps={{ min: 0, max: 12 }}
        style={{ margin: "24px", width: "64px" }}
        label="Ratio"
        type="number"
        onChange={
          (e) => setRatio(+e.target.value) /* cast to number with "+" */
        }
      />
    </div>
  );
}

function BuyForm({ instrument }: { instrument: Instrument }) {
  const { appData } = useContext(AppContext);
  const fakeLimits = {
    minRatio: 150,
    safeRatio: 200,
  };
  const buySpec = useBuySpec(fakeLimits);

  // The place order button. We can connect it with the wallet connection flow.
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
    >
      <div
        style={{
          borderRadius: "6px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: theme.tradeFormBackgroundColor,
          flexGrow: 1,
        }}
      >
        <FieldLabel
          title="Set Collateral"
          description="Set the amount of collateral"
        />
        <CountField {...buySpec} />
        <FieldLabel
          title="Set Collateral Ratio"
          description="Position will be liquidated below the minimum colateral ratio"
        />
        <div
          style={{
            marginTop: "32px",
          }}
        />
        <RatioField {...buySpec} {...fakeLimits} />
      </div>
      <Button
        style={{ marginTop: "32px", width: "300px", alignSelf: "center" }}
        size="large"
        variant="contained"
        onClick={() => {}}
      >
        {appData == null ? "Wallet Not Connected" : "Place Order"}
      </Button>
    </div>
  );
}

// Rendered in the `/trade/order/buy` and contains business logic related to placing a
// order for an instrument.
export default function InstrumentBuy({
  instrument,
}: {
  instrument: Instrument;
}) {
  return (
    <div style={{ display: "flex", overflow: "hidden" }}>
      <BuyForm instrument={instrument} />
      <InstrumentCard instrument={instrument} />
    </div>
  );
}

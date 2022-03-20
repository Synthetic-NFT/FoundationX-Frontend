/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import { Button } from "@material-ui/core";
import Slider from "@material-ui/core/Slider";
import { withStyles } from "@material-ui/core/styles";
import { TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";

import { Instrument } from "./api";
import { AppContext } from "./AppContext";
import theme from "./theme";
import {connectWallet, mintSynth} from "./util/interact";

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
        <b>{instrument.ticker}</b>
        {instrument.price}
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
  maxRatio: number;
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
    config.minRatio + (config.maxRatio - config.minRatio) / 2,
  );
  const [isValid, setIsValid] = useState(false);

  useEffect(
    () =>
      setIsValid(
        count >= 0 && config.minRatio <= ratio && ratio <= config.maxRatio,
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
      <div style={{ color: theme.inactiveTextColor }}>
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
  maxRatio,
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
        marks={[
          {
            value: minRatio,
            label: "min",
          },
          {
            value: maxRatio,
            label: "max",
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
  const { walletAddress } = useContext(AppContext);
  const fakeLimits = {
    minRatio: 150,
    maxRatio: 200,
  };
  const buySpec = useBuySpec(fakeLimits);

  const mintSynthPressed = async () => {
    const mintSynthResponse = await mintSynth(walletAddress, "SynthTest1", buySpec.count, buySpec.ratio);
    console.log(mintSynthResponse);
  };

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
        <FieldLabel title="Set count" description="blah" />
        <CountField {...buySpec} />
        <FieldLabel title="Set ratio" description="blah" />
        <RatioField {...buySpec} {...fakeLimits} />
      </div>
      <Button
        style={{ marginTop: "32px", width: "300px", alignSelf: "center" }}
        size="large"
        variant="contained"
        disabled={walletAddress === ""}
        onClick={mintSynthPressed}
      >
        {walletAddress === "" ? "Wallet Not Connected" : "Place Order"}
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
    <div style={{ display: "flex", overflow: "scroll" }}>
      <BuyForm instrument={instrument} />
      <InstrumentCard instrument={instrument} />
    </div>
  );
}

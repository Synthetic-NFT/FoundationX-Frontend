/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import { Button } from "@material-ui/core";
import Slider from "@material-ui/core/Slider";
import { withStyles } from "@material-ui/core/styles";
import { SvgIcon, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";

import { Instrument } from "./api";
import { AppContext } from "./AppContext";
// eslint-disable-next-line import/default
import InstrumentCard from "./InstrumentCard";
import Ethereum from "./styles/images/Ethereum.svg";
import theme from "./theme";
import { mintSynth } from "./util/interact";

type BuySpecConfig = {
  minRatio: number;
  safeRatio: number;
};

type BuySpec = {
  collateral: string;
  setCollateral: (newCollateral: string) => void;
  collateralValid: boolean;
  ratio: string;
  setRatio: (newRatio: string) => void;
  ratioValid: boolean;
};

// Wraps the business logic in a single hook
function useBuySpec(config: BuySpecConfig): BuySpec {
  const [collateral, setCollateral] = useState("");
  const [ratio, setRatio] = useState(
    String(config.minRatio + (config.safeRatio - config.minRatio) / 2),
  );
  const [collateralValid, setCollateralValid] = useState(true);
  const [ratioValid, setRatioValid] = useState(true);

  useEffect(() => {
    const collateralNum = +collateral;
    const ratioNum = +ratio;
    setCollateralValid(collateralNum >= 0);
    setRatioValid(ratioNum >= 0);
  }, [collateral, ratio, config, setCollateralValid, setRatioValid]);

  return {
    collateral,
    setCollateral,
    collateralValid,
    ratio,
    setRatio,
    ratioValid,
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

function CollateralField({
  collateral,
  setCollateral,
  collateralValid,
}: BuySpec) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img src={Ethereum} alt="Ethereum" height="40px" width="40px" />
      <StyledTextField
        value={collateralValid ? collateral : ""}
        style={{ margin: "24px" }}
        label="Collateral"
        type="number"
        // We probably should do some validation on this
        onChange={(e) => setCollateral(e.target.value)}
      />
    </div>
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
  ratioValid,
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
        value={ratioValid ? +ratio : 0}
        step={5}
        min={100}
        max={250}
        color={+ratio > minRatio ? "primary" : "secondary"}
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
          setRatio(String(v));
        }}
      />
      <StyledTextField
        value={ratioValid ? ratio : ""}
        inputProps={{ min: 0, max: 12 }}
        style={{ margin: "24px", width: "64px" }}
        label="Ratio"
        type="number"
        onChange={(e) => setRatio(e.target.value) /* cast to number with "+" */}
      />
    </div>
  );
}

function BuyForm({ instrument }: { instrument: Instrument }) {
  const { appData } = useContext(AppContext);
  const { walletAddress } = useContext(AppContext);
  const fakeLimits = {
    minRatio: 150,
    safeRatio: 200,
  };
  const buySpec = useBuySpec(fakeLimits);

  const mintSynthPressed = async () => {
    if (buySpec.collateralValid && buySpec.ratioValid) {
      const mintSynthResponse = await mintSynth(
        walletAddress,
        instrument.ticker,
        +buySpec.collateral,
        +buySpec.ratio,
      );
      console.log(mintSynthResponse);
    }
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
        <FieldLabel
          title="Set Collateral"
          description="Set the amount of collateral"
        />
        <CollateralField {...buySpec} />
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

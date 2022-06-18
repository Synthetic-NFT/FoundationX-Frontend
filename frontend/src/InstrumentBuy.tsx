/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import { Button } from "@material-ui/core";
import Slider from "@material-ui/core/Slider";
import { withStyles } from "@material-ui/core/styles";
import { TextField } from "@mui/material";
import { BigNumber } from "bignumber.js";
import React, { useContext, useEffect } from "react";

import { Instrument } from "./api";
import { AppContext } from "./AppContext";
// eslint-disable-next-line import/default
import { NFTIcons } from "./fakeData";
import InstrumentCard from "./InstrumentCard";
import {
  MintContext,
  MintContextProvider,
  ManageActionKind,
} from "./MintContext";
import Ethereum from "./styles/images/Ethereum.svg";
import theme from "./theme";
import { mintSynth } from "./util/interact";

type BuySpecConfig = {
  minRatio: number;
  safeRatio: number;
};

// @See https://v4.mui.com/components/text-fields/#customized-inputs
const StyledTextField = withStyles({
  root: {
    "& .Mui-disabled": {
      "-webkit-text-fill-color": "rgba(255, 255, 255, 0.6) !important", // (default alpha is 0.38)
    },
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
        marginTop: "0.67rem",
        marginLeft: "1rem",
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

function CollateralField({ instrument }: { instrument: Instrument }) {
  const { state, dispatch } = useContext(MintContext);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <StyledTextField
        value={state.collateralValid ? state.collateral : ""}
        style={{ margin: "1rem" }}
        label="Collateral"
        type="number"
        // We probably should do some validation on this
        onChange={(e) =>
          dispatch({
            type: ManageActionKind.COLLATERAL,
            newRatio: "",
            newCollateral: e.target.value,
            newDebt: "",
            price: new BigNumber(instrument.price),
          })
        }
      />
      <img src={Ethereum} alt="Ethereum" style={{ height: "1.67rem", width: "1.67rem" }} />
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
  instrument,
}: BuySpecConfig & { instrument: Instrument }) {
  const { state, dispatch } = useContext(MintContext);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <StyledSlider
        style={{ width: "15.17rem" }}
        value={state.ratioValid ? +state.ratio : 0}
        step={5}
        min={100}
        max={250}
        color={+state.ratio > minRatio ? "primary" : "secondary"}
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
          dispatch({
            type: ManageActionKind.RATIO,
            newRatio: String(v),
            newCollateral: "",
            newDebt: "",
            price: new BigNumber(instrument.price),
          });
        }}
      />
      <StyledTextField
        value={state.ratioValid ? state.ratio : ""}
        inputProps={{ min: 0, max: 12 }}
        style={{ margin: "1rem", width: "2.67rem" }}
        label="Ratio"
        type="number"
        onChange={(e) =>
          dispatch({
            type: ManageActionKind.RATIO,
            newRatio: e.target.value,
            newCollateral: "",
            newDebt: "",
            price: new BigNumber(instrument.price),
          })
        }
      />
    </div>
  );
}

function DebtField({ instrument }: { instrument: Instrument }) {
  const { state, dispatch } = useContext(MintContext);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <StyledTextField
        value={state.debtValid ? state.debt : ""}
        style={{ margin: "1rem" }}
        label="Count"
        type={instrument.ticker}
        // We probably should do some validation on this
        disabled
      />
      <img
        src={NFTIcons.get(instrument.ticker)}
        alt={instrument.ticker}
        style={{ height: "1.67rem", width: "1.67rem" }}
      />
    </div>
  );
}

function BuyForm({ instrument }: { instrument: Instrument }) {
  const { walletAddress } = useContext(AppContext);
  const fakeLimits = {
    minRatio: 150,
    safeRatio: 200,
  };

  const { state, dispatch } = useContext(MintContext);

  // useEffect(() => {
  //     setRatio(fakeLimits.safeRatio.toString(), new BigNumber(instrument.price));
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [instrument.price]);

  const mintSynthPressed = async () => {
    if (state.collateralValid && state.ratioValid) {
      const mintSynthResponse = await mintSynth(
        walletAddress,
        instrument.ticker,
        state.collateral,
        state.ratio,
      );
      console.log("mintSynthPressed response", mintSynthResponse);
      if (mintSynthResponse) {
        if (mintSynthResponse.status === 'success') {
          // TODO show toast and back to mint page
        } else {
          // TODO show toast
        } 
      }
    } else {
      // TODO show toast
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
          borderRadius: "0.25rem",
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
        <CollateralField instrument={instrument} />
        <FieldLabel
          title="Set Collateral Ratio"
          description="Position will be liquidated below the minimum colateral ratio"
        />
        <div
          style={{
            marginTop: "1.33rem",
          }}
        />
        <RatioField {...fakeLimits} instrument={instrument} />
        <div
          style={{
            marginTop: "1.33rem",
          }}
        />
        <DebtField instrument={instrument} />
      </div>
      <Button
        style={{ marginTop: "1.33rem", width: "12.5rem", alignSelf: "center" }}
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
    <div style={{ display: "flex", overflow: "auto", height: "max-content" }}>
      <MintContextProvider>
        <BuyForm instrument={instrument} />
      </MintContextProvider>
      <InstrumentCard instrument={instrument} />
    </div>
  );
}

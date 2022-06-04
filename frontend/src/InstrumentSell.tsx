/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import { Button } from "@material-ui/core";
import Slider from "@material-ui/core/Slider";
import { withStyles } from "@material-ui/core/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { TextField } from "@mui/material";
import { BigNumber } from "bignumber.js";
import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";

import { Instrument } from "./api";
import { AppContext } from "./AppContext";
// eslint-disable-next-line import/default
import { NFTIcons } from "./fakeData";
import InstrumentCard from "./InstrumentCard";
import {
  ManageActionKind,
  ManageContext,
  ManageContextProvider,
  MintContext,
} from "./MintContext";
import Ethereum from "./styles/images/Ethereum.svg";
import theme from "./theme";
import {burnSynth, loadUserOrderStat, manageSynth} from "./util/interact";

type SellSpecConfig = {
  minRatio: number;
  safeRatio: number;
};

type BurnSpecConfig = {
  // collateral: BigNumber;
  // cRatio: BigNumber;
  // debt: BigNumber;
  minRatio: number;
  safeRatio: number;
};

type BurnSpec = {
  collateral: string;
  setCollateral: (newCollateral: string) => void;
  collateralValid: boolean;
  cRatio: string;
  setCRatio: (newCRatio: string) => void;
  cRatioValid: boolean;
  debt: string;
  setDebt: (newDebt: string) => void;
  debtValid: boolean;
};

function useBurnSpec(config: BurnSpecConfig): BurnSpec {
  const { unit } = useContext(AppContext);
  const [collateral, setCollateral] = useState("");
  const [cRatio, setCRatio] = useState("");
  const [debt, setDebt] = useState("");

  const [collateralValid, setCollateralValid] = useState(true);
  const [cRatioValid, setCRatioValid] = useState(true);
  const [debtValid, setDebtValid] = useState(true);

  // const [collateralValid, setCollateralValid] = useContext(MintContext);

  useEffect(() => {
    const collateralNum = +collateral;
    const cRatioNum = +cRatio;
    const debtNum = +debt;
    setCollateralValid(collateralNum >= 0);
    setCRatioValid(cRatioNum >= 0);
    setDebtValid(debtNum >= 0);
  }, [
    collateral,
    cRatio,
    debt,
    config,
    setCollateralValid,
    setCRatioValid,
    setDebtValid,
  ]);

  return {
    collateral,
    setCollateral,
    collateralValid,
    cRatio,
    setCRatio,
    cRatioValid,
    debt,
    setDebt,
    debtValid,
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

function FieldLabel({ title }: { title: string }) {
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
    </div>
  );
}

function CollateralField({
  burnSpec,
  statSpec,
}: {
  burnSpec: BurnSpec;
  statSpec: UserStatSpec;
}) {
  const { unit } = useContext(AppContext);
  const { collateral, setCollateral, setDebt } = burnSpec;
  const currCollateral = new BigNumber(collateral.toString())
    .div(unit)
    .toNumber();

  const { synthPrice, oldCRatio } = statSpec;

  function updateCollateral(newCollateral: number) {
    const floatCollateral = new BigNumber(newCollateral).times(unit);
    const floatCRatio = new BigNumber(oldCRatio.toString()).div(unit);
    const floatSynthPrice = new BigNumber(synthPrice.toString()).div(unit);
    const floatDebt = floatCollateral.div(floatCRatio.times(floatSynthPrice));
    setDebt(floatDebt.toString());
    setCollateral(floatCollateral.toString());
  }
  return (
    <StyledTextField
      value={currCollateral}
      style={{ margin: "1rem" }}
      label="Count"
      type="number"
      // We probably should do some validation on this
      onChange={(e) => updateCollateral(Number(e.target.value))}
    />
  );
}

function DebtField({
  burnSpec,
  statSpec,
}: {
  burnSpec: BurnSpec;
  statSpec: UserStatSpec;
}) {
  const { unit } = useContext(AppContext);
  const { debt, setDebt, debtValid } = burnSpec;
  const currDebt = new BigNumber(debt.toString()).div(unit).toNumber();

  const { cRatio, setCRatio } = burnSpec;
  const { collateral, setCollateral } = burnSpec;
  const { synthPrice, setSynthPrice } = statSpec;

  function updateDebt(newDebt: number) {
    const floatDebt = new BigNumber(newDebt).times(unit);
    const floatCRatio = new BigNumber(cRatio.toString()).div(unit);
    const floatSynthPrice = new BigNumber(synthPrice.toString()).div(unit);
    const floatCollateral = floatDebt.times(floatCRatio).times(floatSynthPrice);
    setCollateral(floatCollateral.toString());
    setDebt(floatDebt.toString());
  }
  return (
    <StyledTextField
      value={debtValid ? currDebt : ""}
      style={{ margin: "1rem" }}
      label="Count"
      type="number"
      // We probably should do some validation on this
      onChange={(e) => updateDebt(Number(e.target.value))}
    />
  );
}

function OrigCollateralField({
  count,
  isCRatio,
}: {
  count: BigNumber;
  isCRatio: boolean;
}) {
  let c = count;
  if (isCRatio) {
    c = c.times(new BigNumber(100));
  }
  const numCount = ethers.utils.formatEther(c.toString());
  return (
    <StyledTextField
      value={numCount}
      style={{ margin: "1rem" }}
      label="Count"
      type="number"
      disabled
      // We probably should do some validation on this
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
  instrument,
}: BurnSpecConfig & { instrument: Instrument }) {
  const { state, dispatch } = useContext(ManageContext);
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

type UserStatSpec = {
  walletAddress: string;
  oldCollateral: BigNumber;
  setOldCollateral: (a: BigNumber) => void;
  oldCRatio: BigNumber;
  setOldCRatio: (a: BigNumber) => void;
  oldDebt: BigNumber;
  setOldDebt: (a: BigNumber) => void;
  synthPrice: BigNumber;
  setSynthPrice: (a: BigNumber) => void;
};

// Wraps the business logic in a single hook
function useUserStatSpec(burnSpec: BurnSpec): UserStatSpec {
  const { unit } = useContext(AppContext);
  const { walletAddress } = useContext(AppContext);
  const [oldCollateral, setOldCollateral] = useState(new BigNumber(0));
  const [oldCRatio, setOldCRatio] = useState(new BigNumber(0));
  const [oldDebt, setOldDebt] = useState(new BigNumber(0));
  const [synthPrice, setSynthPrice] = useState(new BigNumber(0));
  const { setCRatio, setCollateral, setDebt } = burnSpec;
  const { state, dispatch } = useContext(ManageContext);



  useEffect(() => {
    const getAndSetUserStat = async () => {
      const [bnCollateral, bnCRatio, bnDebt, bnSynthPrice] =
        await loadUserOrderStat(walletAddress);
        const ratio = new BigNumber(bnCRatio).div(unit).times(100).toString();
        const collateral = new BigNumber(bnCollateral).div(unit).toString();
        const debt = new BigNumber(bnDebt).div(unit).toString();

        dispatch({
          type: ManageActionKind.SET,
          newRatio: ratio,
          newCollateral: collateral,
          newDebt: debt,
          price: bnSynthPrice,
        });

      setOldCollateral(bnCollateral);
      setOldCRatio(bnCRatio);
      setOldDebt(bnDebt);
      setSynthPrice(bnSynthPrice);
    };
    if (walletAddress.length > 0) {
      getAndSetUserStat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit, walletAddress]);

  return {
    walletAddress,
    oldCollateral,
    setOldCollateral,
    oldCRatio,
    setOldCRatio,
    oldDebt,
    setOldDebt,
    synthPrice,
    setSynthPrice,
  };
}

function UserInputField({
  type,
  price,
}: {
  type: ManageActionKind;
  price: BigNumber;
}) {
  const synthPriceBase10 = price.div("1e18");
  const { state, dispatch } = useContext(ManageContext);
  if (type === ManageActionKind.SET) {
    return <StyledTextField />;
  }

  return (
    <StyledTextField
      value={state[type]}
      style={{ margin: "1rem" }}
      label="Count"
      type="number"
      // disabled={new BigNumber(state.debt).lte(0)}
      // We probably should do some validation on this
      onChange={(e) => dispatch({ type, payload: e.target.value, price })}
    />
  );
}

function SellForm({ instrument }: { instrument: Instrument }) {
  const fakeLimits = {
    minRatio: 150,
    safeRatio: 200,
  };
  const origBurnSpecConfig = {
    minRatio: 150,
    safeRatio: 200,
  };
  const burnSpec = useBurnSpec(origBurnSpecConfig);

  const { state, dispatch } = useContext(ManageContext);

  const UserStatSpec = useUserStatSpec(burnSpec);
  const {
    walletAddress,
    oldDebt,
    setOldDebt,
    oldCollateral,
    setOldCollateral,
    oldCRatio,
    setOldCRatio,
    synthPrice,
    setSynthPrice,
  } = UserStatSpec;

  const burnSynthPressed = async () => {
    const burnSynthResponse = await manageSynth(
        walletAddress,
        instrument.ticker,
        state.ratio,
        state.collateral,
        oldDebt.div('1e18').toString(),
        state.debt,
    );
    const getAndSetUserStat = async () => {
      const [bnCollateral, bnCRatio, bnDebt, bnSynthPrice] =
          await loadUserOrderStat(walletAddress);
      const ratio = new BigNumber(bnCRatio).div('1e18').times(100).toString();
      const collateral = new BigNumber(bnCollateral).div('1e18').toString();
      const debt = new BigNumber(bnDebt).div('1e18').toString();

      dispatch({
        type: ManageActionKind.SET,
        newRatio: ratio,
        newCollateral: collateral,
        newDebt: debt,
        price: bnSynthPrice,
      });

      setOldCollateral(bnCollateral);
      setOldCRatio(bnCRatio);
      setOldDebt(bnDebt);
      setSynthPrice(bnSynthPrice);
    };
    if (walletAddress.length > 0) {
      getAndSetUserStat();
    }
  };


  const Icon = NFTIcons.get(instrument.ticker);

  // The place order button. We can connect it with the wallet connection flow.
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
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
        <FieldLabel title="Collateral" />
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <OrigCollateralField count={oldCollateral} isCRatio={false} />
          <ArrowForwardIcon color="primary" vertical-align="middle" />
          <UserInputField
            type={ManageActionKind.COLLATERAL}
            price={synthPrice.div("1e18")}
          />
          <img src={Ethereum} alt="Ethereum" style={{height:"1.67rem", width:"1.67rem"}} />
        </div>

        <FieldLabel title="Collateral Ratio (%)" />
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <OrigCollateralField count={oldCRatio} isCRatio />
          <ArrowForwardIcon color="primary" vertical-align="middle" />
          <UserInputField
            type={ManageActionKind.RATIO}
            price={synthPrice.div("1e18")}
          />
        </div>

        <FieldLabel title="Synthetic Tokens Minted" />
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <OrigCollateralField count={oldDebt} isCRatio={false} />
          <ArrowForwardIcon color="primary" vertical-align="middle" />
          <UserInputField
            type={ManageActionKind.DEBT}
            price={synthPrice.div("1e18")}
          />
          <img
            src={NFTIcons.get(instrument.ticker)}
            alt={instrument.ticker}
            style={{height:"1.67rem", width:"1.67rem"}}
          />
        </div>

        <FieldLabel title="Set Collateral ratio" />
        <RatioField {...fakeLimits} instrument={instrument} />
      </div>
      <Button
        style={{ marginTop: "1.33rem", width: "12.5rem", alignSelf: "center" }}
        size="large"
        variant="contained"
        disabled={walletAddress === ""}
        onClick={burnSynthPressed}
      >
        {walletAddress === "" ? "Wallet Not Connected" : "Place Order"}
      </Button>
    </div>
  );
}

// Rendered in the `/trade/order/buy` and contains business logic related to placing a
// order for an instrument.
export default function InstrumentSell({
  instrument,
}: {
  instrument: Instrument;
}) {
  return (
    <div style={{ display: "flex", overflow: "auto", height: "max-content"}}>
      <ManageContextProvider>
        <SellForm instrument={instrument} />
      </ManageContextProvider>
      <InstrumentCard instrument={instrument} />
    </div>
  );
}

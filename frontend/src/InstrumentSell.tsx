/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import { Button } from "@material-ui/core";
import Slider from "@material-ui/core/Slider";
import { withStyles } from "@material-ui/core/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { TextField } from "@mui/material";
import { BigNumber } from "bignumber.js";
import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";

import { Instrument } from "./api";
import { AppContext } from "./AppContext";
// eslint-disable-next-line import/default
import InstrumentCard from "./InstrumentCard";
import theme from "./theme";
import { burnSynth, loadUserOrderStat } from "./util/interact";

const BN = require("bn.js");

type SellSpecConfig = {
  minRatio: number;
  maxRatio: number;
};

type BurnSpecConfig = {
  // collateral: BigNumber;
  // cRatio: BigNumber;
  // debt: BigNumber;
  minRatio: number;
  maxRatio: number;
};

type BurnSpec = {
  collateral: BigNumber;
  setCollateral: (newCount: BigNumber) => void;
  cRatio: BigNumber;
  setCRatio: (newCount: BigNumber) => void;
  debt: BigNumber;
  setDebt: (newCount: BigNumber) => void;
  isValid: boolean;
};

function useBurnSpec(config: BurnSpecConfig): BurnSpec {
  const { unit } = useContext(AppContext);
  const [collateral, setCollateral] = useState(new BigNumber(0));
  const [cRatio, setCRatio] = useState(new BigNumber(0));
  const [debt, setDebt] = useState(new BigNumber(0));

  const cRatioPercent = cRatio.times(100).div(unit).toNumber();

  // const collateralFP = config.collateral.div(unit).toNumber();
  // const debtlFP = config.debt.div(unit).toNumber();
  const [isValid, setIsValid] = useState(false);

  useEffect(
    () =>
      setIsValid(
        config.minRatio <= cRatioPercent && cRatioPercent <= config.maxRatio,
      ),
    [cRatioPercent, config, setIsValid],
  );

  return {
    collateral,
    setCollateral,
    cRatio,
    setCRatio,
    debt,
    setDebt,
    isValid,
  };
}

type SellSpec = {
  count: number;
  setCount: (newCount: number) => void;
  ratio: number;
  setRatio: (newRatio: number) => void;
  isValid: boolean;
};

// Wraps the business logic in a single hook
function useSellSpec(config: SellSpecConfig): SellSpec {
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

// function DummyField({ debt, setDebt }: SellSpec) {
//     return (
//         <StyledTextField
//             value={debt}
//             style={{ margin: "24px" }}
//             label="Count"
//             type="number"
//             // We probably should do some validation on this
//             onChange={(e) => resolve(Number(e.target.value))}
//         />
//     );
// }

function setCollateralInWeiWithDebt(debt: BigNumber) {
  const base = new BigNumber(10);
  const expo = new BigNumber(18);
  const unit = base.pow(expo);
  const [cRatio, setCRatio] = useState(new BigNumber(0));
  const [collateral, setCollateral] = useState(new BigNumber(0));
  const [synthPrice, setSynthPrice] = useState(new BigNumber(0));

  const floatCRatio = new BigNumber(cRatio.toString()).div(unit);
  const floatDebt = new BigNumber(debt.toString());
  const floatSynthPrice = new BigNumber(synthPrice.toString()).div(unit);
  const floatCollateral = floatDebt.times(floatCRatio).times(floatSynthPrice);
  // return new BigNumber(floatCollateral.toString());
  setCollateral(new BigNumber(floatCollateral.toString()));
}

function setDebtInWeiWithCollateral(collateral: BigNumber) {
  const base = new BigNumber(10);
  const expo = new BigNumber(18);
  const unit = base.pow(expo);

  const [synthPrice, setSynthPrice] = useState(new BigNumber(0));
  const [cRatio, setCRatio] = useState(new BigNumber(0));
  const [debt, setDebt] = useState(new BigNumber(0));

  const floatCRatio = new BigNumber(cRatio.toString()).div(unit);
  const floatCollateral = new BigNumber(collateral.toString());
  const floatSynthPrice = new BigNumber(synthPrice.toString()).div(unit);
  const floatDebt = floatCollateral.div(floatCRatio.times(floatSynthPrice));
  setDebt(new BigNumber(floatDebt.toString()));
  // return new BigNumber(floatDebt.toString());
}

function setCollateralInWeiWithCRatio(cRatio: BigNumber) {
  const base = new BigNumber(10);
  const expo = new BigNumber(18);
  const unit = base.pow(expo);

  const [synthPrice, setSynthPrice] = useState(new BigNumber(0));
  const [debt, setDebt] = useState(new BigNumber(0));
  const [collateral, setCollateral] = useState(new BigNumber(0));
  const floatCRatio = new BigNumber(cRatio.toString()).div(unit);
  const floatDebt = new BigNumber(debt.toString());
  const floatSynthPrice = new BigNumber(synthPrice.toString()).div(unit);
  const floatCollateral = floatDebt.times(floatCRatio).times(floatSynthPrice);

  // return new BigNumber(floatCollateral.toString());
  setCollateral(new BigNumber(floatCollateral.toString()));
}

function CollateralField({
  burnSpec,
  statSpec,
}: {
  burnSpec: BurnSpec;
  statSpec: UserStatSpec;
}) {
  const base = new BigNumber(10);
  const expo = new BigNumber(18);
  const unit = base.pow(expo);
  const { collateral, setCollateral, setDebt } = burnSpec;
  const currCollateral = new BigNumber(collateral.toString())
    .div(unit)
    .toNumber();

  const { synthPrice, setSynthPrice } = statSpec;
  const { oldCRatio, setOldCRatio } = statSpec;
  // const [oldDebt, setOldDebt] = useState(new BigNumber(0));

  function updateCollateral(newCollateral: number) {
    const floatCollateral = new BigNumber(newCollateral).times(unit);
    const floatCRatio = new BigNumber(oldCRatio.toString()).div(unit);
    const floatSynthPrice = new BigNumber(synthPrice.toString()).div(unit);
    const floatDebt = floatCollateral.div(floatCRatio.times(floatSynthPrice));
    setDebt(new BigNumber(floatDebt.toString()));
    setCollateral(new BigNumber(floatCollateral.toString()));
  }
  return (
    <StyledTextField
      value={currCollateral}
      style={{ margin: "24px" }}
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
  const base = new BigNumber(10);
  const expo = new BigNumber(18);
  const unit = base.pow(expo);
  const { debt, setDebt } = burnSpec;
  const currDebt = new BigNumber(debt.toString()).div(unit).toNumber();

  const { cRatio, setCRatio } = burnSpec;
  const { collateral, setCollateral } = burnSpec;
  const { synthPrice, setSynthPrice } = statSpec;

  function updateDebt(newDebt: number) {
    const floatDebt = new BigNumber(newDebt).times(unit);
    const floatCRatio = new BigNumber(cRatio.toString()).div(unit);
    const floatSynthPrice = new BigNumber(synthPrice.toString()).div(unit);
    const floatCollateral = floatDebt.times(floatCRatio).times(floatSynthPrice);
    // return new BigNumber(floatCollateral.toString());
    setCollateral(new BigNumber(floatCollateral.toString()));
    setDebt(new BigNumber(floatDebt.toString()));
  }
  return (
    <StyledTextField
      value={currDebt}
      style={{ margin: "24px" }}
      label="Count"
      type="number"
      // We probably should do some validation on this
      onChange={(e) => updateDebt(Number(e.target.value))}
    />
  );
}

function CRatioField({
  burnSpec,
  statSpec,
}: {
  burnSpec: BurnSpec;
  statSpec: UserStatSpec;
}) {
  const base = new BigNumber(10);
  const expo = new BigNumber(18);
  const unit = base.pow(expo);
  const { cRatio, setCRatio } = burnSpec;
  const currCRatio = new BigNumber(cRatio.toString())
    .times(new BigNumber(100))
    .div(unit)
    .toNumber();

  const { synthPrice, setSynthPrice } = statSpec;
  const { debt, setDebt } = burnSpec;
  const { collateral, setCollateral } = burnSpec;

  function updateCRatio(newCRatio: number) {
    const floatCRatio = new BigNumber(newCRatio).div(new BigNumber(100));
    const floatDebt = new BigNumber(debt.toString());
    const floatSynthPrice = new BigNumber(synthPrice.toString()).div(unit);
    const floatCollateral = floatDebt.times(floatCRatio).times(floatSynthPrice);

    // return new BigNumber(floatCollateral.toString());
    setCollateral(new BigNumber(floatCollateral.toString()));
    setCRatio(new BigNumber(floatCRatio.times(unit).toString()));
  }
  return (
    <StyledTextField
      value={currCRatio}
      style={{ margin: "24px" }}
      label="Count"
      type="number"
      // We probably should do some validation on this
      onChange={(e) => updateCRatio(Number(e.target.value))}
    />
  );
}

function OrigCountField({
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
      style={{ margin: "24px" }}
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
  maxRatio,
  cRatio,
  setCRatio,
}: SellSpecConfig & BurnSpec) {
  const cRatioPercent = cRatio
    .times(new BigNumber(100))
    .div(new BigNumber("1e18"));
  console.log(cRatioPercent.toString());
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
        value={cRatioPercent.toNumber()}
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
          setCRatio(new BigNumber(v).times(new BigNumber("1e16")));
        }}
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
  useEffect(() => {
    const getAndSetUserStat = async () => {
      const [bnCollateral, bnCRatio, bnDebt, bnSynthPrice] =
        await loadUserOrderStat(walletAddress, 1);
      // const cRatio = new BigNumber(bnCRatio).times(100).div(unit).toNumber();
      // const collateral = new BigNumber(bnCollateral).div(unit).toNumber();
      // const foo = ethers.utils.formatEther(new BigNumber(bnCRatio));
      // const debt = new BigNumber(bnDebt).div(unit).toNumber();

      setOldCollateral(bnCollateral);
      setOldCRatio(bnCRatio);
      setOldDebt(bnDebt);
      setCollateral(bnCollateral);
      setCRatio(bnCRatio);
      setDebt(bnDebt);
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

function SellForm({ instrument }: { instrument: Instrument }) {
  const { appData } = useContext(AppContext);

  //
  // useEffect(() => {
  //     const [debt, setDebt] = useState(new BigNumber(0));
  //     setDebtInWeiWithCollateral(collateral);
  // }, [collateral]);
  //
  // useEffect(() => {
  //     setCollateralInWeiWithDebt(debt);
  // }, [debt]);
  //
  // useEffect(() => {
  //     setCollateralInWeiWithCRatio(cRatio);
  // }, [cRatio]);

  const fakeLimits = {
    minRatio: 150,
    maxRatio: 200,
  };
  const origBurnSpecConfig = {
    // collateral,
    // cRatio,
    // debt,
    minRatio: 150,
    maxRatio: 200,
  };
  const SellSpec = useSellSpec(fakeLimits);
  const BurnSpec = useBurnSpec(origBurnSpecConfig);

  const UserStatSpec = useUserStatSpec(BurnSpec);
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
    const burnSynthResponse = await burnSynth(
      walletAddress,
      "SynthTest1",
      oldDebt.minus(BurnSpec.debt),
    );
    console.log(burnSynthResponse);
  };

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
          borderRadius: "6px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: theme.tradeFormBackgroundColor,
          flexGrow: 1,
        }}
      >
        <FieldLabel title="Collateral" description="" />
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <OrigCountField count={oldCollateral} isCRatio={false} />
          <ArrowForwardIcon color="primary" vertical-align="middle" />
          <CollateralField burnSpec={BurnSpec} statSpec={UserStatSpec} />
        </div>

        <FieldLabel title="Collateral Ratio (%)" description="" />
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <OrigCountField count={oldCRatio} isCRatio />
          <ArrowForwardIcon color="primary" vertical-align="middle" />
          <CRatioField burnSpec={BurnSpec} statSpec={UserStatSpec} />
        </div>

        <FieldLabel title="Minted" description="" />
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <OrigCountField count={oldDebt} isCRatio={false} />
          <ArrowForwardIcon color="primary" vertical-align="middle" />
          <DebtField burnSpec={BurnSpec} statSpec={UserStatSpec} />
        </div>

        <FieldLabel title="Set ratio" description="blah" />
        <RatioField {...BurnSpec} {...fakeLimits} />
      </div>
      <Button
        style={{ marginTop: "32px", width: "300px", alignSelf: "center" }}
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
    <div style={{ display: "flex", overflow: "scroll" }}>
      <SellForm instrument={instrument} />
      <InstrumentCard instrument={instrument} />
    </div>
  );
}

/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import { makeStyles } from "@material-ui/core";
import { Button, Select, MenuItem } from "@material-ui/core";
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import Slider from "@material-ui/core/Slider";
import { withStyles } from "@material-ui/core/styles";
import { StylesContext } from "@material-ui/styles";
import { TextField } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import { BigNumber } from "bignumber.js";
import React, {useCallback, useContext, useEffect, useState} from "react";

import {getTradableCoinInfo} from "../../../api";
import { AppContext } from "../../../AppContext";
// eslint-disable-next-line import/default
import { SearchInput } from '../../../components/SearchInput'
import { NFTIcons } from "../../../fakeData";
import InstrumentCard from "../../../InstrumentCard";
import {
  MintContext,
  MintContextProvider,
  ManageActionKind,
} from "../../../MintContext";
import Ethereum from "../../../styles/images/Ethereum.svg";
import theme from "../../../theme";
import { TradeContext } from "../../../TradeContext";
import {addLiquidityETH, getFarmDesiredETH, loadPoolSynthPrice} from "../../../util/farm_interact";
import { mintSynth } from "../../../util/interact";
import {CoinInterface, ethCoin, Instrument} from "../../../util/dataStructures";


type BuySpecConfig = {
  minRatio: number;
  safeRatio: number;
};

// @See https://v4.mui.com/components/text-fields/#customized-inputs
const StyledTextField = withStyles({
  root: {
    "& .MuiInputBase-input.MuiInput-input.Mui-disabled": {
      "-webkit-text-fill-color": "rgba(0,0,0, 0.6)", // (default alpha is 0.38)
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
        // marginTop: "0.67rem",
        // marginLeft: "1rem",
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
      }}
    >
      <div style={{ fontSize: "1.25rem", color: theme.activeTextColor }}>
        <b>{title}</b>
      </div>
      <div style={{ fontSize: "0.83rem", color: theme.inactiveTextColor, fontWeight: 300, marginTop: "0.42rem" }}>
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
        // color={+state.ratio > minRatio ? "primary" : "secondary"}
        // valueLabelDisplay="on"
        // marks={[
        //   {
        //     value: minRatio,
        //     label: `Min ${String(minRatio)} %`,
        //   },
        //   {
        //     value: safeRatio,
        //     label: `Safe ${String(safeRatio)} %`,
        //   },
        // ]}
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

function Card({
  instrument,
}: {
  instrument: Instrument;
}) {
  const data = [
    ["Oracle Price", instrument.price],
    // ["Premium", instrument.fee],
    // ["Liquidity ", instrument.fee],
  ];

  // @ts-ignore
  return (
    <div
      style={{
        color: theme.activeTextColor,
        borderRadius: "0.75rem",
        display: "flex",
        fontSize: "14pt",
        padding: "1.33rem",
        width: "17.29rem",
        height: "8.7rem",
        flexDirection: "column",
        marginLeft: "1rem",
        background: "linear-gradient(160.35deg, rgba(31, 30, 35, 0.6) 13.15%, #25283C 93.23%)"
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <img
              src={NFTIcons.get(instrument.ticker)}
              alt={instrument.ticker}
              style={{ height: "2rem", width: "2rem" }}
            />
            <div
              style={{
                marginRight: "0.67rem",
              }}
            />
            <div style={{ lineHeight: "2rem", }}>{instrument.ticker}</div>
          </div>
          {/* <div style={{
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: "0.67rem",
            lineHeight: "2rem",
            color: "#565656",
          }}>191.36 UST</div> */}
        </div>
        <div
          style={{
            color: theme.inactiveTextColor,
            display: "flex",
            flexDirection: "column",
            marginTop: "1.33rem",
            fontSize: "12pt",
          }}
        >
          {data.map(([label, value]) => (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontStyle: "normal",
                fontWeight: 300,
                fontSize: "0.58rem",
                lineHeight: "0.875rem",
                color: "#FFFFFF",
                marginBottom: "0.25rem",
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



const useStyles = makeStyles({
  step: {
    display: "flex",
    marginTop: "0.17rem",
    marginBottom: "3rem",
  },
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "0.42rem 1rem",
    gap: "0.42rem",
    width: "23.33rem",
    height: "2.5rem",
    background: "linear-gradient(102.22deg, #1368E8 41.1%, #221FBE 78.05%)",
    borderRadius: "0.125rem",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "0.83rem",
    lineHeight: "1.25rem",
    color: "#FFFFFF",
    marginTop: "2.33rem",
    marginLeft: "2.75rem",
    marginBottom: "3.17rem",
  },
  stepNumber: {
    background: "#323232",
    borderRadius: "0.125rem",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "0.67rem",
    lineHeight: "1.5rem",
    textAlign: "center",
    color: "#FFFFFF",
    width: "1.5rem",
    height: "1.5rem",
  },
  summary: {
    marginTop: "3rem",
    fontWeight: 300,
    fontSize: "0.83rem",
    lineHeight: "1.25rem",
    color: "#FFFFFF",
    marginLeft: "2.75rem",
    marginBottom: "0.5rem",
  },
})

export default function FarmLong({
  instrument,
}: {
  instrument: Instrument;
}) {

  const styles = useStyles();

  const [inst, setInst] = useState(instrument);
  const { tradeData } = useContext(TradeContext);
  const { walletAddress, setWallet } = useContext(AppContext);
  const [availableCoin, setAvailableCoin] = React.useState<CoinInterface[]>(getTradableCoinInfo(tradeData, false));
  const [selectedTickerID, setSelectedTickerID] = useState("");
  const [selectedToken, setSelectedToken] = useState<CoinInterface>();

  const [poolPrice, setPoolPrice] = useState("");
  const [tokenAValue, setTokenAValue] = useState("");
  const [tokenBValue, setTokenBValue] = useState("");


  const handleInstrumentChange = useCallback((tickerId) => {
    const inst: Instrument | undefined = tradeData?.instruments.find(item => item.ticker === tickerId) || instrument;
    setInst(inst)
  }, [instrument, tradeData?.instruments]);


  useEffect(() => {
    if (availableCoin.length>0) {
      if (selectedTickerID) {
        loadPoolSynthPrice(selectedTickerID).then((poolPrice) => {
          setPoolPrice(poolPrice)
        });
        if (tokenAValue && tokenAValue !== "") {
          getFarmDesiredETH(selectedTickerID, tokenAValue).then((tokenBValue) => {
            setTokenBValue(tokenBValue);
          })
        }
      } else {
        loadPoolSynthPrice(availableCoin[0]?.name || "").then((poolPrice) => {
          setPoolPrice(poolPrice);
        }).catch(error => console.error(error));
        // handleInstrumentChange(availableCoin[0]?.name||"")
        setSelectedTickerID(availableCoin[0]?.name || "")
      }
      handleInstrumentChange(selectedTickerID);
    }
  }, [availableCoin, handleInstrumentChange, selectedTickerID, tokenAValue]);

  useEffect(() => {
    setAvailableCoin(getTradableCoinInfo(tradeData, false))
  }, [tradeData]);


  const startFarm = async () => {
    await addLiquidityETH(walletAddress, selectedTickerID, tokenAValue, tokenBValue);
  }

  const fromChanged = async (tickerId: string) => {
    setSelectedTickerID(tickerId);
    // // API issue
    // loadPoolSynthPrice(tickerId).then(result => {setPoolPrice(result)});
  };



  return (
    <div style={{ display: "flex", overflow: "hidden" }}>
      <div>
        <div className={styles.step}>
          <div className={styles.stepNumber}>1</div>
          <div style={{ marginLeft: "1.25rem" }}>
            <FieldLabel
              title="Provide sTokens"
              description=""
            />
            <div >
              <SearchInput availableCoins={availableCoin} defaultValue={inst.ticker} onChange={fromChanged} valueChange={setTokenAValue} />
            </div>
          </div>
        </div>
        <div className={styles.step}>
          <div className={styles.stepNumber}>2</div>
          <div style={{ marginLeft: "1.25rem" }}>
            <FieldLabel
              title="Provide Additional ETH"
              description="An equivalent ETH amount must be provided."
            />
            <div style={{ display: "flex", marginTop: "1.5rem" }}>
              <SearchInput availableCoins={[ethCoin]} defaultValue={ethCoin.name} value={tokenBValue} disableInput />
            </div>
          </div>
        </div>

        <div className={styles.summary}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>Pool Price</div>
            <div> {selectedTickerID} = {poolPrice} ETH</div>
          </div>
          {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
           <div>TX Fees</div>
           <div>0.20 UST</div>
          </div> */}
        </div>
        <Button
          className={styles.button}
          size="large"
          variant="contained"
          onClick={() => { startFarm() }}
        >
          Farm
        </Button>
      </div>
      <Card instrument={inst} />
    </div>
  );
}

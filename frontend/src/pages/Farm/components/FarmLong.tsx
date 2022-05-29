/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import { makeStyles } from "@material-ui/core";
import { Button, Select, MenuItem  } from "@material-ui/core";
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import Slider from "@material-ui/core/Slider";
import { withStyles } from "@material-ui/core/styles";
import { StylesContext } from "@material-ui/styles";
import { TextField } from "@mui/material";
import { BigNumber } from "bignumber.js";
import React, { useContext, useEffect, useState } from "react";

import { Instrument } from "../../../api";
import { AppContext } from "../../../AppContext";
// eslint-disable-next-line import/default
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
import { mintSynth } from "../../../util/interact";

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
        // marginTop: "16px",
        // marginLeft: "24px",
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
      }}
    >
      <div style={{ fontSize: "30px", color: theme.activeTextColor }}>
        <b>{title}</b>
      </div>
      <div style={{ fontSize: "20px", color: theme.inactiveTextColor, fontWeight: 300, marginTop: "10px" }}>
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
        style={{ margin: "24px" }}
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
      <img src={Ethereum} alt="Ethereum" height="40px" width="40px" />
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
        style={{ width: "364px" }}
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
        style={{ margin: "24px", width: "64px" }}
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
        style={{ margin: "24px" }}
        label="Count"
        type={instrument.ticker}
        // We probably should do some validation on this
        disabled
      />
      <img
        src={NFTIcons.get(instrument.ticker)}
        alt={instrument.ticker}
        height="40px"
        width="40px"
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
    ["Premium", instrument.fee],
    ["Liquidity ", instrument.fee],
  ];

  // @ts-ignore
  return (
    <div
      style={{
        color: theme.activeTextColor,
        borderRadius: "9px",
        display: "flex",
        fontSize: "14pt",
        padding: "32px",
        width: "415px",
        height: "209px",
        flexDirection: "column",
        marginLeft: "24px",
        background: "linear-gradient(160.35deg, rgba(31, 30, 35, 0.6) 13.15%, #25283C 93.23%)"
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
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
            <div style={{ lineHeight: "48px", }}>{instrument.ticker}</div>
          </div>
          <div style={{
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: "16px",
            lineHeight: "48px",
            color: "#565656",
          }}>191.36 UST</div>
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
                justifyContent: "space-between",
                fontFamily: "Poppins",
                fontStyle: "normal",
                fontWeight: 300,
                fontSize: "14px",
                lineHeight: "21px",
                color: "#FFFFFF",
                marginBottom: "6px",
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

function LongForm({ instrument, handleChange }: { instrument: Instrument, handleChange: Function }) {
  const { walletAddress } = useContext(AppContext);
  const fakeLimits = {
    minRatio: 150,
    safeRatio: 200,
  };

  const { tradeData } = useContext(TradeContext);
  const { state, dispatch } = useContext(MintContext);

  const mintSynthPressed = async () => {
    if (state.collateralValid && state.ratioValid) {
      const mintSynthResponse = await mintSynth(
        walletAddress,
        instrument.ticker,
        state.collateral,
        state.ratio,
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
          title={`Provide ${  instrument.fullName}`}
          description="can be BOUGHT or BORROWED"
        />
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={instrument.id}
          label="Asset"
          onChange={(e) => handleChange(e.target.value)}
          style={{
            marginTop: "16px",
            marginLeft: "24px",
            display: "flex",
            flexGrow: 1,
            flexDirection: "column",
          }}
        >
          {tradeData?.instruments.map((row) => (
              <MenuItem value={row.id}>{row.fullName}</MenuItem>
            ))}
        </Select>
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

const useStyles = makeStyles({
  step: {
    display: "flex",
    marginTop: "86px"
  },
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px 25px",
    gap: "10px",
    width: "559px",
    height: "60px",
    background: "linear-gradient(102.22deg, #1368E8 41.1%, #221FBE 78.05%)",
    borderRadius: "3px",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "20px",
    lineHeight: "30px",
    color: "#FFFFFF",
    marginTop: "56px",
    marginLeft: "66px",
    marginBottom: "76px",
  },
  stepNumber: {
    background: "#323232",
    borderRadius: "3px",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "16px",
    lineHeight: "36px",
    textAlign: "center",
    color: "#FFFFFF",
    width: "36px",
    height: "36px",
  },
  summary: {
    marginTop: "72px",
    fontWeight: 300,
    fontSize: "20px",
    lineHeight: "30px",
    color: "#FFFFFF",
    marginLeft: "66px",
    marginBottom: "12px",
  }
})

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    // backgroundColor: theme.palette.background.paper,
    border: '0px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    height: "64px",
    lineHeight: "64px",
    backgroundColor: "#222121",
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      // borderRadius: 4,
      // borderColor: '#80bdff',
      // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);


export default function FarmLong({
  instrument,
}: {
  instrument: Instrument;
}) {
  
  const styles = useStyles();

  const [inst, setInst] = useState(instrument);
  const { tradeData } = useContext(TradeContext);
  function handleChange(id:string) {
    const inst:Instrument|undefined = tradeData?.instruments.find(item => item.id === id) || instrument;
    setInst(inst)
  }
  const fakeLimits = {
    minRatio: 150,
    safeRatio: 200,
  };

  return (
    <div style={{ display: "flex", overflow: "hidden" }}>
      {/* <MintContextProvider>
        <LongForm instrument={inst} handleChange={(id: string) => handleChange(id)}/>
      </MintContextProvider>
      <InstrumentCard instrument={inst} /> */}
      <div>

        <div className={styles.step}>
          <div className={styles.stepNumber}>1</div>
          <div style={{marginLeft: "30px"}}>
            <FieldLabel
              title="Choose a collateral asset"
              description="Collateral asset may affect the minimum collateral ratio."
            />
            <div style={{display: "flex", marginTop: "36px"}}>
              <Select
                labelId="demo-customized-select-label"
                id="demo-customized-select"
                input={<BootstrapInput />}
                defaultValue="10"
                style={{height: "64px", marginTop: "10px",}}
              >
                <MenuItem value={10}><img src={Ethereum} alt="Ethereum" height="20px" width="20px" />Ten</MenuItem>
                <MenuItem value={20}><img src={Ethereum} alt="Ethereum" height="20px" width="20px" />Twenty</MenuItem>
                <MenuItem value={30}><img src={Ethereum} alt="Ethereum" height="20px" width="20px" />Thirty</MenuItem>
              </Select>
              <BootstrapInput id="demo-customized-textbox" />
            </div>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.stepNumber}>2</div>
          <div style={{marginLeft: "30px"}}>
            <FieldLabel
              title="Set a Collateral Ratio"
              description="Position will be liquidated below the minimum"
            />
            <div style={{display: "flex"}}>
              <RatioField {...fakeLimits} instrument={instrument} />
              {/* <div
                style={{
                  marginTop: "32px",
                }}
              />
              <DebtField instrument={instrument} /> */}
            </div>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.stepNumber}>3</div>
          <div style={{marginLeft: "30px"}}>
            <FieldLabel
              title="Confirm borrow amount"
              description="Position can be closed by repaying the borrowed amount."
            />
            <div style={{display: "flex", marginTop: "36px"}}>
              <Select
                labelId="demo-customized-select-label"
                id="demo-customized-select"
                input={<BootstrapInput />}
                defaultValue="10"
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
              <BootstrapInput id="demo-customized-textbox" />
            </div>
          </div>
        </div>

        <div className={styles.summary}>
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <div>Oracle Price</div>
            <div>1 mApple = 140.94 UST</div>            
          </div>
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <div>TX Fees</div>
            <div>0.20 UST</div>                 
          </div>
        </div>
        <Button
          className={styles.button}
          size="large"
          variant="contained"
        >
          Connect Wallet
        </Button>
      </div>
      <Card instrument={inst} />
    </div>
  );
}

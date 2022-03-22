/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import { Button } from "@material-ui/core";
import Slider from "@material-ui/core/Slider";
import { withStyles } from "@material-ui/core/styles";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { TextField } from "@mui/material";
import {BigNumber, ethers} from "ethers";
import { useContext, useEffect, useState } from "react";

import { Instrument } from "./api";
import { AppContext } from "./AppContext";
import theme from "./theme";
import {connectWallet, burnSynth, loadUserOrderStat, loadSynthPrice} from "./util/interact";

const BN = require('bn.js');

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
    const [cRatio, setCRatio] = useState((BigNumber.from(0)));
    const cRatioPercent = cRatio.mul(100).div(unit).toNumber();

    const [collateral, setCollateral] = useState((BigNumber.from(0)));
    const [debt, setDebt] = useState((BigNumber.from(0)));
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
    const base = new BN(10);
    const expo = new BN(18);
    const unit = base.pow(expo);
    const [cRatio, setCRatio] = useState(BigNumber.from(0));
    const [collateral, setCollateral] = useState(BigNumber.from(0));
    const [synthPrice, setSynthPrice] = useState(BigNumber.from(0));

    const floatCRatio = new BN(cRatio.toString()).div(unit);
    const floatDebt = new BN(debt.toString());
    const floatSynthPrice = new BN(synthPrice.toString()).div(unit);
    const floatCollateral = floatDebt.mul(floatCRatio).mul(floatSynthPrice);
    // return BigNumber.from(floatCollateral.toString());
    setCollateral(BigNumber.from(floatCollateral.toString()));
}

function setDebtInWeiWithCollateral(collateral: BigNumber) {
    const base = new BN(10);
    const expo = new BN(18);
    const unit = base.pow(expo);

    const [synthPrice, setSynthPrice] = useState(BigNumber.from(0));
    const [cRatio, setCRatio] = useState(BigNumber.from(0));
    const [debt, setDebt] = useState(BigNumber.from(0));

    const floatCRatio = new BN(cRatio.toString()).div(unit);
    const floatCollateral = new BN(collateral.toString())
    const floatSynthPrice = new BN(synthPrice.toString()).div(unit);
    const floatDebt = floatCollateral.div(floatCRatio.mul(floatSynthPrice));
    setDebt(BigNumber.from(floatDebt.toString()));
    // return BigNumber.from(floatDebt.toString());
}

function setCollateralInWeiWithCRatio(cRatio: BigNumber) {
    const base = new BN(10);
    const expo = new BN(18);
    const unit = base.pow(expo);

    const [synthPrice, setSynthPrice] = useState(BigNumber.from(0));
    const [debt, setDebt] = useState(BigNumber.from(0));
    const [collateral, setCollateral] = useState(BigNumber.from(0));
    const floatCRatio = new BN(cRatio.toString()).div(unit);
    const floatDebt = new BN(debt.toString());
    const floatSynthPrice = new BN(synthPrice.toString()).div(unit);
    const floatCollateral = floatDebt.mul(floatCRatio).mul(floatSynthPrice);

    // return BigNumber.from(floatCollateral.toString());
    setCollateral(BigNumber.from(floatCollateral.toString()));
}


function CollateralField(spec: BurnSpec) {
    const base = new BN(10);
    const expo = new BN(18);
    const unit = base.pow(expo);
    const {collateral, setCollateral} = spec;
    const currCollateral = (new BN(collateral.toString()).div(unit)).toNumber();

    const [synthPrice, setSynthPrice] = useState(BigNumber.from(0));
    const [oldCRatio, setOldCRatio] = useState(BigNumber.from(0));
    const [oldDebt, setOldDebt] = useState(BigNumber.from(0));


    function updateCollateral(newCollateral: number) {
        const floatCollateral = new BN(newCollateral).mul(unit);
        const floatCRatio = new BN(oldCRatio.toString()).div(unit);
        const floatSynthPrice = new BN(synthPrice.toString()).div(unit);
        const floatDebt = floatCollateral.div(floatCRatio.mul(floatSynthPrice));
        setOldDebt(BigNumber.from(floatDebt.toString()));
        setCollateral(BigNumber.from(floatCollateral.toString()));
    };
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

function DebtField(spec: BurnSpec) {
    const base = new BN(10);
    const expo = new BN(18);
    const unit = base.pow(expo);
    const {debt, setDebt} = spec;
    const currDebt = (new BN(debt.toString()).div(unit)).toNumber();

    const [cRatio, setCRatio] = useState(BigNumber.from(0));
    const [collateral, setCollateral] = useState(BigNumber.from(0));
    const [synthPrice, setSynthPrice] = useState(BigNumber.from(0));

    function updateDebt(newDebt: number) {
        const floatDebt = new BN(newDebt).mul(unit);
        // const floatCRatio = new BN(cRatio.toString()).div(unit);
        // const floatSynthPrice = new BN(synthPrice.toString()).div(unit);
        // const floatCollateral = floatDebt.mul(floatCRatio).mul(floatSynthPrice);
        // // return BigNumber.from(floatCollateral.toString());
        // setCollateral(BigNumber.from(floatCollateral.toString()));
        setDebt(BigNumber.from(floatDebt.toString()));
    };
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

function CRatioField(spec: BurnSpec) {
    const base = new BN(10);
    const expo = new BN(18);
    const unit = base.pow(expo);
    const {cRatio, setCRatio} = spec;
    const currCRatio = (new BN(cRatio.toString()).mul(new BN(100)).div(unit)).toNumber();

    const [synthPrice, setSynthPrice] = useState(BigNumber.from(0));
    const [debt, setDebt] = useState(BigNumber.from(0));
    const [collateral, setCollateral] = useState(BigNumber.from(0));


    function updateCRatio(newCRatio: number) {
        const floatCRatio = new BN(newCRatio).mul(unit).div(new BN(100));
        const floatDebt = new BN(debt.toString());
        const floatSynthPrice = new BN(synthPrice.toString()).div(unit);
        const floatCollateral = floatDebt.mul(floatCRatio).mul(floatSynthPrice);

        // return BigNumber.from(floatCollateral.toString());
        setCollateral(BigNumber.from(floatCollateral.toString()));
        setCRatio(BigNumber.from(floatCRatio.toString()));
    };
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

function OrigCountField({ count }: {count: BigNumber}) {
    const numCount = ethers.utils.formatEther(count);
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
                        ratio,
                        setRatio,
                    }: SellSpecConfig & SellSpec) {
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

function SellForm({ instrument }: { instrument: Instrument }) {
    const { appData } = useContext(AppContext);
    const { walletAddress } = useContext(AppContext);
    const [collateral, setCollateral] = useState(BigNumber.from(0));
    const [cRatio, setCRatio] = useState(BigNumber.from(0));
    const [debt, setDebt] = useState(BigNumber.from(0));

    const [oldCollateral, setOldCollateral] = useState(BigNumber.from(0));
    const [oldCRatio, setOldCRatio] = useState(BigNumber.from(0));
    const [oldDebt, setOldDebt] = useState(BigNumber.from(0));
    const [synthPrice, setSynthPrice] = useState(BigNumber.from(0));

    //
    // useEffect(() => {
    //     const [debt, setDebt] = useState(BigNumber.from(0));
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

    const {unit} = useContext(AppContext);
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

    useEffect(() => {
        const getAndSetUserStat = async() => {
            const [bnCollateral, bnCRatio, bnDebt, bnSynthPrice] = await loadUserOrderStat(walletAddress, 1);
            // const cRatio = BigNumber.from(bnCRatio).mul(100).div(unit).toNumber();
            // const collateral = BigNumber.from(bnCollateral).div(unit).toNumber();
            // const foo = ethers.utils.formatEther(BigNumber.from(bnCRatio));
            // const debt = BigNumber.from(bnDebt).div(unit).toNumber();
            const cRatio = BigNumber.from(bnCRatio);
            const collateral = BigNumber.from(bnCollateral);
            const debt = BigNumber.from(bnDebt);
            const synthPrice = BigNumber.from(bnSynthPrice);
            setOldCollateral(collateral);
            setOldCRatio(cRatio);
            setOldDebt(debt);
            setSynthPrice(synthPrice);
        };
        if(walletAddress.length > 0) {
            getAndSetUserStat();
        }
    }, [unit, walletAddress]);


    const burnSynthPressed = async () => {
        const burnSynthResponse = await burnSynth(walletAddress, "SynthTest1", oldDebt.sub(BurnSpec.debt));
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
                <FieldLabel title="Change collateral" description="blah" />
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                    }}>
                    <OrigCountField count={oldCollateral} />
                    <ArrowForwardIcon color="primary" vertical-align="middle" />
                    <CollateralField {...BurnSpec} />
                </div>

                <FieldLabel title="Change ratio" description="blah" />
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                    }}>
                    <OrigCountField count={oldCRatio} />
                    <ArrowForwardIcon color="primary" vertical-align="middle" />
                    <CRatioField {...BurnSpec} />
                </div>

                <FieldLabel title="Change minted" description="blah" />
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                    }}>s
                    <OrigCountField count={oldDebt} />
                    <ArrowForwardIcon color="primary" vertical-align="middle" />
                    <DebtField {...BurnSpec} />
                </div>

                <FieldLabel title="Set ratio" description="blah" />
                <RatioField {...SellSpec} {...fakeLimits} />
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

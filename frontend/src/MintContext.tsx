import React, {useState} from "react";


enum LastChangedField {
    COLLATERAL = "COLLATERAL",
    RATIO = "RATIO",
    DEBT = "DEBT",
}

export const MintContext = React.createContext<{
    collateral: string;
    ratio: string;
    debt: string;
    collateralValid: boolean;
    ratioValid: boolean;
    debtValid: boolean;
    setCollateral: (c: string, p: number) => void;
    setRatio: (r: string, p: number) => void;
    setDebt: (d: string, p: number) => void;
}>({
    collateral: "",
    ratio: "",
    debt: "",
    collateralValid: false,
    ratioValid: false,
    debtValid: false,
    setCollateral: (c, p) => {},
    setRatio: (r, p) => {},
    setDebt: (d, p) => {},
});

function calcCollateral(price: number, ratio: number, debt: number) : number {
    return (ratio / 100) * (debt * price);
}

function calcRatio(price: number, collateral: number, debt: number) : number {
    return collateral / (debt * price) * 100;
}

function calcDebt(price: number, collateral: number, ratio: number) : number {
    return collateral / (ratio / 100) / price;
}

export function MintContextProvider({children = null} : {children: React.ReactElement | null}) {
    const [collateral, setCollateralInternal] = useState("");
    const [ratio, setRatioInternal] = useState("");
    const [debt, setDebtInternal] = useState("");

    const [collateralValid, setCollateralValid] = useState(false);
    const [ratioValid, setRatioValid] = useState(false);
    const [debtValid, setDebtValid] = useState(false);

    const [lastField, setLastField] = useState(LastChangedField.RATIO);

    const setCollateral = (newCollateral : string, price: number) => {
        const collateralNum = +newCollateral;
        const valid = collateralNum >= 0;
        setCollateralValid(valid);
        // Do not use collateralValid since it's not necessarily updated yet
        if (valid) {
            setCollateralInternal(newCollateral);
            switch (lastField) {
                case LastChangedField.RATIO:
                    setDebtInternal(calcDebt(price, +newCollateral, +ratio).toString());
                    break;
                case LastChangedField.DEBT:
                    setRatioInternal(calcRatio(price, +newCollateral, +debt).toString());
                    break;
                default:
                    break;
            }
            setLastField(LastChangedField.COLLATERAL);
        }
        console.log("Collateral", collateral, "Ratio", ratio, "Debt", debt);
    }

    const setRatio = (newRatio : string, price : number) => {
        const ratioNum = +newRatio;
        const valid = ratioNum >= 0;
        setRatioValid(valid);
        if (valid) {
            setRatioInternal(newRatio);
            switch (lastField) {
                case LastChangedField.COLLATERAL:
                    setDebtInternal(calcDebt(price, +collateral, +newRatio).toString());
                    break;
                case LastChangedField.DEBT:
                    setCollateralInternal(calcCollateral(price, +newRatio, +debt).toString());
                    break;
                default:
                    break;
            }
            setLastField(LastChangedField.RATIO);
        }
        console.log("Collateral", collateral, "Ratio", ratio, "Debt", debt);
    }

    const setDebt = (newDebt : string, price: number) => {
        const debtNum = +newDebt;
        const valid = debtNum >= 0;
        setDebtValid(valid);
        if (valid) {
            setDebtInternal(newDebt);
            switch (lastField) {
                case LastChangedField.COLLATERAL:
                    setRatioInternal(calcRatio(price, +collateral, +newDebt).toString());
                    break;
                case LastChangedField.RATIO:
                    setCollateralInternal(calcCollateral(price, +ratio, +newDebt).toString());
                    break;
                default:
                    break;
            }
            setLastField(LastChangedField.DEBT);
        }
        console.log("Collateral", collateral, "Ratio", ratio, "Debt", debt);
    }

    return (
        <MintContext.Provider value={{collateral, ratio, debt, collateralValid, ratioValid, debtValid, setCollateral, setRatio, setDebt}}>
            {children}
        </MintContext.Provider>
    )
}

import {BigNumber} from 'bignumber.js'
import React, {useState, useReducer} from "react";

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
    setCollateral: (c: string, p: BigNumber) => void;
    setRatio: (r: string, p: BigNumber) => void;
    setDebt: (d: string, p: BigNumber) => void;
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

function calcCollateral(price: BigNumber, ratio: BigNumber, debt: BigNumber) : BigNumber {
    return ratio.div(new BigNumber(100)).times(debt.times(price));
}

function calcRatio(price: BigNumber, collateral: BigNumber, debt: BigNumber) : BigNumber {
    return collateral.div(debt.times(price)).times(new BigNumber(100));
}

function calcDebt(price: BigNumber, collateral: BigNumber, ratio: BigNumber) : BigNumber {
    return collateral.div(ratio.div(new BigNumber(100))).div(price);
}


// WITHOUT SPECIFIC MENTION, THE STRING VALUES HERE USE THE SAME PRECISION AS USER INPUTS:
// RATIO IS IN PERCENT, COLLATERAL AND DEBT ARE BOTH IN "1E18".
const initManageState: ManageState = {
    collateral: "",
    ratio: "",
    debt: "",
    collateralValid: false,
    ratioValid: false,
    debtValid: false,
    lastField: null
}

type ManageState = {
    collateral: string,
    ratio: string,
    debt: string,
    collateralValid: boolean,
    ratioValid: boolean,
    debtValid: boolean,
    lastField: string|null
};

export enum ManageActionKind {
    COLLATERAL = "collateral",
    RATIO = "ratio",
    DEBT = "debt",
}

export type ManageAction = {
    type: ManageActionKind,
    payload: BigNumber,
    price: BigNumber,
}

export const ManageContext = React.createContext<{
    state: ManageState,
    dispatch: any,
}>({
    state: initManageState,
    dispatch: null
});


export function ManageContextProvider({children = null} : {children: React.ReactElement | null}) {

    function reducer(state: ManageState, action: ManageAction) {
        const {type, payload, price} = action;
        switch (type) {
            case ManageActionKind.COLLATERAL: {
                const collateral = new BigNumber(payload);
                const debt = new BigNumber(state.debt);
                if (debt.isNaN()) {
                    return {
                        ...state,
                        collateral: collateral.toString(),
                        collateralValid: collateral.gte(0),
                    }
                }

                const ratio = collateral.div(debt.times(price)).times(100);
                return {
                    ...state,
                    collateral: collateral.toString(),
                    ratio: ratio.toString(),
                    debt: debt.toString(),
                    collateralValid: collateral.gte(0),
                    ratioValid: ratio.gte(0),
                    debtValid: debt.gte(0),
                }

            }
            case ManageActionKind.DEBT: {
                const collateral = new BigNumber(state.collateral);
                const debt = new BigNumber(payload);
                if (collateral.isNaN()) {
                    return {
                        ...state,
                        debt: debt.toString(),
                        debtValid: debt.gte(0),
                    }
                }
                const ratio = collateral.div(debt.times(price)).times(100);
                return {
                    ...state,
                    collateral: collateral.toString(),
                    ratio: ratio.toString(),
                    debt: debt.toString(),
                    collateralValid: collateral.gte(0),
                    ratioValid: ratio.gte(0),
                    debtValid: debt.gte(0),
                }
            }
            case ManageActionKind.RATIO: {
                const debt = new BigNumber(state.debt);
                const ratio = new BigNumber(payload);
                if (debt.isNaN()) {
                    return {
                        ...state,
                        ratio: ratio.toString(),
                        ratioValid: ratio.gte(0),
                    }
                }
                const collateral = debt.times(price).times(ratio.div(100));
                return {
                    ...state,
                    collateral: collateral.toString(),
                    ratio: ratio.toString(),
                    debt: debt.toString(),
                    collateralValid: collateral.gte(0),
                    ratioValid: ratio.gte(0),
                    debtValid: debt.gte(0),
                }
            }
            default:
                return state;
        }
        // switch (type) {
        //     case ManageActionKind.COLLATERAL: {
        //         const collateral = new BigNumber(payload);
        //
        //         switch (state.lastField) {
        //             case ManageActionKind.RATIO: {
        //                 const ratio = new BigNumber(state.ratio).div(100);
        //                 const debt = collateral.div(ratio).div(price);
        //                 return {
        //                     ...state,
        //                     collateral: collateral.toString(),
        //                     ratio: ratio.times(100).toString(),
        //                     debt: debt.toString(),
        //                     collateralValid: collateral.gte(0),
        //                     ratioValid: ratio.gte(0),
        //                     debtValid: debt.gte(0),
        //                     lastField: ManageActionKind.COLLATERAL
        //                 }
        //             }
        //             case ManageActionKind.DEBT: {
        //                 const debt = new BigNumber(state.debt);
        //                 const ratio = collateral.div(debt.times(price)).times(100);
        //                 return {
        //                     ...state,
        //                     collateral: collateral.toString(),
        //                     ratio: ratio.times(100).toString(),
        //                     debt: debt.toString(),
        //                     collateralValid: collateral.gte(0),
        //                     ratioValid: ratio.gte(0),
        //                     debtValid: debt.gte(0),
        //                     lastField: ManageActionKind.COLLATERAL
        //                 }
        //             }
        //             default:
        //                 return {
        //                     ...state,
        //                     collateral: collateral.toString(),
        //                     collateralValid: collateral.gte(0),
        //                     lastField: ManageActionKind.COLLATERAL
        //                 }
        //         }
        //     }
        //     case ManageActionKind.DEBT: {
        //         const debt = new BigNumber(payload);
        //         switch (state.lastField) {
        //             case ManageActionKind.RATIO: {
        //                 const ratio = new BigNumber(state.ratio).div(100);
        //                 const collateral = debt.times(price).times(ratio);
        //                 return {
        //                     ...state,
        //                     collateral: collateral.toString(),
        //                     ratio: ratio.times(100).toString(),
        //                     debt: debt.toString(),
        //                     collateralValid: collateral.gte(0),
        //                     ratioValid: ratio.gte(0),
        //                     debtValid: debt.gte(0),
        //                     lastField: ManageActionKind.DEBT
        //                 }
        //             }
        //             case ManageActionKind.COLLATERAL: {
        //                 const collateral = new BigNumber(state.collateral);
        //                 const ratio = collateral.div(debt.times(price)).times(100);
        //                 return {
        //                     ...state,
        //                     collateral: collateral.toString(),
        //                     ratio: ratio.times(100).toString(),
        //                     debt: debt.toString(),
        //                     collateralValid: collateral.gte(0),
        //                     ratioValid: ratio.gte(0),
        //                     debtValid: debt.gte(0),
        //                     lastField: ManageActionKind.DEBT
        //                 }
        //             }
        //             default:
        //                 return {
        //                     ...state,
        //                     debt: debt.toString(),
        //                     debtValid: debt.gte(0),
        //                     lastField: ManageActionKind.DEBT
        //                 }
        //         }
        //     }
        //     case ManageActionKind.RATIO: {
        //         const ratio = new BigNumber(payload).div(100);
        //         switch (state.lastField) {
        //             case ManageActionKind.DEBT: {
        //                 const debt = new BigNumber(state.debt);
        //                 const collateral = debt.times(price).times(ratio);
        //                 return {
        //                     ...state,
        //                     collateral: collateral.toString(),
        //                     ratio: ratio.times(100).toString(),
        //                     debt: debt.toString(),
        //                     collateralValid: collateral.gte(0),
        //                     ratioValid: ratio.gte(0),
        //                     debtValid: debt.gte(0),
        //                     lastField: ManageActionKind.RATIO
        //                 }
        //             }
        //             case ManageActionKind.COLLATERAL: {
        //                 const collateral = new BigNumber(state.collateral);
        //                 const debt = collateral.div(ratio).div(price)
        //                 return {
        //                     ...state,
        //                     collateral: collateral.toString(),
        //                     ratio: ratio.times(100).toString(),
        //                     debt: debt.toString(),
        //                     collateralValid: collateral.gte(0),
        //                     ratioValid: ratio.gte(0),
        //                     debtValid: debt.gte(0),
        //                     lastField: ManageActionKind.RATIO
        //                 }
        //             }
        //             default:
        //                 return {
        //                     ...state,
        //                     ratio: ratio.times(100).toString(),
        //                     ratioValid: ratio.gte(0),
        //                     lastField: ManageActionKind.RATIO
        //                 }
        //         }
        //     }
        //     default:
        //         return state;
        // }
    }
    const [state, dispatch] = useReducer(reducer, initManageState);

    return (
        <ManageContext.Provider value={{state, dispatch}}>
            {children}
        </ManageContext.Provider>
    )
}

export function MintContextProvider({children = null} : {children: React.ReactElement | null}) {

    const [collateral, setCollateralInternal] = useState("");
    const [ratio, setRatioInternal] = useState("");
    const [debt, setDebtInternal] = useState("");

    const [collateralValid, setCollateralValid] = useState(false);
    const [ratioValid, setRatioValid] = useState(false);
    const [debtValid, setDebtValid] = useState(false);

    const [lastField, setLastField] = useState(LastChangedField.RATIO);

    const setCollateral = (newCollateral : string, price: BigNumber) => {
        const collateralNum = new BigNumber(newCollateral);
        const valid = collateralNum.gte(0);
        setCollateralValid(valid);
        // Do not use collateralValid since it's not necessarily updated yet
        if (valid) {
            setCollateralInternal(newCollateral);
            switch (lastField) {
                case LastChangedField.RATIO:
                    setDebtInternal(calcDebt(price, new BigNumber(newCollateral), new BigNumber(ratio)).toString());
                    break;
                case LastChangedField.DEBT:
                    setRatioInternal(calcRatio(price, new BigNumber(newCollateral), new BigNumber(debt)).toString());
                    break;
                default:
                    break;
            }
            setLastField(LastChangedField.COLLATERAL);
        }
        console.log("Collateral", collateral, "Ratio", ratio, "Debt", debt);
    }

    const setRatio = (newRatio : string, price : BigNumber) => {
        const ratioNum = new BigNumber(newRatio);
        const valid = ratioNum.gte(0);
        setRatioValid(valid);
        if (valid) {
            setRatioInternal(newRatio);
            switch (lastField) {
                case LastChangedField.COLLATERAL:
                    setDebtInternal(calcDebt(price, new BigNumber(collateral), new BigNumber(newRatio)).toString());
                    break;
                case LastChangedField.DEBT:
                    setCollateralInternal(calcCollateral(price, new BigNumber(newRatio), new BigNumber(debt)).toString());
                    break;
                default:
                    break;
            }
            setLastField(LastChangedField.RATIO);
        }
        console.log("Collateral", collateral, "Ratio", ratio, "Debt", debt);
    }

    const setDebt = (newDebt : string, price: BigNumber) => {
        const debtNum = new BigNumber(newDebt);
        const valid = debtNum.gte(0);
        setDebtValid(valid);
        if (valid) {
            setDebtInternal(newDebt);
            switch (lastField) {
                case LastChangedField.COLLATERAL:
                    setRatioInternal(calcRatio(price, new BigNumber(collateral), new BigNumber(newDebt)).toString());
                    break;
                case LastChangedField.RATIO:
                    setCollateralInternal(calcCollateral(price, new BigNumber(ratio), new BigNumber(newDebt)).toString());
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

import { BigNumber } from "bignumber.js";
import React, { useReducer } from "react";

enum LastChangedField {
  COLLATERAL = "COLLATERAL",
  RATIO = "RATIO",
  DEBT = "DEBT",
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
  lastField: null,
};


type ManageState = {
  collateral: string;
  ratio: string;
  debt: string;
  collateralValid: boolean;
  ratioValid: boolean;
  debtValid: boolean;
  lastField: string | null;
};

export enum ManageActionKind {
  COLLATERAL = "collateral",
  RATIO = "ratio",
  DEBT = "debt",
  SET = "set",
}

export type ManageAction = {
    type: ManageActionKind,
    newCollateral: BigNumber,
    newDebt:BigNumber,
    newRatio: BigNumber,
    price: BigNumber,
    payload: BigNumber,
}

export const ManageContext = React.createContext<{
  state: ManageState;
  dispatch: any;
}>({
  state: initManageState,
  dispatch: null,
});

const initMintState: ManageState = {
  collateral: "0",
  ratio: "150",
  debt: "",
  collateralValid: true,
  ratioValid: true,
  debtValid: false,
  lastField: null,
};

export const MintContext = React.createContext<{
  state: ManageState;
  dispatch: any;
}>({
  state: initMintState,
  dispatch: null,
});


export function ManageContextProvider({children = null} : {children: React.ReactElement | null}) {
    function reducer(state: ManageState, action: ManageAction) {
        // eslint-disable-next-line prefer-const
        let {type, newCollateral, newRatio, newDebt, payload, price} = action;
        switch (type) {
            case ManageActionKind.SET: {
                const collateral = new BigNumber(newCollateral);
                const debt = new BigNumber(newDebt);
                const ratio = new BigNumber(newRatio);
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

            case ManageActionKind.COLLATERAL: {
                newCollateral = payload

                const collateral = new BigNumber(newCollateral);
                // let debt = new BigNumber(state.debt);
                // let ratio = collateral.div(debt.times(price)).times(100);
                // if (debt.isNaN() && ratio.isNaN()) {
                //     return {
                //         ...state,
                //         collateral: collateral.toString(),
                //         collateralValid: collateral.gte(0),
                //     }
                // }
                // if (debt.isNaN()) {
                //     debt = collateral.div(ratio).times(100).div(price);
                // } else {
                //     ratio = collateral.div(debt.times(price)).times(100);
                // }
                const debt = new BigNumber(state.debt);
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
                newDebt = payload;
                const debt = new BigNumber(newDebt);

                if (debt.isZero()) {
                    return state;
                }
                // let collateral = new BigNumber(state.collateral);
                // let ratio = new BigNumber(state.ratio);

                // if (collateral.isNaN() && ratio.isNaN()) {
                //     return {
                //         ...state,
                //         debt: debt.toString(),
                //         debtValid: debt.gte(0),
                //     }
                // }
                //
                // if (collateral.isNaN()) {
                //     collateral = debt.times(price).times(ratio).div(100);
                // } else {
                //     ratio = collateral.div(debt.times(price)).times(100);
                // }

                const collateral = new BigNumber(state.collateral);
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
                newRatio = payload;

                const ratio = new BigNumber(newRatio);
                // let debt = new BigNumber(state.debt);
                // let collateral = new BigNumber(state.collateral);
                //
                // if (debt.isNaN() && collateral.isNaN()) {
                //     return {
                //         ...state,
                //         ratio: ratio.toString(),
                //         ratioValid: ratio.gte(0),
                //     }
                // }
                // if (debt.isNaN()) {
                //     debt = collateral.div(ratio).times(100).div(price);
                // } else {
                //     collateral = debt.times(price).times(ratio.div(100));
                // }
                const debt = new BigNumber(state.debt);
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
    <ManageContext.Provider value={{ state, dispatch }}>
      {children}
    </ManageContext.Provider>
  );
}

export function MintContextProvider({
  children = null,
}: {
  children: React.ReactElement | null;
}) {
  function reducer(state: ManageState, action: ManageAction) {
    const { type, newCollateral, newRatio, newDebt, price } = action;
    switch (type) {
      case ManageActionKind.COLLATERAL: {
        const collateral = new BigNumber(newCollateral);
        const ratio = new BigNumber(state.ratio);
        const debt = collateral.div(ratio).times(100).div(price);
        return {
          ...state,
          collateral: collateral.toString(),
          ratio: ratio.toString(),
          debt: debt.toString(),
          collateralValid: collateral.gte(0),
          ratioValid: ratio.gte(0),
          debtValid: debt.gte(0),
        };
      }

      case ManageActionKind.RATIO: {
        const ratio = new BigNumber(newRatio);
        const collateral = new BigNumber(state.collateral);
        const debt = collateral.div(ratio).times(100).div(price);
        return {
          ...state,
          collateral: collateral.toString(),
          ratio: ratio.toString(),
          debt: debt.toString(),
          collateralValid: collateral.gte(0),
          ratioValid: ratio.gte(0),
          debtValid: debt.gte(0),
        };
      }
      default:
        return state;
    }
  }
  const [state, dispatch] = useReducer(reducer, initMintState);

  return (
    <MintContext.Provider value={{ state, dispatch }}>
      {children}
    </MintContext.Provider>
  );
}

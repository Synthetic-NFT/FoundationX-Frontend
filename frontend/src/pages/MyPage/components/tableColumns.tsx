import { makeStyles } from "@material-ui/core/styles";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { Button, IconButton, Snackbar, Tooltip } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import React from "react";
import {Route, Switch, useHistory} from "react-router-dom";

import ReturnButton from "../../../components/ReturnButton";
import { NFTIcons } from "../../../fakeData";
import CoinSwapper from "../../../swapper/CoinSwapper";
import theme from "../../../theme";
import ClaimDetail from "../../Claim/components/ClaimDetail";
import ClaimPage from "../../Claim/components/ClaimPage";
import ClaimTable from "../../Claim/components/ClaimTable";
import {BorrowingData, HoldingData, MyPageTableData} from "../../../util/dataStructures";

type ColumnConfigWithoutRenderers = {
  id: string;
  label: string;
  minWidth: string;
  align?: "left" | "left";
  tooltip?: string;
};

export type HeaderRendererProps = {
  config: ColumnConfigWithoutRenderers;
};

export type CellRendererProps = {
  row: MyPageTableData;
};

export type TableCellElement = React.ReactElement<typeof TableCell>;

export type ColumnConfig = ColumnConfigWithoutRenderers & {
  cellRenderer: (props: CellRendererProps) => TableCellElement;
  headerRenderer: (props: HeaderRendererProps) => TableCellElement;
};

export function DefaultHeaderRenderer({
  config,
}: HeaderRendererProps): TableCellElement {
  return (
    <TableCell
      align={config.align}
      style={{
        width: config.minWidth,
        backgroundColor: "inherit",
        height: "3.17rem",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "0.75rem",
        lineHeight: "1rem",
        color: "#FFFFFF"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: config.align === "left" ? "start" : "end",
        }}
      >
        <b>{config.label}</b>
      </div>
    </TableCell>
  );
}

function TooltipHeaderRenderer({
  config,
}: HeaderRendererProps): TableCellElement {
  return (
    <TableCell
      align={config.align}
      style={{
        minWidth: config.minWidth,
        backgroundColor: "inherit",
        height: "3.17rem",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "0.75rem",
        lineHeight: "1rem",
        color: "#FFFFFF"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: config.align === "left" ? "start" : "end",
        }}
      >
        <b>{config.label}</b>
        <div
          style={{
            marginRight: "0.67rem",
          }}
        />
        <Tooltip title={<h4>{config.tooltip}</h4>}>
          <IconButton>
            <HelpOutlineOutlinedIcon
              sx={{ color: theme.tableHeaderTextColor }}
            />
          </IconButton>
        </Tooltip>
      </div>
    </TableCell>
  );
}


export const TABLE_CELL_STYLE = {
  color: theme.tableRowPrimaryTextColor,
  borderColor: theme.tableBorderColor,
  height: "3.67rem"
};

export const TABLE_CELL_STYLE_HOVER = {
  ...TABLE_CELL_STYLE,
};

export const TABLE_CELL_LINK_STYLE = {
  color: theme.tableLinkColor,
};

const useStyles = makeStyles({
  link: {
    color: theme.tableLinkColor,
  },
  router: {
    "&:hover": {
      backgroundColor: theme.tableHoverColor,
    }
  }
});
export function TickerCellRenderer({
  row,
}: CellRendererProps): TableCellElement {
  return (
    <TableCell style={TABLE_CELL_STYLE}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* This is just a placeholder. We need to replace this with img tag when we have
        the images for the tickers. */}
        {/* <img
          src={NFTIcons.get(row.ticker)}
          alt={row.ticker}
          width="1.33rem"
          height="1.33rem"
        /> */}
        {/* <div
          style={{
            marginRight: "0.67rem",
          }}
        /> */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex" }}>
            <b>{row.ticker}</b>
          </div>
          {/* <div
            style={{ color: theme.tableRowSecondaryTextColor, display: "flex" }}
          >
            {row.ticker}
          </div> */}
        </div>
      </div>
    </TableCell>
  );
}

function PoolPriceCellRenderer({ row }: CellRendererProps): TableCellElement {
  return (
    <TableCell align="left" style={TABLE_CELL_STYLE} >
      <b>{row.poolPrice} ETH</b>
    </TableCell>
  );
}

function OraclePriceCellRenderer({ row }: CellRendererProps): TableCellElement {
  return (
    <TableCell align="left" style={TABLE_CELL_STYLE} >
      <b>{row.oraclePrice}</b>
    </TableCell>
  );
}

function BalanceCellRenderer({ row }: CellRendererProps): TableCellElement {
  return (
    <TableCell align="left" style={TABLE_CELL_STYLE} >
      <b>{row.balance}</b>
    </TableCell>
  );
}

function ValueCellRenderer({ row }: CellRendererProps): TableCellElement {
  return (
    <TableCell align="left" style={TABLE_CELL_STYLE} >
      <b>{row.value} ETH</b>
    </TableCell>
  );
}

function CollateralCellRenderer({ row }: CellRendererProps): TableCellElement {
  return (
    <TableCell align="left" style={TABLE_CELL_STYLE} >
      <b>{row.collateral} ETH</b>
    </TableCell>
  );
}

function HoldingActionCellRenderer({ row }: CellRendererProps): TableCellElement {
  const history = useHistory();
  const styles = useStyles();

  function handleSwapClick() {
    // history.push(`/swap`);
    history.push(
    '/swap', row.instrument
    )
  // return (
  //   <Switch>
  //       history.push(
  //           '/swap', row.instrument
  //       )
  //       <Route path={`/swap`}>
  //           <CoinSwapper instrument={row.instrument} />
  //       </Route>
  //   </Switch>
  // );
    // history.push(`/trade/order/buy?ticker=${row.ticker}`);
    //
    //   return (
    //       <Switch>
    //           <Route path={`/swap`}>
    //               <CoinSwapper instrument={row.instrument} />
    //           </Route>
    //       </Switch>
    //   );
  }
  function handleManageClick() {
    history.push(`/mypage/manage/nft?ticker=${row.ticker}`);
  }

  return (
    <TableCell align="left" style={TABLE_CELL_STYLE} >
      <Button
        size="small"
        variant="contained"
        onClick={() => handleSwapClick()}
        style={{
          background: "#4340CB",
          borderRadius: "2.08rem",
          marginRight: "0.4rem"
        }}
      >
        Swap
      </Button>
      <Button
        size="small"
        variant="contained"
        onClick={() => handleManageClick()}
        style={{
          background: "#4340CB",
          borderRadius: "2.08rem",
        }}
      >
        Reedem
      </Button>
    </TableCell>
  );
}

function BorrowingActionCellRenderer({ row }: CellRendererProps): TableCellElement {
  const history = useHistory();
  const styles = useStyles();

  function handleClick() {
    history.push(`/mypage/manage/withdraw?ticker=${row.ticker}`);
  }
  return (
    <TableCell align="left" style={TABLE_CELL_STYLE}>
      <Button
        size="small"
        variant="contained"
        onClick={() => handleClick()}
        style={{
          background: "#4340CB",
          borderRadius: "2.08rem",
        }}
      >
        Withdraw
      </Button>
    </TableCell>
  );
}

function BorrowedCellRenderer({ row }: CellRendererProps): TableCellElement {
  return (
    <TableCell align="left" style={TABLE_CELL_STYLE}>
      <div>{row.borrowed.meth} mETH</div>
      <div>{row.borrowed.ust} UST</div>
    </TableCell>
  );
}

function CollateralRatioCellRenderer({ row }: CellRendererProps): TableCellElement {
  return (
    <TableCell align="left" style={TABLE_CELL_STYLE}>
      <span>{row.collateralRatio} %</span>
      <span>Min: 150% </span>
    </TableCell>
  );
}
// Defines the available columns in the instrument table and how they are rendered.
export const holdingTableColumns: ColumnConfig[] = [
  {
    id: "ticker",
    label: "Ticker",
    minWidth: "20%",
    align: "left",
    cellRenderer: TickerCellRenderer,
    headerRenderer: DefaultHeaderRenderer,
  },
  {
    id: "balance",
    label: "Balance",
    minWidth: "17%",
    align: "left",
    cellRenderer: BalanceCellRenderer,
    headerRenderer: DefaultHeaderRenderer,
    tooltip: "Balance"
  },
  {
    id: "value",
    label: "Minted with ETH",
    minWidth: "17%",
    align: "left",
    cellRenderer: ValueCellRenderer,
    headerRenderer: DefaultHeaderRenderer,
    tooltip: "Value"
  },
  {
    id: "poolPrice",
    label: "Token Price",
    minWidth: "17%",
    align: "left",
    cellRenderer: PoolPriceCellRenderer,
    headerRenderer: DefaultHeaderRenderer,
  },
  {
    id: "action",
    label: "Action",
    minWidth: "29%",
    align: "left",
    cellRenderer: HoldingActionCellRenderer,
    headerRenderer: DefaultHeaderRenderer,
  },
];

export const borrowingTableColumns: ColumnConfig[] = [
  {
    id: "ticker",
    label: "Pool",
    minWidth: "34%",
    align: "left",
    cellRenderer: TickerCellRenderer,
    headerRenderer: DefaultHeaderRenderer,
  },
  {
    id: "oraclePrice",
    label: "Withdrawable",
    minWidth: "33%",
    align: "left",
    cellRenderer: OraclePriceCellRenderer,
    headerRenderer: DefaultHeaderRenderer,
  },
  {
    id: "action",
    label: "Action",
    minWidth: "33%",
    align: "left",
    cellRenderer: BorrowingActionCellRenderer,
    headerRenderer: DefaultHeaderRenderer,
  },
];

// export const governTableColumns: ColumnConfig[] = [
//   {
//     id: "ticker",
//     label: "Ticker",
//     minWidth: "17%",
//     align: "left",
//     cellRenderer: TickerCellRenderer,
//     headerRenderer: DefaultHeaderRenderer,
//   },
//   {
//     id: "oraclePrice",
//     label: "Oracle Price",
//     minWidth: "17%",
//     align: "left",
//     cellRenderer: OraclePriceCellRenderer,
//     headerRenderer: DefaultHeaderRenderer,
//   },
//   {
//     id: "borrowed",
//     label: "Borrowed",
//     minWidth: "17%",
//     align: "left",
//     cellRenderer: BorrowedCellRenderer,
//     headerRenderer: TooltipHeaderRenderer,
//     tooltip: "Borrowed."
//   },
//   {
//     id: "collateral",
//     label: "Collateral",
//     minWidth: "17%",
//     align: "left",
//     cellRenderer: CollateralCellRenderer,
//     headerRenderer: TooltipHeaderRenderer,
//     tooltip: "Collateral."
//   },
//   {
//     id: "collateralRatio",
//     label: "Collateral Ratio",
//     minWidth: "18%",
//     align: "left",
//     cellRenderer: CollateralRatioCellRenderer,
//     headerRenderer: TooltipHeaderRenderer,
//     tooltip: "Collateral Ration"
//   },
//   {
//     id: "action",
//     label: "Action",
//     minWidth: "17%",
//     align: "left",
//     cellRenderer: BorrowingActionCellRenderer,
//     headerRenderer: DefaultHeaderRenderer,
//   },
// ];
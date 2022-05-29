import { makeStyles } from "@material-ui/core/styles";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { Button, IconButton, Snackbar, Tooltip } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import React from "react";
import { useHistory } from "react-router-dom";

import { HoldingData, BorrowingData, MyPageTableData } from "../../../api";
import { NFTIcons } from "../../../fakeData";
import theme from "../../../theme";

type ColumnConfigWithoutRenderers = {
  id: string;
  label: string;
  minWidth: number;
  align?: "left"|"left";
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
        minWidth: config.minWidth,
        backgroundColor: "inherit",
        height: "76px",
        fontFamily: "Poppins",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "18px",
        lineHeight: "27px",
        color: "#FFFFFF",
        paddingLeft: "64px"
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
        height: "76px",
        fontFamily: "Poppins",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "18px",
        lineHeight: "27px",
        color: "#FFFFFF",
        paddingLeft: "64px"
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
            marginRight: "16px",
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
  height: "140px",
  paddingLeft: "64px",
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
          width="32px"
          height="32px"
        /> */}
        {/* <div
          style={{
            marginRight: "16px",
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
      <b>{row.poolPrice} UST</b>
    </TableCell>
  );
}

function OraclePriceCellRenderer({ row }: CellRendererProps): TableCellElement {  
  return (
    <TableCell align="left" style={TABLE_CELL_STYLE} >
      <b>{row.oraclePrice} UST</b>
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
      <b>{row.value} UST</b>
    </TableCell>
  );
}

function CollateralCellRenderer({ row }: CellRendererProps): TableCellElement {  
  return (
    <TableCell align="left" style={TABLE_CELL_STYLE} >
      <b>{row.collateral} UST</b>
    </TableCell>
  );
}

function HoldingActionCellRenderer({ row }: CellRendererProps): TableCellElement {
  const history = useHistory();
  const styles = useStyles();
  
  function handleClick() {
    history.push(`/trade/order/buy?ticker=${row.ticker}`);
  }
  return (
    <TableCell align="left" style={TABLE_CELL_STYLE} >
      <Button
        size="large"
        variant="contained"
        onClick={() => handleClick()}
        style={{
          background: "#4340CB",
          borderRadius: "50px",
        }}
      >
        Trade
      </Button>
    </TableCell>
  );
}

function BorrowingActionCellRenderer({ row }: CellRendererProps): TableCellElement {
  const history = useHistory();
  const styles = useStyles();
  
  function handleClick() {
    history.push(`/trade/order/buy?ticker=${row.ticker}`);
  }
  return (
    <TableCell align="left" style={TABLE_CELL_STYLE}>
      <Button
        size="large"
        variant="contained"
        onClick={() => handleClick()}
      >
        Manage
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
    minWidth: 100,
    align: "left",
    cellRenderer: TickerCellRenderer,
    headerRenderer: DefaultHeaderRenderer,
  },
  {
    id: "poolPrice",
    label: "Pool Price",
    minWidth: 100,
    align: "left",
    cellRenderer: PoolPriceCellRenderer,
    headerRenderer: DefaultHeaderRenderer,
  },
  {
    id: "balance",
    label: "Balance",
    minWidth: 100,
    align: "left",
    cellRenderer: BalanceCellRenderer,
    headerRenderer: TooltipHeaderRenderer,
    tooltip: "Balance"
  },
  {
    id: "value",
    label: "Value",
    minWidth: 100,
    align: "left",
    cellRenderer: ValueCellRenderer,
    headerRenderer: TooltipHeaderRenderer,
    tooltip: "Value"
  },
  {
    id: "action",
    label: "Action",
    minWidth: 100,
    align: "left",
    cellRenderer: HoldingActionCellRenderer,
    headerRenderer: DefaultHeaderRenderer,
  },
];

export const borrowingTableColumns: ColumnConfig[] = [
  {
    id: "ticker",
    label: "Ticker",
    minWidth: 100,
    align: "left",
    cellRenderer: TickerCellRenderer,
    headerRenderer: DefaultHeaderRenderer,
  },
  {
    id: "oraclePrice",
    label: "Oracle Price",
    minWidth: 100,
    align: "left",
    cellRenderer: OraclePriceCellRenderer,
    headerRenderer: DefaultHeaderRenderer,
  },
  {
    id: "borrowed",
    label: "Borrowed",
    minWidth: 100,
    align: "left",
    cellRenderer: BorrowedCellRenderer,
    headerRenderer: TooltipHeaderRenderer,
    tooltip: "Borrowed."
  },
  {
    id: "collateral",
    label: "Collateral",
    minWidth: 100,
    align: "left",
    cellRenderer: CollateralCellRenderer,
    headerRenderer: TooltipHeaderRenderer,
    tooltip: "Collateral."
  },
  {
    id: "collateralRatio",
    label: "Collateral Ratio",
    minWidth: 100,
    align: "left",
    cellRenderer: CollateralRatioCellRenderer,
    headerRenderer: TooltipHeaderRenderer,
    tooltip: "Collateral Ration"
  },
  {
    id: "action",
    label: "Action",
    minWidth: 100,
    align: "left",
    cellRenderer: BorrowingActionCellRenderer,
    headerRenderer: DefaultHeaderRenderer,
  },
];

export const governTableColumns: ColumnConfig[] = [
  {
    id: "ticker",
    label: "Ticker",
    minWidth: 100,
    align: "left",
    cellRenderer: TickerCellRenderer,
    headerRenderer: DefaultHeaderRenderer,
  },
  {
    id: "oraclePrice",
    label: "Oracle Price",
    minWidth: 100,
    align: "left",
    cellRenderer: OraclePriceCellRenderer,
    headerRenderer: DefaultHeaderRenderer,
  },
  {
    id: "borrowed",
    label: "Borrowed",
    minWidth: 100,
    align: "left",
    cellRenderer: BorrowedCellRenderer,
    headerRenderer: TooltipHeaderRenderer,
    tooltip: "Borrowed."
  },
  {
    id: "collateral",
    label: "Collateral",
    minWidth: 100,
    align: "left",
    cellRenderer: CollateralCellRenderer,
    headerRenderer: TooltipHeaderRenderer,
    tooltip: "Collateral."
  },
  {
    id: "collateralRatio",
    label: "Collateral Ratio",
    minWidth: 100,
    align: "left",
    cellRenderer: CollateralRatioCellRenderer,
    headerRenderer: TooltipHeaderRenderer,
    tooltip: "Collateral Ration"
  },
  {
    id: "action",
    label: "Action",
    minWidth: 100,
    align: "left",
    cellRenderer: BorrowingActionCellRenderer,
    headerRenderer: DefaultHeaderRenderer,
  },
];
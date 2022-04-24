import { makeStyles } from "@material-ui/core/styles";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { Button, IconButton, Snackbar, Tooltip } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import React from "react";
import { useHistory } from "react-router-dom";

import { Instrument } from "../../../api";
import { NFTIcons } from "../../../fakeData";
import theme from "../../../theme";

type ColumnConfigWithoutRenderers = {
  id: string;
  label: string;
  minWidth: number;
  align?: "right"|"left";
  tooltip?: string;
};

export type HeaderRendererProps = {
  config: ColumnConfigWithoutRenderers;
};

export type CellRendererProps = {
  row: Instrument;
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
        backgroundColor: theme.tableHeaderBackgroundColor,
        color: theme.tableHeaderTextColor,
        borderColor: theme.tableBorderColor,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: config.align === "right" ? "end" : "start",
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
        backgroundColor: theme.tableHeaderBackgroundColor,
        color: theme.tableHeaderTextColor,
        borderColor: theme.tableBorderColor,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: config.align === "right" ? "end" : "start",
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
        <img
          src={NFTIcons.get(row.ticker)}
          alt={row.ticker}
          width="32px"
          height="32px"
        />
        <div
          style={{
            marginRight: "16px",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex" }}>
            <b>{row.ticker}</b>
          </div>
          <div
            style={{ color: theme.tableRowSecondaryTextColor, display: "flex" }}
          >
            {row.fullName}
          </div>
        </div>
      </div>
    </TableCell>
  );
}

function PriceCellRenderer({ row }: CellRendererProps): TableCellElement {  
  return (
    <TableCell align="right" style={TABLE_CELL_STYLE} >
      <b>{row.price} UST</b>
    </TableCell>
  );
}

function premiumCellRenderer({ row }: CellRendererProps): TableCellElement {
  return (
    <TableCell align="right" style={TABLE_CELL_STYLE}>
      <b>{row.premium} %</b>
    </TableCell>
  );
}

function LongCellRenderer({ row }: CellRendererProps): TableCellElement {
  const history = useHistory();
  const styles = useStyles();

  function handleClick() {
    history.push(`/farm/long?ticker=${row.ticker}`);
  }
  return (
    <TableCell align="left" style={TABLE_CELL_STYLE_HOVER} onClick={() => handleClick()} className={styles.router}>
      <b className={styles.link}>{row.long} %</b>
      <div>Long Farm <span className={styles.link}>{'>'}</span></div>
    </TableCell>
  );
}

function ShortCellRenderer({ row }: CellRendererProps): TableCellElement {
  const history = useHistory();
  const styles = useStyles();
  
  function handleClick() {
    history.push(`/farm/short?ticker=${row.ticker}`);
  }
  return (
    <TableCell align="left" style={TABLE_CELL_STYLE_HOVER} onClick={() => handleClick()} className={styles.router}>
      <b style={{color: theme.tableLinkColor}}>{row.short} %</b>
      <div>Short Farm <span style={{color: theme.tableLinkColor}}>{'>'}</span></div>
    </TableCell>
  );
}
// Defines the available columns in the instrument table and how they are rendered.
export const tableColumns: ColumnConfig[] = [
  {
    id: "ticker",
    label: "Ticker",
    minWidth: 100,
    cellRenderer: TickerCellRenderer,
    headerRenderer: DefaultHeaderRenderer,
  },
  {
    id: "long",
    label: "Long",
    minWidth: 100,
    align: "left",
    cellRenderer: LongCellRenderer,
    headerRenderer: TooltipHeaderRenderer,
    tooltip: "Annualized MIR reward return from providing the asset's liquidity. The APR based on premium is updated once every hour."
  },
  {
    id: "short",
    label: "Short",
    minWidth: 100,
    align: "left",
    cellRenderer: ShortCellRenderer,
    headerRenderer: TooltipHeaderRenderer,
    tooltip: "Annualized MIR reward return from depositing collateral to create short position. The APR based on premium is updated once every hour."
  },
  {
    id: "price",
    label: "Pool Price",
    minWidth: 100,
    align: "right",
    cellRenderer: PriceCellRenderer,
    headerRenderer: DefaultHeaderRenderer,
  },
  {
    id: "premium",
    label: "premium",
    minWidth: 100,
    align: "right",
    cellRenderer: premiumCellRenderer,
    headerRenderer: TooltipHeaderRenderer,
    tooltip: "Percentage difference between Pool and Oracle price"
  },
];

export default tableColumns;

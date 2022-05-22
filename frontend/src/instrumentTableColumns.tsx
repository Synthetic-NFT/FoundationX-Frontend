import TableCell from "@mui/material/TableCell";
import React from "react";

import { Instrument } from "./api";
import { NFTIcons } from "./fakeData";
import theme from "./theme";

type ColumnConfigWithoutRenderers = {
  id: string;
  label: string;
  minWidth: number;
  align?: "right";
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
        backgroundColor: "inherit",
        color: theme.tableHeaderTextColor,
        borderColor: theme.tableBorderColor,
        border: "none",
      }}
    >
      <b>{config.label}</b>
    </TableCell>
  );
}

export const TABLE_CELL_STYLE = {
  color: theme.tableRowPrimaryTextColor,
  borderColor: theme.tableBorderColor,
  border: "none",
};

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
    <TableCell align="right" style={TABLE_CELL_STYLE}>
      <b>{row.price}</b>
    </TableCell>
  );
}

function FeeCellRenderer({ row }: CellRendererProps): TableCellElement {
  return (
    <TableCell align="right" style={TABLE_CELL_STYLE}>
      <b>{row.fee}</b>
    </TableCell>
  );
}

// Defines the available columns in the instrument table and how they are rendered.
export const tableColumns: ColumnConfig[] = [
  {
    id: "ticker",
    label: "Ticker",
    minWidth: 170,
    cellRenderer: TickerCellRenderer,
    headerRenderer: DefaultHeaderRenderer,
  },
  {
    id: "price",
    label: "Price",
    minWidth: 170,
    align: "right",
    cellRenderer: PriceCellRenderer,
    headerRenderer: DefaultHeaderRenderer,
  },
  {
    id: "fee",
    label: "Fee",
    minWidth: 170,
    align: "right",
    cellRenderer: FeeCellRenderer,
    headerRenderer: DefaultHeaderRenderer,
  },
];

export default tableColumns;

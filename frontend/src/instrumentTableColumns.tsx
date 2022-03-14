import TableCell from "@mui/material/TableCell";
import React from "react";

import type { Instrument } from "@/TradeContext";

type ColumnConfigWithoutRenderers = {
  id: string;
  label: string;
  minWidth: number;
  align?: "right";
};

type HeaderRendererProps = {
  config: ColumnConfigWithoutRenderers;
};

type CellRendererProps = {
  row: Instrument;
};

type TableCellElement = React.ReactElement<typeof TableCell>;

type ColumnConfig = ColumnConfigWithoutRenderers & {
  cellRenderer: (props: CellRendererProps) => TableCellElement;
  headerRenderer: (props: HeaderRendererProps) => TableCellElement;
};

function DefaultHeaderRenderer({
  config,
}: HeaderRendererProps): TableCellElement {
  return (
    <TableCell align={config.align} style={{ minWidth: config.minWidth }}>
      {config.label}
    </TableCell>
  );
}

function TickerCellRenderer({ row }: CellRendererProps): TableCellElement {
  return <TableCell>{row.ticker}</TableCell>;
}

function PriceCellRenderer({ row }: CellRendererProps): TableCellElement {
  return <TableCell align="right">{row.price}</TableCell>;
}

function FeeCellRenderer({ row }: CellRendererProps): TableCellElement {
  return <TableCell align="right">{row.ticker}</TableCell>;
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

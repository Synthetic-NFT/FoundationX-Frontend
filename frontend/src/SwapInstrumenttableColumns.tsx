import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { Button, IconButton, Snackbar, Tooltip } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import React, { useState } from "react";

import { fakeSynthAddresses } from "./fakeData";
import {
  CellRendererProps,
  ColumnConfig,
  DefaultHeaderRenderer,
  HeaderRendererProps,
  TABLE_CELL_STYLE,
  TableCellElement,
  TickerCellRenderer,
} from "./instrumentTableColumns";
import theme from "./theme";

function AddressCellRenderer({ row }: CellRendererProps): TableCellElement {
  const synthAddress: string = fakeSynthAddresses.get(row.ticker)!;
  const [open, setOpen] = useState(false);

  const onClick = () => {
    setOpen(true);
    navigator.clipboard.writeText(synthAddress);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <TableCell align="left" style={TABLE_CELL_STYLE}>
      <Button onClick={onClick}>{synthAddress}</Button>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={onClose}
        message="Address Copied to Clipboard"
      />
    </TableCell>
  );
}

function AddressHeaderRenderer({
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
          justifyContent: "left",
        }}
      >
        <b>{config.label}</b>
        <div
          style={{
            marginRight: "16px",
          }}
        />
        <Tooltip title={<h4>Paste synth token address to any existing DEX</h4>}>
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

export const swapTableColumns: ColumnConfig[] = [
  {
    id: "ticker",
    label: "Ticker",
    minWidth: 170,
    cellRenderer: TickerCellRenderer,
    headerRenderer: DefaultHeaderRenderer,
  },
  {
    id: "address",
    label: "Address",
    minWidth: 170,
    cellRenderer: AddressCellRenderer,
    headerRenderer: AddressHeaderRenderer,
  },
];

export default swapTableColumns;

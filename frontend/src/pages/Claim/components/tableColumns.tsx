import { makeStyles } from "@material-ui/core/styles";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { Button, IconButton, Snackbar, Tooltip } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import React from "react";
import { useHistory } from "react-router-dom";

import { NFTIcons } from "../../../fakeData";
import theme from "../../../theme";
import {Instrument} from "../../../util/dataStructures";

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
        color: theme.tableHeaderTextColor,
        borderColor: theme.tableBorderColor,
        backgroundColor: "inherit",
        border: "none",
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
        color: theme.tableHeaderTextColor,
        borderColor: theme.tableBorderColor,
        backgroundColor: "inherit",
        border: "none",
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
  border: "none",
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
          style={{height:"1.33rem", width:"1.33rem"}}
        />
        <div
          style={{
            marginRight: "0.67rem",
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
    <TableCell align="left" style={TABLE_CELL_STYLE} >
      <b>{row.price} UST</b>
    </TableCell>
  );
}

// Defines the available columns in the instrument table and how they are rendered.
export const tableColumns: ColumnConfig[] = [
  {
    id: "ticker",
    label: "NFT Collection",
    minWidth: 100,
    cellRenderer: TickerCellRenderer,
    headerRenderer: DefaultHeaderRenderer,
  },
  {
    id: "price",
    label: "Floor Price",
    minWidth: 100,
    align: "left",
    cellRenderer: PriceCellRenderer,
    headerRenderer: DefaultHeaderRenderer,
  },
];

export default tableColumns;

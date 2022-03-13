import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useContext } from "react";

import tableColumns from "@/instrumentTableColumns";
import { Instrument, TradeContext } from "@/TradeContext";

export default function InstrumentTable({
  onRowClick,
}: {
  onRowClick: (instrument: Instrument) => void;
}): React.ReactElement {
  const { tradeData } = useContext(TradeContext);
  if (tradeData == null) {
    return <div />;
  }

  return (
    <TableContainer sx={{ maxHeight: 440 }}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            {tableColumns.map((column) => {
              const Renderer = column.headerRenderer;
              return <Renderer key={column.id} config={column} />;
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {tradeData.instruments.map((row) => (
            <TableRow hover key={row.id} onClick={() => onRowClick(row)}>
              {tableColumns.map((column) => {
                const Renderer = column.cellRenderer;
                return <Renderer key={column.id} row={row} />;
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

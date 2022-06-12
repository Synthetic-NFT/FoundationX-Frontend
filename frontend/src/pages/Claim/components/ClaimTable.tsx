import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useContext, useEffect, useState } from "react";

import { Instrument } from "../../../api";
import { SearchBar, simpleFilter } from "../../../InstrumentTable";
import theme from "../../../theme";
import { TradeContext } from "../../../TradeContext";
import tableColumns from "./tableColumns";

export default function ClaimTable({
    onRowClick,
}: {
    onRowClick: (instrument: Instrument) => void;
}): React.ReactElement {
  const { tradeData } = useContext(TradeContext);
  // instruments to be rendered, after accounting for filtering.
  const [instruments, setInstruments] = useState<Instrument[] | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    // populates the local tradeData when context loaded.
    if (tradeData != null) {
      setInstruments(simpleFilter(searchTerm, tradeData));
    }
  }, [tradeData, searchTerm]);

  if (instruments == null) {
    return <div />;
  }

  return (
    <>
      <SearchBar onSearch={setSearchTerm} />
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table
          style={{
            backgroundColor: theme.tableBackgroundColor,
            borderTopLeftRadius: "0.67rem",
            borderTopRightRadius: "0.67rem",
            overflow: "hidden",
            background: "inherit",
            borderStyle:"none",
          }}
          stickyHeader
          aria-label="sticky table"
        >
          <TableHead>
            <TableRow>
              {tableColumns.map((column) => {
                const Renderer = column.headerRenderer;
                return <Renderer key={column.id} config={column} />;
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {instruments.map((row) => (
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
    </>
  );
}

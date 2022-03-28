import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useContext, useEffect, useState } from "react";

import { Instrument } from "./api";
import { SearchBar, simpleFilter } from "./InstrumentTable";
import swapInstrumenttableColumns from "./SwapInstrumenttableColumns";
import theme from "./theme";
import { TradeContext } from "./TradeContext";

export default function SwapInstrumentTable(): React.ReactElement {
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
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            overflow: "hidden",
          }}
          stickyHeader
          aria-label="sticky table"
        >
          <TableHead>
            <TableRow>
              {swapInstrumenttableColumns.map((column) => {
                const Renderer = column.headerRenderer;
                return <Renderer key={column.id} config={column} />;
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {instruments.map((row) => (
              <TableRow hover key={row.id}>
                {swapInstrumenttableColumns.map((column) => {
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
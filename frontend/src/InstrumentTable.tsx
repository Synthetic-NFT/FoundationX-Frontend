import { IconButton } from "@material-ui/core";
import Input from "@material-ui/core/Input";
import SearchIcon from "@material-ui/icons/Search";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useContext, useEffect, useState } from "react";

import { Instrument, TradeData } from "./api";
import instrumentTableColumns from "./instrumentTableColumns";
import theme from "./theme";
import { TradeContext } from "./TradeContext";

export function SearchBar({
  onSearch,
}: {
  onSearch: (searchTerm: string) => void;
}): React.ReactElement {
  return (
    <div
      style={{
        backgroundColor: theme.tableSearchBarBackgroundColor,
        display: "flex",
        margin: "0px 12px 12px 12px",
        borderRadius: "6px",
      }}
    >
      <IconButton color="primary">
        <SearchIcon />
      </IconButton>
      <Input
        disableUnderline
        style={{
          color: theme.activeTextColor,
          display: "flex",
          flexGrow: 1,
        }}
        // This is called on every key stroke, which is fine for now but we might want to
        // add some debouncing.
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}

// Very naive implementation of searching by substring.
export function simpleFilter(
  searchTerm: string,
  tradeData: TradeData,
): Instrument[] {
  if (searchTerm === "") {
    return tradeData.instruments;
  }
  const loweredSearchTerm = searchTerm.toLowerCase();

  return tradeData.instruments.filter(
    (instrument) =>
      instrument.ticker.toLowerCase().includes(loweredSearchTerm) ||
      instrument.fullName.toLowerCase().includes(loweredSearchTerm),
  );
}

// Renders the list of instruments available for trade.
// How the instruments are rendered (i.e. columns) is defined in tableColumns.
export function InstrumentTable({
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
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            overflow: "scroll",
          }}
          stickyHeader
          aria-label="sticky table"
        >
          <TableHead>
            <TableRow>
              {instrumentTableColumns.map((column) => {
                const Renderer = column.headerRenderer;
                return <Renderer key={column.id} config={column} />;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {instruments.map((row) => (
              <TableRow hover key={row.id} onClick={() => onRowClick(row)}>
                {instrumentTableColumns.map((column) => {
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

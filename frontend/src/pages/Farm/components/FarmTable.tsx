import { IconButton } from "@material-ui/core";
import Input from "@material-ui/core/Input";
import SearchIcon from "@material-ui/icons/Search";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useContext, useEffect, useState } from "react";

import { Instrument, TradeData } from "../../../api";
import theme from "../../../theme";
import { TradeContext } from "../../../TradeContext";
import FarmTableColumns from "./tableColumns";

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

export function FarmTable(): React.ReactElement {
  const { tradeData } = useContext(TradeContext);
  const [instruments, setInstruments] = useState<Instrument[] | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
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
              {FarmTableColumns.map((column) => {
                const Renderer = column.headerRenderer;
                return <Renderer key={column.id} config={column} />;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {instruments.map((row) => (
              <TableRow hover key={row.id} >
                {FarmTableColumns.map((column) => {
                  const Renderer = column.cellRenderer;
                  return <Renderer key={column.id} row={row} />;
                })}
                {/* callback={() => onColumnClick(column.id)} */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

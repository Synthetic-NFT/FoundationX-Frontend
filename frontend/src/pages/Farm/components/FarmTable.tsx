import { IconButton } from "@material-ui/core";
import Input from "@material-ui/core/Input";
import SearchIcon from "@material-ui/icons/Search";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useContext, useEffect, useState } from "react";

import theme from "../../../theme";
import { TradeContext } from "../../../TradeContext";
import FarmTableColumns from "./tableColumns";
import {Instrument, TradeData} from "../../../util/dataStructures";

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
        margin: "1.33rem 0 3rem 0",
        borderRadius: "0.25rem",
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
          height: "2.33rem",
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
    return tradeData.instruments.filter((instrument) => instrument.ticker !== "Ethereum");
  }
  const loweredSearchTerm = searchTerm.toLowerCase();

  return tradeData.instruments.filter(
    (instrument) =>
      instrument.ticker !== "Ethereum" && 
      (instrument.ticker.toLowerCase().includes(loweredSearchTerm) ||
      instrument.fullName.toLowerCase().includes(loweredSearchTerm)),
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
      {/* <SearchBar onSearch={setSearchTerm} /> */}
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table
          style={{
            backgroundColor: "inherit",
            borderTopLeftRadius: "0.25rem",
            borderTopRightRadius: "0.25rem",
            overflow: "hidden",
          }}
          stickyHeader
          aria-label="sticky table"
        >
          <TableHead style={{
              height: "1.67rem"
            }}>
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

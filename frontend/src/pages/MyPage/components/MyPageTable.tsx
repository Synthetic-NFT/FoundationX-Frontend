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

export default function MyPageTable(props: any): React.ReactElement {
  const { tableColumns, data, Header } = props;
  return (
    <>
      {Header}
      {tableColumns && <TableContainer sx={{ maxHeight: 440 }}>
        <Table
          style={{
            backgroundColor: theme.tableBackgroundColor,
            borderBottomLeftRadius: "6px",
            borderBottomRightRadius: "6px",
            borderTopLeftRadius: "6px",
            borderTopRightRadius: "6px",
            overflow: "hidden"
          }}
          stickyHeader
          aria-label="sticky table"
        >
          <TableHead>
            <TableRow>
              {tableColumns.map((column:any) => {
                const Renderer = column.headerRenderer;
                return <Renderer key={column.id} config={column} />;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row:any) => (
              <TableRow hover key={row.id} >
                {tableColumns.map((column:any) => {
                  const Renderer = column.cellRenderer;
                  return <Renderer key={column.id} row={row} />;
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>}
    </>
  );
}

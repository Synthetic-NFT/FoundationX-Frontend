import { IconButton } from "@material-ui/core";
import Input from "@material-ui/core/Input";
import SearchIcon from "@material-ui/icons/Search";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useContext, useEffect, useState } from "react";

import theme from "../../../theme";

export default function MyPageTable(props: any): React.ReactElement {
  const { tableColumns, data, Header, Radius } = props;
  return (
    <>
      {/* {Header} */}
      {tableColumns && <TableContainer sx={{ maxHeight: 440 }}>
        <Table
          style={{
            background: "linear-gradient(160.35deg, rgba(31, 30, 35, 0.6) 13.15%, #25283C 93.23%)",
            borderRadius: Radius,
            overflow: "hidden"
          }}
          stickyHeader
          aria-label="sticky table"
        >
          <TableHead>
            <TableRow 
              style={{
                background: "linear-gradient(160.35deg, #1465B0 13.15%, #1D2995 93.23%)",
                height: "76px",
              }}>
              {tableColumns.map((column:any) => {
                const Renderer = column.headerRenderer;
                return <Renderer key={column.id} config={column} />;
              })}
            </TableRow>
          </TableHead>
          <TableBody 
            style={{
              minHeight: "140px",
            }}>
            {data && data.length > 0 && data.map((row:any) => (
              <TableRow hover key={row.id} >
                {tableColumns.map((column:any) => {
                  const Renderer = column.cellRenderer;
                  return <Renderer key={column.id} row={row} />;
                })}
              </TableRow>
            ))}
            {data && data.length === 0 &&
              <TableRow hover 
                style={{
                  height: "140px",
                }}>
                {tableColumns.map((column:any) => (
                  <TableCell align="right" key={column.id}> </TableCell>
                ))}
              </TableRow>
            }
          </TableBody>
        </Table>
      </TableContainer>}
    </>
  );
}

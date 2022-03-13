import { makeStyles } from "@material-ui/core/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useContext } from "react";

import tableColumns from "@/InstrumentTableColumns";
import { TradeContext } from "@/TradeContext";

const useStyles = makeStyles({
  root: {
    height: "2000px",
  },
});

export default function TradeRouteContainer(): React.ReactElement {
  const { tradeData } = useContext(TradeContext);
  if (tradeData == null) {
    return <div />;
  }

  return (
    <TableContainer sx={{ maxHeight: 440 }}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            {tableColumns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tradeData.instruments.map((row) => (
            <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
              <TableCell key="ticker">{row.ticker}</TableCell>
              <TableCell align="right" key="price">
                {row.price}
              </TableCell>
              <TableCell align="right" key="fee">
                {row.fee}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

import {Button, Snackbar} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import React, {useState} from "react";

import {fakeSynthAddresses} from "./fakeData";
import {
    CellRendererProps,
    ColumnConfig,
    DefaultHeaderRenderer,
    TABLE_CELL_STYLE,
    TableCellElement,
    TickerCellRenderer
} from "./instrumentTableColumns";


function AddressCellRenderer({ row }: CellRendererProps): TableCellElement {
    const synthAddress: string = fakeSynthAddresses.get(row.ticker)!;
    const [open, setOpen] = useState(false);

    const onClick = () => {
        setOpen(true);
        navigator.clipboard.writeText(synthAddress);
    }

    const onClose = () => {
        setOpen(false);
    }

    return (
            <TableCell align="left" style={TABLE_CELL_STYLE}>
                <Button onClick={onClick}>
                    {synthAddress}
                </Button>
                <Snackbar
                    open={open}
                    autoHideDuration={3000}
                    onClose={onClose}
                    message="Address Copied to Clipboard" />
            </TableCell>
    );
}

export const swapTableColumns : ColumnConfig[] = [
    {
        id: "ticker",
        label: "Ticker",
        minWidth: 170,
        cellRenderer: TickerCellRenderer,
        headerRenderer: DefaultHeaderRenderer
    },
    {
        id: "address",
        label: "Address",
        minWidth: 170,
        cellRenderer: AddressCellRenderer,
        headerRenderer: DefaultHeaderRenderer
    }
]

export default swapTableColumns;

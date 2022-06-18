import { Button, Select, MenuItem, makeStyles } from "@material-ui/core";
import InputBase from '@material-ui/core/InputBase';
import { withStyles } from "@material-ui/core/styles";
import FormControl from '@mui/material/FormControl';
import React from "react";

const useStyles = makeStyles((theme) => ({
    formControl: {
        display: "flex !important",
        marginTop: "1.5rem !important",
        '& svg': {
            color: '#ffffff',
        },
    }
}));

const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: 0,
        position: 'relative',
        // backgroundColor: theme.palette.background.paper,
        border: '0 solid #ced4da',
        fontSize: 16,
        padding: '0.42rem 1rem 0.42rem 0.5rem',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        height: "2.67rem",
        lineHeight: "2.67rem",
        backgroundColor: "#222121",
        color: "#ffffff",
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            backgroundColor: '#222121 !important',
        },
    },
}))(InputBase);

function SearchInput(props: any) {
    const styles = useStyles();
    const { children } = props;
    return (
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} className={styles.formControl} style={{ flexDirection: "row", }}>
            <Select
                labelId="demo-customized-select-label"
                id="demo-customized-select"
                input={<BootstrapInput />}
                defaultValue="10"
                style={{ color: "#ffffff" }}
            >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            <BootstrapInput id="demo-customized-textbox" />
        </FormControl>
    );
}
export { SearchInput, BootstrapInput };


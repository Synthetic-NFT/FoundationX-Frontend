import {
  Container,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Typography,
  Icon,
} from "@material-ui/core";
import LoopIcon from "@material-ui/icons/Loop";
import SwapVerticalCircleIcon from "@material-ui/icons/SwapVerticalCircle";
import { Button } from "@mui/material";
import React, { useEffect } from "react";

import { defaultInstrument } from "../../../api";
import Card from "../../../components/Card";
import CardDialog from "../../../components/CardDialog";
import {AUTONITYCoins, GÖRLICoins, DummyCoins} from "../../../constants/coins";
import { fakeTradeData } from "../../../fakeData";
import Add from "../../../styles/images/add.svg";
import Azuki from "../../../styles/images/Azuki.jpeg";
import BoredApeYachtClub from "../../../styles/images/BoredApeYachtClub.png";
import CryptoPunks from "../../../styles/images/CryptoPunks.png";
import Ethereum from "../../../styles/images/Ethereum.svg";

const styles = (theme: { spacing: (arg0: number) => any; }) => ({
  paperContainer: {
    // padding: theme.spacing(1),
    paddingBottom: theme.spacing(3),
    background: "linear-gradient(160.35deg, rgba(31, 30, 35, 0.6) 13.15%, #25283C 93.23%)",
    borderRadius: "0.83rem",
    border: "1px solid #ffffff",    
    padding: "1.67rem 2.17rem",
  },
  switchButton: {
    zIndex: 1,
    margin: "-0.67rem",
    padding: theme.spacing(0.5),
  },
  fullWidth: {
    width: "100%",
  },
  title: {
    textAlign: "center",
    // padding: theme.spacing(0.5),
    // marginBottom: theme.spacing(1),
    fontWeight: 600,
    fontSize: "1.25rem",
    lineHeight: "1.875rem",
    color: "#FFFFFF",
    marginBottom: "1.75rem",
  },
  hr: {
    width: "100%",
  },
  balance: {
    padding: theme.spacing(1),
    overflow: "wrap",
    textAlign: "center",
  },
  footer: {
    marginTop: "11.875rem",
  },
  from: {
    fontWeight: 400,
    fontSize: "0.58rem",
    lineHeight: "1rem",
    color: "#FFFFFF",
    marginLeft: "0.33rem",
  },
  id: {    
    fontWeight: 600,
    fontSize: "0.83rem",
    lineHeight: "1.25rem",
    color: "#FFFFFF",
    marginTop: "0.5rem",
    textAlign: "center",
    minHeight: "1.25rem",
  }
});

// @ts-ignore
const useStyles = makeStyles(styles);

function ClaimDetail(props: any) : React.ReactElement{
  const classes = useStyles();

  const { instrument, buttonName } = props;

  const availbleCoinIn = DummyCoins;
  const availbleCoinOut = DummyCoins;

  // Stores a record of whether their respective dialog window is open
  const [dialog, setDialog] = React.useState({});
  const [wrongNetworkOpen, setwrongNetworkOpen] = React.useState(false);

  interface CoinInterface {
    address: string|undefined;
    symbol: string|undefined;
    balance: number|undefined;
  }
  // Stores data about their respective coin
  const [coin1, setCoin1] = React.useState<CoinInterface>({
    address: undefined,
    symbol: undefined,
    balance: undefined,
  });
  const [coin2, setCoin2] = React.useState<CoinInterface>({
    address: undefined,
    symbol: undefined,
    balance: undefined,
  });

  useEffect(() => {

  }, [availbleCoinIn, instrument]);

  // This hook creates a timeout that will run every ~10 seconds, it's role is to check if the user's balance has
  // updated has changed. This allows them to see when a transaction completes by looking at the balance output.
  useEffect(() => {
    const coinTimeout = setTimeout(() => {
      console.log('props: ', props);
      console.log("Checking balances...");

      return () => clearTimeout(coinTimeout);
    });
  });

  const data = [
    {
      name: "Naruto Todorki1",
      id: "1",
      price: "0.1",
      img: BoredApeYachtClub,
    },    
    {
      name: "Naruto Todorki2",
      id: "2",
      price: "0.2",
      img: Azuki,
    }
    ,    
    {
      name: "Naruto Todorki3",
      id: "3",
      price: "0.3",
      img: CryptoPunks,
    }
    ,    
    {
      name: "Naruto Todorki4",
      id: "4",
      price: "0.4",
      img: CryptoPunks,
    }
  ]
  // @ts-ignore
  return (
    <div style={{ 
      display: "flex",
      justifyContent: "flex",
    }}>
      <CardDialog
        data={dialog}
        onClose={() => setDialog({})}
        coins={availbleCoinIn}
        signer="placeholder"
        buttonName={buttonName}
      />
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item xs={3} sm={3} md={3} spacing={2} style={{padding: "0.5rem"}}  alignItems="center">
          <Card cardStyle={{
              width: "10rem",
              height: "10rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "inherit",
              border: "1px dashed #ffffff",
            }}>
            <img src={Add} alt="Add" style={{height:"1rem", width:"1rem"}} />
          </Card>
          <div className={classes.id}> </div>
        </Grid>
        {
          data.map(item => 
            (
              <Grid 
                item 
                xs={3} 
                sm={3} 
                md={3} 
                lg={3} 
                key={item.id} 
                spacing={2} 
                style={{padding: "0.5rem"}}  
                alignItems="center" 
                onClick={() => setDialog(item)}
                >
                <Card cardStyl="">
                  <img src={item.img} alt={item.name} style={{height:"100%", width:"100%"}} />
                </Card>
                <div className={classes.id}>#{item.id}</div>
              </Grid>
            )
          )
        }
      </Grid>
    </div>
  );
};

export default ClaimDetail;
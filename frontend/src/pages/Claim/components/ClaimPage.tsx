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
import {
  useHistory,
} from "react-router-dom";

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
  },
  titleGroup: {
    fontWeight: 600,
    fontSize: "1.5rem",
    lineHeight: "2.25rem",    
    color: "#FFFFFF",
    display: "flex",
    marginBottom: "3rem",
  },
  count: {
    marginRight: "1rem",
  },
  button: {
    width: "6.5rem",
    height: "2rem",
    background: "linear-gradient(102.22deg, #1368E8 41.1%, #221FBE 78.05%)",
    borderRadius: "0.125rem",
    fontWeight: 400,
    fontSize: "0.83rem",
    lineHeight: "1.25rem",    
    color: "#FFFFFF",
  }
});

// @ts-ignore
const useStyles = makeStyles(styles);

export default function ClaimPage(props: any) : React.ReactElement{
  const classes = useStyles();
  const history = useHistory();

  const { collection, buttonName, haveAdd } = props;
  const [selectCards, setSelectCards] = React.useState<string[]>([]);

  interface Card {
    name: string;
    id: string;
  }

  useEffect(() => {
    const coinTimeout = setTimeout(() => () => clearTimeout(coinTimeout));
  });

  function handleCardClick(item:Card) {
    const cards = [...selectCards];
    const index = cards.indexOf(item.id);
    if (index > -1) {
      cards.splice(index, 1);
    } else {
      cards.push(item.id);
    }

    setSelectCards(cards);
  }

  const data = [
    {
      name: "ETH",
      id: "1",
      price: "0.1",
      img: BoredApeYachtClub,
    }, 
    {
      name: "Naruto Todorki1",
      id: "2",
      price: "0.1",
      img: BoredApeYachtClub,
    },    
    {
      name: "Naruto Todorki2",
      id: "3",
      price: "0.2",
      img: Azuki,
    }
    ,    
    {
      name: "Naruto Todorki3",
      id: "4",
      price: "0.3",
      img: CryptoPunks,
    },    
    {
      name: "Naruto Todorki4",
      id: "5",
      price: "0.4",
      img: CryptoPunks,
    },
    {
      name: "ETH",
      id: "6",
      price: "0.1",
      img: BoredApeYachtClub,
    }, 
    {
      name: "Naruto Todorki1",
      id: "7",
      price: "0.1",
      img: BoredApeYachtClub,
    },    
    {
      name: "Naruto Todorki2",
      id: "8",
      price: "0.2",
      img: Azuki,
    },    
    {
      name: "Naruto Todorki3",
      id: "9",
      price: "0.3",
      img: CryptoPunks,
    },    
    {
      name: "Naruto Todorki4",
      id: "10",
      price: "0.4",
      img: CryptoPunks,
    }
  ]
  const active = {
    // borderImage: "linear-gradient(222deg, rgba(152, 44, 177, 1), rgba(228, 88, 95, 1))",
    border: "1px solid #951FBE"
  }
  const inactive = {
  }
  // @ts-ignore
  return (
    <div style={{ 
      display: "flex",
      justifyContent: "flex",      
      flexDirection: "column",
    }}>
      <div className={classes.titleGroup}>
        <div className={classes.count}>
          {selectCards.length} Selected
        </div>
        <Button
            className={classes.button}
            size="small"
            variant="contained"
          >
            Claim Now
          </Button>
      </div>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
      >
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
                onClick={() => handleCardClick(item)}
                >
                <Card cardStyle={selectCards.indexOf(item.id) > -1 ? active : inactive}>
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

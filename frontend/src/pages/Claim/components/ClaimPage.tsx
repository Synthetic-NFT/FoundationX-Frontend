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
import React, {useContext, useEffect, useState} from "react";
import {
  useHistory,
} from "react-router-dom";

import Card from "../../../components/Card";
import CardDialog from "../../../components/CardDialog";
import {AUTONITYCoins, GÖRLICoins, DummyCoins} from "../../../constants/coins";
import { fakeTradeData } from "../../../fakeData";
import Add from "../../../styles/images/add.svg";
import Azuki from "../../../styles/images/Azuki.jpeg";
import BoredApeYachtClub from "../../../styles/images/BoredApeYachtClub.png";
import CryptoPunks from "../../../styles/images/CryptoPunks.png";
import Ethereum from "../../../styles/images/Ethereum.svg";
import {loadUnclaimedGivenNFT, userClaimBatchNFT} from "../../../util/nft_interact";
import {AppContext} from "../../../AppContext";
import {defaultInstrument} from "../../../util/dataStructures";

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


export function Pagination(props: any) : React.ReactElement{
  const { postsPerPage, totalPosts, paginate } = props
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i+=1) {
    pageNumbers.push(i);
  }

  return (
      <nav>
        <ul className='pagination'>
          {pageNumbers.map(number => (
              <li key={number} className='page-item'>
                <a onClick={(e) => {
                  e.preventDefault();
                  paginate(number)
                }} href="!#" className='page-link'>
                  {number}
                </a>
              </li>
          ))}
        </ul>
      </nav>
  );
}


// @ts-ignore
const useStyles = makeStyles(styles);

export default function ClaimPage(props: any) : React.ReactElement{
  const classes = useStyles();
  const history = useHistory();

  const { collection, buttonName, haveAdd } = props;
  const {walletAddress} = useContext(AppContext)
  const [selectCards, setSelectCards] = React.useState<string[]>([]);
  const [selectedNFTs, setSelectedNFTs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [currentNFTAPIPage, setCurrentNFTAPIPage] = useState(0);
  const [loadedNFTs, setLoadedNFTs] = useState<any[]>([]);
  const NFTAPIItemPerPage = 10;

  interface Card {
    name: string;
    id: string;
  }

  useEffect(() => {
    const coinTimeout = setTimeout(() => () => clearTimeout(coinTimeout));
  });

  const onNFTLoad = (item: any) => {
    setLoading(false);
    setLoadedNFTs([...loadedNFTs, item]);
  }

  useEffect(() => {
    setLoading(true);
    loadUnclaimedGivenNFT(collection.ticker, currentPage-1).then(result => {
      setLoadedNFTs(result);
      setLoading(false);
    })
    // loadUnclaimedGivenNFT(collection.ticker, currentPage-1, onNFTLoad)
  }, [currentPage, collection]);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);




  useEffect(() => {
    const coinTimeout = setTimeout(() => () => clearTimeout(coinTimeout));
  });

  function handleCardClick(item:any) {
    const cards = [...selectCards];
    const index = cards.indexOf(item.tokenId);
    if (index > -1) {
      cards.splice(index, 1);
    } else {
      cards.push(item.tokenId);
    }

    setSelectCards(cards);
  }

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
            onClick={() => userClaimBatchNFT(walletAddress, selectCards, collection.ticker)}
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
          loadedNFTs.map(item =>
            (
              <Grid 
                item 
                xs={3} 
                sm={3} 
                md={3} 
                lg={3} 
                key={item.tokenId}
                spacing={2} 
                style={{padding: "0.5rem"}}  
                alignItems="center" 
                onClick={() => handleCardClick(item)}
                >
                <Card cardStyle={selectCards.indexOf(item.tokenId) > -1 ? active : inactive}>
                  <img src={item.img} alt={item.tokenId} style={{height:"100%", width:"100%"}} />
                </Card>
                <div className={classes.id}>#{item.tokenId}</div>
              </Grid>
            )
          )
        }
      </Grid>
      <Pagination
          postsPerPage={10}
          totalPosts={1000}
          paginate={paginate}
      />
    </div>
  );
};

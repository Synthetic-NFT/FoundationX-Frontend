import {
  Grid,
  makeStyles,
} from "@material-ui/core";
import {Button} from "@mui/material";
import React, {useContext, useEffect} from "react";
import {
  useHistory,
} from "react-router-dom";

import {AppContext} from "../../../AppContext";
import Card from "../../../components/Card";
import CardDialog from "../../../components/CardDialog";
import {TradeContext} from "../../../TradeContext";
import {OneNFT} from "../../../util/dataStructures";
import {
  burnSynthWithNFT,
  loadUserDepositedNFTs,
  loadUserGivenNFT,
  mintSynthWithNFT,
  userClaimBatchNFT
} from "../../../util/nft_interact";
import ClaimDetail from "../../Claim/components/ClaimDetail";

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




function MyPageManageNFT(props: any): React.ReactElement {
  const classes = useStyles();
  const history = useHistory();

  const { instrument, buttonName } = props;
  const {tradeData} = useContext(TradeContext);
  const {walletAddress} = useContext(AppContext);
  const [relatedNFTs, setRelatedNFTs] = React.useState<OneNFT[]>([]);
  const [selectedTokenIDs, setSelectedTokenIDs] = React.useState<string[]>([]);


  // Stores a record of whether their respective dialog window is open
  const [dialog, setDialog] = React.useState({});

  useEffect(() => {
    if (buttonName === "Mint") {
      loadUserGivenNFT(walletAddress, instrument.ticker).then(oneNFTs => {
        setRelatedNFTs(oneNFTs);
      })
    }
    else if (buttonName === "Burn") {
      loadUserDepositedNFTs(walletAddress, instrument.ticker).then(oneNFTs => {
        setRelatedNFTs(oneNFTs);
      })
    }
  }, [walletAddress, instrument, buttonName]);

  // This hook creates a timeout that will run every ~10 seconds, it's role is to check if the user's balance has
  // updated has changed. This allows them to see when a transaction completes by looking at the balance output.
  useEffect(() => {
    const coinTimeout = setTimeout(() => {
      console.log('props: ', props);
      console.log("Checking balances...");

      return () => clearTimeout(coinTimeout);
    });
  });

  function handleCardClick(item:any) {
    const cards = [...selectedTokenIDs];
    const index = cards.indexOf(item.tokenID);
    if (index > -1) {
      cards.splice(index, 1);
    } else {
      cards.push(item.tokenID);
    }

    setSelectedTokenIDs(cards);
  }

  function handleButtonClick() {
    if (buttonName === "Mint") {
      mintSynthWithNFT(walletAddress, selectedTokenIDs, instrument.ticker)
    }
    else if (buttonName === "Burn") {
      burnSynthWithNFT(walletAddress, selectedTokenIDs, instrument.ticker)
    }
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
      {/* <CardDialog */}
      {/*  data={dialog} */}
      {/*  onClose={() => setDialog({})} */}
      {/*  buttonName={buttonName} */}
      {/* /> */}
      <div>
        <Button
            className={classes.button}
            size="small"
            variant="contained"
            onClick={() => handleButtonClick()}
        >
          {buttonName}
        </Button>
      </div>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
      >
        {
          relatedNFTs.map(item =>
          (
            <Grid
              item
              xs={3}
              sm={3}
              md={3}
              lg={3}
              key={item.ticker}
              spacing={2}
              style={{ padding: "0.5rem" }}
              alignItems="center"
              onClick={() => handleCardClick(item)}
            >
              <Card cardStyle={selectedTokenIDs.indexOf(item.tokenID) > -1 ? active : inactive}>
                {/* eslint-disable-next-line global-require,import/no-dynamic-require */}
                <img src={item.tokenURI} alt={item.ticker} style={{ height: "100%", width: "100%" }} />
              </Card>
              <div className={classes.id}>{item.tokenID}</div>
            </Grid>
          )
          )
        }
      </Grid>
    </div>
  );
};

export default MyPageManageNFT;
import { makeStyles } from "@material-ui/core";
import AccountBalanceWallet from "@mui/icons-material/AccountBalanceWallet";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import QrCodeIcon from '@mui/icons-material/QrCode';
import SendIcon from '@mui/icons-material/Send';
import { Button, IconButton, Snackbar, Tooltip } from "@mui/material";
import EchartsOption from "echarts";
import ReactEcharts from "echarts-for-react";
import React, { useContext, useEffect, useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";

import api, { MyPageData } from "../../../api";
import {AppContext} from "../../../AppContext";
import CreditCard from "../../../styles/images/CreditCard.png";
import Send from "../../../styles/images/send.svg";
import Star from "../../../styles/images/star.svg";
import theme from "../../../theme";
import { connectWallet, getCurrentWalletConnected } from "../../../util/interact";
import MyPageTable from "./MyPageTable";
import {holdingTableColumns, borrowingTableColumns, governTableColumns} from "./tableColumns";


const useStyles = makeStyles({
  loginGroup: {
    backgroundColor: "inherit",
    display: "flex",
    flexDirection: "column",
    borderRadius: "0.25rem",
    height: "16.67rem",
    alignItems: "center",
  },
  title: {
    color: theme.activeTextColor,
    fontSize: "24pt",
    marginTop: "1.33rem",
    marginBottom: "0",
  },
  button: {
    margin: "2.41rem 0 !important",
    alignSelf: "flex-start",
    display: "flex",
    justifyContent: "space-between !important",
    background: "linear-gradient(101.05deg, #1368E8 -5.36%, #0C3B72 29.46%, #1B2138 56.03%, #030F16 81.92%)",
    borderRadius: "0.25rem",
    width: "33.75rem",
    height: "3.83rem",
    padding: "1rem 2.75rem !important",
  },
  buttonTitle: {
    height: "1.5rem",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "1.5rem",
    color: "#FFFFFF",
    fontSize: "1rem",
  },
  cardGroup: {
    display: "flex",
    marginTop: "4rem",
    marginBottom: "2.67rem",
  },
  card: {
    color: theme.activeTextColor,
    borderRadius: "0.25rem",
    display: "flex",
    fontSize: "14pt",
    padding: "0.67rem",
    width: "21.75rem",
    height: "12.25rem",
    flexDirection: "column",
    marginRight: "1rem",
    backgroundColor: theme.instrumentCardBackgroundColor,
  },
  cardLeft: {
    color: theme.activeTextColor,
    display: "flex",
    fontSize: "14pt",
    padding: "1rem 1.67rem",
    width: "21.75rem",
    height: "12.25rem",
    flexDirection: "column",
    marginRight: "0.58rem",
    marginLeft: "0.17rem",
    // background: "linear-gradient(160.35deg, rgba(31, 30, 35, 0.6) 13.15%, #25283C 93.23%)",
    border: "solid 1px transparent",
    // borderImage: "linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0)) 1",
    borderRadius: "0.83rem",
    clipPath: "inset(0 round 0.83rem)",
    backgroundClip: "padding-box, border-box",
    backgroundOrigin: "padding-box, border-box",
    backgroundImage: "linear-gradient(160.35deg, #25283C 93.23%, rgba(31, 30, 35, 0.6) 13.15%), linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0))",
    justifyContent: "space-between",
  },
  cardRight: {
    color: theme.activeTextColor,
    display: "flex",
    fontSize: "14pt",
    padding: "1rem 1.67rem",
    width: "21.75rem",
    height: "12.25rem",
    flexDirection: "column",
    marginLeft: "0.58rem",
    marginRight: "0.17rem",
    background: "linear-gradient(160.35deg, rgba(31, 30, 35, 0.6) 13.15%, #25283C 93.23%)",
    borderRadius: "0.83rem",
  },
  titleGroup: {
    display: "flex",
    justifyContent: "space-between !important",
  },
  cardButton: {
    width: "fit-content",
    display: "flex",
    justifyContent: "space-between !important",
    height: "1.42rem",
    background: "linear-gradient(94.8deg, #072CB2 2.99%, #4B3CA8 57.25%, #440495 98.64%, #0C3666 138.99%)",
    borderRadius: "2.08rem !important",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "0.5rem !important",
    lineHeight: "0.75rem",
    color: "#FFFFFF !important",
  },
  chartContainer: {
    display: "flex",
    justifyContent: "space-between",
    height: "8.33rem",
    fontSize: "0.5rem",
    width: "100%",
    marginTop: "1rem",
  },
  chart: {
    border: "0 solid red",
  },
  chartLegend: {
    border: "0 solid red",
    minWidth: "8.33rem",
    width: "12.5rem",
    display: "flex",
    flexWrap: "wrap",
  },
  ust: {
    display: "inline-block",
    paddingLeft: "0.58rem",
    position: "relative",
    marginRight: "1.5rem",
    marginLeft: "0.5rem",
    marginBottom: "1rem",
    width: "4.17rem",
    "&::after": {
      content: "''",
      width: "0.5rem",
      height: "1.67rem",
      borderRadius: "0.25rem",
      backgroundColor: "#2B87E3",
      position: "absolute",
      top: "0.25rem",
      left: "-0.5rem",
      right: "0",
    }
  },
  holding: {
    display: "inline-block",
    paddingLeft: "0.58rem",
    position: "relative",
    width: "4.17rem",
    marginBottom: "1rem",
    "&::after": {
      content: "''",
      width: "0.5rem",
      height: "1.67rem",
      borderRadius: "0.25rem",
      backgroundColor: "#43CCC4",
      position: "absolute",
      top: "0.25rem",
      left: "-0.5rem",
      right: "0",
    }
  },
  borrowing: {
    display: "inline-block",
    paddingLeft: "0.58rem",
    position: "relative",
    marginLeft: "0.5rem",
    width: "4.17rem",
    marginBottom: "1rem",
    "&::after": {
      content: "''",
      width: "0.5rem",
      height: "1.67rem",
      borderRadius: "0.25rem",
      backgroundColor: "#072CB2",
      position: "absolute",
      top: "0.25rem",
      left: "-0.5rem",
      right: "0",
    }
  },
  priceLabel: {
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "0.67rem",
    lineHeight: "1rem",
    color: "#FFFFFF",
  },
  price: {
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "0.67rem",
    lineHeight: "1rem",
    color: "#FFFFFF",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    // marginTop: "1rem",
    // borderTopLeftRadius: "0.67rem",
    // borderTopRightRadius: "0.67rem",
    // backgroundColor: "#0099FF",
    padding: "0 0.67rem",
    height: "2.67rem",
    alignItems: "center",
    color: "#ffffff",
  },
  totalValueTitle: {
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "1rem",
    lineHeight: "1.5rem",
    color: "#FFFFFF",
  },
  totalValue: {
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "1rem",
    lineHeight: "1.5rem",
    color: "#FFFFFF",
  }
});
const colors = ["#2B87E3", "#43CCC4", "#072CB2"];

export default function MypPage(): React.ReactElement {
  const history = useHistory();
  const styles = useStyles();

  const { walletAddress, setWallet } = useContext(AppContext);
  // const [loginSuccess, setLoginSuccess] = useState(false);
  const [myPageData, setMyPageData] = useState<MyPageData | null>(null);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState("");
  const [loading, setIsLoading] = React.useState(false);
  

  useEffect(() => {
    if (!loading) {
      setIsLoading(true);
      api.loadMyPageData().then((data) => {
        setMyPageData(data);
        // setStep(0);
        setIsLoading(false);
      });
      
      const setWalletAndStatus = async () => {
        const { address, status } = await getCurrentWalletConnected();
        setWallet(address);
        setStatus(status);
      };
      setWalletAndStatus();

      if ((window as any).ethereum) {
        (window as any).ethereum.on(
          "accountsChanged",
          (accounts: string | any[]) => {
            if (accounts.length > 0) {
              setWallet(accounts[0]);
              setStatus("👆🏽 Write a message in the text-field above.");
            } else {
              setWallet("");
              setStatus("🦊 Connect to Metamask using the top right button.");
            }
          },
        );
      } else {
        setStatus("Not installed");
      }
    }
  }, [loading, setIsLoading, myPageData, setMyPageData, walletAddress, setWallet, setStatus]);
  
  const login = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  }

  function getOption() {
    return {
      tooltip: {
        trigger: 'item'
      },
      color: colors,
      legend: {
        show: false,
      },
      series: [
        {
          name: 'My Page',
          type: 'pie',
          radius: ['70%', '98%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: false,
          labelLine: {
            show: false
          },
          data: [
            { value: myPageData?.ust, name: 'ust' },
            { value: myPageData?.holding, name: 'holding' },
            { value: myPageData?.borrowing, name: 'borrowing' },
          ]
        }
      ]
    };
  }

  const HoldingHeader = (
    <div className={styles.header}>
      <div>
        Holding
        <Tooltip title={<h4>Holding tooltip</h4>}>
          <IconButton>
            <HelpOutlineOutlinedIcon
              sx={{ color: theme.tableHeaderTextColor }}
            />
          </IconButton>
        </Tooltip>
      </div>
      {/* <div>
        ≈ {myPageData?.data.holding[0].value} UST
        <Tooltip title={<h4>value tooltip</h4>}>
          <IconButton>
            <HelpOutlineOutlinedIcon
              sx={{ color: theme.tableHeaderTextColor }}
            />
          </IconButton>
        </Tooltip>
      </div> */}
    </div>
  )

  const BorrowingHeader = (
    <div className={styles.header}>
      <div>
        Farming
        <Tooltip title={<h4>Borrowing tooltip</h4>}>
          <IconButton>
            <HelpOutlineOutlinedIcon
              sx={{ color: theme.tableHeaderTextColor }}
            />
          </IconButton>
        </Tooltip>
      </div>
      {/* <div>
        <span>
          Borrowed ≈ {myPageData?.data.borrowing[0].borrowed.ust} UST
          <Tooltip title={<h4>Borrowed tooltip</h4>}>
            <IconButton>
              <HelpOutlineOutlinedIcon
                sx={{ color: theme.tableHeaderTextColor }}
              />
            </IconButton>
          </Tooltip>
        </span>
        <span>
          Collateral ≈ {myPageData?.data.borrowing[0].borrowed.ust} UST
          <Tooltip title={<h4>Collateral tooltip</h4>}>
            <IconButton>
              <HelpOutlineOutlinedIcon
                sx={{ color: theme.tableHeaderTextColor }}
              />
            </IconButton>
          </Tooltip>
        </span>
      </div> */}
    </div>
  )


  const GovernHeader = (
    <div className={styles.header} style={{ borderRadius: "0.67rem" }}>
      <div>
        Govern
        <Tooltip title={<h4>Govern tooltip</h4>}>
          <IconButton>
            <HelpOutlineOutlinedIcon
              sx={{ color: theme.tableHeaderTextColor }}
            />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  )
  const statusList = ['claim', 'trade', 'swap'];
  const titleList = [
    'You don’t have any NFT yet. Claim testing NFT now',
    'Now you can mint sTokens with your NFTs',
    'Now you can trade your sTokens',
  ]
  const buttonList = ['Claim your NFT now', 'Mint sTokens with your NFTs', 'Trade your sTokens']
  function handleClick() {
    // const s = step + 1;
    // setStep(s % 3);
    history.push(`/${statusList[step]}`);
  }

  return (
    <>
      {
        walletAddress === "" &&
        <div className={styles.loginGroup} >
          <Button
            className={styles.button}
            size="large"
            variant="contained"
            endIcon={<img src={CreditCard} alt={CreditCard} style={{ height: "0.83rem", width: "0.83rem" }} />}
            onClick={() => login()}
          >
            <span className={styles.buttonTitle}>
              Wallet Connect
            </span>
          </Button>
        </div>
      }
      {
        walletAddress !== "" && myPageData &&
        <>
          <div className={styles.cardGroup}>
            <div className={styles.cardLeft} >
              {/* <div className={styles.titleGroup}>
                <div>
                  <div className={styles.totalValueTitle}>
                    Total Value 
                  </div>
                </div>
                <div className={styles.totalValue}>
                  {myPageData?.total} ust
                </div>
              </div>
              <div className={styles.chartContainer}>
                <div>
                  <div className={styles.chartLegend}>
                    <div className={styles.ust}>
                      <div className={styles.priceLabel}>
                        UST 
                      </div>
                      <div className={styles.price}>
                        {myPageData?.ust} UST
                      </div>
                    </div>
                    <div className={styles.holding}>
                      <div className={styles.priceLabel}>
                        HOLDING 
                      </div>
                      <div className={styles.price}>
                        {myPageData?.holding} UST
                      </div>
                    </div>
                    <div className={styles.borrowing}>
                      <div className={styles.priceLabel}>
                        BORROWING 
                      </div>
                      <div className={styles.price}>
                        {myPageData?.borrowing} UST
                      </div>
                    </div>
                  </div>
                  <Button
                    className={styles.cardButton}
                    size="large"
                    variant="text"
                    endIcon={<img src={Send} alt={Send} style={{height:"0.83rem", width:"0.83rem"}} />}
                    onClick={() => setLoginSuccess(true)}
                  >
                    Send
                  </Button>
                </div>
                <ReactEcharts
                  className={styles.chart}
                  style={{
                    height: "8.33rem",
                    width: "8.33rem",
                    marginTop: "-1rem",
                  }}
                  option={getOption()}
                />
              </div> */}
              <div className={styles.totalValueTitle}>
                {titleList[step]}
              </div>
              <Button
                className={styles.cardButton}
                size="large"
                variant="text"
                // endIcon={<img src={Send} alt={Send} style={{height:"0.83rem", width:"0.83rem"}} />}
                onClick={() => handleClick()}
              >
                {buttonList[step]}
              </Button>
              <Button onClick={() => setStep((step + 1) % 3)} size="small">
                next step
              </Button>
            </div>
            <div className={styles.cardRight} >
              <div className={styles.titleGroup} style={{ width: "11.67rem" }}>
                <div className={styles.totalValueTitle} style={{ display: "flex", alignItems: "center" }}>
                  Total Claimable Rewards
                </div>
              </div>
              <div className={styles.price} style={{ marginTop: "1.33rem", }}>
                {myPageData?.totalClaimableRewards.mir} MIR
              </div>
              <div className={styles.priceLabel}>
                {myPageData?.totalClaimableRewards.ust} UST
              </div>
              <div className={styles.price} style={{ marginTop: "1.33rem", }}>
                <div className={styles.priceLabel}>Mri Price</div>
                {myPageData?.totalClaimableRewards.mriPrice}
              </div>
              <Button
                style={{
                  width: "14rem",
                  height: "1.42rem",
                  alignSelf: "flex-end",
                  background: "linear-gradient(94.8deg, #072CB2 2.99%, #4B3CA8 57.25%, #440495 98.64%, #0C3666 138.99%)",
                  borderRadius: "2.08rem",
                  fontStyle: "normal",
                  fontWeight: 400,
                  fontSize: "0.5rem",
                  lineHeight: "0.75rem",
                  color: "#FFFFFF",
                }}
                size="large"
                variant="contained"
                disabled
                endIcon={<img src={Star} alt={Star} style={{ height: "0.83rem", width: "0.83rem" }} />}
              >
                Claim All Rewards
              </Button>
            </div>
          </div>
          <div style={{ margin: "0 0.17rem 2.25rem 0.17rem" }}>
            <MyPageTable tableColumns={holdingTableColumns} data={myPageData?.data.holding} Header={HoldingHeader} Radius="0.83rem 0.83rem 0 0" />
            <MyPageTable tableColumns={borrowingTableColumns} data={myPageData?.data.borrowing} Header={BorrowingHeader} Radius="0 0 0 0" />
            <MyPageTable tableColumns={holdingTableColumns} data={[]} Header={GovernHeader} Radius="0 0 0.83rem 0.83rem" />
          </div>
        </>
      }
    </>
  );
}

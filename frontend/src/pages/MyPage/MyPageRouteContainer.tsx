import { makeStyles } from "@material-ui/core";
import AccountBalanceWallet from "@mui/icons-material/AccountBalanceWallet";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import QrCodeIcon from '@mui/icons-material/QrCode';
import SendIcon from '@mui/icons-material/Send';
import { Button, IconButton, Snackbar, Tooltip } from "@mui/material";
import EchartsOption from "echarts";
import ReactEcharts from "echarts-for-react";
import React, { useContext, useEffect, useState }  from "react";
import { Switch, Route, useHistory } from "react-router-dom";

import api, {MyPageData} from "../../api";
import CreditCard from "../../styles/images/CreditCard.png";
import theme from "../../theme";
import MyPageTable from "./components/MyPageTable";
import {holdingTableColumns, borrowingTableColumns, governTableColumns} from "./components/tableColumns";

const useStyles = makeStyles({
  loginGroup: {
    backgroundColor: "inherit",
    display: "flex",
    flexDirection: "column",
    borderRadius: "6px",
    height: "400px",
    alignItems: "center",
  },
  title: {
    color: theme.activeTextColor,
    fontSize: "24pt",
    marginTop: "32px",
    marginBottom: "0px",
  },
  button: {
    margin: "58px 0px !important", 
    alignSelf: "flex-start",
    display: "flex",
    justifyContent: "space-between !important",
    background: "linear-gradient(101.05deg, #1368E8 -5.36%, #0C3B72 29.46%, #1B2138 56.03%, #030F16 81.92%)",
    borderRadius: "6px",
    width: "810px",
    height: "92px",
    padding: "28px 66px !important"
  },
  buttonTitle: {
    height: "36px",
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "24px",
    lineHeight: "36px",
    color: "#FFFFFF",
  },
  cardGroup: {
    display: "flex",
    marginTop: "96px",
    marginBottom: "64px",
  },
  card: {
    color: theme.activeTextColor,
    borderRadius: "6px",
    display: "flex",
    fontSize: "14pt",
    padding: "16px",
    width: "522px",
    height: "294px",
    flexDirection: "column",
    marginRight: "24px",
    backgroundColor: theme.instrumentCardBackgroundColor,
  },
  cardLeft: {
    color: theme.activeTextColor,
    display: "flex",
    fontSize: "14pt",
    padding: "26px 40px",
    width: "522px",
    height: "294px",
    flexDirection: "column",
    marginRight: "14px",
    marginLeft: "4px",
    // background: "linear-gradient(160.35deg, rgba(31, 30, 35, 0.6) 13.15%, #25283C 93.23%)",
    border: "solid 1px transparent",
    // borderImage: "linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0)) 1",
    borderRadius: "20px",
    clipPath: "inset(0 round 20px)",
    backgroundClip: "padding-box, border-box",
    backgroundOrigin: "padding-box, border-box",
    backgroundImage: "linear-gradient(160.35deg, #25283C 93.23%, rgba(31, 30, 35, 0.6) 13.15%), linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0))",
  },
  cardRight: {
    color: theme.activeTextColor,
    display: "flex",
    fontSize: "14pt",
    padding: "26px 40px",
    width: "522px",
    height: "294px",
    flexDirection: "column",
    marginLeft: "14px",
    marginRight: "4px",
    background: "linear-gradient(160.35deg, rgba(31, 30, 35, 0.6) 13.15%, #25283C 93.23%)",
    borderRadius: "20px",
  },
  titleGroup: {
    display: "flex",
    justifyContent: "space-between !important",
  },
  cardButton: {
    width: "106px", 
    display: "flex",
    justifyContent: "space-between !important",
    height: "34px",
    background: "linear-gradient(94.8deg, #072CB2 2.99%, #4B3CA8 57.25%, #440495 98.64%, #0C3666 138.99%)",
    borderRadius: "50px !important",
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "12px",
    lineHeight: "18px",
    color: "#FFFFFF",
  },
  chartContainer: {
    display: "flex",
    justifyContent: "space-between",
    height: "200px",
    fontSize: "12px",
    width: "100%",
    marginTop: "28px",
  },
  chart: {
    border: "0px solid red",
  },
  chartLegend: {
    border: "0px solid red",
    minWidth: "200px",
    width: "300px",
    display: "flex",
    flexWrap: "wrap",
  },
  ust: {
    display: "inline-block",
    paddingLeft: "14px",
    position: "relative",
    marginRight: "36px",
    marginLeft: "12px",
    marginBottom: "26px",
    width: "100px",
    "&::after": {
        content: "''",
        width: "12px",
        height: "39px",
        borderRadius: "6px",
        backgroundColor: "#2B87E3",
        position: "absolute",
        top: "6px",
        left: "-12px",
        right: "0px",
    }
  },
  holding: {
    display: "inline-block",
    paddingLeft: "14px",
    position: "relative",
    width: "100px",
    marginBottom: "26px",
    "&::after": {
        content: "''",
        width: "12px",
        height: "39px",
        borderRadius: "6px",
        backgroundColor: "#43CCC4",
        position: "absolute",
        top: "6px",
        left: "-12px",
        right: "0px",
    }
  },
  borrowing: {
    display: "inline-block",
    paddingLeft: "14px",
    position: "relative",
    marginLeft: "12px",
    width: "100px",
    marginBottom: "26px",
    "&::after": {
        content: "''",
        width: "12px",
        height: "39px",
        borderRadius: "6px",
        backgroundColor: "#072CB2",
        position: "absolute",
        top: "6px",
        left: "-12px",
        right: "0px",
    }
  },
  priceLabel: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "24px",
    color: "#FFFFFF",
  },
  price: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "24px",
    color: "#FFFFFF",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "24px",
    borderTopLeftRadius: "16px",
    borderTopRightRadius: "16px",
    backgroundColor: "#0099FF",
    padding: "0 16px",    
    height: "64px",
    alignItems: "center",
  },
  totalValueTitle: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "24px",
    lineHeight: "36px",
    color: "#FFFFFF",
  },
  totalValue: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "24px",
    lineHeight: "36px",
    color: "#FFFFFF",
  }
});
const colors = ["#2B87E3", "#43CCC4", "#072CB2"];

export default function MyPageRouteContainer(): React.ReactElement {
  const history = useHistory();
  const styles = useStyles();

  const [loginSuccess, setLoginSuccess] = useState(false);
  const [myPageData, setMyPageData] = useState<MyPageData | null>(null);

  const [loading, setIsLoading] = React.useState(false);
  useEffect(() => {
    if (!loading) {
      setIsLoading(true);
      api.loadMyPageData().then((data) => {
        setMyPageData(data);
        setIsLoading(false);
      });
    }
  }, [loading, setIsLoading, myPageData, setMyPageData]);
  
  function login() {
    setLoginSuccess(true);
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
      <div>
        ≈ {myPageData?.data.holding[0].value} UST
        <Tooltip title={<h4>value tooltip</h4>}>
          <IconButton>
            <HelpOutlineOutlinedIcon
              sx={{ color: theme.tableHeaderTextColor }}
            />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  )

  const BorrowingHeader = (
    <div className={styles.header}>
      <div>
        Borrowing
        <Tooltip title={<h4>Borrowing tooltip</h4>}>
          <IconButton>
            <HelpOutlineOutlinedIcon
              sx={{ color: theme.tableHeaderTextColor }}
            />
          </IconButton>
        </Tooltip>
      </div>
      <div>
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
      </div>
    </div>
  )

  
  const GovernHeader = (
    <div className={styles.header} style={{borderRadius: "16px"}}>
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

  return (
    <>
      {
        !loginSuccess &&
        <div className={styles.loginGroup} >
          {/* <div className={styles.title}>Connect to a wallet</div> */}
          {/* <Button
            className={styles.button}
            size="large"
            variant="contained"
            endIcon={<QrCodeIcon />}
            onClick={() => login()}
          >
            View an address
          </Button> */}
          <Button
            className={styles.button}
            size="large"
            variant="contained"
            endIcon={<img src={CreditCard} alt={CreditCard} height="20px" width="20px" />}
            onClick={() => login()}
          >
            <span className={styles.buttonTitle}>
              Wallet Connect
            </span>
           </Button>
        </div>
      }
      {
        loginSuccess && myPageData &&
        <>
          <div className={styles.cardGroup}>
            <div className={styles.cardLeft} >
              <div className={styles.titleGroup}>
                <div>
                  <div className={styles.totalValueTitle}>
                    Total Value 
                    {/* <Tooltip title={<h4>total value tooltip</h4>}>
                      <IconButton>
                        <HelpOutlineOutlinedIcon
                          sx={{ color: theme.tableHeaderTextColor }}
                        />
                      </IconButton>
                    </Tooltip> */}
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
                        {/* <Tooltip title={<h4>UST tooltip</h4>}>
                          <IconButton>
                            <HelpOutlineOutlinedIcon
                              sx={{ color: theme.tableHeaderTextColor }}
                            />
                          </IconButton>
                        </Tooltip> */}
                      </div>
                      <div className={styles.price}>
                        {myPageData?.ust} UST
                      </div>
                    </div>
                    <div className={styles.holding}>
                      <div className={styles.priceLabel}>
                        HOLDING 
                        {/* <Tooltip title={<h4>holding tooltip</h4>}>
                          <IconButton>
                            <HelpOutlineOutlinedIcon
                              sx={{ color: theme.tableHeaderTextColor }}
                            />
                          </IconButton>
                        </Tooltip> */}
                      </div>
                      <div className={styles.price}>
                        {myPageData?.holding} UST
                      </div>
                    </div>
                    <div className={styles.borrowing}>
                      <div className={styles.priceLabel}>
                        BORROWING 
                        {/* <Tooltip title={<h4>borrowing tooltip</h4>}>
                          <IconButton>
                            <HelpOutlineOutlinedIcon
                              sx={{ color: theme.tableHeaderTextColor }}
                            />
                          </IconButton>
                        </Tooltip> */}
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
                    endIcon={<SendIcon />}
                    onClick={() => setLoginSuccess(true)}
                  >
                    Send
                  </Button>
                </div>
                <ReactEcharts
                  className={styles.chart}
                  style={{
                    height: "200px",
                    width: "200px",
                    marginTop: "-26px",
                  }}
                  option={getOption()}
                />
              </div>
            </div>
            <div className={styles.cardRight} >
              <div className={styles.titleGroup} style={{width: "280px"}}>
                <div className={styles.totalValueTitle} style={{display: "flex", alignItems: "center"}}>
                  Total Claimable Rewards
                  {/* <Tooltip title={<h4>Total Claimable Rewards</h4>}>
                    <IconButton>
                      <HelpOutlineOutlinedIcon
                        sx={{ color: theme.tableHeaderTextColor }}
                      />
                    </IconButton>
                  </Tooltip> */}
                </div>
              </div>
              <div className={styles.price} style={{marginTop: "32px",}}>
                {myPageData?.totalClaimableRewards.mir} MIR
              </div>
              <div className={styles.priceLabel}>
                {myPageData?.totalClaimableRewards.ust} UST
              </div>
              <div className={styles.price} style={{marginTop: "32px",}}>
                <div className={styles.priceLabel}>Mri Price</div>
                {myPageData?.totalClaimableRewards.mriPrice}
              </div>
              <Button
                style={{ 
                  width: "220px", 
                  height: "34px",
                  alignSelf: "flex-end", 
                  background: "linear-gradient(94.8deg, #072CB2 2.99%, #4B3CA8 57.25%, #440495 98.64%, #0C3666 138.99%)",
                  borderRadius: "50px",
                  fontFamily: "Poppins",
                  fontStyle: "normal",
                  fontWeight: 400,
                  fontSize: "12px",
                  lineHeight: "18px",
                  color: "#FFFFFF",
                }}
                size="large"
                variant="contained"
                disabled
                endIcon={<SendIcon />}
              >
                Claim All Rewards
              </Button>
            </div>
          </div>
          <div style={{margin: "0 4px 54px 4px"}}>
            <MyPageTable tableColumns={holdingTableColumns} data={myPageData?.data.holding} Header={HoldingHeader} Radius="20px 20px 0px 0px" />
            <MyPageTable tableColumns={holdingTableColumns} data={myPageData?.data.holding} Header={BorrowingHeader} Radius="0px 0px 0px 0px"/>
            <MyPageTable tableColumns={holdingTableColumns} data={[]} Header={GovernHeader}  Radius="0px 0px 20px 20px"/>
          </div>
        </>
      }
    </>
  );
}

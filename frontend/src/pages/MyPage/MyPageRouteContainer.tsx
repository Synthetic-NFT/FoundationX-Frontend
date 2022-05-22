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
import {holdingTableColumns, borrowingTableColumns} from "./components/tableColumns";

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
  },
  card: {
    color: theme.activeTextColor,
    borderRadius: "6px",
    display: "flex",
    fontSize: "14pt",
    padding: "16px",
    width: "488px",
    height: "280px",
    flexDirection: "column",
    marginRight: "24px",
    backgroundColor: theme.instrumentCardBackgroundColor,
  },
  cardLeft: {
    color: theme.activeTextColor,
    borderRadius: "6px",
    display: "flex",
    fontSize: "14pt",
    padding: "16px",
    width: "496px",
    height: "280px",
    flexDirection: "column",
    marginRight: "12px",
    marginLeft: "4px",
    backgroundColor: theme.instrumentCardBackgroundColor,
  },
  cardRight: {
    color: theme.activeTextColor,
    borderRadius: "6px",
    display: "flex",
    fontSize: "14pt",
    padding: "16px",
    width: "496px",
    height: "280px",
    flexDirection: "column",
    marginLeft: "12px",
    marginRight: "4px",
    backgroundColor: theme.instrumentCardBackgroundColor,
  },
  titleGroup: {
    display: "flex",
    justifyContent: "space-between !important",
  },
  cardButton: {
    width: "100px", 
    display: "flex",
    justifyContent: "space-between !important",
    borderRadius: "8px",
    height: "32px",
  },
  chartContainer: {
    display: "flex",
    justifyContent: "space-between",
    height: "200px",
    fontSize: "12px",
    width: "100%",
  },
  chart: {
    border: "0px solid red",
  },
  chartLegend: {
    border: "0px solid red",
    minWidth: "150px",
    width: "150px",
    marginTop: "12px",
  },
  ust: {
    display: "inline-block",
    paddingLeft: "14px",
    position: "relative",
    "&::after": {
        content: "''",
        height: "10px",
        width: "10px",
        backgroundColor: "#00FFFF",
        position: "absolute",
        top: "14px",
        left: "0px",
        right: "0px",
    }
  },
  holding: {
    display: "inline-block",
    paddingLeft: "14px",
    position: "relative",
    "&::after": {
        content: "''",
        height: "10px",
        width: "10px",
        backgroundColor: "#0099FF",
        position: "absolute",
        top: "14px",
        left: "0px",
        right: "0px",
    }
  },
  borrowing: {
    display: "inline-block",
    paddingLeft: "14px",
    position: "relative",
    "&::after": {
        content: "''",
        height: "10px",
        width: "10px",
        backgroundColor: "#0000FF",
        position: "absolute",
        top: "14px",
        left: "0px",
        right: "0px",
    }
  },
  priceLabel: {
    fontSize: "14px",
    color: "#858585"
  },
  price: {
    fontSize: "14px",
    color: "#ffffff",
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
  }
});
const colors = ["#00FFFF", "#0099FF", "#0000FF"];

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
      grid: {
        top: "100px",
        left: "200px",
      },
      color: colors,
      legend: {
        show: false,
      },
      series: [
        {
          name: 'My Page',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '16',
              fontWeight: 'bold'
            }
          },
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
                  <div>
                    Total Value 
                    <Tooltip title={<h4>total value tooltip</h4>}>
                      <IconButton>
                        <HelpOutlineOutlinedIcon
                          sx={{ color: theme.tableHeaderTextColor }}
                        />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <div>
                    {myPageData?.total} ust
                  </div>
                </div>
                <Button
                  className={styles.cardButton}
                  size="large"
                  variant="text"
                  startIcon={<SendIcon />}
                  onClick={() => setLoginSuccess(true)}
                >
                  Send
                </Button>
              </div>
              <div className={styles.chartContainer}>
                <div className={styles.chartLegend}>
                  <div className={styles.ust}>
                    <div className={styles.priceLabel}>
                      UST 
                      <Tooltip title={<h4>UST tooltip</h4>}>
                        <IconButton>
                          <HelpOutlineOutlinedIcon
                            sx={{ color: theme.tableHeaderTextColor }}
                          />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <div className={styles.price}>
                      {myPageData?.ust} UST
                    </div>
                  </div>
                  <div className={styles.holding}>
                    <div className={styles.priceLabel}>
                      HOLDING 
                      <Tooltip title={<h4>holding tooltip</h4>}>
                        <IconButton>
                          <HelpOutlineOutlinedIcon
                            sx={{ color: theme.tableHeaderTextColor }}
                          />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <div className={styles.price}>
                      {myPageData?.holding} UST
                    </div>
                  </div>
                  <div className={styles.borrowing}>
                    <div className={styles.priceLabel}>
                      BORROWING 
                      <Tooltip title={<h4>borrowing tooltip</h4>}>
                        <IconButton>
                          <HelpOutlineOutlinedIcon
                            sx={{ color: theme.tableHeaderTextColor }}
                          />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <div className={styles.price}>
                      {myPageData?.borrowing} UST
                    </div>
                  </div>
                </div>
                <ReactEcharts
                  className={styles.chart}
                  style={{
                    height: "200px",
                    width: "200px",
                    marginRight: "-30px",
                  }}
                  option={getOption()}
                />
              </div>
            </div>
            <div className={styles.cardRight} >
              <div className={styles.titleGroup} style={{width: "280px"}}>
                <div style={{display: "flex", alignItems: "center"}}>
                  Total Claimable Rewards
                  <Tooltip title={<h4>Total Claimable Rewards</h4>}>
                    <IconButton>
                      <HelpOutlineOutlinedIcon
                        sx={{ color: theme.tableHeaderTextColor }}
                      />
                    </IconButton>
                  </Tooltip>
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
                style={{ marginTop: "32px", width: "300px", alignSelf: "center", backgroundColor: "#0099FF"}}
                size="large"
                variant="contained"
                disabled
                startIcon={<SendIcon />}
              >
              Claim All Rewards
            </Button>
            </div>
          </div>
          <div style={{margin: "0 4px"}}>
            <MyPageTable tableColumns={holdingTableColumns} data={myPageData?.data.holding} Header={HoldingHeader}/>
            <MyPageTable tableColumns={borrowingTableColumns} data={myPageData?.data.borrowing} Header={BorrowingHeader}/>
            <MyPageTable tableColumns={null} data={null} Header={GovernHeader}/>
          </div>
        </>
      }
    </>
  );
}

import { makeStyles } from "@material-ui/core";
import React, { useContext, useEffect, useState }  from "react";
import { Switch, Route, useHistory } from "react-router-dom";

import MypPage from "./components/MyPage";
import MyPageManage from "./components/MyPageManage";

const useStyles = makeStyles({
});
export default function MyPageRouteContainer(): React.ReactElement {
  const history = useHistory();
  const styles = useStyles();

  return (
    <Switch>
      <Route path="/mypage" exact>
        <MypPage />
      </Route>
      <Route path="/mypage/manage">
        {/* <ReturnButton onClick={() => history.push('/farm')} textValue="Back" /> */}
        <MyPageManage />
      </Route>
    </Switch>
  );
}

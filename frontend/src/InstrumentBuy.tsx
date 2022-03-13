import { Button } from "@material-ui/core";
import { useContext } from "react";

import { Instrument } from "./TradeContext";
import { AppContext } from "@/AppContext";

export default function InstrumentBuy({
  instrument,
}: {
  instrument: Instrument;
}) {
  const { appData, setAppData } = useContext(AppContext);
  return (
    <>
      <div>Fee: {instrument.fee}</div>

      <Button size="large" variant="contained" onClick={() => {}}>
        {appData == null ? "Wallet Not Connected" : "Place Order"}
      </Button>
    </>
  );
}
